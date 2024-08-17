"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  status: string;
  is_confirmed: boolean;
};

const ContactNoteDetailPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [note, setNote] = useState<ContactNote | null>(null); // 連絡事項の詳細データを管理する状態
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  // 初回レンダリング時に連絡事項の詳細を取得
  useEffect(() => {
    fetchContactNote();
  }, [id]);

  // APIから連絡事項の詳細を取得する関数
  const fetchContactNote = async () => {
    try {
      const response = await axios.get<ContactNote>(
        `http://localhost:8000/api/contact-note/${id}/`
      );
      setNote(response.data); // 取得したデータを状態にセット
      setLoading(false); // ローディング完了
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました");
      setLoading(false); // エラーが発生してもローディングを終了
    }
  };

  // 連絡事項を確認済みにする関数
  const handleConfirm = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/contact-note/${id}/update-status/`,
        { is_confirmed: true }
      );
      // 更新後の状態を反映
      setNote({
        ...note,
        is_confirmed: true,
        status: "確認済み",
      } as ContactNote);
    } catch (error) {
      console.error("連絡事項の更新中にエラーが発生しました");
    }
  };

  // データがロード中の場合の処理
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      {/* 戻るボタン */}
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      {note && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">連絡詳細</h2>
          <p className="text-gray-600">日付: {note.date}</p>
          <p className="text-gray-600 mt-2">連絡内容:</p>
          <p className="mt-1">{note.detail}</p>
          {/* is_confirmed が false の場合に確認ボタンを表示 */}
          {!note.is_confirmed ? (
            <button
              onClick={handleConfirm}
              className="mt-4 bg-accent text-white px-4 py-2 rounded"
            >
              確認済みにする
            </button>
          ) : (
            <button
              className="mt-4 bg-accent2 text-white px-4 py-2 rounded"
              disabled
            >
              確認済み
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactNoteDetailPage;
