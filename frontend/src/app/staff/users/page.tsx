"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

type User = {
  uuid: string;
  user_id: string;
  user_name: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:8000/api/users/"
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("ユーザー情報の取得中にエラーが発生しました", error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">利用者管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
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
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">利用者ID</th>
            <th className="py-2 px-3 border-b">利用者名</th>
            <th className="py-2 px-3 border-b">性別</th>
            <th className="py-2 px-3 border-b">生年月日</th>
            <th className="py-2 px-3 border-b">緊急連絡先名</th>
            <th className="py-2 px-3 border-b">緊急連絡先電話番号</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.uuid}>
              <td className="py-2 px-3 border-b">{user.user_id}</td>
              <td className="py-2 px-3 border-b text-blue-800 underline">
                <Link href={`/staff/users/${user.uuid}`}>{user.user_name}</Link>
              </td>
              <td className="py-2 px-3 border-b">{user.user_sex}</td>
              <td className="py-2 px-3 border-b">{user.user_birthday}</td>
              <td className="py-2 px-3 border-b">
                {user.emergency_contact_name}
              </td>
              <td className="py-2 px-3 border-b">
                {user.emergency_contact_phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
