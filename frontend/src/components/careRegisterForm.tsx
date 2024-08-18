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
  const [systolic_bp, setSystolic_bp] = useState(""); // フィールド名を変更
  const [diastolic_bp, setDiastolic_bp] = useState(""); // フィールド名を変更
  const [comments, setComments] = useState("");

  // 仮のスタッフUUIDを設定する（小林 玲奈さんのUUIDと仮定）
  const staffUuid = "9fae7d8d-9282-4b8e-b156-14e322944e74";  // スタッフログイン実装後削除

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 登録するためのデータを準備
    const careRecordData = {
      user: user.uuid,
      date: date,
      meal: meal,
      excretion: excretion,
      bath: bath,
      temperature: temperature,
      systolic_bp: systolic_bp, // 修正されたフィールド名を使用
      diastolic_bp: diastolic_bp, // 修正されたフィールド名を使用
      comments: comments,
      staff: staffUuid, // 仮のスタッフUUIDを送信データに追加、実装後削除！
    };

    try {
      // POSTリクエストでデータを送信
      console.log("送信するデータ:", careRecordData);

      const response = await fetch("http://localhost:8000/api/care-records/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careRecordData),
      });

      // レスポンスのステータスとデータを確認
      console.log("レスポンスステータス:", response.status);
      const data = await response.json();
      console.log("レスポンスデータ:", data);

      // レスポンスが成功かどうかを判定
      if (response.ok) {
        alert("ケア記録が登録されました。");
        onClose(); // モーダルを閉じる
      } else {
        alert("ケア記録の登録に失敗しました。");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("ケア記録の登録中にエラーが発生しました。");
    }
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
                value={diastolic_bp}  // 修正されたフィールド名を使用
                onChange={(e) => setDiastolic_bp(e.target.value)}  // 修正されたフィールド名を使用
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">血圧（最高）</label>
              <input
                type="text"
                value={systolic_bp}  // 修正されたフィールド名を使用
                onChange={(e) => setSystolic_bp(e.target.value)}  // 修正されたフィールド名を使用
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
