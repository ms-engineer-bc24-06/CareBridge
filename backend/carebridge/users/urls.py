from django.urls import path
from .views import get_users, get_user, get_user_uuid_by_firebase_uid

urlpatterns = [
    path('users/', get_users, name='get_users'),
    path('users/<uuid:uuid>/', get_user, name='get_user'),
    path('users/firebase/<str:firebase_uid>/', get_user_uuid_by_firebase_uid, name='get_user_uuid_by_firebase_uid'),  # ユーザ用ページで自身のFirebaseのUID取得用
]