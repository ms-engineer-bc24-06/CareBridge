import React from "react";
import Link from "next/link";

const MenuBar = () => {
  return (
    <nav className="bg-white text-menuBarText text-base p-3 flex items-center justify-between shadow relative">
      <div className="flex items-center">
        <Link
          href="/staff/users"
          className="group ml-4 flex items-center relative"
        >
          <img src="/images/users_icon.png" alt="users" className="mr-1 w-5" />
          利用者一覧
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        <Link
          href="/staff/dashboard"
          className="group ml-4 flex items-center relative"
        >
          <img
            src="/images/dashboard_icon.png"
            alt="Dashboard"
            className="mr-1 w-5"
          />
          ダッシュボード
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        <Link
          href="/staff/care-records"
          className="group ml-4 flex items-center relative"
        >
          <img
            src="/images/careRecords_icon.png"
            alt="CareRecords"
            className="mr-1 w-5"
          />
          ケア記録一覧
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
      </div>
    </nav>
  );
};

export default MenuBar;
