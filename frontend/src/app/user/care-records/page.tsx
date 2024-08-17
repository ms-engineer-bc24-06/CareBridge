"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";

type CareRecord = {
  care_record_id: number;
  date: string;
  comments: string;
};

const CareRecordsPage = () => {
  const [userUuid, setUserUuid] = useState<string | null>(null); // UUIDを保存する状態変数
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]); // 全てのケア記録データ
  const [filteredCareRecords, setFilteredCareRecords] = useState<CareRecord[]>(
    []
  ); // 選択された年・月に基づいてフィルタリングされたケア記録データ
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // 選択された年
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // 選択された月

  // FirebaseからUIDを取得し、それに基づいてUUIDを取得
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Firebase UIDを使ってUUIDを取得
          const response = await axios.get<{ uuid: string }>(
            `http://localhost:8000/api/users/firebase/${user.uid}/`
          );
          setUserUuid(response.data.uuid);
        } catch (error) {
          console.error("UUIDの取得中にエラーが発生しました");
        }
      }
    });
  }, []);

  // UUIDが取得できたらケア記録を取得
  useEffect(() => {
    if (userUuid) {
      fetchCareRecords(userUuid);
    }
  }, [userUuid]);

  // APIからケア記録を取得する関数
  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );

      // 日付でソート（新しい順）
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // ソートされたケア記録を状態にセット
      setCareRecords(sortedRecords);
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
    }
  };

  // ケア記録を選択された年と月でフィルタリングする関数
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

  // 年または月が選択されたとき、ケア記録をフィルタリング
  useEffect(() => {
    filterCareRecords();
  }, [selectedYear, selectedMonth, careRecords]);

  // 日付のフォーマットをMM/DD形式にする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  // 過去5年間の年のリストを生成
  const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  // 1月から12月までの月のリストを生成
  const months = Array.from({ length: 12 }, (v, k) => k + 1);

  return (
    <div className="p-6 min-h-screen">
      {/* 戻るボタン */}
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">←戻る</button>
      </Link>

      {/* 年と月の選択 */}
      <div className="flex justify-between items-center mb-6">
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

      {/* ケア記録のテーブル表示 */}
      {userUuid ? (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-3 border-b">日付</th>
              <th className="py-2 px-3 border-b">コメント</th>
            </tr>
          </thead>
          <tbody>
            {filteredCareRecords.map((record) => (
              <tr key={record.care_record_id}>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  {formatDate(record.date)}
                </td>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  <Link
                    href={`/user/care-records/${record.care_record_id}`}
                    className="text-blue-600 underline"
                  >
                    <div className="line-clamp-1">{record.comments}</div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ロード中...</p>
      )}
    </div>
  );
};

export default CareRecordsPage;
