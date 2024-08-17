import React, { useState, useEffect } from "react";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: string;
  is_confirmed: boolean;
};

type Staff = {
  id: string;
  uuid: string;
  name: string;
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
  const [staff, setStaff] = useState<string>(note ? note.staff : "");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");

  // フォームが読み込まれた際にスタッフリストを取得
  useEffect(() => {
    if (note) {
      setDetail(note.detail);
      setDate(note.date);
      setStaff(note.staff);
    }

    const fetchStaffs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/staffs/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStaffs(
          data.map((staff: any) => ({
            id: staff.staff_id,
            uuid: staff.uuid,
            name: staff.staff_name,
          }))
        );
      } catch (error) {
        console.error("スタッフリストの取得に失敗しました:", error);
      }
    };

    fetchStaffs();
  }, [note]);

  // スタッフID選択時に名前を表示するためのハンドラー
  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setStaff(selectedId);
    const selectedStaff = staffs.find((staff) => staff.id === selectedId);
    setSelectedStaffName(selectedStaff ? selectedStaff.name : "");
  };

  // フォーム送信時のハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contactNoteData = {
      user: userUuid,
      date: date,
      detail: detail,
      staff: staff,
      is_confirmed: false,
    };

    try {
      let response;
      if (note) {
        // 編集の場合は、更新用のエンドポイントにPUTリクエストを送信
        response = await fetch(
          `http://localhost:8000/api/contact-note/${note.id}/update/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contactNoteData),
          }
        );
      } else {
        // 新規作成の場合はPOSTリクエストを送信
        response = await fetch("http://localhost:8000/api/contact-note/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactNoteData),
        });
      }

      if (response.ok) {
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
        <label>スタッフID</label>
        <select
          value={staff}
          onChange={handleStaffChange}
          className="border p-2 rounded w-full"
        >
          <option value="">スタッフを選択してください</option>
          {staffs.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.id}
            </option>
          ))}
        </select>
        {selectedStaffName && (
          <p className="mt-2 text-gray-700">
            選択されたスタッフ: {selectedStaffName}
          </p>
        )}
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
