"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

type CareRecord = {
  care_record_id: number;
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  comments: string;
  staff: number;
};

const CareRecordDetailPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [careRecord, setCareRecord] = useState<CareRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareRecord();
  }, [id]);

  const fetchCareRecord = async () => {
    try {
      const response = await axios.get<CareRecord>(
        `http://localhost:8000/api/care-records/${id}/`
      );
      setCareRecord(response.data);
      setLoading(false);
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <Link href="/user/care-records">
        <button className="text-blue-800 mb-4">← 戻る</button>
      </Link>
      {careRecord && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">ケアデータ詳細</h2>
          <p className="text-gray-600">日付: {careRecord.date}</p>
          <p className="text-gray-600 mt-2">食事: {careRecord.meal}</p>
          <p className="text-gray-600 mt-2">排泄: {careRecord.excretion}</p>
          <p className="text-gray-600 mt-2">入浴: {careRecord.bath}</p>
          <p className="text-gray-600 mt-2">体温: {careRecord.temperature}°C</p>
          <p className="text-gray-600 mt-2">
            血圧: {careRecord.systolic_bp}/{careRecord.diastolic_bp} mmHg
          </p>
          <p className="text-gray-600 mt-2">コメント:</p>
          <p className="mt-1">{careRecord.comments}</p>
          <p className="text-gray-600 mt-2">スタッフID: {careRecord.staff}</p>
        </div>
      )}
    </div>
  );
};

export default CareRecordDetailPage;
