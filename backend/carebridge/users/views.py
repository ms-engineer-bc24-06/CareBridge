from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid

# ベタ打ちのユーザーデータ
USERS = [
    {
        "uuid": str(uuid.uuid4()),
        "user_id": "U001",
        "facility": 1,
        "password_hash": "hash1",
        "user_name": "伊藤太郎",
        "user_name_kana": "いとうたろう",
        "user_birthday": "1940-01-01",
        "user_sex": "男性",
        "emergency_contact_name": "伊藤たかし",
        "emergency_contact_relationship": "息子",
        "emergency_contact_phone": "090-1234-5678",
        "allergies": None,
        "medications": None,
        "medical_history": None,
        "created_at": "2024-08-01T00:00:00Z",
        "updated_at": "2024-08-01T00:00:00Z"
    },
    {
        "uuid": str(uuid.uuid4()),
        "user_id": "U002",
        "facility": 1,
        "password_hash": "hash2",
        "user_name": "田中花子",
        "user_name_kana": "たなかはなこ",
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
    {
        "uuid": str(uuid.uuid4()),
        "user_id": "U003",
        "facility": 1,
        "password_hash": "hash3",
        "user_name": "井上良彦",
        "user_name_kana": "いのうえよしひこ",
        "user_birthday": "1942-03-03",
        "user_sex": "男性",
        "emergency_contact_name": "内村勝子",
        "emergency_contact_relationship": "妹",
        "emergency_contact_phone": "080-1111-2344",
        "allergies": "小麦",
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
def get_user(request, uuid):
    user = next((u for u in USERS if u['uuid'] == str(uuid)), None)
    if user:
        return Response(user)
    return Response({"ユーザーが見つかりません"}, status=404)