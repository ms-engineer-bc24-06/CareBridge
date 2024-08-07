"use client";

import React from "react";
import Header from "../../components/header";
import MenuBar from "../../components/menuBar";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <MenuBar />
      <div className="flex flex-1">
        <div className="p-4 w-full">{children}</div>
      </div>
    </div>
  );
};

export default StaffLayout;
