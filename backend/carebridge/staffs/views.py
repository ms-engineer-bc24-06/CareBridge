from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid

# ベタ打ちの職員データ
STAFFS = [
    {
        "id": 1,
        "password_hash": "hash1",
        "facility": 1,
        "staff_name": "飯沼春歌",
        "user_name_kana":"いいぬまはるか",
        "is_admin": True,
    },
    {
        "id": 2,
        "password_hash": "hash2",
        "facility": 1,
        "staff_name": "飯沼晴也",
        "user_name_kana":"いいぬまはるや",
        "is_admin": False,
    },
]

@api_view(['GET'])
def get_staffs(request):
    return Response(STAFFS)

@api_view(['GET'])
def get_staff(request, id):
    staff = next((s for s in STAFFS if s['id'] == id), None)
    if staff:
        return Response(staff)
    return Response({"職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_staff(request):
    new_staff = request.data
    new_staff["id"] = max(s['id'] for s in STAFFS) + 1 if STAFFS else 1
    STAFFS.append(new_staff)
    return Response(new_staff, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_staff(request, id):
    staff = next((s for s in STAFFS if s['id'] == id), None)
    if not staff:
        return Response({"職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    updated_data = request.data
    for key, value in updated_data.items():
        staff[key] = value
    return Response(staff)

@api_view(['DELETE'])
def delete_staff(request, id):
    global STAFFS
    STAFFS = [s for s in STAFFS if s['id'] != id]
    return Response(status=status.HTTP_204_NO_CONTENT)
