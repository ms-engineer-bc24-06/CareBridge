"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// ユーザーとケア記録の型定義
type User = {
  uuid: string;
  user_id: string;
  user_name: string;
};

type CareRecord = {
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  staff: number;
};

const CareRecordsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // デフォルトは現在の月
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // デフォルトは選択なし
  const [users, setUsers] = useState<User[]>([]);
  const [careRecords, setCareRecords] = useState<{
    [key: string]: CareRecord[];
  }>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers(); // コンポーネントマウント時にユーザー情報を取得
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:8000/api/users/"
      );
      const usersData = response.data;
      setUsers(usersData);
      setFilteredUsers(usersData);

      // ユーザーごとのケア記録を取得
      usersData.forEach((user) => {
        fetchCareRecords(user.uuid);
      });
    } catch (error) {
      console.error("ユーザー情報の取得中にエラーが発生しました");
    }
  };

  // ユーザーUUIDに基づいてケア記録をAPIから取得
  const fetchCareRecords = async (userUuid: string) => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() // 日付の新しい順にソート
      );
      setCareRecords((prevState) => ({
        ...prevState,
        [userUuid]: sortedRecords,
      }));
    } catch (error) {
      console.error("ケア記録の取得中にエラーが発生しました");
    }
  };

  // 検索条件に基づいてユーザーをフィルタリング
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  // 月と日付でフィルタリング
  const filterRecordsByDate = (records: CareRecord[]) => {
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      const isSameMonth = recordDate.getMonth() + 1 === selectedMonth;
      const isSameDay = selectedDay
        ? recordDate.getDate() === selectedDay
        : true;
      return isSameMonth && isSameDay;
    });
  };

  // 月のオプション生成
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 選択された月の全日付オプションを生成
  const days = Array.from(
    { length: new Date(new Date().getFullYear(), selectedMonth, 0).getDate() },
    (_, i) => i + 1
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ケア記録一覧</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          {/* ユーザー名で検索 */}
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            クリア
          </button>
        </div>
        {/* 月選択ドロップダウン */}
        <div className="flex space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border p-2 rounded"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}月
              </option>
            ))}
          </select>
          {/* 日付選択ドロップダウン */}
          <select
            value={selectedDay || ""}
            onChange={(e) =>
              setSelectedDay(e.target.value ? parseInt(e.target.value) : null)
            }
            className="border p-2 rounded"
          >
            <option value="">全日</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}日
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">日付</th>{" "}
            {/* 日付を一番左に配置 */}
            <th className="py-2 px-3 border-b">利用者ID</th>
            <th className="py-2 px-3 border-b">利用者名</th>
            <th className="py-2 px-3 border-b">食事</th>
            <th className="py-2 px-3 border-b">排泄</th>
            <th className="py-2 px-3 border-b">入浴</th>
            <th className="py-2 px-3 border-b">体温</th>
            <th className="py-2 px-3 border-b">血圧（最高）</th>
            <th className="py-2 px-3 border-b">血圧（最低）</th>
            <th className="py-2 px-3 border-b">スタッフID</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) =>
            filterRecordsByDate(careRecords[user.uuid] || []).map((record) => (
              <tr key={`${user.uuid}-${record.date}`}>
                <td className="py-2 px-3 border-b">{record.date}</td>{" "}
                {/* 日付の列 */}
                <td className="py-2 px-3 border-b">{user.user_id}</td>
                <td className="py-2 px-3 border-b">{user.user_name}</td>
                <td className="py-2 px-3 border-b">{record.meal}</td>
                <td className="py-2 px-3 border-b">{record.excretion}</td>
                <td className="py-2 px-3 border-b">{record.bath}</td>
                <td className="py-2 px-3 border-b">{record.temperature}</td>
                <td className="py-2 px-3 border-b">{record.systolic_bp}</td>
                <td className="py-2 px-3 border-b">{record.diastolic_bp}</td>
                <td className="py-2 px-3 border-b">{record.staff}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CareRecordsListPage;
