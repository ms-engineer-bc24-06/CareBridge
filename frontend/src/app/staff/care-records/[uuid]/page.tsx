"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Modal from "../../../../components/modalCareRegister";
import CareRegisterForm from "../../../../components/careRegisterForm";

type CareRecord = {
  care_record_id: number;
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  comments: string;
  staff: number;
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

const CareRecordsPage = () => {
  const { uuid } = useParams(); // URLパラメータからUUIDを取得
  const userUuid = Array.isArray(uuid) ? uuid[0] : uuid; // UUIDが配列の場合の対応
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]); // ケア記録データの状態変数
  const [filteredCareRecords, setFilteredCareRecords] = useState<CareRecord[]>(
    []
  ); // フィルタされたケア記録データの状態変数
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // ユーザー詳細データの状態変数
  const [loading, setLoading] = useState(true); // ローディング状態を管理する状態変数
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダルの開閉状態を管理する状態変数
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // 選択された年
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // 選択された月

  // コンポーネントがマウントされたときにケア記録とユーザー詳細を取得
  useEffect(() => {
    if (userUuid) {
      fetchCareRecords(userUuid);
      fetchUserDetail(userUuid);
    }
  }, [userUuid]);

  // 年と月が選択されたときにケア記録をフィルタ
  useEffect(() => {
    filterCareRecords();
  }, [selectedYear, selectedMonth, careRecords]);

  // ケア記録をAPIから取得する関数
  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );

      // 日付でソート（新しい順）
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setCareRecords(sortedRecords);
      setLoading(false);
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  // ユーザー詳細をAPIから取得する関数
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await axios.get<UserDetail>(
        `http://localhost:8000/api/users/${userUuid}/`
      );
      setUserDetail(response.data);
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // 選択された年と月でケア記録をフィルタする関数
  const filterCareRecords = () => {
    const filtered = careRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === selectedYear &&
        recordDate.getMonth() + 1 === selectedMonth
      );
    });
    setFilteredCareRecords(filtered);
  };

  // モーダルを開く関数
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  // 年の選択肢を生成
  const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  // 月の選択肢を生成
  const months = Array.from({ length: 12 }, (v, k) => k + 1);

  return (
    <div className="p-6 min-h-screen">
      <Link href="/staff/users">
        <button className="text-blue-800 mb-4">←利用者一覧に戻る</button>
      </Link>
      <div className="flex justify-between items-center mb-6">
        {userDetail && (
          <div className="flex items-center">
            <div className="mr-4">
              <h2 className="text-xl font-bold">{userDetail.user_id}</h2>
              <h2 className="text-xl font-bold">{userDetail.user_name}</h2>
              <p>{userDetail.user_name_kana}</p>
            </div>
            <div className="flex items-center">
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
        <button
          onClick={openModal}
          className="bg-secondary text-white px-4 py-2 rounded"
        >
          ケア登録
        </button>
      </div>
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
            <th className="py-2 px-3 border-b">スタッフID</th>
          </tr>
        </thead>
        <tbody>
          {filteredCareRecords.map((record) => (
            <tr key={record.care_record_id}>
              <td className="py-2 px-3 border-b">{record.date}</td>
              <td className="py-2 px-3 border-b">{record.meal}</td>
              <td className="py-2 px-3 border-b">{record.excretion}</td>
              <td className="py-2 px-3 border-b">{record.bath}</td>
              <td className="py-2 px-3 border-b">{record.temperature}</td>
              <td className="py-2 px-3 border-b">{record.diastolic_bp}</td>
              <td className="py-2 px-3 border-b">{record.systolic_bp}</td>
              <td className="py-2 px-3 border-b">{record.comments}</td>
              <td className="py-2 px-3 border-b">{record.staff}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {userDetail && (
          <CareRegisterForm user={userDetail} onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default CareRecordsPage;
