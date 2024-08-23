"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 処方箋データの型定義
type Prescription = {
  id: number;
  date: string;
  medication_name: string;
};

// ページコンポーネント
const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]); // 処方箋データ
  const [currentPage, setCurrentPage] = useState<number>(1); // 現在のページ
  const [userUuid, setUserUuid] = useState<string | null>(null); // UUIDを保存する状態変数
  const itemsPerPage = 6; // 1ページあたりのアイテム数

  // FirebaseからユーザーのUIDを取得し、それに基づいてUUIDを取得
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await axios.get<{ uuid: string }>(
            `http://localhost:8000/api/users/firebase/${user.uid}/`
          );
          setUserUuid(response.data.uuid); // UUIDを状態に保存
        } catch (error) {
          console.error("UUIDの取得中にエラーが発生しました");
        }
      }
    });
  }, []);

  // UUIDが取得できたら処方箋データを取得
  useEffect(() => {
    if (userUuid) {
      fetchPrescriptions(userUuid);
    }
  }, [userUuid]);

  // APIから処方箋データを取得する関数
  const fetchPrescriptions = async (userUuid: string) => {
    try {
      const response = await axios.get<Prescription[]>(
        `http://localhost:8000/api/prescriptions/${userUuid}/`
      );

      // 日付でソートして設定
      const sortedPrescriptions = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPrescriptions(sortedPrescriptions);
    } catch (error) {
      console.error("処方箋の取得中にエラーが発生しました");
    }
  };

  // 日付を MM/DD 形式でフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  // ページネーションの計算
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prescriptions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="md:p-6 p-4 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      <h2 className="text-xl md:text-2xl mb-4">処方薬一覧</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-sm md:text-base py-2 px-3 border-b">日付</th>
              <th className="text-sm md:text-base py-2 px-3 border-b">薬名</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((prescription) => (
              <tr key={prescription.id}>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  {formatDate(prescription.date)} {/* 日付をMM/DD形式で表示 */}
                </td>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  <Link href={`/user/prescriptions/${prescription.id}`}>
                    <div className="text-blue-600 line-clamp-2">
                      {prescription.medication_name}
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ページネーション */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handleClick(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  page === currentPage ? "bg-accent2 text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
