"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  staff: number;
};

const CareRecordsPage = () => {
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [filteredCareRecords, setFilteredCareRecords] = useState<CareRecord[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const itemsPerPage = 6;

  // Firebase から UID を取得し、その UID に基づいた UUID を取得する
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await axios.get<{ uuid: string }>(
            `http://localhost:8000/api/users/firebase/${user.uid}/`
          );
          setUserUuid(response.data.uuid);
        } catch (error) {
          console.error("UUID の取得中にエラーが発生しました");
        }
      }
    });
  }, []);

  // UUID が取得できたらケア記録を取得
  useEffect(() => {
    if (userUuid) {
      fetchCareRecords(userUuid);
    }
  }, [userUuid]);

  // API からケア記録を取得する関数
  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );

      // 日付でソートして設定
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCareRecords(sortedRecords);
      filterCareRecords(sortedRecords, selectedYear, selectedMonth); // 初期フィルタリング
    } catch (error) {
      console.error("ケア記録の取得中にエラーが発生しました");
    }
  };

  // ケア記録を選択された年と月でフィルタリングする関数
  const filterCareRecords = (
    records: CareRecord[],
    year: number,
    month: number
  ) => {
    const filtered = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month
      );
    });
    setFilteredCareRecords(filtered);
    setCurrentPage(1); // ページ番号をリセット
  };

  // 年または月が選択されたとき、ケア記録をフィルタリング
  useEffect(() => {
    filterCareRecords(careRecords, selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, careRecords]);

  // 日付を MM/DD 形式でフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  // ページネーションの計算
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCareRecords.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredCareRecords.length / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 過去5年間の年のリストを生成
  const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  // 1月から12月までの月のリストを生成
  const months = Array.from({ length: 12 }, (v, k) => k + 1);

  return (
    <div className="md:p-6 p-4 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      <h2 className="text-xl md:text-2xl mb-4">ケア記録一覧</h2>

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

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-sm md:text-base py-2 px-3 border-b">日付</th>
              <th className="text-sm md:text-base py-2 px-3 border-b">
                コメント
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((record) => (
              <tr key={record.id}>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  {formatDate(record.date)} {/* 日付をMM/DD形式で表示 */}
                </td>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  <Link href={`/user/care-records/${record.id}`}>
                    <div className="text-blue-600 line-clamp-2">
                      {record.comments}
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ページネーション */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handleClick(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  page === currentPage ? "bg-accent2 text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CareRecordsPage;
