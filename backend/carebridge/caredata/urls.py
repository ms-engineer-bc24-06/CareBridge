from django.urls import path
from .views import get_care_records, get_user_care_records, create_care_record, get_care_record_detail

urlpatterns = [
    path('care-records/', get_care_records),
    path('care-records/<uuid:uuid>/', get_user_care_records, name='get_user_care_records'),
    path('care-records/create/', create_care_record, name='create_care_record'),
    path('care-records/detail/<int:id>/', get_care_record_detail, name='get_care_record_detail'),
]