# users/tests.py
from django.test import TestCase
from carebridge.models import User, Facility
from uuid import uuid4

class UserModelTest(TestCase):
    def setUp(self):
        # Facilityのインスタンスを作成
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Person",
            email="test@example.com",
            is_active=True
        )

        # Userのインスタンスを作成
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            user_id="00000001",
            facility=self.facility,
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210",
        )

    def test_user_creation(self):
        # Userが正しく作成されたかテスト
        self.assertEqual(self.user.user_name, "Test User")
        self.assertEqual(self.user.facility.facility_name, "Test Facility")
        self.assertEqual(User.objects.count(), 1)
        self.assertIsNotNone(self.user.uuid)
