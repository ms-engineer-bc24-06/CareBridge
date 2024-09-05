from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from carebridge.models import ContactNote, User, Staff, Facility
from uuid import uuid4

class ContactNoteAPITest(APITestCase):

    def setUp(self):
        # テスト用の施設を作成
        self.facility = Facility.objects.create(
            facility_name="Test Facility",
            address="123 Test St",
            phone_number="123-456-7890",
            contact_person="Test Contact",
            email="test@example.com",
            is_active=True
        )

        # テスト用のユーザーとスタッフを作成
        self.user = User.objects.create(
            uuid=uuid4(),
            firebase_uid="test_firebase_uid",
            user_id="00000001",
            facility=self.facility,  # Facilityを関連付け
            user_name="Test User",
            user_name_kana="テストユーザー",
            user_birthday="1990-01-01",
            user_sex="Male",
            emergency_contact_name="Emergency Contact",
            emergency_contact_relationship="Parent",
            emergency_contact_phone="987-654-3210"
        )

        self.staff = Staff.objects.create(
            uuid=uuid4(),
            firebase_uid="test_staff_uid",
            staff_id="000001",
            facility=self.facility,  # Facilityを関連付け
            staff_name="Test Staff",
            staff_name_kana="テストスタッフ"
        )

        # テスト用のContactNoteを作成
        self.contact_note = ContactNote.objects.create(
            user=self.user,
            date="2024-09-01",
            detail="This is a test contact note.",
            staff=self.staff,
            is_confirmed=False
        )

        # APIエンドポイントのURLを設定
        self.list_url = reverse('get_contact_notes_by_user', args=[self.user.uuid])
        self.detail_url = reverse('get_contact_note_detail', args=[self.contact_note.id])
        self.create_url = reverse('create_contact_note')
        self.update_url = reverse('update_contact_note', args=[self.contact_note.id])
        self.update_status_url = reverse('update_contact_note_status', args=[self.contact_note.id])

    # 正常系テスト
    def test_get_contact_notes_by_user(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['detail'], "This is a test contact note.")

    def test_get_contact_note_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "This is a test contact note.")

    def test_create_contact_note(self):
        data = {
            "user": str(self.user.uuid),
            "date": "2024-09-02",
            "detail": "New contact note",
            "staff": str(self.staff.uuid)
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['detail'], "New contact note")
        self.assertFalse(response.data['is_confirmed'])  # 新規作成時は未確認

    def test_update_contact_note(self):
        data = {
            "user": str(self.user.uuid),
            "date": "2024-09-03",
            "detail": "Updated contact note",
            "staff": str(self.staff.uuid)
        }
        response = self.client.put(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Updated contact note")

    def test_update_contact_note_status(self):
        data = {"is_confirmed": True}
        response = self.client.patch(self.update_status_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_confirmed'])  # ステータスが更新されていることを確認
