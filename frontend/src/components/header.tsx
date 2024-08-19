"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // 現在のパスを取得

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/");
      // ログアウト後、サインインページにリダイレクト
      router.push("/staff/signin");
    } catch (error) {
      console.error("ログアウトに失敗しました");
    }
  };

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
      {/* サインインページとDetailsページ以外でログアウトボタンを表示 */}
      {pathname !== "/staff/signin" && pathname !== "/webHomePage/details" && (
        <button onClick={handleLogout} className="text-text">
          ログアウト
        </button>
      )}
    </header>
  );
};

export default Header;
