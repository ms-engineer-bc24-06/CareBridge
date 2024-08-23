from django.urls import path
from .views import get_staffs, get_staff, get_staff_by_firebase_uid, get_staffs_by_facility, create_staff, update_staff, delete_staff

urlpatterns = [
    path('staffs/', get_staffs, name='get_staffs'),
    path('staffs/<uuid:uuid>/', get_staff, name='get_staff'),
    path('staffs/firebase/<str:firebase_uid>/', get_staff_by_firebase_uid, name='get_staff_by_firebase_uid'), #認証情報をつかって取得
    path('staffs/facility/<int:facility_id>/', get_staffs_by_facility, name='get_staffs_by_facility'),
    path('staffs/create/', create_staff, name='create_staff'),
    path('staffs/<uuid:uuid>/update/', update_staff, name='update_staff'),
    path('staffs/<uuid:uuid>/delete/', delete_staff, name='delete_staff'),
]