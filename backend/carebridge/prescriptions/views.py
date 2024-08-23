from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PrescriptionSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.cloud import vision
import openai
import os
import logging
from carebridge.models import Prescription, User, Staff
import json
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

logger = logging.getLogger(__name__)


@csrf_exempt
def ocr_view(request):
    if request.method == 'POST':
        logger.debug("POSTリクエストが/api/prescription/ocr/に送信されました")
        file = request.FILES.get('file')
        if file is None:
            logger.error("リクエストにファイルが含まれていません")
            return JsonResponse({'error': 'No file provided'}, status=400)

        try:
            # Google Cloud Vision APIでOCRを実行
            logger.debug("Google Cloud Vision APIクライアントを初期化しています")
            client = vision.ImageAnnotatorClient()

            logger.debug("画像ファイルを読み込んでいます")
            image = vision.Image(content=file.read())

            logger.debug("Google Cloud Vision APIでテキスト検出を実行しています")
            response = client.text_detection(image=image)

            if response.error.message:
                logger.error(f"Google Cloud Vision APIエラー: {response.error.message}")
                return JsonResponse({'error': response.error.message}, status=500)

            if response.text_annotations:
                ocr_text = response.text_annotations[0].description
                logger.debug(f"OCRで抽出されたテキスト: {ocr_text}")
            else:
                logger.error("テキストが検出されませんでした")
                return JsonResponse({'error': 'No text detected'}, status=500)

            # OpenAI APIでOCR結果を解析
            logger.debug("OCRテキストをOpenAI APIに送信して解析しています")
            openai.api_key = os.getenv('OPENAI_API_KEY')
            client = openai.OpenAI(api_key=openai.api_key)
            analysis_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "以下のOCRテキストから、次の項目を抽出し、指定されたJSON形式で出力してください: "
                            "患者の名前、病院名、日付、薬名、用法用量、薬局名（院内処方の場合は病院名）、薬局の電話番号。"
                            "出力フォーマットは以下のようにしてください: "
                            '{\n'
                            '"patient_name": "名前",\n'
                            '"hospital_name": "病院名",\n'
                            '"date": "yyyy-MM-dd",\n'
                            '"medication_name": "薬名",\n'
                            '"dosage_and_usage": "用法用量",\n'
                            '"pharmacy_name": "薬局名（院内処方の場合は病院名）",\n'
                            '"pharmacy_phone_number": "電話番号"\n'
                            '}'
                        )
                    },
                    {"role": "user", "content": ocr_text}
                ]
            )

            extracted_text = analysis_response.choices[0].message.content
            logger.debug(f"OpenAIから抽出されたテキスト: {extracted_text}")

            return JsonResponse({'text': extracted_text})

        except Exception as e:
            logger.error(f"OCR処理中にエラーが発生しました: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    logger.error("無効なリクエストメソッド: POSTのみが許可されています")
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
def save_prescription(request):
    try:
        data = request.data
        logger.debug(f"Received data: {data}")  # リクエストデータのログ

        # 処方箋データのシリアライズと保存
        serializer = PrescriptionSerializer(data={
            'user': data['user_uuid'],  # リクエストデータから直接取得
            'hospital_name': data['hospital_name'],
            'date': data['date'],
            'medication_name': data['medication_name'],
            'dosage_and_usage': data['dosage_and_usage'],
            'pharmacy_name': data['pharmacy_name'],
            'pharmacy_phone_number': data.get('pharmacy_phone_number', ''),
            'comment': data.get('comment', ''),
            'staff': data['staff'],  # リクエストデータから直接取得
        })

        if serializer.is_valid():
            serializer.save()
            logger.info("Prescription saved successfully")  # 保存成功のログ
            return Response({"message": "処方箋が保存されました"}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {serializer.errors}")  # バリデーションエラーのログ
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")  # 予期しないエラーのログ
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_prescriptions_by_user(request, uuid):
    try:
        prescriptions = Prescription.objects.filter(user__uuid=uuid)
        if prescriptions.exists():
            serializer = PrescriptionSerializer(prescriptions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "該当する処方箋が見つかりませんでした"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)