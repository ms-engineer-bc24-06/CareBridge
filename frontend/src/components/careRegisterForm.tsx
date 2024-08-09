import React, { useState } from "react";

type CareRecordFormProps = {
  user: {
    uuid: string;
    user_id: string;
    user_name: string;
    user_name_kana: string;
    user_sex: string;
    user_birthday: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  };
  onClose: () => void;
};

const CareRegisterForm: React.FC<CareRecordFormProps> = ({ user, onClose }) => {
  const [date, setDate] = useState("");
  const [meal, setMeal] = useState("");
  const [excretion, setExcretion] = useState("");
  const [bath, setBath] = useState("");
  const [temperature, setTemperature] = useState("");
  const [systolicBP, setSystolicBP] = useState("");
  const [diastolicBP, setDiastolicBP] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 送信ロジック
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <h1 className="text-2xl font-bold">{user.user_id}</h1>
            <h1 className="text-xl font-bold">{user.user_name}</h1>
            <p>{user.user_name_kana}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">体温</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">血圧（最低）</label>
              <input
                type="text"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">血圧（最高）</label>
              <input
                type="text"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">食事</label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">選択</option>
                <option value="完食">完食</option>
                <option value="ほとんど食べた">ほとんど食べた</option>
                <option value="半分食べた">半分食べた</option>
                <option value="少し食べた">少し食べた</option>
                <option value="食べなかった">食べなかった</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">排泄</label>
              <select
                value={excretion}
                onChange={(e) => setExcretion(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">選択</option>
                <option value="コロコロ">コロコロ</option>
                <option value="硬便">硬便</option>
                <option value="普通便">普通便</option>
                <option value="軟便">軟便</option>
                <option value="水様便">水様便</option>
                <option value="なし">なし</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">入浴</label>
              <select
                value={bath}
                onChange={(e) => setBath(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">選択</option>
                <option value="入浴">入浴</option>
                <option value="シャワー">シャワー</option>
                <option value="体を拭く">体を拭く</option>
                <option value="なし">なし</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">コメント</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-accent text-white px-4 py-2 rounded mr-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-accent2 text-white px-4 py-2 rounded"
            >
              登録する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareRegisterForm;
