from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import Staff
from .serializers import StaffSerializer
from uuid import UUID

@api_view(['GET'])
def get_staffs(request):
    staffs = Staff.objects.all()
    serializer = StaffSerializer(staffs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_staff(request, uuid):
    try:
        staff = Staff.objects.get(uuid=uuid) # すでにUUIDオブジェクトとして扱われていると仮定 staff = Staff.objects.get(uuid=UUID(uuid))から修正
        serializer = StaffSerializer(staff)
        return Response(serializer.data)
    except Staff.DoesNotExist:
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_staff_by_firebase_uid(request, firebase_uid):
    try:
        staff = Staff.objects.get(firebase_uid=firebase_uid)  # firebase_uidフィールドに基づいてスタッフを取得
        serializer = StaffSerializer(staff)
        return Response(serializer.data)
    except Staff.DoesNotExist:
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_staffs_by_facility(request, facility_id):
    staffs = Staff.objects.filter(facility_id=facility_id)
    serializer = StaffSerializer(staffs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_staff(request):
    print("Received data:", request.data)  # 受け取ったデータをログ出力
    serializer = StaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # エラーメッセージを出力してデバッグ
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_staff(request, uuid):
    try:
        # UUIDを文字列として扱う
        print(f"Received request to update staff with UUID: {uuid}")  # デバッグ用のログ
        staff = Staff.objects.get(uuid=uuid)  # UUIDの取得部分でUUIDオブジェクトではなくそのまま文字列を使用
        print(f"Found staff: {staff}")  # UUIDでスタッフが見つかった場合

        # リクエストデータの内容を確認
        print("Request data:", request.data)

        # データをシリアライザーに渡す
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("Staff updated successfully:", serializer.data)  # 更新成功時のログ
            return Response(serializer.data)
        print("Validation errors:", serializer.errors)  # バリデーションエラーのログ
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Staff.DoesNotExist:
        print(f"Staff with UUID {uuid} not found")  # スタッフが見つからない場合のログ
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating staff with UUID {uuid}: {str(e)}")  # その他のエラーのログ
        return Response({"message": f"更新中にエラーが発生しました: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_staff(request, uuid):
    try:
        print(f"Attempting to delete staff with UUID: {uuid}")
        # UUIDが文字列で渡されている場合のみUUIDオブジェクトに変換
        if isinstance(uuid, str):
            uuid = UUID(uuid)
        
        staff = Staff.objects.get(uuid=uuid)
        staff.delete()
        print(f"Staff with UUID {uuid} deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ValueError:
        print(f"Invalid UUID format: {uuid}")
        return Response({"message": "無効なUUID形式です"}, status=status.HTTP_400_BAD_REQUEST)
    except Staff.DoesNotExist:
        print(f"Staff with UUID {uuid} not found")
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting staff with UUID {uuid}: {str(e)}")
        return Response({"message": f"削除中にエラーが発生しました: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
