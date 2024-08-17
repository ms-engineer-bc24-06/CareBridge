from django.urls import path
from . import views

urlpatterns = [
    path('contact-notes/<uuid:uuid>/', views.get_contact_notes_by_user, name='get_contact_notes_by_user'),
    path('contact-note/<int:id>/', views.get_contact_note_detail, name='get_contact_note_detail'),
    path('contact-note/<int:id>/update/', views.update_contact_note, name='update_contact_note'),  # 更新用のエンドポイント
    path('contact-note/<int:id>/update-status/', views.update_contact_note_status, name='update_contact_note_status'),  # ステータス更新用のエンドポイント
    path('contact-note/', views.create_contact_note, name='create_contact_note'),  # 新規登録用エンドポイント
]
