from django.db import models

class Facility(models.Model):
    id = models.AutoField(primary_key=True)
    facility_name = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()

class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=16)
    card_expiry = models.CharField(max_length=5)
    card_cvc = models.CharField(max_length=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    password_hash = models.CharField(max_length=255)
    facility = models.ForeignKey(Facility, related_name='admins', on_delete=models.CASCADE)

class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class User(models.Model):
    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    password_hash = models.CharField(max_length=255)
    user_name = models.CharField(max_length=10)
    user_birthday = models.DateField()
    user_sex = models.CharField(max_length=10)
    emergency_contact_name = models.CharField(max_length=50)
    emergency_contact_relationship = models.CharField(max_length=20)
    emergency_contact_phone = models.CharField(max_length=15)
    allergies = models.CharField(max_length=100, null=True)
    medications = models.CharField(max_length=255, null=True)
    medical_history = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Staff(models.Model):
    id = models.AutoField(primary_key=True)
    password_hash = models.CharField(max_length=255)
    facility = models.ForeignKey(Facility, related_name='staffs', on_delete=models.CASCADE)
    staff_name = models.CharField(max_length=10)
    is_admin = models.BooleanField(default=False)  # デフォルト値をFalseと設定

class ContactNote(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    detail = models.TextField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)

class CareRecord(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    meal = models.CharField(max_length=50)
    excretion = models.CharField(max_length=50)
    bath = models.CharField(max_length=50)
    temperature = models.FloatField(null=True)
    systolic_bp = models.IntegerField(null=True)
    diastolic_bp = models.IntegerField(null=True)
    comments = models.TextField(null=True)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)

class MedicalRecord(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    medical_facility_name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    detail = models.TextField()
