from rest_framework.decorators import api_view
from rest_framework.response import Response

# ベタ打ちの介護データ
CARE_RECORDS = [
    {
        "care_record_id": 1,
        "user": 1,
        "date": "2024-08-01",
        "meal": "半分",
        "excretion": "普通",
        "bath": "清拭",
        "temperature": 36.7,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "comments": "若干食欲がないが元気",
        "staff_id": 201
    },
    {
        "care_record_id": 2,
        "user": 1,
        "date": "2024-08-02",
        "meal": "半分",
        "excretion": "軟便",
        "bath": "なし",
        "temperature": 36.8,
        "systolic_bp": 118,
        "diastolic_bp": 78,
        "comments": "おなかの調子が悪いが元気はある",
        "staff": 201
    },
    {
        "care_record_id": 3,
        "user": 1,
        "date": "2024-08-03",
        "meal": "完食",
        "excretion": "なし",
        "bath": "清拭",
        "temperature": 36.6,
        "systolic_bp": 117,
        "diastolic_bp": 76,
        "comments": "お腹の調子も良くなってきている",
        "staff": 201
    },
    # 他のデータを追加
]

@api_view(['GET'])
def get_care_records(request):
    return Response(CARE_RECORDS)