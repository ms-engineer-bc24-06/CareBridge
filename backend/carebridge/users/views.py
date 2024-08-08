from rest_framework.decorators import api_view
from rest_framework.response import Response

# ベタ打ちのユーザーデータ
USERS = [
    {
        "id": 1,
        "facility_id": 1,
        "password_hash": "hash1",
        "user_name": "伊藤太郎",
        "user_birthday": "1940-01-01",
        "user_sex": "男性",
        "emergency_contact_name": "伊藤たかし",
        "emergency_contact_relationship": "息子",
        "emergency_contact_phone": "090-1234-5678",
        "allergies": "None",
        "medications": "薬1",
        "medical_history": "既往症1",
        "created_at": "2024-08-01T00:00:00Z",
        "updated_at": "2024-08-01T00:00:00Z"
    },
    {
        "id": 2,
        "facility_id": 1,
        "password_hash": "hash2",
        "user_name": "田中花子",
        "user_birthday": "1945-02-02",
        "user_sex": "女性",
        "emergency_contact_name": "田中理恵",
        "emergency_contact_relationship": "娘",
        "emergency_contact_phone": "080-2345-6789",
        "allergies": "花粉",
        "medications": "薬2",
        "medical_history": "既往症2",
        "created_at": "2024-08-02T00:00:00Z",
        "updated_at": "2024-08-02T00:00:00Z"
    },
    # 他のデータを追加
]

@api_view(['GET'])
def get_users(request):
    return Response(USERS)

@api_view(['GET'])
def get_user(request, id):
    user = next((u for u in USERS if u['id'] == id), None)
    if user:
        return Response(user)
    return Response({"ユーザーが見つかりません"}, status=404)