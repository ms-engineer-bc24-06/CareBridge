from rest_framework.test import APITestCase
from django.urls import reverse
from carebridge.models import Staff, Facility
from rest_framework import status
from uuid import uuid4
from random import randint

class StaffAPITest(APITestCase):

    def setUp(self):
        # テスト用の施設とスタッフの作成
        self.facility = Facility.objects.create(
        facility_name='Test Facility',
        address='123 Test St.',
        phone_number='1234567890',
        contact_person='Test Manager',
        email='test@facility.com',
        email_domain='facility.com',
        is_active=True
    )
        self.staff = Staff.objects.create(
        firebase_uid='firebase_uid_123',
        staff_id=f'{randint(100000, 999999)}',
        facility=self.facility,
        staff_name='Test Staff',
        staff_name_kana='テストスタッフ',
        is_admin=False
    )

    # URLをセットアップ
        self.get_staff_url = reverse('get_staff', args=[str(self.staff.uuid)])
        self.get_staffs_url = reverse('get_staffs')  # 全スタッフ取得のURL
        self.create_staff_url = reverse('create_staff')
        self.update_staff_url = reverse('update_staff', args=[str(self.staff.uuid)])
        self.delete_staff_url = reverse('delete_staff', args=[str(self.staff.uuid)])


    def test_get_staff(self):
        # スタッフ情報取得のテスト
        response = self.client.get(self.get_staff_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['staff_name'], self.staff.staff_name)

    def test_get_staff_not_found(self):
        # 存在しないスタッフ取得のテスト
        invalid_uuid = uuid4()
        url = reverse('get_staff', args=[str(invalid_uuid)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_staffs(self):
        # 全スタッフ取得のテスト
        response = self.client.get(self.get_staffs_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_delete_staff_not_found(self):
        # 存在しないスタッフ削除のテスト
        invalid_uuid = uuid4()
        url = reverse('delete_staff', args=[str(invalid_uuid)])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_staff(self):
        # スタッフ作成のテスト（正常ケース：staff_nameは10文字以内）
        data = {
            'firebase_uid': 'new_firebase_uid',
            'staff_id': f'{randint(100000, 999999)}',
            'facility': self.facility.id,
            'staff_name': '田中 茂樹',  # 10文字以内
            'staff_name_kana': 'ニュースタッフ',
            'is_admin': False
        }
        response = self.client.post(self.create_staff_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['staff_name'], '田中 茂樹')

    def test_create_staff_validation_error(self):
        # スタッフ作成時のバリデーションエラーテスト（staff_nameは10文字以上）
        data = {
            'firebase_uid': 'new_firebase_uid',
            'staff_id': f'{randint(100000, 999999)}',
            'facility': self.facility.id,
            'staff_name': '田中 茂樹１０文字超えている',  # 10文字を超えている
            'staff_name_kana': 'ニュースタッフ',
            'is_admin': False
        }
        response = self.client.post(self.create_staff_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('staff_name', response.data)

    def test_update_staff(self):
        # スタッフ更新のテスト（正常ケース：staff_nameは10文字以内）
        data = {
            'firebase_uid': 'updated_firebase_uid',
            'staff_id': self.staff.staff_id,
            'facility': self.facility.id,
            'staff_name': '田中 茂樹',  # 10文字以内
            'staff_name_kana': 'アップデートスタッフ',
            'is_admin': True
        }
        response = self.client.put(self.update_staff_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['staff_name'], '田中 茂樹')

    def test_update_staff_validation_error(self):
        # スタッフ更新時のバリデーションエラーテスト（staff_nameは10文字以上）
        data = {
            'firebase_uid': 'updated_firebase_uid',
            'staff_id': self.staff.staff_id,
            'facility': self.facility.id,
            'staff_name': '田中 茂樹１０文字超えている',  # 10文字を超えている
            'staff_name_kana': 'アップデートスタッフ',
            'is_admin': True
        }
        response = self.client.put(self.update_staff_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('staff_name', response.data)
