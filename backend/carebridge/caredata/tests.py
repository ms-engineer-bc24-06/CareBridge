from django.test import TestCase
from rest_framework.test import APIClient
from carebridge.models import CareRecord, User, Facility, Staff
from uuid import uuid4

# 全ケア記録を取得するテスト
class GetCareRecordsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Person",
            email="test@example.com",
            is_active=True
        )
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            facility=self.facility,
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210",
        )
        self.staff = Staff.objects.create(
            uuid=uuid4(),
            firebase_uid="test_staff_uid",
            facility=self.facility,
            staff_name="Test Staff",
            staff_name_kana="テストスタッフ",
            is_admin=False,
        )
        CareRecord.objects.create(
            user=self.user,
            staff=self.staff,  # ここでstaffを追加
            date="2023-01-01",
            meal="Test Meal",
            excretion="Test Excretion",
            bath="Test Bath"
        )

    def test_get_care_records(self):
        response = self.client.get('/api/care-records/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

# 特定ユーザーのケア記録を取得するテスト
class GetUserCareRecordsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Person",
            email="test@example.com",
            is_active=True
        )
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            facility=self.facility,
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210",
        )
        self.staff = Staff.objects.create(
            uuid=uuid4(),
            firebase_uid="test_staff_uid",
            facility=self.facility,
            staff_name="Test Staff",
            staff_name_kana="テストスタッフ",
            is_admin=False,
        )
        CareRecord.objects.create(
            user=self.user,
            staff=self.staff,  # ここでstaffを追加
            date="2023-01-01",
            meal="Test Meal",
            excretion="Test Excretion",
            bath="Test Bath"
        )

    def test_get_user_care_records(self):
        response = self.client.get(f'/api/care-records/{self.user.uuid}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

# ケア記録を作成するテスト
class CreateCareRecordTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Person",
            email="test@example.com",
            is_active=True
        )
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            facility=self.facility,
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210",
        )
        self.staff = Staff.objects.create(
            uuid=uuid4(),
            firebase_uid="test_staff_uid",
            facility=self.facility,
            staff_name="Test Staff",
            staff_name_kana="テストスタッフ",
            is_admin=False,
        )

    def test_create_care_record(self):
        data = {
            "user": self.user.uuid,
            "date": "2023-01-01",
            "meal": "Test Meal",
            "excretion": "Test Excretion",
            "bath": "Test Bath",
            "temperature": 36.5,
            "systolic_bp": 120,
            "diastolic_bp": 80,
            "comments": "Test comment",
            "staff": self.staff.uuid,
        }
        response = self.client.post('/api/care-records/create/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CareRecord.objects.count(), 1)

# ケア記録を削除するテスト
class DeleteCareRecordTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Person",
            email="test@example.com",
            is_active=True
        )
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            facility=self.facility,
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210",
        )
        self.staff = Staff.objects.create(
            uuid=uuid4(),
            firebase_uid="test_staff_uid",
            facility=self.facility,
            staff_name="Test Staff",
            staff_name_kana="テストスタッフ",
            is_admin=False,
        )
        self.care_record = CareRecord.objects.create(
            user=self.user,
            staff=self.staff,  # ここでstaffを追加
            date="2023-01-01",
            meal="Test Meal",
            excretion="Test Excretion",
            bath="Test Bath"
        )

    def test_delete_care_record(self):
        response = self.client.delete(f'/api/care-records/delete/{self.care_record.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(CareRecord.objects.count(), 0)
