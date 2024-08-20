"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Modal from "../../../../components/modalCareRegister";
import CareRegisterForm from "../../../../components/careRegisterForm";

// ケア記録データの型定義
type CareRecord = {
  id: number;
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  comments: string;
  staff: string; // スタッフのUUID
};

// ユーザー詳細情報の型定義
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

// スタッフ詳細情報の型定義
type StaffDetail = {
  uuid: string;
  staff_id: string;
  staff_name: string;
};

const CareRecordsPage = () => {
  const { uuid } = useParams(); // URLパラメータからUUIDを取得
  const userUuid = Array.isArray(uuid) ? uuid[0] : uuid; // UUIDが配列で返される場合に対応
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]); // 全てのケア記録を管理する状態変数
  const [filteredCareRecords, setFilteredCareRecords] = useState<CareRecord[]>(
    []
  ); // フィルタリングされたケア記録を管理する状態変数
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 選択された年を管理する状態変数
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // 選択された月を管理する状態変数
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // ユーザー詳細情報を管理する状態変数
  const [staffDetails, setStaffDetails] = useState<{
    [key: string]: StaffDetail;
  }>({}); // スタッフ詳細情報を管理する状態変数
  const [loading, setLoading] = useState(true); // ローディング状態を管理する状態変数
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダルの開閉状態を管理する状態変数
  const [selectedRecord, setSelectedRecord] = useState<CareRecord | null>(null); // 選択されたケア記録を管理する状態変数

  // コンポーネントがマウントされた時にケア記録とユーザー詳細を取得
  useEffect(() => {
    if (userUuid) {
      fetchCareRecords(userUuid);
      fetchUserDetail(userUuid);
    }
  }, [userUuid]);

  // スタッフ情報を取得して状態に保存
  useEffect(() => {
    fetchStaffDetails();
  }, []);

  // APIからケア記録を取得
  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );

      // 取得したケア記録を日付順にソート（新しい順）
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setCareRecords(sortedRecords);
      setLoading(false); // ローディング状態を解除
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
      setLoading(false); // ローディング状態を解除
    }
  };

  // APIからユーザー詳細情報を取得
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await axios.get<UserDetail>(
        `http://localhost:8000/api/users/${userUuid}/`
      );
      setUserDetail(response.data); // ユーザー詳細情報を状態にセット
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // APIからスタッフ情報を取得して、UUIDをキーとするマッピングを作成
  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get<StaffDetail[]>(
        `http://localhost:8000/api/staffs/`
      );
      const staffMap: { [key: string]: StaffDetail } = {};
      response.data.forEach((staff) => {
        staffMap[staff.uuid] = staff;
      });
      setStaffDetails(staffMap); // スタッフ情報を状態にセット
    } catch (error) {
      console.error("スタッフ情報の取得中にエラーが発生しました");
    }
  };

  // 選択された年と月に基づいてケア記録をフィルタリング
  const filterCareRecords = useCallback(() => {
    const filtered = careRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === selectedYear &&
        recordDate.getMonth() + 1 === selectedMonth
      );
    });
    setFilteredCareRecords(filtered); // フィルタリングされたケア記録を状態にセット
  }, [careRecords, selectedYear, selectedMonth]);

  // 年または月が変更された際にケア記録をフィルタリング
  useEffect(() => {
    filterCareRecords();
  }, [filterCareRecords]);

  // モーダルを開く関数（新規登録または編集用）
  const openModal = (record: CareRecord | null = null) => {
    console.log("openModalで渡されたrecordオブジェクト:", record);
    setSelectedRecord(record); // 編集対象のケア記録をセット（新規の場合はnull）
    setIsModalOpen(true); // モーダルを表示
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false); // モーダルを非表示
    setSelectedRecord(null); // 選択されたケア記録をリセット
    fetchCareRecords(userUuid); // モーダル閉じた後にケア記録リストを更新
  };

  // ケア記録を削除する関数
  const handleDelete = async (recordId: number) => {
    console.log("handleDeleteで渡されたrecordId:", recordId);
    const confirmDelete = confirm("このケア記録を削除してもよろしいですか？");
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/care-records/delete/${recordId}/`
        );
        fetchCareRecords(userUuid); // 削除後にケア記録を再取得
      } catch (error) {
        console.error("ケア記録の削除中にエラーが発生しました");
      }
    }
  };

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  // 選択可能な年のリストを生成
  const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  // 選択可能な月のリストを生成
  const months = Array.from({ length: 12 }, (v, k) => k + 1);

  return (
    <div className="p-6 min-h-screen">
      {/* 利用者一覧への戻りリンク */}
      <Link href="/staff/users">
        <button className="text-blue-800 mb-4">←利用者一覧に戻る</button>
      </Link>
      <div className="flex justify-between items-center mb-6">
        {userDetail && (
          <div className="flex items-center">
            {/* ユーザー詳細情報の表示 */}
            <div className="mr-4">
              <h2 className="text-xl font-bold">{userDetail.user_id}</h2>
              <h2 className="text-xl font-bold">{userDetail.user_name}</h2>
              <p>{userDetail.user_name_kana}</p>
            </div>
            <div className="flex items-center">
              {/* 年の選択 */}
              <label className="mr-2">年</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border p-2 rounded mr-2"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {/* 月の選択 */}
              <label className="mr-2">月</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border p-2 rounded"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {/* ケア登録ボタン */}
        <button
          onClick={() => openModal()}
          className="bg-secondary text-white px-4 py-2 rounded"
        >
          ケア登録
        </button>
      </div>
      {/* ケア記録の一覧テーブル */}
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">日付</th>
            <th className="py-2 px-3 border-b">食事</th>
            <th className="py-2 px-3 border-b">排泄</th>
            <th className="py-2 px-3 border-b">入浴</th>
            <th className="py-2 px-3 border-b">体温</th>
            <th className="py-2 px-3 border-b">血圧（最低）</th>
            <th className="py-2 px-3 border-b">血圧（最高）</th>
            <th className="py-2 px-3 border-b">コメント</th>
            <th className="py-2 px-3 border-b">スタッフ名</th>
            <th className="py-2 px-3 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredCareRecords.map((record) => (
            <tr key={record.id}>
              <td className="py-2 px-3 border-b">{record.date}</td>
              <td className="py-2 px-3 border-b">{record.meal}</td>
              <td className="py-2 px-3 border-b">{record.excretion}</td>
              <td className="py-2 px-3 border-b">{record.bath}</td>
              <td className="py-2 px-3 border-b">{record.temperature}</td>
              <td className="py-2 px-3 border-b">{record.diastolic_bp}</td>
              <td className="py-2 px-3 border-b">{record.systolic_bp}</td>
              <td className="py-2 px-3 border-b">{record.comments}</td>
              {/* スタッフの名前を表示 */}
              <td className="py-2 px-3 border-b">
                {staffDetails[record.staff]?.staff_name || "不明"}
              </td>
              {/* 編集と削除のボタン */}
              <td className="py-2 px-3 border-b">
                <button
                  onClick={() => openModal(record)}
                  className="bg-accent2 text-white px-3 py-1 rounded mr-2"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="bg-accent text-white px-3 py-1 rounded"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* モーダルウィンドウ */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {userDetail && (
          <CareRegisterForm
            user={userDetail}
            onClose={closeModal}
            record={selectedRecord}
          />
        )}
      </Modal>
    </div>
  );
};

export default CareRecordsPage;
