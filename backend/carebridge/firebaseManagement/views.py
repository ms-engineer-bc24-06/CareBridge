# フロントエンドで職員の情報を収集し、その情報をバックエンド（Django）に送信し、バックエンドがFirebase Admin SDKを使用してFirebaseに新しいユーザーを作成する
# APIキーやその他の認証情報はサーバー側で安全に管理されます。セキュリティが向上します。

from django.http import JsonResponse
from firebase_admin import auth
from django.views.decorators.csrf import csrf_exempt
import logging
import json

logger = logging.getLogger(__name__)

# Firebaseの初期化状態をチェックする関数：システムの状態確認
def check_firebase(request):
    return JsonResponse({'message': 'Firebase is initialized and working.'})

# 職員ユーザーを作成する関数：新しい職員ユーザーを作成するためのメインの関数
@csrf_exempt
def create_staff_user(request):
    try:
        # リクエストデータをJSONとしてパース
        data = json.loads(request.body)

        # JSONデータから必要なフィールドを取得
        display_name = data.get('display_name')  # 名前
        email = data.get('email')                # メールアドレス
        password = data.get('password')          # パスワード

        # リクエスト内容をログに出力
        logger.info(f"Received request to create user: {display_name}, {email}")

        # Firebaseでユーザー作成
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name,
            disabled=False
        )

        # ユーザー作成成功時のログ出力
        logger.info(f"User created successfully: {user.uid}")

        # 成功レスポンスを返す
        return JsonResponse({'message': 'Staff user created successfully', 'user_id': user.uid})
    except Exception as e:
        # エラー発生時のログ出力
        logger.error(f"Error creating user: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

# Firebase Admin SDKが正しく機能しているかをテストする関数：不要になった場合、将来的に削除しても良い
def test_firebase(request):
    try:
        # テスト用に特定のユーザーのUIDを使います（ Firebaseに登録されてる'ami@example.com'を使用）
        user = auth.get_user_by_email('ami@example.com') 
        return JsonResponse({
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def register_family_member_user(request):
    try:
        print("Request received at register_family_member_user")
        # リクエストデータをJSONとしてパース
        data = json.loads(request.body)

        # JSONデータから必要なフィールドを取得
        display_name = data.get('display_name')  # 名前
        email = data.get('email')                # メールアドレス
        password = data.get('password')          # パスワード

        # リクエスト内容をログに出力
        logger.info(f"Received request to create family member user: {display_name}, {email}")

        # Firebaseでユーザー作成
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name,
            disabled=False
        )

        # ユーザー作成成功時のログ出力
        logger.info(f"Family member user created successfully: {user.uid}")

        # 成功レスポンスを返す
        return JsonResponse({'message': 'Family member user created successfully', 'user_id': user.uid})
    except Exception as e:
        # エラー発生時のログ出力
        logger.error(f"Error creating family member user: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
