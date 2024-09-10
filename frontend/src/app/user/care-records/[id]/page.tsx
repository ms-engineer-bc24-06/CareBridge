"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

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
  staff: string; // スタッフのUUID（外部キー）
};

type StaffDetail = {
  uuid: string; // スタッフのUUID
  staff_id: string; // スタッフのID
  staff_name: string;
};

const CareRecordDetailPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [careRecord, setCareRecord] = useState<CareRecord | null>(null);
  const [staffDetails, setStaffDetails] = useState<{
    [key: string]: StaffDetail;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareRecord();
    fetchStaffDetails();
  }, [id]);

  // ケア記録を取得する関数
  const fetchCareRecord = async () => {
    try {
      const response = await apiClient.get<CareRecord>(
        `/api/care-records/detail/${id}/`
      );
      setCareRecord(response.data);
      setLoading(false);
    } catch (error) {
      console.error("ケアデータの取得中にエラーが発生しました");
      setLoading(false);
    }
  };

  // スタッフ情報を取得してマッピングを作成する関数
  const fetchStaffDetails = async () => {
    try {
      const response = await apiClient.get<StaffDetail[]>(`/api/staffs/`);
      const staffMap: { [key: string]: StaffDetail } = {};
      response.data.forEach((staff) => {
        staffMap[staff.uuid] = staff;
      });
      setStaffDetails(staffMap); // スタッフのUUIDをキーとするマッピングをセット
    } catch (error) {
      console.error("スタッフ情報の取得中にエラーが発生しました");
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
          <p className="text-gray-600 mt-2">
            スタッフ名: {staffDetails[careRecord.staff]?.staff_name || "不明"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CareRecordDetailPage;
