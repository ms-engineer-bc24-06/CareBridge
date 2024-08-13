from django.urls import path
from .views import get_staffs, get_staff, create_staff, update_staff, delete_staff

urlpatterns = [
    path('staffs/', get_staffs, name='get_staffs'),
    path('staffs/<uuid:uuid>/', get_staff, name='get_staff'),
    path('staffs/', create_staff, name='create_staff'),
    path('staffs/<uuid:uuid>/', update_staff, name='update_staff'),
    path('staffs/<uuid:uuid>/', delete_staff, name='delete_staff'),
]
