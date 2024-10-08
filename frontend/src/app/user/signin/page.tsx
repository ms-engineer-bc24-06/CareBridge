"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // ユーザーのメールアドレスを保持
  const [password, setPassword] = useState<string>(""); // ユーザーのパスワードを保持
  const [error, setError] = useState<string>("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ); // Firebaseでのサインイン
      const user = userCredential.user;

      // カスタムクレームを取得
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      // 役割に応じてリダイレクト
      if (role === "family") {
        router.push("/user/top"); // 介護家族用トップページにリダイレクト
      } else {
        setError(
          "ログインできませんでした。メールアドレスとパスワードを確認してください。"
        );
      }
    } catch (error) {
      console.error("ログインエラー");
      setError(
        "ログインできませんでした。メールアドレスとパスワードを確認してください。"
      );
    }
  };

  return (
    <div className="flex flex-col items-center md:justify-center h-screen bg-cover bg-center p-4">
      <h1 className="text-xl md:text-4xl md:mb-12 mb-8">
        ご家族ログインページ
      </h1>
      <form
        onSubmit={handleSignIn}
        className="w-10/12 max-w-sm md:max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg"
      >
        <div className="mb-3 md:mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-base md:text-xl mb-2"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-3 md:p-4 rounded-lg text-sm md:text-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="例: example@example.com"
          />
          <small className="text-gray-500">
            メールアドレスを入力してください
          </small>
        </div>
        <div className="mb-3 md:mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-base md:text-xl mb-2"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 p-3 md:p-4 rounded-lg text-sm md:text-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="パスワードを入力してください"
          />
          <small className="text-gray-500">パスワードを入力してください</small>
        </div>
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-3 md:px-8 md:py-4 text-base md:text-xl text-white bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          ログイン
        </button>
      </form>
      <div className="mt-6 text-sm md:text-xl">
        <Link href="/reset-password" className="text-blue-500 hover:underline">
          パスワードをお忘れの方はこちら
        </Link>
      </div>
      <div className="mt-2 md:mt-4 text-sm md:text-xl">
        <Link
          href="/user/userPrivasyPolicy"
          className="text-blue-500 hover:underline"
        >
          carebridge プライバシーポリシー
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
