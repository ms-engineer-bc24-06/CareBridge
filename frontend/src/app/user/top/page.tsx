"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth をインポート

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  is_confirmed: boolean; // 連絡事項が確認済みかどうか
};

const UserTop = () => {
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]); // 連絡事項の状態変数
  const [userUuid, setUserUuid] = useState<string | null>(null); // UUIDを保存する状態変数

  // 初回レンダリング時にFirebaseからUIDを取得し、UUIDを取得する
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Firebase UIDを使ってUUIDを取得
          const response = await axios.get<{ uuid: string }>(
            `http://localhost:8000/api/users/firebase/${user.uid}/`
          );
          setUserUuid(response.data.uuid);
        } catch (error) {
          console.error("UUIDの取得中にエラーが発生しました");
        }
      }
    });
  }, []);

  // UUIDが取得できたら連絡事項を取得
  useEffect(() => {
    if (userUuid) {
      fetchContactNotes(userUuid);
    }
  }, [userUuid]);

  // APIから連絡事項を取得する関数
  const fetchContactNotes = async (userUuid: string) => {
    try {
      const response = await axios.get<ContactNote[]>(
        `http://localhost:8000/api/contact-notes/${userUuid}/`
      );

      // 日付でソートして最新4件を表示
      const sortedNotes = response.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

      // 状態変数にソートされたデータをセット
      setContactNotes(sortedNotes);
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました");
    }
  };

  // 日付のフォーマットをMM/DD形式にする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div className="md:p-6 p-4 min-h-screen">
      <section className="my-4">
        <h2 className="text-xl md:text-2xl mb-2">施設からの連絡</h2>
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
                </th>
              </tr>
            </thead>
            <tbody>
              {contactNotes.map((note) => (
                <tr key={note.id}>
                  <td className="py-2 px-3 border-b md:text-base text-sm">
                    {formatDate(note.date)} {/* 日付をMM/DD形式で表示 */}
                  </td>
                  <td className="py-2 px-3 border-b md:text-base text-sm">
                    <Link href={`/user/contact-notes/${note.id}`}>
                      <div className="line-clamp-2 text-blue-600 hover:underline">
                        {note.detail} {/* 連絡事項の詳細を表示 */}
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
        <Link href="/user/prescriptions">
          <div className="text-center flex flex-col items-center bg-white border border-gray-300 rounded-lg p-3 shadow hover:shadow-md md:w-[100px] md:h-[100px] w-[96px] h-[96px]">
            <img
              src="/images/prescriptions_icon.png"
              alt="お薬ノート"
              className="h-8 mb-1"
            />
            <span className="text-sm text-gray-700">
              お薬
              <br />
              ノート
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default UserTop;
