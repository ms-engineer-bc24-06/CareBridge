"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import DashboardChart from "../../../components/dashboardChart";
import UserInfo from "../../../components/userInfo";
import { useSearchParams } from "next/navigation";

const Dashboard = () => {
  const [selectedUserUuid, setSelectedUserUuid] = useState<string | null>(null);
  const searchParams = useSearchParams(); // クエリパラメータを取得

  // 初期表示時にクエリパラメータからユーザーUUIDを取得してセット
  useEffect(() => {
    const userUuid = searchParams.get("user");
    if (userUuid) {
      setSelectedUserUuid(userUuid);
    }
  }, [searchParams]);

  // ユーザーを選択したときの処理
  const handleSelectUser = (userUuid: string) => {
    setSelectedUserUuid(userUuid);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebarに選択されたユーザーのUUIDを渡す */}
      <Sidebar
        onSelectUser={handleSelectUser}
        selectedUserUuid={selectedUserUuid}
      />
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedUserUuid ? (
          <>
            <UserInfo userUuid={selectedUserUuid} />
            <DashboardChart userUuid={selectedUserUuid} />
          </>
        ) : (
          <p>利用者を選択してください</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
