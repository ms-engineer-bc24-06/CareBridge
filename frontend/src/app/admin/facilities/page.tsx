"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authのインポート

// Facilityインターフェースの定義
interface Facility {
  id?: number;  // 施設のID（省略可能）
  facility_name: string;  // 施設名
  address: string;  // 施設の住所
  phone_number: string;  // 施設の電話番号
  email: string;  // 施設のメールアドレス
  contact_person?: string;  // 施設の担当者（省略可能）
}

const FacilitiesManagement: React.FC = () => {
  const [facility, setFacility] = useState<Facility | null>(null);  // 施設情報の状態
  const [isEditing, setIsEditing] = useState<boolean>(false);  // 編集モードの状態
  const [errors, setErrors] = useState<{ [key: string]: string }>({});  // エラーメッセージ
  const [staffFacilityId, setStaffFacilityId] = useState<number | null>(null); // ログイン中のスタッフの施設IDを保存する状態

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid; // Firebaseから取得したユーザーUID
        fetchStaffFacilityId(uid); // UIDを利用して施設IDを取得
      } else {
        console.error("ユーザーがログインしていません");
      }
    });
  }, []);

  useEffect(() => {
    if (staffFacilityId) {
      fetchFacility(staffFacilityId); // 施設IDが取得できたら施設情報を取得
    }
  }, [staffFacilityId]);

  const fetchStaffFacilityId = async (uid: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/staffs/get_staff_facility_id/?firebase_uid=${uid}`);  // UIDをクエリパラメータとして施設IDを取得するエンドポイント
      setStaffFacilityId(response.data.facility_id); // 取得した施設IDを保存
    } catch (error) {
      console.error("施設IDの取得中にエラーが発生しました", error);
    }
  };

  const fetchFacility = async (facilityId: number) => {
    try {
      const response = await axios.get<Facility>(`http://localhost:8000/api/facilities/${facilityId}/`);  // ログイン中のスタッフの施設情報を取得
      setFacility(response.data);  // 取得した施設情報をstateに保存
    } catch (error) {
      console.error("施設情報の取得中にエラーが発生しました", error);
    }
  };

  const handleUpdateFacility = async () => {
    if (facility && validateForm(facility)) {
      try {
        const response = await axios.put(`http://localhost:8000/api/facilities/${facility.id}/`, facility);
        setFacility(response.data);  // 更新された施設情報をstateに保存
        setIsEditing(false);  // 編集モードを終了
        setErrors({});  // エラーメッセージをクリア
      } catch (error) {
        console.error("施設情報の更新中にエラーが発生しました", error);
      }
    }
  };

  const validateForm = (facility: Facility) => {
    const newErrors: { [key: string]: string } = {};
    if (!facility.facility_name) newErrors.facility_name = '必須項目です';
    if (!facility.address) newErrors.address = '必須項目です';
    if (!facility.phone_number) newErrors.phone_number = '必須項目です';
    if (!facility.email) newErrors.email = '必須項目です';
    if (!facility.contact_person) newErrors.contact_person = '必須項目です';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderRequiredLabel = () => (
    <span style={{ color: 'red' }}>*</span>
  );

  const renderErrorMessage = (fieldName: string) => {
    if (errors[fieldName]) {
      return <span style={{ color: 'red' }}>{errors[fieldName]}</span>;
    }
    return null;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">施設情報</h1>
      {facility && (
        <div className="flex flex-col items-start bg-white p-16 rounded-lg shadow-lg w-full max-w-none mx-auto">
          <div className="text-xl mb-4 w-full">
            <strong>施設名:</strong> {facility.facility_name}
          </div>
          <div className="text-lg mb-4 w-full">
            <strong>住所:</strong> {facility.address}
          </div>
          <div className="text-lg mb-4 w-full">
            <strong>電話番号:</strong> {facility.phone_number}
          </div>
          <div className="text-lg mb-4 w-full">
            <strong>メール:</strong> {facility.email}
          </div>
          <div className="text-lg mb-4 w-full">
            <strong>担当者:</strong> {facility.contact_person}
          </div>
          <div className="flex justify-end w-full mt-8">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-6 py-3 text-lg rounded">編集</button>
          </div>
        </div>
      )}

      {/* 編集ポップアップ */}
      {isEditing && facility && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col justify-center">
            <label className="block mb-4 text-lg">
              施設名{renderRequiredLabel()}:
              <input
                type="text"
                value={facility.facility_name}
                onChange={(e) => setFacility({ ...facility, facility_name: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              {renderErrorMessage("facility_name")}
            </label>
            <label className="block mb-4 text-lg">
              住所{renderRequiredLabel()}:
              <input
                type="text"
                value={facility.address}
                onChange={(e) => setFacility({ ...facility, address: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              {renderErrorMessage("address")}
            </label>
            <label className="block mb-4 text-lg">
              電話番号{renderRequiredLabel()}:
              <input
                type="text"
                value={facility.phone_number}
                onChange={(e) => setFacility({ ...facility, phone_number: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              {renderErrorMessage("phone_number")}
            </label>
            <label className="block mb-4 text-lg">
              メール{renderRequiredLabel()}:
              <input
                type="email"
                value={facility.email}
                onChange={(e) => setFacility({ ...facility, email: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              {renderErrorMessage("email")}
            </label>
            <label className="block mb-4 text-lg">
              担当者{renderRequiredLabel()}:
              <input
                type="text"
                value={facility.contact_person ?? ''}
                onChange={(e) => setFacility({ ...facility, contact_person: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              {renderErrorMessage("contact_person")}
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpdateFacility}
                className={`bg-blue-500 text-white px-6 py-3 rounded text-lg ${Object.keys(errors).length === 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={Object.keys(errors).length > 0}
              >
                保存
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-6 py-3 rounded text-lg ml-4">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesManagement;
