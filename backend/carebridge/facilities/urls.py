from django.urls import path
from .views import get_facilities, get_facility, create_facility, update_facility, delete_facility

urlpatterns = [
    path('facilities/', get_facilities, name='get_facilities'),
    path('facilities/<int:id>/', get_facility, name='get_facility'),
    path('facilities/', create_facility, name='create_facility'),
    path('facilities/<int:id>/', update_facility, name='update_facility'),
    path('facilities/<int:id>/', delete_facility, name='delete_facility'),
]
