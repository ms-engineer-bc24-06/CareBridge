"use client";
import React from 'react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
      <div className="w-64 bg-gray-800 text-white flex flex-col bg-opacity-90">
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          管理メニュー
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-4">
              <Link href="/admin/facilities">
                <span className="hover:text-gray-300">施設情報</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/staff">
                <span className="hover:text-gray-300">職員管理</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/users">
                <span className="hover:text-gray-300">利用者管理</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/payments">
                <span className="hover:text-gray-300">決済管理</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-6 bg-white bg-opacity-90">
        <h1 className="text-3xl font-bold mb-4">管理者ダッシュボード</h1>
        <p>管理者ダッシュボードへようこそ。サイドバーを使用して管理セクションにナビゲートしてください。</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
