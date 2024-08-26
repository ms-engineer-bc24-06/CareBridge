from django.urls import path
from .views import get_facilities, get_facility, create_facility, update_facility, delete_facility, get_staff_facility_id

urlpatterns = [
    path('facilities/', get_facilities, name='get_facilities'),
    path('facilities/<int:id>/', get_facility, name='get_facility'),
    path('facilities/create/', create_facility, name='create_facility'),
    path('facilities/update/<int:id>/', update_facility, name='update_facility'),
    path('facilities/delete/<int:id>/', delete_facility, name='delete_facility'),
    path('staffs/get_staff_facility_id/', get_staff_facility_id, name='get_staff_facility_id'),
]
