"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { getAuth } from "firebase/auth"; // Firebase Auth をインポート

type User = {
  uuid: string;
  user_id: string;
  user_name: string;
  user_name_kana: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

const Users: React.FC = () => {
  // 検索条件、ユーザーリスト、フィルタリングされたユーザーリストの状態を管理
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // FirebaseからのUIDを保持する状態を追加
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // コンポーネントがマウントされたときにFirebase UIDを取得
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setFirebaseUid(user.uid);
    }
  }, []);

  // Firebase UIDが取得できたらユーザー情報を取得
  useEffect(() => {
    if (firebaseUid) {
      fetchUsers(firebaseUid);
    }
  }, [firebaseUid]);

  // 検索条件が変更されたときにユーザーリストをフィルタリング
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

  // ユーザー情報をAPIから取得する関数
  const fetchUsers = async (firebaseUid: string) => {
    try {
      const response = await axios.get<User[]>(
        `http://localhost:8000/api/users/?firebase_uid=${firebaseUid}`
      );
      setUsers(response.data);
      setFilteredUsers(response.data); // 初期状態で全てのユーザーを表示
    } catch (error) {
      console.error("ユーザー情報の取得中にエラーが発生しました");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">利用者一覧</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          {/* ユーザー名で検索するための入力フィールド */}
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
      {/* フィルタリングされたユーザーを表示するテーブル */}
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">利用者ID</th>
            <th className="py-2 px-3 border-b">利用者名</th>
            <th className="py-2 px-3 border-b">性別</th>
            <th className="py-2 px-3 border-b">生年月日</th>
            <th className="py-2 px-3 border-b">緊急連絡先名</th>
            <th className="py-2 px-3 border-b">緊急連絡先TEL</th>
            <th className="py-2 px-3 border-b">アクション</th>
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
              <td className="py-2 px-3 border-b flex space-x-2">
                {/* ケア記録ボタン */}
                <Link href={`/staff/care-records/${user.uuid}`}>
                  <button className="bg-accent2 text-white px-4 py-2 rounded">
                    ケア記録
                  </button>
                </Link>
                {/* ダッシュボードボタン */}
                <Link href={`/staff/dashboard?user=${user.uuid}`}>
                  <button className="bg-accent2 text-white px-4 py-2 rounded">
                    ボード
                  </button>
                </Link>
                {/* 連絡ノートボタン */}
                <Link href={`/staff/contact-notes/${user.uuid}`}>
                  <button className="bg-accent2 text-white px-4 py-2 rounded">
                    連絡ノート
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
