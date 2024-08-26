from django.urls import path
from .views import get_users, get_user, get_user_uuid_by_firebase_uid, create_user, update_user, delete_user

urlpatterns = [
    path('users/', get_users, name='get_users'),
    path('users/<uuid:uuid>/', get_user, name='get_user'),
    path('users/firebase/<str:firebase_uid>/', get_user_uuid_by_firebase_uid, name='get_user_uuid_by_firebase_uid'),  # ユーザ用ページで自身のFirebaseのUID取得用
    # path('users/facility/<int:facility_id>/', get_users_by_facility, name='get_users_by_facility'),
    path('users/create/', create_user, name='create_user'),
    path('users/<uuid:uuid>/update/', update_user, name='update_user'),
    path('users/<uuid:uuid>/delete/', delete_user, name='delete_user'),
]