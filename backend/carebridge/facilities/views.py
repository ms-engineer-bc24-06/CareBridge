from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from carebridge.models import Facility
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
        return Response({"message": "施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

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
        return Response({"message": "施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_facility(request, id):
    try:
        facility = Facility.objects.get(id=id)
        facility.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Facility.DoesNotExist:
        return Response({"message": "施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)


# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# # ベタ打ちの施設データ
# FACILITIES = [
#     {
#         "id": 1,
#         "facility_name": "Cabrななこ",
#         "address": "東京都千代田区1-1-1",
#         "phone_number": "03-1234-5678",
#         "email": "facility_ haruka@example.com",
#         "contact_person": "担当者あみ"
#     }
# ]

# @api_view(['GET'])
# def get_facilities(request):
#     return Response(FACILITIES)

# @api_view(['GET'])
# def get_facility(request, id):
#     facility = next((f for f in FACILITIES if f['id'] == id), None)
#     if facility:
#         return Response(facility)
#     return Response({"施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# def create_facility(request):
#     new_facility = request.data
#     new_facility["id"] = max(f['id'] for f in FACILITIES) + 1 if FACILITIES else 1
#     FACILITIES.append(new_facility)
#     return Response(new_facility, status=status.HTTP_201_CREATED)

# @api_view(['PUT'])
# def update_facility(request, id):
#     facility = next((f for f in FACILITIES if f['id'] == id), None)
#     if not facility:
#         return Response({"施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
#     updated_data = request.data
#     for key, value in updated_data.items():
#         facility[key] = value
#     return Response(facility)

# @api_view(['DELETE'])
# def delete_facility(request, id):
#     global FACILITIES
#     FACILITIES = [f for f in FACILITIES if f['id'] != id]
#     return Response(status=status.HTTP_204_NO_CONTENT)
