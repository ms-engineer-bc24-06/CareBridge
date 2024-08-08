from django.urls import path
from . import views

urlpatterns = [
    path('care-records/', views.get_care_records),
]