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

@api_view(['POST'])
def create_staff(request):
    serializer = StaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_staff(request, uuid):
    try:
        staff = Staff.objects.get(uuid=UUID(uuid))
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Staff.DoesNotExist:
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_staff(request, uuid):
    try:
        staff = Staff.objects.get(uuid=UUID(uuid))
        staff.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Staff.DoesNotExist:
        return Response({"message": "職員が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
