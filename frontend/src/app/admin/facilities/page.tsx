"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

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

  // コンポーネントの初回レンダリング時に施設情報を取得
  useEffect(() => {
    fetchFacility();
  }, []);

  // 特定の施設情報をAPIから取得する関数（仮にIDが1の施設を取得）
  const fetchFacility = async () => {
    try {
      const response = await axios.get<Facility>('http://localhost:8000/api/facilities/1/');  // IDが1の施設を取得
      setFacility(response.data);  // 取得した施設情報をstateに保存
    } catch (error) {
      console.error("施設情報の取得中にエラーが発生しました", error);
    }
  };

  // 施設情報を更新する関数
  const handleUpdateFacility = async () => {
    if (facility && isAllFieldsFilled(facility)) {
      try {
        const response = await axios.put(`http://localhost:8000/api/facilities/${facility.id}/`, facility);
        setFacility(response.data);  // 更新された施設情報をstateに保存
        setIsEditing(false);  // 編集モードを終了
      } catch (error) {
        console.error("施設情報の更新中にエラーが発生しました", error);
      }
    }
  };

  // 全フィールドが入力されているかを確認する関数
  const isAllFieldsFilled = (facility: Facility) => {
    return (
      facility.facility_name !== '' &&
      facility.address !== '' &&
      facility.phone_number !== '' &&
      facility.email !== '' &&
      facility.contact_person !== ''
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">施設情報</h1>
      <div className="mb-4 flex justify-between items-center">
        <div></div>
      </div>
      {facility && (
        <div className="flex flex-col items-start bg-white p-16 rounded-lg shadow-lg w-full max-w-none mx-auto">
        {/* <div className="flex flex-col items-start bg-white p-16 rounded-lg shadow-lg w-full max-w-7xl mx-auto min-h-3/4"> */}


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
              施設名:
              <input
                type="text"
                value={facility.facility_name}
                onChange={(e) => setFacility({ ...facility, facility_name: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              <input type="checkbox" checked={facility.facility_name !== ''} readOnly />
            </label>
            <label className="block mb-4 text-lg">
              住所:
              <input
                type="text"
                value={facility.address}
                onChange={(e) => setFacility({ ...facility, address: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              <input type="checkbox" checked={facility.address !== ''} readOnly />
            </label>
            <label className="block mb-4 text-lg">
              電話番号:
              <input
                type="text"
                value={facility.phone_number}
                onChange={(e) => setFacility({ ...facility, phone_number: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              <input type="checkbox" checked={facility.phone_number !== ''} readOnly />
            </label>
            <label className="block mb-4 text-lg">
              メール:
              <input
                type="email"
                value={facility.email}
                onChange={(e) => setFacility({ ...facility, email: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              <input type="checkbox" checked={facility.email !== ''} readOnly />
            </label>
            <label className="block mb-4 text-lg">
              担当者:
              <input
                type="text"
                value={facility.contact_person ?? ''}
                onChange={(e) => setFacility({ ...facility, contact_person: e.target.value })}
                className="border p-3 rounded w-full text-lg"
              />
              <input type="checkbox" checked={facility.contact_person !== ''} readOnly />
            </label>
            <div className="flex justify-end mt-4">
              <button onClick={handleUpdateFacility} className={`bg-blue-500 text-white px-6 py-3 rounded text-lg ${isAllFieldsFilled(facility) ? '' : 'opacity-50 cursor-not-allowed'}`} disabled={!isAllFieldsFilled(facility)}>保存</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-6 py-3 rounded text-lg ml-4">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesManagement;