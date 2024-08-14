"use client";

import React from "react";
import MobileHeader from "../../components/mobileHeader"; // MobileHeaderのインポート

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <MobileHeader />

      {/* 各ページのコンテンツを表示する部分 */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default UsersLayout;
