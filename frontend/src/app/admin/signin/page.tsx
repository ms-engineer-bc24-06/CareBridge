"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // メールアドレス
  const [facilityId, setFacilityId] = useState<string>(""); // 施設IDをパスワードとして使用
  const [error, setError] = useState<string>("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log("Attempting sign in with email:", email);
      await signInWithEmailAndPassword(auth, email, facilityId); // 施設IDをパスワードとして使用
      console.log("Sign in successful, redirecting to /admin/dashboard");
      router.push("/admin/dashboard"); 
    } catch (error) {
      setError("ログインできませんでした。メールアドレスと施設IDを確認してください。");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center p-4"
    >
      <h1 className="text-4xl mb-12">ログイン</h1>
      <form onSubmit={handleSignIn} className="w-96 bg-white p-8 rounded-lg shadow-lg"> {/* w-96でフォームの幅を広げる */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-xl mb-2">メールアドレス</label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-4 rounded-lg text-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="例: example@example.com"
          />
          <small className="text-gray-500">登録したメールアドレスを入力してください</small>
        </div>
        <div className="mb-6">
          <label htmlFor="facilityId" className="block text-gray-700 text-xl mb-2">施設ID</label>
          <input
            type="text"
            id="facilityId"
            className="w-full border border-gray-300 p-4 rounded-lg text-xl"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            required
            placeholder="例: 123456"
          />
          <small className="text-gray-500">施設IDをパスワードとして使用してください</small>
        </div>
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <button type="submit" className="w-full px-8 py-4 text-xl text-white bg-blue-500 rounded-xl hover:bg-blue-600">ログイン</button>
      </form>
      <div className="mt-6">
        <Link href="/reset-password" className="text-blue-500 hover:underline">
          パスワードをお忘れの方はこちら
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/privacy-policy" className="text-blue-500 hover:underline">
          carebridge プライバシーポリシー
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;


