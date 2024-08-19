from django.urls import path
from . import views  # 既存のインポート

# URLパターンとそれに対応するビュー関数の定義
urlpatterns = [
    # path('create_user/', views.create_user, name='create_user'),  # 管理者ユーザーを作成するエンドポイント
    path('check_firebase/', views.check_firebase, name='check_firebase'),  # Firebaseの状態を確認するエンドポイント
    path('register_family_member_user/', views.register_family_member_user, name='register_family_member_user'),  # 介護家族ユーザーを作成するエンドポイント
    path('create_staff_user/', views.create_staff_user, name='create_staff_user'),  # 職員ユーザーを作成するエンドポイント
    path('test-firebase/', views.test_firebase, name='test_firebase'),  #  Firebase　Admin SDKテストのために使用
]
