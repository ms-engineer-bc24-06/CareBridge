"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import Modal from "../../../../components/modalCareRegister";
import ContactRegisterForm from "../../../../components/contactRegisterForm";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  status: string;
};

type UserDetail = {
  uuid: string;
  user_id: string;
  user_name: string;
  user_name_kana: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

const ContactNotesPage = () => {
  const params = useParams(); // URLパラメータを取得
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid; // UUIDが配列の場合に対応

  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // ユーザー詳細データの状態変数
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダルの開閉状態を管理
  const [selectedNote, setSelectedNote] = useState<ContactNote | null>(null); // 選択された連絡事項を管理

  useEffect(() => {
    if (uuid) {
      fetchContactNotes(uuid);
      fetchUserDetail(uuid);
    }
  }, [uuid]);

  // 連絡事項を取得する関数
  const fetchContactNotes = async (userUuid: string) => {
    try {
      const response = await axios.get<ContactNote[]>(
        `http://localhost:8000/api/contact-notes/${userUuid}/`
      );
      setContactNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("連絡事項の取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  // ユーザー詳細を取得する関数
  const fetchUserDetail = async (userUuid: string) => {
    try {
      const response = await axios.get<UserDetail>(
        `http://localhost:8000/api/users/${userUuid}/`
      );
      setUserDetail(response.data);
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // モーダルを開く関数
  const openModal = (note: ContactNote | null = null) => {
    setSelectedNote(note); // 選択された連絡事項を設定
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null); // モーダルを閉じたときに選択された連絡事項をリセット
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <Link href="/staff/users">
        <button className="text-blue-800 mb-4">←利用者一覧に戻る</button>
      </Link>
      <div className="flex justify-between items-center mb-6">
        {userDetail && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="mr-4">
                <h2 className="text-xl font-bold">{userDetail.user_id}</h2>
                <h2 className="text-xl font-bold">{userDetail.user_name}</h2>
                <p>{userDetail.user_name_kana}</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              連絡登録
            </button>
          </div>
        )}
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">日付</th>
            <th className="py-2 px-3 border-b">連絡内容</th>
            <th className="py-2 px-3 border-b">スタッフID</th>
            <th className="py-2 px-3 border-b">ステータス</th>
            <th className="py-2 px-3 border-b">アクション</th>{" "}
            {/* 新しくアクション列を追加 */}
          </tr>
        </thead>
        <tbody>
          {contactNotes.map((note) => (
            <tr key={note.id}>
              <td className="py-2 px-3 border-b">{note.date}</td>
              <td className="py-2 px-3 border-b truncate max-w-xs">
                {note.detail}
              </td>
              <td className="py-2 px-3 border-b">{note.staff}</td>
              <td className="py-2 px-3 border-b">{note.status}</td>
              <td className="py-2 px-3 border-b">
                <button
                  onClick={() => openModal(note)}
                  className="bg-accent2 text-white px-4 py-2 rounded"
                >
                  確認・編集
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* モーダルを呼び出す */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ContactRegisterForm
          onClose={closeModal}
          userUuid={uuid}
          note={selectedNote} // モーダルに選択された連絡事項を渡す
        />
      </Modal>
    </div>
  );
};

export default ContactNotesPage;
