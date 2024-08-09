from rest_framework import serializers # type: ignore
from .models import Facility, Payment, Admin, Transaction, User, Staff, ContactNote, CareRecord, MedicalRecord

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

# class ContactNoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ContactNote
#         fields = '__all__'

# class CareRecordSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CareRecord
#         fields = '__all__'

# class MedicalRecordSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MedicalRecord
#         fields = '__all__'
