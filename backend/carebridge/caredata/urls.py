from django.urls import path
from .views import get_care_records, get_user_care_records, create_care_record

urlpatterns = [
    path('care-records/', get_care_records),
    path('care-records/<uuid:uuid>/', get_user_care_records, name='get_user_care_records'),
    path('care-records/create/', create_care_record, name='create_care_record'),
]