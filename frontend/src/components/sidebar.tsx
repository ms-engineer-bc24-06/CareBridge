"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type SidebarProps = {
  onSelectUser: (userUuid: string) => void;
  selectedUserUuid: string | null; // 現在選択されているユーザーのUUID
  firebaseUid: string | null; // Firebase UID
};

type User = {
  uuid: string;
  user_name: string;
};

const Sidebar = ({
  onSelectUser,
  selectedUserUuid,
  firebaseUid,
}: SidebarProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (firebaseUid) {
      fetchUsers(firebaseUid);
    }
  }, [firebaseUid]);

  // ユーザー一覧を取得する非同期関数
  const fetchUsers = async (firebaseUid: string) => {
    try {
      const response = await axios.get<User[]>(
        `http://localhost:8000/api/users/?firebase_uid=${firebaseUid}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // 検索条件に基づいてユーザーリストをフィルタリング
  const filteredUsers = users.filter((user) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl mb-4">利用者一覧</h2>
      <input
        type="text"
        placeholder="名前で検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.uuid} className="mb-2">
            <button
              className={`w-full text-left p-2 rounded ${
                selectedUserUuid === user.uuid
                  ? "bg-gray-300"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => onSelectUser(user.uuid)}
            >
              {user.user_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
