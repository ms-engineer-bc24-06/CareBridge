"use client";

import React from "react";
import SignInPage from "./staff/signin/page"; // `SignInPage` をインポート

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      {/* `SignInPage` コンポーネントを表示 */}
      <SignInPage />
    </main>
  );
};

export default Home;