import React, { useState, useEffect } from "react";

type ContactNote = {
  id: number;
  date: string;
  detail: string;
  staff: number;
  status: string;
};

type ContactRegisterFormProps = {
  onClose: () => void;
  userUuid: string;
  note: ContactNote | null; // note プロパティを追加
};

const ContactRegisterForm = ({
  onClose,
  userUuid,
  note,
}: ContactRegisterFormProps) => {
  const [detail, setDetail] = useState<string>(note ? note.detail : "");
  const [date, setDate] = useState<string>(
    note ? note.date : new Date().toISOString().split("T")[0]
  );
  const [staff, setStaff] = useState<number>(note ? note.staff : 0);

  useEffect(() => {
    if (note) {
      setDetail(note.detail);
      setDate(note.date);
      setStaff(note.staff);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API呼び出しなどの処理をここに追加
    onClose();
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
        <input
          type="number"
          value={staff}
          onChange={(e) => setStaff(parseInt(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          保存
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
