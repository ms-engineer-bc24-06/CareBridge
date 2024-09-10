"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

type UserDetail = {
  uuid: string;
  user_id: string;
  user_name: string;
  user_name_kana: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  allergies: string | null;
  medications: string | null;
  medical_history: string | null;
};

const UserDetailPage = () => {
  const params = useParams();
  const { uuid } = params; // URLパラメータからUUIDを取得
  const [user, setUser] = useState<UserDetail | null>(null); // ユーザー詳細データの状態変数
  const [loading, setLoading] = useState(true); // ローディング状態を管理する状態変数

  // コンポーネントがマウントされたときにユーザー詳細を取得
  useEffect(() => {
    if (uuid) {
      fetchUserDetail(uuid as string);
    }
  }, [uuid]);

  // ユーザー詳細データをAPIから取得する関数
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await apiClient.get<UserDetail>(
        `/api/users/${userUuid}/`
      );
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  // ユーザーが見つからなかった場合の表示
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      {/* 戻るボタン */}
      <button
        onClick={() => window.history.back()}
        className="text-blue-800 mb-4"
      >
        ←利用者一覧に戻る
      </button>
      <div className="flex items-center mb-6">
        <div>
          {/* ユーザーID、名前、かなの表示 */}
          <h1 className="text-2xl font-bold">{user.user_id}</h1>
          <h1 className="text-xl font-bold">{user.user_name}</h1>
          <p>{user.user_name_kana}</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">詳細情報</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* ユーザーの詳細情報を表示 */}
          <div className="mb-2">
            <p className="text-gray-600">氏名（カナ）</p>
            <p className="text-lg">{user.user_name_kana}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">戸籍上の性別</p>
            <p className="text-lg">{user.user_sex}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">生年月日</p>
            <p className="text-lg">{user.user_birthday}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">緊急連絡先電話番号</p>
            <p className="text-lg">{user.emergency_contact_phone}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">緊急連絡先名</p>
            <p className="text-lg">{user.emergency_contact_name}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">緊急連絡先との関係</p>
            <p className="text-lg">{user.emergency_contact_relationship}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">アレルギー</p>
            <p className="text-lg">{user.allergies || "なし"}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">服用中の薬</p>
            <p className="text-lg">{user.medications || "なし"}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">既往症</p>
            <p className="text-lg">{user.medical_history || "なし"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
