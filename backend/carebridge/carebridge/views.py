from rest_framework import viewsets # type: ignore
from .models import Facility, Payment, Admin, Transaction, User, Staff, ContactNote, CareRecord, MedicalRecord
from .serializers import FacilitySerializer, PaymentSerializer, AdminSerializer, TransactionSerializer, UserSerializer, StaffSerializer, ContactNoteSerializer, CareRecordSerializer, MedicalRecordSerializer

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

# class ContactNoteViewSet(viewsets.ModelViewSet):
#     queryset = ContactNote.objects.all()
#     serializer_class = ContactNoteSerializer

# class CareRecordViewSet(viewsets.ModelViewSet):
#     queryset = CareRecord.objects.all()
#     serializer_class = CareRecordSerializer

# class MedicalRecordViewSet(viewsets.ModelViewSet):
#     queryset = MedicalRecord.objects.all()
#     serializer_class = MedicalRecordSerializer
