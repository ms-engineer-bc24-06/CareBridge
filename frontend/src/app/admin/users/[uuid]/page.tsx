"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

// ユーザー詳細データの型を定義
type UserDetail = {
  uuid: string; // ユーザーUUID
  user_id: string; // ユーザーID
  user_name: string; // ユーザー名
  user_name_kana: string; // ユーザー名（カナ）
  user_sex: string; // 性別
  user_birthday: string; // 生年月日
  emergency_contact_name: string; // 緊急連絡先名
  emergency_contact_phone: string; // 緊急連絡先電話番号
  emergency_contact_relationship: string; // 緊急連絡先との関係
  allergies?: string; // アレルギー情報（省略可能）
  medications?: string; // 服用中の薬（省略可能）
  medical_history?: string; // 既往症（省略可能）
};

const AdminUserDetailPage: React.FC = () => {
  const params = useParams(); // URLパラメータを取得
  const { uuid } = params; // URLのパラメータからuuidを取得
  const [user, setUser] = useState<UserDetail | null>(null); // ユーザー詳細情報を保持するstate
  const [loading, setLoading] = useState(true); // ローディング状態を管理するstate

  // APIからユーザー詳細情報を取得する関数
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await apiClient.get<UserDetail>(
        `/api/users/${userUuid}/`
      );
      setUser(response.data); // 取得したデータをstateに保存
      setLoading(false); // ローディング終了
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました", error);
      setLoading(false); // エラー発生時もローディング終了
    }
  };

  // コンポーネントの初回レンダリング時にユーザー詳細情報を取得
  useEffect(() => {
    if (uuid) {
      fetchUserDetail(uuid as string); // UUIDを使ってAPIリクエストを実行
    }
  }, [uuid]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (!user) {
    return <div>User not found</div>; // ユーザーが見つからない場合の表示
  }

  return (
    <div className="p-6 min-h-screen">
      <button
        onClick={() => window.history.back()}
        className="text-blue-800 mb-4"
      >
        利用者一覧に戻る
      </button>
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.user_id}</h1>
          <h1 className="text-xl font-bold">{user.user_name}</h1>
          <p>{user.user_name_kana}</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">詳細情報</h2>
        <div className="grid grid-cols-2 gap-4">
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

export default AdminUserDetailPage;
