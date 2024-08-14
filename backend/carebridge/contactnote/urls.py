from django.urls import path
from .views import get_contact_notes, get_user_contact_notes, get_contact_note_by_id, update_contact_note_status

urlpatterns = [
    path('contact-notes/', get_contact_notes),
    path('contact-notes/<uuid:uuid>/', get_user_contact_notes, name='get_user_contact_notes'),
    path('contact-note/<int:id>/', get_contact_note_by_id, name='get_contact_note_by_id'),  # IDで取得
    path('contact-note/<int:id>/update-status/', update_contact_note_status, name='update_contact_note_status'),  # ステータス更新
]