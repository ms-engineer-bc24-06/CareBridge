"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import DashboardChart from "../../../components/dashboardChart";
import UserInfo from "../../../components/userInfo";
import { useSearchParams } from "next/navigation";
import { getAuth } from "firebase/auth";

const Dashboard = () => {
  const [selectedUserUuid, setSelectedUserUuid] = useState<string | null>(null);
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // 初期表示時にFirebase UIDを取得
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setFirebaseUid(user.uid);
    }
  }, []);

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
      {/* SidebarにFirebase UIDと選択されたユーザーのUUIDを渡す */}
      <Sidebar
        onSelectUser={handleSelectUser}
        selectedUserUuid={selectedUserUuid}
        firebaseUid={firebaseUid} // 追加
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
