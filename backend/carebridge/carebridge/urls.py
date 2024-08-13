from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('caredata.urls')), # ケア情報
    path('api/', include('users.urls')), # ユーザー情報
    path('api/', include('staffs.urls')), # スタッフ情報
<<<<<<< HEAD
    path('api/', include('facilities.urls')), # 施設情報
=======
>>>>>>> 3e5c5c6 (staffs_DB疎通_get)
    path('api/', include('logout.urls')),  # logoutのエンドポイントを追加
]