"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebaseConfig";

const Dashboard: React.FC = () => {
  const router = useRouter();
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
            <li><a href="/staff/top">職員ページ</a></li>
            {/* 他の管理者専用メニュー */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
