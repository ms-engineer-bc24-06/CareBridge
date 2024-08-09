"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../../components/header";
import AdminMenuBar from "../../components/adminMenuBar";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // 現在のパスが /staff/signin で始まる場合は MenuBar を非表示にする
  const showMenuBar = !pathname.startsWith("/admin/signin");

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      {showMenuBar && <AdminMenuBar />}
      <div className="flex flex-1">
        <div className="p-4 w-full">{children}</div>
      </div>
    </div>
  );
};

export default StaffLayout;
