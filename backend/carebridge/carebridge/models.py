from django.db import models
from django.db import transaction
import uuid

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
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=8, unique=True, blank=True)  # 施設で運用するID
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    password_hash = models.CharField(max_length=255)
    user_name = models.CharField(max_length=10)
    user_name_kana = models.CharField(max_length=20)
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

    # 施設内で取り扱いしやすい連番のユーザーIDを付与
    def save(self, *args, **kwargs):
        with transaction.atomic():  # トランザクションを使用
            if not self.user_id:
                # ID生成用のカウンターを取得し、更新する
                counter, created = UserCounter.objects.get_or_create(name="user_id")
                counter.value += 1
                counter.save()
                self.user_id = f'{counter.value:08d}'  # 8桁のゼロ埋め
            super(User, self).save(*args, **kwargs)

# 連番管理：ユーザーIDの最後の番号を保持する専用、常に最新の番号を更新する
class UserCounter(models.Model):
    name = models.CharField(max_length=50, unique=True)
    value = models.IntegerField(default=0)
        
class Staff(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff_id = models.CharField(max_length=6, unique=True, blank=True)  # 施設で運用するID
    password_hash = models.CharField(max_length=255)
    facility = models.ForeignKey(Facility, related_name='staffs', on_delete=models.CASCADE)
    staff_name = models.CharField(max_length=10)
    staff_name_kana = models.CharField(max_length=20)
    is_admin = models.BooleanField(default=False)  # デフォルト値をFalseと設定
    
    def save(self, *args, **kwargs):
        with transaction.atomic():  # トランザクションを使ってデータベース操作を保護
            if not self.staff_id:
                # 同じ施設内で最後のstaff_idを取得
                last_staff = Staff.objects.filter(facility=self.facility).order_by('staff_id').last()
                if last_staff and last_staff.staff_id:
                    # 新しいstaff_idを生成 (施設内で連番)
                    new_id = int(last_staff.staff_id) + 1
                else:
                    # この施設での最初のスタッフの場合
                    new_id = 1
                self.staff_id = f'{new_id:06d}'  # 6桁のゼロ埋め
            super(Staff, self).save(*args, **kwargs)  # 親クラスのsaveメソッドを呼び出す

    def __str__(self):
        return f"{self.facility.facility_name} - {self.staff_name}"

    def save(self, *args, **kwargs):
        with transaction.atomic(): # トランザクションを使ってデータベース操作を保護
            if self.staff_id is None:  # staff_idが未設定の場合のみ新しいIDを生成
                counter, created = StaffCounter.objects.get_or_create(name="staff_id")
                counter.value += 1
                counter.save()
                self.staff_id = counter.value  # ゼロ埋めせずに整数として直接代入
            super(Staff, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.facility.facility_name} - {self.staff_name}"

class StaffCounter(models.Model):
    name = models.CharField(max_length=50, unique=True)
    value = models.IntegerField(default=0)

class ContactNote(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id')
    date = models.DateField()
    detail = models.TextField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, to_field='staff_id')

class CareRecord(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id')
    date = models.DateField()
    meal = models.CharField(max_length=50)
    excretion = models.CharField(max_length=50)
    bath = models.CharField(max_length=50)
    temperature = models.FloatField(null=True)
    systolic_bp = models.IntegerField(null=True)
    diastolic_bp = models.IntegerField(null=True)
    comments = models.TextField(null=True)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, to_field='staff_id')

class MedicalRecord(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id')
    date = models.DateField()
    medical_facility_name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    detail = models.TextField()
