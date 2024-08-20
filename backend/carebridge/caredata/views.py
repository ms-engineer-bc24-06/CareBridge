from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import CareRecord, User, Staff
from .serializers import CareRecordSerializer
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
        
        # staff_uuidを取得
        staff = Staff.objects.get(uuid=request.data.get('staff'))
        
        # 新しいCareRecordオブジェクトを作成
        care_record = CareRecord(
            user=user,
            date=request.data.get('date'),
            meal=request.data.get('meal'),
            excretion=request.data.get('excretion'),
            bath=request.data.get('bath'),
            temperature=request.data.get('temperature'),
            systolic_bp=request.data.get('systolic_bp'),
            diastolic_bp=request.data.get('diastolic_bp'),
            comments=request.data.get('comments'),
            staff=staff  # 登録したスタッフを設定
        )
        care_record.save()

        serializer = CareRecordSerializer(care_record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "指定されたユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Staff.DoesNotExist:
        return Response({"error": "指定されたスタッフが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # 予期しないエラーが発生した場合にエラー内容を返す
        return Response({"error": f"リクエストが不正です: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_care_record_detail(request, id):
    try:
        care_record = CareRecord.objects.get(id=id)
        serializer = CareRecordSerializer(care_record)
        return Response(serializer.data)
    except CareRecord.DoesNotExist:
        return Response({"error": "ケア記録が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_care_record(request, id):
    try:
        print(f"Received request to delete care record with id: {id}")  # ログの追加

        care_record = CareRecord.objects.get(id=id)
        care_record.delete()
        print(f"Successfully deleted care record with id: {id}")  # 成功ログ
        return Response({"message": "ケア記録が削除されました"}, status=status.HTTP_204_NO_CONTENT)
    except CareRecord.DoesNotExist:
        print(f"Care record with id: {id} does not exist")  # 存在しないログ
        return Response({"error": "ケア記録が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"An error occurred while deleting care record with id: {id}: {str(e)}")  # エラーログ
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
def update_care_record(request, id):
    try:
        print(f"Received request to update care record with id: {id}")  # ログの追加

        care_record = CareRecord.objects.get(id=id)
        serializer = CareRecordSerializer(care_record, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(f"Successfully updated care record with id: {id}")  # 成功ログ
            return Response(serializer.data)
        else:
            print(f"Failed to update care record with id: {id} - Invalid data")  # 失敗ログ
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except CareRecord.DoesNotExist:
        print(f"Care record with id: {id} does not exist")  # 存在しないログ
        return Response({"error": "ケア記録が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"An error occurred while updating care record with id: {id}: {str(e)}")  # エラーログ
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)