from django.utils import timezone
from django.db import models
from django.db import transaction
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
import uuid

def validate_domain(value):
    if not value or '.' not in value:
        raise ValidationError("Enter a valid domain.")

class Plan(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)  # 例: 'monthly', 'yearly'
    description = models.TextField(null=True, blank=True)  # プランの説明

    def __str__(self):
        return self.name

class Facility(models.Model):
    id = models.AutoField(primary_key=True)
    facility_name = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    contact_person = models.CharField(max_length=20)
    email = models.EmailField()
    email_domain = models.CharField(max_length=50, validators=[validate_domain])
    is_active = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if '@' in self.email:
            self.email_domain = self.email.split('@')[1]
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.facility_name

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
    ]

    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)  # 料金プランの外部キー
    stripe_payment_method_id = models.CharField(max_length=255, unique=True, null=False)
    stripe_subscription_id = models.CharField(max_length=255, null=True)
    trial_end_date = models.DateField(null=True, blank=True)  # 無料試用期間の終了日
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')  # choicesを追加

    def __str__(self):
        return f"{self.facility.facility_name} - Payment"

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('trial', 'Trial'),
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
        ('active', 'Active'),
    ]
    
    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, null=False)  # choicesを参照
    stripe_transaction_id = models.CharField(max_length=255, unique=True, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.facility.facility_name} - {self.status} - {self.created_at}"


class User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firebase_uid = models.CharField(max_length=128, unique=True, blank=True)
    user_id = models.CharField(max_length=8, unique=True)  # 8桁の文字列に変更
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='users')
    user_name = models.CharField(max_length=10)
    user_name_kana = models.CharField(max_length=20)
    user_birthday = models.DateField()
    user_sex = models.CharField(max_length=10)
    emergency_contact_name = models.CharField(max_length=50)
    emergency_contact_relationship = models.CharField(max_length=20)
    emergency_contact_phone = models.CharField(max_length=15)
    allergies = models.CharField(max_length=100, null=True, blank=True)
    medications = models.CharField(max_length=255, null=True, blank=True)
    medical_history = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.user_id:
            with transaction.atomic():
                counter, created = UserCounter.objects.select_for_update().get_or_create(name=f'facility_{self.facility.id}')
                counter.value += 1
                self.user_id = f'{counter.value:08d}'  # 8桁のゼロ埋め
                counter.save()
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.facility.facility_name} - {self.user_name} ({self.uuid})"

class UserCounter(models.Model):
    name = models.CharField(max_length=50, unique=True)
    value = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name 
       
class Staff(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firebase_uid = models.CharField(max_length=128, unique=True, blank=True)
    staff_id = models.CharField(max_length=6, unique=True)  # 6桁の文字列に変更
    facility = models.ForeignKey(Facility, related_name='staffs', on_delete=models.CASCADE)
    staff_name = models.CharField(max_length=10)
    staff_name_kana = models.CharField(max_length=20)
    is_admin = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.staff_id:
            with transaction.atomic():
                counter, created = StaffCounter.objects.select_for_update().get_or_create(name=f'facility_{self.facility.id}')
                counter.value += 1
                self.staff_id = f'{counter.value:06d}'  # 6桁のゼロ埋め
                counter.save()
        super(Staff, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.facility.facility_name} - {self.staff_name}"

class StaffCounter(models.Model):
    name = models.CharField(max_length=50, unique=True)
    value = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ContactNote(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='uuid')
    date = models.DateField()
    detail = models.TextField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, to_field='uuid')
    is_confirmed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user} - {self.date}"

class CareRecord(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='uuid')
    date = models.DateField()
    meal = models.CharField(max_length=50)
    excretion = models.CharField(max_length=50)
    bath = models.CharField(max_length=50)
    temperature = models.FloatField(null=True, blank=True)
    systolic_bp = models.IntegerField(null=True, blank=True)
    diastolic_bp = models.IntegerField(null=True, blank=True)
    comments = models.TextField(blank=True)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, to_field='uuid')
    
    def __str__(self):
        return f"{self.user} - {self.date}"
    
class Prescription(models.Model):
    id = models.AutoField(primary_key=True)  # 自動増分の整数型IDを主キーとして使用
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='uuid')
    hospital_name = models.CharField(max_length=255)  # 病院名
    date = models.DateField()  # 日付
    medication_name = models.CharField(max_length=255)  # 薬の名前
    dosage_and_usage = models.TextField()  # 投薬方法と用法
    pharmacy_name = models.CharField(max_length=255)  # 薬局名
    pharmacy_phone_number = models.CharField(max_length=15, blank=True, null=True)  # 薬局の電話番号
    comment = models.TextField(blank=True, null=True)  # コメント
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, to_field='uuid')
    created_at = models.DateTimeField(auto_now_add=True)  # レコード作成日時

    def __str__(self):
        return f"{self.medication_name} - {self.date}"
