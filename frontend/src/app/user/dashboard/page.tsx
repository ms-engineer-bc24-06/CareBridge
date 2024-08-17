"use client";

import React from "react";
import DashboardChart from "../../../components/dashboardChart";
import UserInfo from "../../../components/userInfo";
import Link from "next/link";

const UserDashboard = () => {
  // ベタ打ちのUUIDを使用
  const userUuid = "8bc5f8c4-b529-47eb-bf7e-c2f3584cc035";

  return (
    <div className="p-6 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">←TOPに戻る</button>
      </Link>
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        ユーザーダッシュボード
      </h1>

      {/* ユーザー情報の表示 */}
      <UserInfo userUuid={userUuid} />

      {/* ダッシュボードチャートの表示 */}
      <DashboardChart userUuid={userUuid} />
    </div>
  );
};

export default UserDashboard;
