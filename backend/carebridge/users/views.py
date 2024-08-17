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
        user = User.objects.get(uuid=uuid)  # ここでUUIDの再変換は不要
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
        user = User.objects.get(uuid=uuid)  # ここでUUIDの再変換は不要
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"ユーザーが見つかりません"}, status=404)

@api_view(['GET'])
def get_user_uuid_by_firebase_uid(request, firebase_uid):
    try:
        user = User.objects.get(firebase_uid=firebase_uid)
        return Response({"uuid": str(user.uuid)})
    except User.DoesNotExist:
        return Response({"error": "ユーザーが見つかりません"}, status=404)