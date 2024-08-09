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
      const response = await axios.get<CareRecord[]>(
        `http://localhost:8000/api/care-records/${userUuid}/`
      );
      console.log("Fetched care records:", response.data);

      // 日付順にソートし、最新の7日間のデータを取得
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestSevenRecords = sortedRecords.slice(0, 7);
      setCareRecords(latestSevenRecords);
    } catch (error) {
      console.error("Error fetching care records:", error);
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
    maintainAspectRatio: false, // サイズ調整を許可
    scales: {
      y: {
        min: 35,
        max: 41,
      },
    },
  };

  // 血圧グラフのオプション
  const bloodPressureOptions = {
    responsive: true,
    maintainAspectRatio: false, // サイズ調整を許可
    scales: {
      y: {
        min: 60,
        max: 160,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="mb-8" style={{ width: "400px", height: "300px" }}>
        <h2 className="text-xl mb-2">体温</h2>
        <Line
          data={temperatureData}
          options={temperatureOptions}
          width={400}
          height={300}
        />
      </div>
      <div style={{ width: "400px", height: "300px" }}>
        <h2 className="text-xl mb-2">血圧</h2>
        <Line
          data={bloodPressureData}
          options={bloodPressureOptions}
          width={400}
          height={300}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
