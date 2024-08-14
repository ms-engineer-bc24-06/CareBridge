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
};

const ContactNoteDetailPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [note, setNote] = useState<ContactNote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactNote();
  }, [id]);

  const fetchContactNote = async () => {
    try {
      const response = await axios.get<ContactNote>(
        `http://localhost:8000/api/contact-note/${id}/`
      );
      setNote(response.data);
      setLoading(false);
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/contact-note/${id}/update-status/`
      );
      setNote({ ...note, status: "確認済み" } as ContactNote);
    } catch (error) {
      console.error("連絡事項の更新中にエラーが発生しました");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <Link href="/user/top">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      {note && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">連絡詳細</h2>
          <p className="text-gray-600">日付: {note.date}</p>
          <p className="text-gray-600 mt-2">連絡内容:</p>
          <p className="mt-1">{note.detail}</p>
          {note.status === "未確認" ? (
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
