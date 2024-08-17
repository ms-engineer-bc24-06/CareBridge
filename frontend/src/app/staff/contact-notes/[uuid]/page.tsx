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
  staff: string; // スタッフのUUID（外部キー）
  is_confirmed: boolean;
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

type StaffDetail = {
  uuid: string; // スタッフのUUID（外部キー）
  staff_id: string; // スタッフのID
  staff_name: string;
};

const ContactNotesPage = () => {
  const params = useParams();
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

  // State管理
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]); // 連絡ノートのリスト
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // ユーザー詳細情報
  const [staffDetails, setStaffDetails] = useState<{
    [key: string]: StaffDetail;
  }>({});
  const [loading, setLoading] = useState(true); // ローディング状態
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダル表示状態
  const [selectedNote, setSelectedNote] = useState<ContactNote | null>(null); // 選択された連絡ノート（編集用）

  // 初期ロード時に連絡ノートとユーザー詳細を取得
  useEffect(() => {
    if (uuid) {
      fetchContactNotes(uuid);
      fetchUserDetail(uuid);
    }
  }, [uuid]);

  // スタッフ情報を取得
  useEffect(() => {
    fetchStaffDetails();
  }, []);

  // 連絡ノートをユーザーIDで取得する関数
  const fetchContactNotes = async (userUuid: string) => {
    try {
      const response = await axios.get<ContactNote[]>(
        `http://localhost:8000/api/contact-notes/${userUuid}/`
      );
      setContactNotes(response.data); // 取得した連絡ノートをセット
      setLoading(false); // ローディング完了
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
      setUserDetail(response.data); // 取得したユーザー詳細をセット
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // スタッフ情報を取得してマッピングを作成する関数
  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get<StaffDetail[]>(
        `http://localhost:8000/api/staffs/`
      );
      const staffMap: { [key: string]: StaffDetail } = {};
      response.data.forEach((staff) => {
        staffMap[staff.uuid] = staff;
      });
      setStaffDetails(staffMap); // スタッフのUUIDをキーとするマッピングをセット
    } catch (error) {
      console.error("スタッフ情報の取得中にエラーが発生しました");
    }
  };

  // フォーム送信後にリストを更新する関数
  const handleFormSubmit = () => {
    fetchContactNotes(uuid); // 連絡ノートを再取得してリストを更新
    closeModal(); // モーダルを閉じる
  };

  // モーダルを開く関数（新規登録または編集用）
  const openModal = (note: ContactNote | null = null) => {
    setSelectedNote(note); // 編集対象のノートをセット（新規の場合はnull）
    setIsModalOpen(true); // モーダルを表示
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false); // モーダルを非表示
    setSelectedNote(null); // 編集対象をリセット
  };

  // ローディング中の表示
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
            <th className="py-2 px-3 border-b">スタッフ名</th>
            <th className="py-2 px-3 border-b">ステータス</th>
            <th className="py-2 px-3 border-b">アクション</th>
          </tr>
        </thead>
        <tbody>
          {contactNotes.map((note) => (
            <tr key={note.id}>
              <td className="py-2 px-3 border-b">{note.date}</td>
              <td className="py-2 px-3 border-b truncate max-w-xs">
                {note.detail}
              </td>
              {/* スタッフUUIDを元に対応するスタッフIDと名前を表示 */}
              <td className="py-2 px-3 border-b">
                {staffDetails[note.staff]?.staff_id || "不明"}
              </td>
              <td className="py-2 px-3 border-b">
                {staffDetails[note.staff]?.staff_name || "不明"}
              </td>
              <td className="py-2 px-3 border-b">
                {note.is_confirmed ? "確認済み" : "未確認"}
              </td>
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ContactRegisterForm
          onClose={handleFormSubmit} // フォーム送信後にリストを更新
          userUuid={uuid}
          note={selectedNote} // 編集の場合に既存ノートを渡す
        />
      </Modal>
    </div>
  );
};

export default ContactNotesPage;
