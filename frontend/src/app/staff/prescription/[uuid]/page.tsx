"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import Modal from "../../../../components/modalCareRegister";
import PrescriptionRegisterForm from "../../../../components/prescriptionRegisterForm";

// 処方箋の情報を定義する型
type Prescription = {
  id: number;
  hospital_name: string;
  date: string;
  medication_name: string;
  dosage_and_usage: string;
  pharmacy_name: string;
  pharmacy_phone_number: string;
  staff: string; // スタッフのUUID（外部キー）
};

type UserDetail = {
  uuid: string;
  user_id: string;
  user_name: string;
  user_name_kana: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

type StaffDetail = {
  uuid: string; // スタッフのUUID（外部キー）
  staff_id: string; // スタッフのID
  staff_name: string;
};

const PrescriptionPage = () => {
  const params = useParams();
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

  // State管理
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]); // 処方箋のリスト
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // ユーザー詳細情報
  const [staffDetails, setStaffDetails] = useState<{
    [key: string]: StaffDetail;
  }>({});
  const [loading, setLoading] = useState(true); // ローディング状態
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダル表示状態
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null); // 選択された処方箋（編集用）

  // 初期ロード時に処方箋とユーザー詳細を取得
  useEffect(() => {
    if (uuid) {
      fetchPrescriptions(uuid);
      fetchUserDetail(uuid);
    }
  }, [uuid]);

  // スタッフ情報を取得
  useEffect(() => {
    fetchStaffDetails();
  }, []);

  // 処方箋をユーザーIDで取得する関数
  const fetchPrescriptions = async (userUuid: string) => {
    try {
      const response = await axios.get<Prescription[]>(
        `http://localhost:8000/api/prescriptions/${userUuid}/`
      );

      // 日付でソートして新しい順に並べ替える
      const sortedPrescriptions = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPrescriptions(sortedPrescriptions); // ソート後の処方箋をセット
      setLoading(false); // ローディング完了
    } catch (error) {
      console.error("処方箋の取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  // ユーザー詳細を取得する関数
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await axios.get<UserDetail>(
        `http://localhost:8000/api/users/${userUuid}/`
      );
      setUserDetail(response.data); // 取得したユーザー詳細をセット
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // スタッフ情報を取得してマッピングを作成する関数
  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get<StaffDetail[]>(
        `http://localhost:8000/api/staffs/`
      );
      const staffMap: { [key: string]: StaffDetail } = {};
      response.data.forEach((staff) => {
        staffMap[staff.uuid] = staff;
      });
      setStaffDetails(staffMap); // スタッフのUUIDをキーとするマッピングをセット
    } catch (error) {
      console.error("スタッフ情報の取得中にエラーが発生しました");
    }
  };

  // フォーム送信後にリストを更新する関数
  const handleFormSubmit = () => {
    fetchPrescriptions(uuid); // 処方箋を再取得してリストを更新
    closeModal(); // モーダルを閉じる
  };

  // モーダルを開く関数（新規登録または編集用）
  const openModal = (prescription: Prescription | null = null) => {
    setSelectedPrescription(prescription); // 編集対象の処方箋をセット（新規の場合はnull）
    setIsModalOpen(true); // モーダルを表示
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false); // モーダルを非表示
    setSelectedPrescription(null); // 編集対象をリセット
  };

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <Link href="/staff/users">
        <button className="text-blue-800 mb-4">←利用者一覧に戻る</button>
      </Link>
      <div className="flex justify-between items-center mb-6">
        {userDetail && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="mr-4">
                <h2 className="text-xl font-bold">{userDetail.user_id}</h2>
                <h2 className="text-xl font-bold">{userDetail.user_name}</h2>
                <p>{userDetail.user_name_kana}</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              処方薬登録
            </button>
          </div>
        )}
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">日付</th>
            <th className="py-2 px-3 border-b">薬名</th>
            <th className="py-2 px-3 border-b">用法用量</th>
            <th className="py-2 px-3 border-b">薬局名</th>
            <th className="py-2 px-3 border-b">電話番号</th>
            <th className="py-2 px-3 border-b">スタッフ名</th>
            <th className="py-2 px-3 border-b">アクション</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription.id}>
              <td className="py-2 px-3 border-b text-center">{prescription.date}</td>
              <td className="py-2 px-3 border-b text-center truncate max-w-xs">
                {prescription.medication_name}
              </td>
              <td className="py-2 px-3 border-b text-center">
                {prescription.dosage_and_usage}
              </td>
              <td className="py-2 px-3 border-b text-center">
                {prescription.pharmacy_name}
              </td>
              <td className="py-2 px-3 border-b text-center">
                {prescription.pharmacy_phone_number}
              </td>
              {/* スタッフUUIDを元に対応するスタッフIDと名前を表示 */}
              <td className="py-2 px-3 border-b text-center">
                {staffDetails[prescription.staff]?.staff_name || "不明"}
              </td>
              <td className="py-2 px-3 border-b text-center">
                <button
                  onClick={() => openModal(prescription)}
                  className="bg-accent2 text-white px-4 py-2 rounded"
                >
                  確認・編集
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PrescriptionRegisterForm
          onClose={handleFormSubmit} // フォーム送信後にリストを更新
          userUuid={uuid}
          prescription={selectedPrescription} // 編集の場合に既存処方箋を渡す
        />
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
