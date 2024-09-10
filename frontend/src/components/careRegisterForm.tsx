import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

// スタッフの情報を定義する型
type Staff = {
  uuid: string;
  staff_name: string;
  staff_id: string;
};

// ケア記録の情報を定義する型
type CareRecord = {
  id?: number; // idは新規作成時には存在しない可能性があるためオプショナル
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  comments: string;
  staff: string;
};

// フォームコンポーネントに渡されるプロパティの型を定義
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
  onClose: () => void; // フォームが閉じられるときに呼び出される関数
  record?: CareRecord | null; // 編集時の既存データ、ない場合は新規作成
};

// ケア記録フォームのコンポーネントを定義
const CareRegisterForm: React.FC<CareRecordFormProps> = ({
  user,
  onClose,
  record,
}) => {
  // フォームの入力値を管理する状態変数
  const [date, setDate] = useState(record ? record.date : "");
  const [meal, setMeal] = useState(record ? record.meal : "");
  const [excretion, setExcretion] = useState(record ? record.excretion : "");
  const [bath, setBath] = useState(record ? record.bath : "");
  const [temperature, setTemperature] = useState(
    record ? record.temperature : ""
  );
  const [systolic_bp, setSystolic_bp] = useState(
    record ? record.systolic_bp : ""
  );
  const [diastolic_bp, setDiastolic_bp] = useState(
    record ? record.diastolic_bp : ""
  );
  const [comments, setComments] = useState(record ? record.comments : "");
  const [staffUuid, setStaffUuid] = useState<string>(""); // スタッフのUUIDを管理
  const [staffName, setStaffName] = useState<string>(""); // スタッフの名前を管理

  // コンポーネントのマウント時に実行される処理
  useEffect(() => {
    // Firebase認証情報を利用してスタッフ情報を取得
    const fetchStaffInfo = async () => {
      const auth = getAuth(); // Firebase認証インスタンスを取得
      const user = auth.currentUser; // 現在のユーザーを取得

      if (user) {
        try {
          // 現在のユーザーのUIDを使ってスタッフ情報を取得
          const response = await apiClient.get<Staff>(
            `/api/staffs/firebase/${user.uid}/`
          );

          // スタッフUUIDと名前を状態にセット
          setStaffUuid(response.data.uuid);
          setStaffName(response.data.staff_name);
        } catch (error) {
          console.error("スタッフ情報の取得中にエラーが発生しました:");
        }
      }
    };

    fetchStaffInfo(); // スタッフ情報を取得

    if (record) {
      // 編集時には既存のデータをフォームにセット
      setDate(record.date);
      setMeal(record.meal);
      setExcretion(record.excretion);
      setBath(record.bath);
      setTemperature(record.temperature);
      setSystolic_bp(record.systolic_bp);
      setDiastolic_bp(record.diastolic_bp);
      setComments(record.comments);
      setStaffUuid(record.staff);
    }
  }, [record]);

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 送信するケア記録データを準備
    const careRecordData = {
      user: user.uuid,
      date,
      meal,
      excretion,
      bath,
      temperature,
      systolic_bp,
      diastolic_bp,
      comments,
      staff: staffUuid,
    };

    try {
      let response;
      if (record && record.id) {
        // 編集の場合、PUTリクエストを送信
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-records/update/${record.id}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(careRecordData),
          }
        );
      } else {
        // 新規作成の場合、POSTリクエストを送信
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-records/create/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(careRecordData),
          }
        );
      }

      if (response.ok) {
        alert(
          record ? "ケア記録が更新されました。" : "ケア記録が登録されました。"
        );
        onClose(); // フォーム送信後に閉じる処理
      } else {
        alert("ケア記録の送信に失敗しました。");
      }
    } catch (error) {
      console.error("ケア記録の送信中にエラーが発生しました:");
      alert("ケア記録の送信中にエラーが発生しました。");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4">
        {/* ユーザー情報の表示 */}
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <h1 className="text-2xl font-bold">{user.user_id}</h1>
            <h1 className="text-xl font-bold">{user.user_name}</h1>
            <p>{user.user_name_kana}</p>
          </div>
        </div>
        {/* ケア記録フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* 日付の入力 */}
            <div>
              <label className="block text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* 体温の入力 */}
            <div>
              <label className="block text-gray-700">体温</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* 血圧（最低）の入力 */}
            <div>
              <label className="block text-gray-700">血圧（最低）</label>
              <input
                type="text"
                value={diastolic_bp}
                onChange={(e) => setDiastolic_bp(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* 血圧（最高）の入力 */}
            <div>
              <label className="block text-gray-700">血圧（最高）</label>
              <input
                type="text"
                value={systolic_bp}
                onChange={(e) => setSystolic_bp(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* 食事の入力 */}
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
            {/* 排泄の入力 */}
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
            {/* 入浴の入力 */}
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
            {/* コメントの入力 */}
            <div>
              <label className="block text-gray-700">コメント</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
          </div>
          {/* フォーム送信ボタン */}
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
              {record ? "更新する" : "登録する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareRegisterForm;
