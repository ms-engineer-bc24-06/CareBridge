import React from "react";
import Link from "next/link";

const MenuBar = () => {
  return (
    <nav className="bg-white text-menuBarText text-sm p-2 flex items-center justify-between shadow">
      <div>
        <Link href="/staff/dashboard" className="ml-4">
          ダッシュボード
        </Link>
        <Link href="/staff/settings" className="ml-4">
          ケア記録登録
        </Link>
        <Link href="/staff/settings" className="ml-4">
          連絡事項登録
        </Link>
      </div>
    </nav>
  );
};

export default MenuBar;
