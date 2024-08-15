# import stripe
# import os
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt

# # 環境変数からStripeのシークレットキーを取得
# stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# @csrf_exempt
# def create_checkout_session(request):
#     print("Received request to create checkout session")
#     try:
#         # Stripe Checkoutセッションをサブスクリプションモードで作成
#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'jpy',
#                     'product_data': {
#                         'name': 'CareBridge サービス',
#                     },
#                     'recurring': {
#                         'interval': 'month',
#                     },
#                     'unit_amount': 1000,
#                 },
#                 'quantity': 1,
#             }],
#             mode='subscription',
#             subscription_data={
#                 'trial_period_days': 30,  # 無料期間を30日に設定
#             },
#             success_url='http://localhost:3000/admin/dashboard',
#             cancel_url='http://localhost:3000/admin/cancel',
#         )
#         print("Checkout session created:", session.id)
#         return JsonResponse({'id': session.id})
#     except Exception as e:
#         print("Error creating checkout session:", str(e))
#         return JsonResponse({'error': str(e)}, status=500)
import stripe
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Subscription


# StripeのAPIキーを環境変数から取得し、Stripeの初期設定を行う
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@csrf_exempt
def create_checkout_session(request):
    # ログとして、Checkoutセッション作成リクエストが受け取られたことを出力
    print("Received request to create checkout session")
    try:
        # StripeのCheckoutセッションを作成するための処理
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],  # 支払い方法をカードに設定
            line_items=[{
                'price_data': {
                    'currency': 'jpy',  # 通貨を日本円に設定
                    'product_data': {
                        'name': 'CareBridge サービス',  # 商品名を指定
                    },
                    'recurring': {
                        'interval': 'month',  # 月ごとのサブスクリプションとして設定
                    },
                    'unit_amount': 1000,  # 価格を1000円に設定
                },
                'quantity': 1,  # 数量を1に設定
            }],
            mode='subscription',  # サブスクリプションモードでのCheckoutセッションを作成
            subscription_data={
                'trial_period_days': 30,  # 無料試用期間を30日間に設定
            },
            success_url='http://localhost:3000/admin/dashboard',  # 支払い成功後のリダイレクト先URL
            cancel_url='http://localhost:3000/admin/cancel',  # 支払いキャンセル時のリダイレクト先URL
        )
        # セッションIDをログとして出力
        print("Checkout session created:", session.id)
        # セッションIDをJSON形式でクライアントに返す
        return JsonResponse({'id': session.id})
    except Exception as e:
        # エラーが発生した場合、エラーメッセージをログとして出力し、クライアントにエラーを返す
        print("Error creating checkout session:", str(e))
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_POST
def stripe_webhook(request):
    # Stripeのウェブフックリクエストのペイロード（ボディ）を取得
    payload = request.body
    # リクエストヘッダーからStripe署名を取得
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    # Stripeのウェブフックシークレットを環境変数から取得
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        # ペイロードの検証とイベントの構築を行う
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # ペイロードが無効な場合のエラーハンドリング
        return JsonResponse({'status': 'invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        # 署名が無効な場合のエラーハンドリング
        return JsonResponse({'status': 'invalid signature'}, status=400)

    # 受信したイベントが支払い成功の場合の処理
    if event['type'] == 'invoice.payment_succeeded':
        # 支払いに関する請求書オブジェクトを取得
        invoice = event['data']['object']
        # サブスクリプションIDを取得
        subscription_id = invoice['subscription']
        
        try:
            # DB内のサブスクリプションを検索し、ステータスを更新
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            subscription.status = 'active'  # ステータスを「active」に更新
            subscription.save()  # 更新内容を保存
        except Subscription.DoesNotExist:
            # サブスクリプションが存在しない場合は何もしない
            pass

    # サブスクリプションがキャンセルされた場合の処理
    elif event['type'] == 'customer.subscription.deleted':
        # サブスクリプションIDを取得
        subscription_id = event['data']['object']['id']

        try:
            # DB内のサブスクリプションを検索し、ステータスをキャンセルに更新
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            subscription.status = 'canceled'
            subscription.save()
        except Subscription.DoesNotExist:
            # サブスクリプションが存在しない場合は何もしない
            pass

    # 他のイベントタイプについても処理が必要であれば、ここに追加可能

    # 処理が成功したことをクライアントに返す
    return JsonResponse({'status': 'success'}, status=200)

