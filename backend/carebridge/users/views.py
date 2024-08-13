from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import User
from .serializers import UserSerializer
from uuid import UUID


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_user(request, uuid):
    try:
        user = User.objects.get(uuid=UUID(uuid))
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"ユーザーが見つかりません"}, status=404)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user(request, uuid):
    try:
        user = User.objects.get(uuid=UUID(uuid))
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
        user = User.objects.get(uuid=UUID(uuid))
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"ユーザーが見つかりません"}, status=404)
    

# ベタ打ちのユーザーデータ
# USERS = [
#     {
#         "uuid": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "user_id": "U001",
#         "facility": 1,
#         "password_hash": "hash1",
#         "user_name": "伊藤太郎",
#         "user_name_kana": "いとうたろう",
#         "user_birthday": "1940-01-01",
#         "user_sex": "男性",
#         "emergency_contact_name": "伊藤たかし",
#         "emergency_contact_relationship": "息子",
#         "emergency_contact_phone": "090-1234-5678",
#         "allergies": None,
#         "medications": None,
#         "medical_history": None,
#         "created_at": "2024-08-01T00:00:00Z",
#         "updated_at": "2024-08-01T00:00:00Z"
#     },
#     {
#         "uuid": "85b9c4be-55be-44ca-a52c-001207242ff2",
#         "user_id": "U002",
#         "facility": 1,
#         "password_hash": "hash2",
#         "user_name": "田中花子",
#         "user_name_kana": "たなかはなこ",
#         "user_birthday": "1945-02-02",
#         "user_sex": "女性",
#         "emergency_contact_name": "田中理恵",
#         "emergency_contact_relationship": "娘",
#         "emergency_contact_phone": "080-2345-6789",
#         "allergies": "花粉",
#         "medications": "薬2",
#         "medical_history": "既往症2",
#         "created_at": "2024-08-02T00:00:00Z",
#         "updated_at": "2024-08-02T00:00:00Z"
#     },
#     {
#         "uuid": "5d5a993b-4c4d-4e36-9597-c00d15ae185f",
#         "user_id": "U003",
#         "facility": 1,
#         "password_hash": "hash3",
#         "user_name": "井上良彦",
#         "user_name_kana": "いのうえよしひこ",
#         "user_birthday": "1942-03-03",
#         "user_sex": "男性",
#         "emergency_contact_name": "内村勝子",
#         "emergency_contact_relationship": "妹",
#         "emergency_contact_phone": "080-1111-2344",
#         "allergies": "小麦",
#         "medications": "薬2",
#         "medical_history": "既往症2",
#         "created_at": "2024-08-02T00:00:00Z",
#         "updated_at": "2024-08-02T00:00:00Z"
#     },
#     # 他のデータを追加
# ]

# @api_view(['GET'])
# def get_users(request):
#     return Response(USERS)

# @api_view(['GET'])
# def get_user(request, uuid):
#     user = next((u for u in USERS if u['uuid'] == str(uuid)), None)
#     if user:
#         return Response(user)
#     return Response({"ユーザーが見つかりません"}, status=404)

# @api_view(['POST'])
# def create_user(request):
#     new_user = request.data
#     new_user["uuid"] = str(uuid.uuid4())
#     USERS.append(new_user)
#     return Response(new_user, status=status.HTTP_201_CREATED)

# @api_view(['PUT'])
# def update_user(request, uuid):
#     user = next((u for u in USERS if u['uuid'] == str(uuid)), None)
#     if not user:
#         return Response({"ユーザーが見つかりません"}, status=404)
#     updated_data = request.data
#     for key, value in updated_data.items():
#         user[key] = value
#     return Response(user)

# @api_view(['DELETE'])
# def delete_user(request, uuid):
#     global USERS
#     USERS = [u for u in USERS if u['uuid'] != str(uuid)]
#     return Response(status=status.HTTP_204_NO_CONTENT)