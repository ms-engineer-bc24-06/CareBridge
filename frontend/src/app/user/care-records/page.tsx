"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type CareRecord = {
  care_record_id: number;
  date: string;
  comments: string;
};

const CareRecordsPage = () => {
  const userUuid = "b61da427-3ad3-4c41-b268-00a2837cd4b9"; // ベタ打ちのユーザーUUID
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]); // ケア記録データの状態変数
  const [filteredCareRecords, setFilteredCareRecords] = useState<CareRecord[]>(
    []
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // 選択された年
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // 選択された月

  useEffect(() => {
    fetchCareRecords(userUuid);
  }, [userUuid]);

  useEffect(() => {
    filterCareRecords();
  }, [selectedYear, selectedMonth, careRecords]);

  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );

      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setCareRecords(sortedRecords);
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  const months = Array.from({ length: 12 }, (v, k) => k + 1);

  return (
    <div className="p-6 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">←戻る</button>
      </Link>
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
    </div>
  );
};

export default CareRecordsPage;
