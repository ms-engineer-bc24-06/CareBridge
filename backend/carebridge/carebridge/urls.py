from django.contrib import admin
from django.urls import path, include
from firebaseManagement import views  # ここでviewsをインポート（# Firebase admin SDKが機能してるかテストのため追加）

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('caredata.urls')), # ケア情報
    path('api/', include('users.urls')), # ユーザー情報
    path('api/', include('staffs.urls')), # スタッフ情報
    path('api/', include('facilities.urls')), # 施設情報
    path('api/', include('contactnote.urls')),  # コンタクトノート
    path('api/', include('logout.urls')),  # logoutのエンドポイントを追加
    path('api/', include('payments.urls')),  # 支払い情報
    path('firebaseManagement/', include('firebaseManagement.urls')),  # Firebase admin SDK
    path('test-firebase/', views.test_firebase, name='test_firebase'),  # Firebase admin SDKが機能してるかテストのため追加
    path('api/prescriptions/', include('prescriptions.urls')),  # 医療情報
]