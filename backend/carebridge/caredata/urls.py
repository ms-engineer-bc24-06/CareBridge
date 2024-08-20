from django.urls import path
from .views import get_care_records, get_user_care_records, create_care_record, get_care_record_detail, delete_care_record, update_care_record

urlpatterns = [
    path('care-records/', get_care_records),
    path('care-records/<uuid:uuid>/', get_user_care_records, name='get_user_care_records'),
    path('care-records/create/', create_care_record, name='create_care_record'),
    path('care-records/update/<int:id>/', update_care_record, name='update_care_record'),  # 更新用エンドポイント
    path('care-records/delete/<int:id>/', delete_care_record, name='delete_care_record'),  # 削除用エンドポイント
]