import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: string;
  is_confirmed: boolean;
};

type Staff = {
  uuid: string;
  staff_id: string;
  staff_name: string;
};

type ContactRegisterFormProps = {
  onClose: () => void;
  userUuid: string;
  note: ContactNote | null; // 新規の場合はnull、編集の場合は既存のノート
};

const ContactRegisterForm = ({
  onClose,
  userUuid,
  note,
}: ContactRegisterFormProps) => {
  // フォームフィールドの状態を管理
  const [detail, setDetail] = useState<string>(note ? note.detail : "");
  const [date, setDate] = useState<string>(
    note ? note.date : new Date().toISOString().split("T")[0]
  );
  const [staffUuid, setStaffUuid] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");

  // Firebaseから現在のユーザーのUIDを取得し、それに基づいてスタッフ情報を取得
  useEffect(() => {
    const fetchStaffInfo = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          // Firebase UIDを使ってスタッフ情報を取得
          const response = await axios.get<Staff>(
            `http://localhost:8000/api/staffs/firebase/${user.uid}/`
          );

          setStaffUuid(response.data.uuid);
          setStaffName(response.data.staff_name);
        } catch (error) {
          console.error("スタッフ情報の取得中にエラーが発生しました:", error);
        }
      }
    };

    fetchStaffInfo();

    if (note) {
      setDetail(note.detail);
      setDate(note.date);
      setStaffUuid(note.staff);
    }
  }, [note]);

  // フォーム送信時のハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contactNoteData = {
      user: userUuid,
      date: date,
      detail: detail,
      staff: staffUuid,
      is_confirmed: false,
    };

    try {
      let response;
      if (note) {
        // 編集の場合は、更新用のエンドポイントにPUTリクエストを送信
        response = await axios.put(
          `http://localhost:8000/api/contact-note/${note.id}/update/`,
          contactNoteData
        );
      } else {
        // 新規作成の場合はPOSTリクエストを送信
        response = await axios.post(
          "http://localhost:8000/api/contact-note/",
          contactNoteData
        );
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          note ? "連絡ノートが更新されました。" : "連絡ノートが登録されました。"
        );
        onClose(); // フォーム送信後にモーダルを閉じる
      } else {
        alert(
          note
            ? "連絡ノートの更新に失敗しました。"
            : "連絡ノートの登録に失敗しました。"
        );
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert(
        note
          ? "連絡ノートの更新中にエラーが発生しました。"
          : "連絡ノートの登録中にエラーが発生しました。"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mt-4">
        <label>連絡内容</label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mt-4">
        <label>スタッフ</label>
        <p className="border p-2 rounded w-full bg-gray-100">{staffName}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {note ? "更新" : "保存"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default ContactRegisterForm;
