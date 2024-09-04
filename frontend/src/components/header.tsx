"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  // スタッフ名を保持する状態変数
  const [staffName, setStaffName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // 現在のパスを取得

  useEffect(() => {
    const auth = getAuth();

    // Firebase認証状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Firebase UIDに基づいてスタッフ情報を取得
        axios
          .get(`http://localhost:8000/api/staffs/firebase/${user.uid}/`)
          .then((response) => {
            setStaffName(response.data.staff_name);
          })
          .catch((error) => {
            console.error("スタッフ情報の取得中にエラーが発生しました:");
          });
      } else {
        console.error("ユーザーが認証されていません");
      }
    });

    // クリーンアップのために購読を解除
    return () => unsubscribe();
  }, []);

  // Firebaseでのログアウト処理を実行する関数
  const handleLogout = async () => {
    const auth = getAuth(); // Firebase認証のインスタンスを取得
    try {
      await signOut(auth); // Firebaseからのログアウト
      // ログアウト後、サインインページにリダイレクト
      router.push("/staff/signin");
    } catch (error) {
      console.error("ログアウトに失敗しました:");
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
      <div className="flex items-center space-x-4">
        {/* ユーザーアイコンとスタッフ名 */}
        {pathname !== "/staff/signin" && staffName && (
          <div className="flex items-center space-x-2 text-text">
            <img
              src="/images/account_icon.png"
              alt="Account"
              className="h-6 w-6"
            />
            <span>{staffName}</span>
          </div>
        )}
        {/* ログアウトアイコンとボタン */}
        {pathname !== "/staff/signin" &&
          pathname !== "/webHomePage/details" && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-text"
            >
              <img
                src="/images/logout_icon.png"
                alt="Logout"
                className="h-6 w-6"
              />
              <span>ログアウト</span>
            </button>
          )}
      </div>
    </header>
  );
};

export default Header;
