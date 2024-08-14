"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  // メニューの表示状態を管理するフック
  const [menuOpen, setMenuOpen] = useState(false);

  // メニューの表示/非表示をトグルする関数
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-header text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* ロゴを表示 */}
        <Image
          src="/images/logo_transparent.png"
          alt="Care Bridge"
          width={150} // ロゴの幅を指定
          height={50} // ロゴの高さを指定
          className="h-10"
        />
      </div>
      <div className="relative">
        {/* メニュー用の三本線アイコン */}
        <button onClick={toggleMenu}>
          <Image
            src="/images/menu_icon.png" // 三本線アイコンの画像パス
            alt="メニュー"
            width={30} // アイコンの幅を指定
            height={30} // アイコンの高さを指定
            className="h-8"
          />
        </button>

        {/* メニューの表示部分 */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
            <ul className="flex flex-col">
              <li className="p-2 border-b hover:bg-gray-100">
                <Link href="/account-settings">アカウント設定</Link>
              </li>
              <li className="p-2 hover:bg-gray-100">
                <Link href="/logout">ログアウト</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
