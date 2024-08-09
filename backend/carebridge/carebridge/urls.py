from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('caredata.urls')), # ケア情報
    path('api/', include('users.urls')), # ユーザー情報
    path('api/', include('logout.urls')),  # logoutのエンドポイントを追加
]