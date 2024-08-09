import React from "react";
import Link from "next/link";

const AdminMenuBar = () => {
  return (
    <nav className="bg-white text-menuBarText text-base p-3 flex items-center justify-between shadow relative">
      <div className="flex items-center">
        <Link
          href="/admin/users"
          className="group ml-4 flex items-center relative"
        >
          <img
            src="/images/admin_user_icon.png"
            alt="admin"
            className="mr-1 w-5"
          />
          利用者管理
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        <Link
          href="/admin/staffs"
          className="group ml-4 flex items-center relative"
        >
          <img
            src="/images/admin_staff_icon.png"
            alt="admin"
            className="mr-1 w-5"
          />
          職員管理
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        <Link
          href="/admin/facilities"
          className="group ml-4 flex items-center relative"
        >
          <img
            src="/images/admin_facilities_icon.png"
            alt="admin"
            className="mr-1 w-5"
          />
          施設情報
          <span className="absolute left-0 bottom-[-13px] w-full h-0.5 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        
      </div>
    </nav>
  );
};

export default AdminMenuBar;


