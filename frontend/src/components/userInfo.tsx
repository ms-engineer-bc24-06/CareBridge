"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type CareRecord = {
  date: string;
  meal: string;
  excretion: string;
};

type UserDetail = {
  uuid: string;
  user_id: string;
  user_name: string;
  allergies: string | null;
  medications: string | null;
};

type UserInfoProps = {
  userUuid: string;
};

const UserInfo = ({ userUuid }: UserInfoProps) => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [daysSinceLastExcretion, setDaysSinceLastExcretion] = useState<
    number | null
  >(null);
  const [appetiteStatus, setAppetiteStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetail();
    fetchCareRecords();
  }, [userUuid]);

  // ユーザー詳細情報を取得する非同期関数
  const fetchUserDetail = async () => {
    try {
      const response = await axios.get<UserDetail>(
        `http://localhost:8000/api/users/${userUuid}/`
      );
      setUserDetail(response.data);
    } catch (error) {
      console.error("ユーザー詳細の取得中にエラーが発生しました");
    }
  };

  // ケア記録を取得する非同期関数
  const fetchCareRecords = async () => {
    try {
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );
      const records = response.data;
      setCareRecords(records);
      calculateExcretionInfo(records);
      determineAppetiteStatus(records);
    } catch (error) {
      console.error("ケア記録の取得中にエラーが発生しました");
    }
  };

  // 最後の排便から何日経過しているかを計算する関数
  const calculateExcretionInfo = (records: CareRecord[]) => {
    // 排泄が "なし" ではないすべてのレコードをフィルタリング
    const excretionRecords = records.filter(
      (record) => record.excretion !== "なし"
    );

    // 最新の日付を取得
    const latestExcretionDate = excretionRecords.length
      ? new Date(
          Math.max(
            ...excretionRecords.map((record) => new Date(record.date).getTime())
          )
        )
      : null;

    if (latestExcretionDate) {
      const today = new Date(); // 今日の日付を取得
      const diffTime = Math.abs(
        today.getTime() - latestExcretionDate.getTime()
      ); // 今日と最後の排泄日との差をミリ秒単位で計算
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ミリ秒を日数に変換し、切り上げて整数にする
      setDaysSinceLastExcretion(diffDays); // 計算した日数を state に保存
    } else {
      setDaysSinceLastExcretion(null); // 排泄のデータがない場合は null を設定
    }
  };

  // 食欲のありなしを判断
  const determineAppetiteStatus = (records: CareRecord[]) => {
    const latestMeal = records[0]?.meal;
    if (
      latestMeal === "完食" ||
      latestMeal === "半分" ||
      latestMeal === "ほとんど食べた"
    ) {
      setAppetiteStatus("あり");
    } else {
      setAppetiteStatus("なし");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg md:p-6 p-4 md:mb-6 mb-4">
      {userDetail && (
        <div>
          <h2 className="md:text-xl text-lg font-bold md:mb-4 mb-2">
            {userDetail.user_name}さんの現在の状況
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-4 gap-2">
            <div className="md:mb-2 mb-1">
              <p className="text-gray-600">最後の排便からの経過日数</p>
              <p className="md:text-lg text-base">
                {daysSinceLastExcretion !== null
                  ? `${daysSinceLastExcretion}日`
                  : "データなし"}
              </p>
            </div>
            <div className="md:mb-2 mb-1">
              <p className="text-gray-600">食欲</p>
              <p className="md:text-lg text-base">
                {appetiteStatus !== null ? appetiteStatus : "データなし"}
              </p>
            </div>
            <div className="md:mb-2 mb-1">
              <p className="text-gray-600">アレルギー情報</p>
              <p className="md:text-lg text-base">
                {userDetail.allergies || "なし"}
              </p>
            </div>
            <div className="md:mb-2 mb-1">
              <p className="text-gray-600">服用中の薬</p>
              <p className="md:text-lg text-base">
                {userDetail.medications || "なし"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
