"use client";

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

// OCRで取得したデータの型定義
interface OcrData {
  hospital_name: string;
  date: string;
  medication_name: string;
  dosage_and_usage: string;
  pharmacy_name: string;
  pharmacy_phone_number: string;
}

// 処方箋の情報を定義する型
type Prescription = {
  id?: number;
  hospital_name: string;
  date: string;
  medication_name: string;
  dosage_and_usage: string;
  pharmacy_name: string;
  pharmacy_phone_number: string;
  staff: string;
  comment?: string;
};

// スタッフの情報を定義する型
type Staff = {
  uuid: string;
  staff_name: string;
  staff_id: string;
};

// フォームコンポーネントに渡されるプロパティの型定義
interface PrescriptionRegisterFormProps {
  onClose: () => void;
  userUuid: string;
  prescription: Prescription | null;
  ocrData?: OcrData;
}

const PrescriptionRegisterForm: React.FC<PrescriptionRegisterFormProps> = ({
  onClose,
  userUuid,
  prescription,
  ocrData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Prescription>({
    hospital_name: ocrData?.hospital_name || prescription?.hospital_name || "",
    date: ocrData?.date || prescription?.date || "",
    medication_name:
      ocrData?.medication_name || prescription?.medication_name || "",
    dosage_and_usage:
      ocrData?.dosage_and_usage || prescription?.dosage_and_usage || "",
    pharmacy_name: ocrData?.pharmacy_name || prescription?.pharmacy_name || "",
    pharmacy_phone_number:
      ocrData?.pharmacy_phone_number ||
      prescription?.pharmacy_phone_number ||
      "",
    staff: "",
    comment: prescription?.comment || "",
  });

  const [staffUuid, setStaffUuid] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");

  useEffect(() => {
    const fetchStaffInfo = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const response = await axios.get<Staff>(
            `http://localhost:8000/api/staffs/firebase/${user.uid}/`
          );
          setStaffUuid(response.data.uuid);
          setStaffName(response.data.staff_name);
          setFormData((prevData) => ({
            ...prevData,
            staff: response.data.uuid,
          }));
        } catch (error) {
          console.error("スタッフ情報の取得中にエラーが発生しました");
        }
      }
    };

    fetchStaffInfo();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(
      "http://localhost:8000/api/prescriptions/ocr/",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error(
        "ファイルのアップロード中にエラーが発生しました",
        response.statusText
      );
      return;
    }

    const data = await response.json();
    const parsedData: OcrData = JSON.parse(data.text);

    setFormData((prevData) => ({
      ...prevData,
      hospital_name: parsedData.hospital_name || "",
      date: parsedData.date || "",
      medication_name: parsedData.medication_name || "",
      dosage_and_usage: parsedData.dosage_and_usage || "",
      pharmacy_name: parsedData.pharmacy_name || "",
      pharmacy_phone_number: parsedData.pharmacy_phone_number || "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/prescriptions/save/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, user_uuid: userUuid }),
        }
      );

      if (response.ok) {
        alert("データが正常に保存されました！");
        onClose();
      } else {
        alert("エラーが発生しました。");
      }
    } catch (error) {
      console.error("データ送信中にエラーが発生しました:");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">処方薬登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">ファイルを選択:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={handleUpload}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              アップロードして解析
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">病院名:</label>
              <input
                type="text"
                name="hospital_name"
                value={formData.hospital_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">調剤日付:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">薬名:</label>
              <input
                type="text"
                name="medication_name"
                value={formData.medication_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">用法用量:</label>
              <textarea
                name="dosage_and_usage"
                value={formData.dosage_and_usage}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">薬局名:</label>
              <input
                type="text"
                name="pharmacy_name"
                value={formData.pharmacy_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">薬局電話番号:</label>
              <input
                type="text"
                name="pharmacy_phone_number"
                value={formData.pharmacy_phone_number}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">コメント:</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end">
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
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionRegisterForm;
