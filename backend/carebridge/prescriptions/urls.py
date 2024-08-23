from django.urls import path
from .import views 
urlpatterns = [
    path('ocr/', views.ocr_view, name='ocr_view'), #OCRで得たテキストを加工
    path('save/', views.save_prescription, name='save_prescription'), # 処方箋の保存APIエンドポイント
    path('<uuid:uuid>/', views.get_prescriptions_by_user, name='get_prescriptions_by_user'),  # ユーザーごとの処方箋一覧
]
