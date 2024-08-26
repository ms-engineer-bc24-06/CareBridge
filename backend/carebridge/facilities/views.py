from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import Facility, Staff
from .serializers import FacilitySerializer

@api_view(['GET'])
def get_facilities(request):
    facilities = Facility.objects.all()
    serializer = FacilitySerializer(facilities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_facility(request, id):
    try:
        facility = Facility.objects.get(id=id)
        serializer = FacilitySerializer(facility)
        return Response(serializer.data)
    except Facility.DoesNotExist:
        return Response({"message": "指定されたIDの施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_facility(request):
    serializer = FacilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_facility(request, id):
    try:
        facility = Facility.objects.get(id=id)
        serializer = FacilitySerializer(facility, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Facility.DoesNotExist:
        return Response({"message": "指定されたIDの施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_facility(request, id):
    try:
        facility = Facility.objects.get(id=id)
        facility.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Facility.DoesNotExist:
        return Response({"message": "指定されたIDの施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_staff_facility_id(request):
    firebase_uid = request.query_params.get('firebase_uid', None)
    if not firebase_uid:
        return Response({"message": "firebase_uidが指定されていません"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        staff = Staff.objects.get(firebase_uid=firebase_uid)
        facility_id = staff.facility.id
        return Response({"facility_id": facility_id})
    except Staff.DoesNotExist:
        return Response({"message": "指定されたUIDのスタッフが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
