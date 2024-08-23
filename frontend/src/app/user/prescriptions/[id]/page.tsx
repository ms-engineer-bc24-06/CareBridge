"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

type Prescription = {
  id: number;
  hospital_name: string;
  date: string;
  medication_name: string;
  dosage_and_usage: string;
  pharmacy_name: string;
  pharmacy_phone_number: string;
  staff: string; // スタッフのUUID
  comment?: string;
};

type Staff = {
  uuid: string;
  staff_name: string;
};

const PrescriptionDetailPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [prescription, setPrescription] = useState<Prescription | null>(null); // 処方箋の詳細データを管理する状態
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [staffName, setStaffName] = useState<string>(""); // スタッフ名を保存する状態変数

  // 初回レンダリング時に処方箋の詳細を取得
  useEffect(() => {
    fetchPrescription();
  }, [id]);

  // APIから処方箋の詳細を取得する関数
  const fetchPrescription = async () => {
    try {
      const response = await axios.get<Prescription>(
        `http://localhost:8000/api/prescriptions/${id}/`
      );
      setPrescription(response.data); // 取得したデータを状態にセット

      // スタッフ名を取得
      const staffResponse = await axios.get<Staff>(
        `http://localhost:8000/api/staffs/${response.data.staff}/`
      );
      setStaffName(staffResponse.data.staff_name); // スタッフ名をセット

      setLoading(false); // ローディング完了
    } catch (error) {
      console.error("処方箋の取得中にエラーが発生しました");
      setLoading(false); // エラーが発生してもローディングを終了
    }
  };

  // データがロード中の場合の処理
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      {/* 戻るボタン */}
      <Link href="/user/prescriptions">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      {prescription && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">処方詳細</h2>
          <p className="text-gray-600">病院名: {prescription.hospital_name}</p>
          <p className="text-gray-600">日付: {prescription.date}</p>
          <p className="text-gray-600">薬名: {prescription.medication_name}</p>
          <p className="text-gray-600 mt-2">用法用量:</p>
          <p className="mt-1">{prescription.dosage_and_usage}</p>
          <p className="text-gray-600 mt-2">
            薬局名: {prescription.pharmacy_name}
          </p>
          <p className="text-gray-600 mt-2">
            薬局電話番号: {prescription.pharmacy_phone_number}
          </p>
          <p className="text-gray-600 mt-2">スタッフ: {staffName}</p>
          {prescription.comment && (
            <>
              <p className="text-gray-600 mt-2">コメント:</p>
              <p className="mt-1">{prescription.comment}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionDetailPage;
