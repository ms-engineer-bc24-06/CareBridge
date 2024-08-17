"use client";

import React, { useEffect, useState } from "react";
import DashboardChart from "../../../components/dashboardChart";
import UserInfo from "../../../components/userInfo";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const UserDashboard = () => {
  const [userUuid, setUserUuid] = useState<string | null>(null); // UUIDを保存する状態変数

  // Firebase から UID を取得し、その UID に基づいた UUID を取得する
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Firebase UIDを使ってUUIDを取得
          const response = await axios.get<{ uuid: string }>(
            `http://localhost:8000/api/users/firebase/${user.uid}/`
          );
          setUserUuid(response.data.uuid); // UUID を状態に保存
        } catch (error) {
          console.error("UUID の取得中にエラーが発生しました");
        }
      }
    });
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">←TOPに戻る</button>
      </Link>
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        ユーザーダッシュボード
      </h1>

      {/* UUIDが取得できている場合にのみコンポーネントを表示 */}
      {userUuid ? (
        <>
          {/* ユーザー情報の表示 */}
          <UserInfo userUuid={userUuid} />

          {/* ダッシュボードチャートの表示 */}
          <DashboardChart userUuid={userUuid} />
        </>
      ) : (
        <p>ロード中...</p>
      )}
    </div>
  );
};

export default UserDashboard;
