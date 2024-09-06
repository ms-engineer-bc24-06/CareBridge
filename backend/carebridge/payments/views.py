import stripe
import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from carebridge.models import Payment, Facility
from datetime import datetime
import logging
import traceback

# ロガーを設定
logger = logging.getLogger(__name__)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


@csrf_exempt
def create_checkout_session(request):
    try:
        data = json.loads(request.body)
        facility_id = data.get('facilityId')
        if not facility_id:
            return JsonResponse({'error': 'facilityId is required'}, status=400)
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'jpy',
                    'product_data': {
                        'name': 'CareBridge サービス',
                    },
                    'recurring': {
                        'interval': 'month',
                    },
                    'unit_amount': 8800,
                },
                'quantity': 1,
            }],
            mode='subscription',
            subscription_data={
                'trial_period_days': 30,
            },
            success_url='http://localhost:3000/admin/dashboard',
            cancel_url='http://localhost:3000/admin/cancel',
            metadata={
                'facility_id': str(facility_id)
            }
        )
        return JsonResponse({'id': session.id})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        logger.info("Starting webhook event construction")
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        logger.info("Webhook event constructed successfully: %s", event)

        event_type = event['type']
        session = event['data']['object']

        # デバッグログの追加
        logger.debug(f"Event data object: {session}")

        facility_id = None
        stripe_payment_method_id = None
        stripe_subscription_id = None
        trial_end_date = None
        status = None

        if event_type == 'checkout.session.completed':
            facility_id = event['data']['object'].get('metadata', {}).get('facility_id')
            if not facility_id:
                logger.error(f"facility_id is missing in the event metadata. Event type: {event_type}")
                return JsonResponse({'error': 'facility_id is missing'}, status=400)
            try:
                facility_id = int(facility_id)
            except ValueError:
                logger.error(f"facility_id is not an integer: {facility_id}")
                return JsonResponse({'error': 'facility_id is not a valid integer'}, status=400)
            logger.info(f"facility_id found: {facility_id}")
            logger.info(f"facility_id: {facility_id}, type: {type(facility_id)}")

            stripe_subscription_id = event['data']['object'].get('subscription')
            if not stripe_subscription_id:
                logger.error(f"subscription is missing in the session. Event type: {event_type}")
                return JsonResponse({'error': 'stripe_subscription_id is missing'}, status=400)
            logger.info(f"Stripe subscription id found: {stripe_subscription_id}")

            status = event['data']['object'].get('status')
            if not status:
                logger.error(f"status is missing in the event data. Event type: {event_type}")
                return JsonResponse({'error': 'status is missing'}, status=400)
            logger.info(f"Status found: {status}")

        # Facility の取得と is_active の更新
        if facility_id:
            try:
                facility = Facility.objects.get(id=facility_id)
                logger.info(f"Retrieved facility: {facility}")
                
                # is_active フィールドを True に更新
                facility.is_active = True
                facility.save()
                logger.info(f"Updated facility {facility_id} to active.")

                payment, created = Payment.objects.get_or_create(
                    facility=facility,
                    defaults={
                        'stripe_subscription_id': stripe_subscription_id,
                        'stripe_payment_method_id': stripe_payment_method_id,
                        'trial_end_date': trial_end_date,
                        'status': status,
                    }
                )
                logger.info(f"Payment record created: {created}")
                logger.info(f"Payment details: {payment}")

                if not created:
                    payment.stripe_subscription_id = stripe_subscription_id
                    payment.stripe_payment_method_id = stripe_payment_method_id
                    payment.trial_end_date = trial_end_date
                    payment.status = status
                    payment.save()
                    payment.refresh_from_db()
                    logger.info(f"stripe_payment_method_id after saving: {payment.stripe_payment_method_id}")
                    logger.info(f"Updated Payment record for facility_id: {facility_id}")
            
            except Facility.DoesNotExist:
                logger.error(f"Facility not found for id: {facility_id}")
                return JsonResponse({'error': 'Facility not found'}, status=404)

        return JsonResponse({'status': 'success'})

    except ValueError as e:
        logger.error(f"Invalid payload: {str(e)}")
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {str(e)}")
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return JsonResponse({'error': 'Webhook error'}, status=500)
