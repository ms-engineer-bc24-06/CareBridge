"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  is_confirmed: boolean;
};

const UserTop = () => {
  const userUuid = "b61da427-3ad3-4c41-b268-00a2837cd4b9"; // ベタ打ちのユーザーUUID
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]);

  useEffect(() => {
    fetchContactNotes(userUuid);
  }, [userUuid]);

  const fetchContactNotes = async (userUuid: string) => {
    try {
      const response = await axios.get<ContactNote[]>(
        `http://localhost:8000/api/contact-notes/${userUuid}/`
      );

      // 日付でソートして最新4件を表示
      const sortedNotes = response.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

      setContactNotes(sortedNotes);
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました");
    }
  };

  return (
    <div className="md:p-6 p-4 min-h-screen">
      <section className="my-4">
        <h2 className="text-xl md:text-2xl mb-2">施設からの連絡</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b">日付</th>
                <th className="py-2 px-3 border-b">連絡内容</th>
              </tr>
            </thead>
            <tbody>
              {contactNotes.map((note) => (
                <tr key={note.id}>
                  <td className="py-2 px-3 border-b md:text-base text-sm">
                    {note.date}
                  </td>
                  <td className="py-2 px-3 border-b md:text-base text-sm">
                    <Link href={`/user/contact-notes/${note.id}`}>
                      <div className="line-clamp-2 text-blue-600 hover:underline">
                        {note.detail}
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/user/contact-notes">
            <button className="w-full bg-white text-text border border-gray-300 py-2 rounded shadow hover:shadow-md">
              連絡事項一覧を見る
            </button>
          </Link>
        </div>
      </section>
      <section className="flex justify-around mt-6">
        <Link href="/user/care-records">
          <div className="text-center flex flex-col items-center bg-white border border-gray-300 rounded-lg p-3 shadow hover:shadow-md md:w-[100px] md:h-[100px] w-[96px] h-[96px]">
            <img
              src="/images/careRecords_icon.png"
              alt="ケア記録"
              className="h-8 mb-1"
            />
            <span className="text-sm text-gray-700">
              ケア記録
              <br />
              一覧
            </span>
          </div>
        </Link>
        <Link href="/user/dashboard">
          <div className="text-center flex flex-col items-center bg-white border border-gray-300 rounded-lg p-3 shadow hover:shadow-md md:w-[100px] md:h-[100px] w-[96px] h-[96px]">
            <img
              src="/images/dashboard_icon.png"
              alt="ダッシュボード"
              className="h-8 mb-1"
            />
            <span className="text-sm text-gray-700">
              ダッシュ
              <br />
              ボード
            </span>
          </div>
        </Link>
        <Link href="/announcements/register">
          <div className="text-center flex flex-col items-center bg-white border border-gray-300 rounded-lg p-3 shadow hover:shadow-md md:w-[100px] md:h-[100px] w-[96px] h-[96px]">
            <img
              src="/images/contactNotes_icon.png"
              alt="お知らせ登録"
              className="h-8 mb-1"
            />
            <span className="text-sm text-gray-700">
              医療情報
              <br />
              登録
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default UserTop;
