"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  is_confirmed: boolean; // 連絡事項が確認済みかどうか
};

const ContactNotesPage = () => {
  const userUuid = "8bc5f8c4-b529-47eb-bf7e-c2f3584cc035"; // ベタ打ちのユーザーUUID
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]); // 連絡事項データ
  const [currentPage, setCurrentPage] = useState<number>(1); // 現在のページ
  const itemsPerPage = 6; // 1ページあたりのアイテム数

  useEffect(() => {
    fetchContactNotes(userUuid);
  }, [userUuid]);

  // APIから連絡事項を取得する関数
  const fetchContactNotes = async (userUuid: string) => {
    try {
      const response = await axios.get<ContactNote[]>(
        `http://localhost:8000/api/contact-notes/${userUuid}/`
      );

      // 日付でソートして設定
      const sortedNotes = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setContactNotes(sortedNotes);
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました", error);
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
  const currentItems = contactNotes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(contactNotes.length / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="md:p-6 p-4 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      <h2 className="text-xl md:text-2xl mb-4">連絡事項一覧</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th
                className="text-sm md:text-base py-2 px-3 border-b"
                style={{ whiteSpace: "nowrap" }} // テキストが縦書きにならないように
              >
                日付
              </th>
              <th
                className="text-sm md:text-base py-2 px-3 border-b"
                style={{ whiteSpace: "nowrap" }} // テキストが縦書きにならないように
              >
                連絡内容
              </th>
              <th
                className="text-sm md:text-base py-2 px-3 border-b"
                style={{ whiteSpace: "nowrap" }} // テキストが縦書きにならないように
              >
                確認
              </th>{" "}
              {/* 確認欄を追加 */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((note) => (
              <tr key={note.id}>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  {formatDate(note.date)} {/* 日付をMM/DD形式で表示 */}
                </td>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  <Link href={`/user/contact-notes/${note.id}`}>
                    <div className="text-blue-600 line-clamp-2">
                      {note.detail}
                    </div>
                  </Link>
                </td>
                <td className="py-2 px-3 border-b md:text-base text-sm">
                  {note.is_confirmed ? "済" : "未"}{" "}
                  {/* 確認済みかどうかを表示 */}
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

export default ContactNotesPage;
