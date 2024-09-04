"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 現在のパスを取得するためのフック
import { signOut } from "firebase/auth"; // Firebaseのサインアウト機能をインポート
import { auth } from "../lib/firebaseConfig"; // 初期化されたauthをインポート

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // 現在のパスを取得
  const router = useRouter(); // ルーターを取得

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Firebaseでのログアウト処理
  const handleLogout = async () => {
    try {
      // Firebaseからのログアウト
      await signOut(auth);

      // ログアウト後、サインインページにリダイレクト
      router.push("/user/signin");
    } catch (error) {
      console.error("ログアウトに失敗しました");
    }
  };

  return (
    <header className="bg-header text-white p-3 flex justify-between items-center">
      <div className="flex items-center">
        {/* ロゴを表示 */}
        <Image
          src="/images/logo_transparent.png"
          alt="Care Bridge"
          width={150}
          height={50}
          className="h-10"
        />
      </div>
      <div className="relative">
        {/* user/signinページ以外でメニューアイコンを表示 */}
        {pathname !== "/user/signin" && (
          <>
            <button onClick={toggleMenu}>
              <Image
                src="/images/menu_icon.png"
                alt="メニュー"
                width={30}
                height={30}
                className="h-8"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                <ul className="flex flex-col">
                  <li className="p-2 border-b hover:bg-gray-100">
                    <Link href="/account-settings">アカウント設定</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-100">
                    <button onClick={handleLogout}>ログアウト</button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
