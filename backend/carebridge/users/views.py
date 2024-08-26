from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import User, Staff
from .serializers import UserSerializer
from django.core.cache import cache
from uuid import UUID

@api_view(['GET'])
def get_users(request):
    try:
        # ログインしているスタッフのFirebase UIDを取得
        firebase_uid = request.GET.get('firebase_uid')
        if not firebase_uid:
            return Response({"error": "Firebase UIDが必要です"}, status=status.HTTP_400_BAD_REQUEST)
        
        # キャッシュキーを生成
        cache_key = f"users_{firebase_uid}"

        # キャッシュからユーザーリストを取得
        cached_users = cache.get(cache_key)
        if cached_users:
            return Response(cached_users)

        # Firebase UIDからスタッフ情報を取得
        try:
            staff = Staff.objects.get(firebase_uid=firebase_uid)
        except Staff.DoesNotExist:
            return Response({"error": "スタッフが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

        # スタッフの施設に紐づくユーザーを取得
        users = User.objects.filter(facility=staff.facility)
        serializer = UserSerializer(users, many=True)
        response_data = serializer.data

        # キャッシュに保存（15分間）
        cache.set(cache_key, response_data, 60 * 15)

        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user(request, uuid):
    try:
        user = User.objects.get(uuid=uuid)  # ここでUUIDの再変換は不要
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"ユーザーが見つかりません"}, status=404)

@api_view(['GET'])
def get_user_uuid_by_firebase_uid(request, firebase_uid):
    try:
        user = User.objects.get(firebase_uid=firebase_uid)
        return Response({"uuid": str(user.uuid)})
    except User.DoesNotExist:
        return Response({"error": "ユーザーが見つかりません"}, status=404)

@api_view(['POST'])
def create_user(request):
    data = request.data.copy()
    
    # user_id を自動生成（もしくは save メソッド内で生成される場合は不要）
    # data['user_id'] = generate_user_id()  # 必要に応じて実装
    
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user(request, uuid):
    try:
        user = User.objects.get(uuid=uuid)  # ここでUUIDの再変換は不要
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"ユーザーが見つかりません"}, status=404)

@api_view(['DELETE'])
def delete_user(request, uuid):
    try:
        print(f"Attempting to delete user with UUID: {uuid}")
        # UUIDが文字列で渡されている場合のみUUIDオブジェクトに変換
        if isinstance(uuid, str):
            uuid = UUID(uuid)
        
        user = User.objects.get(uuid=uuid)
        user.delete()
        print(f"User with UUID {uuid} deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ValueError:
        print(f"Invalid UUID format: {uuid}")
        return Response({"message": "無効なUUID形式です"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        print(f"User with UUID {uuid} not found")
        return Response({"message": "ユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting user with UUID {uuid}: {str(e)}")
        return Response({"message": f"削除中にエラーが発生しました: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
