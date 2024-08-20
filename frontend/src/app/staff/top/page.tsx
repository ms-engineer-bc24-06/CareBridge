"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebaseConfig";

const StaffTop = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims.role === 'admin');
      }
    };

    checkAdminRole();
  }, [user]);

  return (
    <div>
      {isAdmin && (
        <div>
          <ul>
            <li><a href="/admin/dashboard">管理ページ</a></li>
            {/* 他の管理者専用メニュー */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffTop;

