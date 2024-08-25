"use client";

import React from "react";
import { useRouter } from "next/navigation";

const WebPageHeader: React.FC = () => {
  const router = useRouter();

  return (
    <header className="bg-header text-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        {/* ロゴ画像 */}
        <img
          src="/images/logo_transparent.png"
          alt="CareBridge"
          className="h-10"
        />
      </div>
    </header>
  );
};

export default WebPageHeader;
