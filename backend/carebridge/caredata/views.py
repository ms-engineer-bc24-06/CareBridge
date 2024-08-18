from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import CareRecord, User, Staff
from .serializers import CareRecordSerializer
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_care_records(request):
    try:
        care_records = CareRecord.objects.all()
        serializer = CareRecordSerializer(care_records, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error retrieving care records: {str(e)}")
        return Response({"error": "ケア記録の取得中にエラーが発生しました"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_care_records(request, uuid):
    try:
        care_records = CareRecord.objects.filter(user__uuid=uuid)
        if care_records.exists():
            serializer = CareRecordSerializer(care_records, many=True)
            return Response(serializer.data)
        else:
            return Response({"message": "ケア記録が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error retrieving care records for UUID {uuid}: {str(e)}")
        return Response({"error": "ケア記録の取得中にエラーが発生しました"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_care_record(request):
    try:
        # user_uuidを取得
        user = User.objects.get(uuid=request.data.get('user'))
        
        # staff_idを取得
        staff = Staff.objects.get(staff_id=request.data.get('staff'))
        
        # 新しいCareRecordオブジェクトを作成
        care_record = CareRecord(
            user=user,
            date=request.data.get('date'),
            detail=request.data.get('detail'),
            staff=staff
        )
        care_record.save()

        serializer = CareRecordSerializer(care_record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        logger.warning(f"User not found: UUID {request.data.get('user')}")
        return Response({"error": "指定されたユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Staff.DoesNotExist:
        logger.warning(f"Staff not found: staff_id {request.data.get('staff')}")
        return Response({"error": "指定されたスタッフが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error creating care record: {str(e)}")
        return Response({"error": f"リクエストが不正です: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import uuid

# # ベタ打ちの介護データ
# CARE_RECORDS = [
#     {
#         "care_record_id": 1,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-08-01",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 201
#     },
#     {
#         "care_record_id": 2,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-02",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 3,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-03",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 201
#     },
#         {
#         "care_record_id": 4,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-08-04",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 202
#     },
#     {
#         "care_record_id": 5,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-05",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 6,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-06",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 204
#     },
#         {
#         "care_record_id": 7,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-08-07",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 203
#     },
#     {
#         "care_record_id": 8,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-08",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 9,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-08-09",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 201
#     },
#         {
#         "care_record_id": 10,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-07-31",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 201
#     },
#     {
#         "care_record_id": 11,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-30",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 12,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-29",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 206
#     },
#             {
#         "care_record_id": 13,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-07-28",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 201
#     },
#     {
#         "care_record_id": 14,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-27",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 15,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-26",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 206
#     },
#         {
#         "care_record_id": 16,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-25",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 17,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-24",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 204
#     },
#         {
#         "care_record_id": 18,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-07-23",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 203
#     },
#     {
#         "care_record_id": 19,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-22",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 20,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-21",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 201
#     },
#         {
#         "care_record_id": 21,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-07-20",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 201
#     },
#     {
#         "care_record_id": 22,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-19",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 23,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-18",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 206
#     },
#             {
#         "care_record_id": 24,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9", 
#         "date": "2024-07-17",
#         "meal": "半分",
#         "excretion": "普通",
#         "bath": "清拭",
#         "temperature": 36.7,
#         "systolic_bp": 120,
#         "diastolic_bp": 80,
#         "comments": "若干食欲がないが元気",
#         "staff": 201
#     },
#     {
#         "care_record_id": 25,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-16",
#         "meal": "半分",
#         "excretion": "軟便",
#         "bath": "なし",
#         "temperature": 36.8,
#         "systolic_bp": 118,
#         "diastolic_bp": 78,
#         "comments": "おなかの調子が悪いが元気はある",
#         "staff": 201
#     },
#     {
#         "care_record_id": 26,
#         "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
#         "date": "2024-07-15",
#         "meal": "完食",
#         "excretion": "なし",
#         "bath": "清拭",
#         "temperature": 36.6,
#         "systolic_bp": 117,
#         "diastolic_bp": 76,
#         "comments": "お腹の調子も良くなってきている",
#         "staff": 206
#     },
#     # 他のデータを追加
# ]

# @api_view(['GET'])
# def get_care_records(request):
#     return Response(CARE_RECORDS)

# @api_view(['GET'])
# def get_user_care_records(request, uuid):
#     user_care_records = [record for record in CARE_RECORDS if record['user'] == str(uuid)]
#     if user_care_records:
#         return Response(user_care_records)
#     return Response({"message": "ケア記録が見つかりません"}, status=404)