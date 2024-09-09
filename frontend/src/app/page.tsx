"use client";

import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Link legacyBehavior href="/staff/signin">
        <a className="text-blue-500 underline">介護職員ログイン</a>
      </Link>
      <Link legacyBehavior href="/user/signin">
        <a className="text-blue-500 underline">ご家族ログイン</a>
      </Link>
    </main>
  );
};

export default Home;




