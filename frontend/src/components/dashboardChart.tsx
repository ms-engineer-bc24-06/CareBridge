"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

type DashboardChartProps = {
  userUuid: string;
};

const DashboardChart = ({ userUuid }: DashboardChartProps) => {
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);

  useEffect(() => {
    fetchCareRecords();
  }, [userUuid]);

  // ケア記録を取得する非同期関数
  const fetchCareRecords = async () => {
    try {
      const response = await apiClient.get<CareRecord[]>(
        `/api/care-records/${userUuid}/`
      );

      // 日付順にソートし、最新の7日間のデータを取得
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestSevenRecords = sortedRecords.slice(0, 7);
      setCareRecords(latestSevenRecords);
    } catch (error) {
      console.error("ケア記録の取得中にエラーが発生しました");
    }
  };

  // グラフのラベル（日付）
  const labels = careRecords.map((record) => record.date).reverse();

  // 体温データセット
  const temperatureData = {
    labels: labels,
    datasets: [
      {
        label: "体温",
        data: careRecords.map((record) => record.temperature).reverse(),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  // 血圧データセット
  const bloodPressureData = {
    labels: labels,
    datasets: [
      {
        label: "血圧（高値）",
        data: careRecords.map((record) => record.systolic_bp).reverse(),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y",
      },
      {
        label: "血圧（低値）",
        data: careRecords.map((record) => record.diastolic_bp).reverse(),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  // 体温グラフのオプション
  const temperatureOptions = {
    responsive: true,
    maintainAspectRatio: true, // サイズ調整を許可
    aspectRatio: 1.8, // グラフの縦横比を設定
    scales: {
      x: {
        ticks: {
          callback: function (value: any, index: any, values: any) {
            const date = new Date(labels[index]);
            return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD形式で表示
          },
        },
      },
      y: {
        min: 35,
        max: 41,
        ticks: {
          maxTicksLimit: 6, // 最大ティック数を指定
          minTicksLimit: 5, // 最小ティック数を指定
        },
      },
    },
  };

  // 血圧グラフのオプション
  const bloodPressureOptions = {
    responsive: true,
    maintainAspectRatio: true, // サイズ調整を許可
    aspectRatio: 1.8, // グラフの縦横比を設定
    scales: {
      x: {
        ticks: {
          callback: function (value: any, index: any, values: any) {
            const date = new Date(labels[index]);
            return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD形式で表示
          },
        },
      },
      y: {
        min: 60,
        max: 160,
        ticks: {
          autoSkip: false, // ラベルの自動省略を無効にする
          maxTicksLimit: 6, // 最大ティック数を指定（必要に応じて調整）
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="mb-8 sm:mb-0 w-full">
        <h2 className="md:text-xl text-lg mb-2">体温</h2>
        <Line data={temperatureData} options={temperatureOptions} />
      </div>
      <div className="w-full">
        <h2 className="md:text-xl text-lg mb-2">血圧</h2>
        <Line data={bloodPressureData} options={bloodPressureOptions} />
      </div>
    </div>
  );
};

export default DashboardChart;
