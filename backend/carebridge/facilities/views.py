from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# ベタ打ちの施設データ
FACILITIES = [
    {
        "id": 1,
        "facility_name": "Cabrななこ",
        "address": "東京都千代田区1-1-1",
        "phone_number": "03-1234-5678",
        "email": "facility_ haruka@example.com",
        "contact_person": "担当者あみ"
    }
]

@api_view(['GET'])
def get_facilities(request):
    return Response(FACILITIES)

@api_view(['GET'])
def get_facility(request, id):
    facility = next((f for f in FACILITIES if f['id'] == id), None)
    if facility:
        return Response(facility)
    return Response({"施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_facility(request):
    new_facility = request.data
    new_facility["id"] = max(f['id'] for f in FACILITIES) + 1 if FACILITIES else 1
    FACILITIES.append(new_facility)
    return Response(new_facility, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_facility(request, id):
    facility = next((f for f in FACILITIES if f['id'] == id), None)
    if not facility:
        return Response({"施設が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    updated_data = request.data
    for key, value in updated_data.items():
        facility[key] = value
    return Response(facility)

@api_view(['DELETE'])
def delete_facility(request, id):
    global FACILITIES
    FACILITIES = [f for f in FACILITIES if f['id'] != id]
    return Response(status=status.HTTP_204_NO_CONTENT)
