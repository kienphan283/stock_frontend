/**
 * Market Status Panel Component
 *
 * Panel giữa hiển thị:
 * - Tabs: Biến động | Nước ngoài | Tự doanh | Thanh khoản
 * - Pie Chart: Số lượng mã tăng/giảm/không đổi
 * - Bar Chart: Phân bổ dòng tiền
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MarketStatus, MarketStatusTab } from "@/types/market";
import { marketService } from "@/services/marketService";

const TABS = [
  { label: "Biến động", value: "movement" as MarketStatusTab },
  { label: "Nước ngoài", value: "foreign" as MarketStatusTab },
  { label: "Tự doanh", value: "proprietary" as MarketStatusTab },
  { label: "Thanh khoản", value: "liquidity" as MarketStatusTab },
];

const COLORS = {
  advancing: "#10b981", // Green
  declining: "#ef4444", // Red
  unchanged: "#fbbf24", // Yellow
};

export default function MarketStatusPanel() {
  const [activeTab, setActiveTab] = useState<MarketStatusTab>("movement");
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    try {
      const data = await marketService.getMarketStatus();
      setStatus(data);
    } catch (error) {
      console.error("Failed to load market status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading || !status) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-[600px]">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Prepare data for Pie Chart
  const pieData = [
    { name: "Tăng", value: status.advancing, color: COLORS.advancing },
    { name: "Giảm", value: status.declining, color: COLORS.declining },
    { name: "Không đổi", value: status.unchanged, color: COLORS.unchanged },
  ];

  const totalStocks = status.advancing + status.declining + status.unchanged;

  // Prepare data for Bar Chart (Cash Flow)
  const barData = [
    {
      name: "Tăng",
      value: status.cashFlow.advancing,
      color: COLORS.advancing,
    },
    {
      name: "Giảm",
      value: status.cashFlow.declining,
      color: COLORS.declining,
    },
    {
      name: "Kh. đổi",
      value: status.cashFlow.unchanged,
      color: COLORS.unchanged,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors
                ${
                  activeTab === tab.value
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tab: Biến động */}
        {activeTab === "movement" && (
          <div className="grid grid-cols-2 gap-4">
            {/* LEFT: Pie Chart - Số lượng mã */}
            <div>
              <h3 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Số lượng CP Tăng, Giảm, Không đổi
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name} (${entry.value})`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-1 mt-1 text-center text-xs">
                <div>
                  <div className="font-bold text-green-600 text-base">
                    {status.advancing}
                  </div>
                  <div className="text-gray-500 text-[10px]">Tăng</div>
                </div>
                <div>
                  <div className="font-bold text-red-600 text-base">
                    {status.declining}
                  </div>
                  <div className="text-gray-500 text-[10px]">Giảm</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600 text-base">
                    {status.unchanged}
                  </div>
                  <div className="text-gray-500 text-[10px]">Không đổi</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Bar Chart - Phân bổ dòng tiền */}
            <div>
              <h3 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Phân bổ dòng tiền
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10 }}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${value?.toFixed(2) ?? "0.00"}B`
                    }
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab: Nước ngoài */}
        {activeTab === "foreign" && status.foreignTrading && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Giao dịch Nhà đầu tư nước ngoài
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mua
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${status.foreignTrading?.buy?.toFixed(2) ?? "0.00"}M
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Bán
                </span>
                <span className="text-lg font-bold text-red-600">
                  ${status.foreignTrading?.sell?.toFixed(2) ?? "0.00"}M
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mua ròng
                </span>
                <span
                  className={`text-lg font-bold ${
                    (status.foreignTrading?.net ?? 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(status.foreignTrading?.net ?? 0) >= 0 ? "+" : ""}$
                  {status.foreignTrading?.net?.toFixed(2) ?? "0.00"}M
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tự doanh */}
        {activeTab === "proprietary" && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Dữ liệu tự doanh đang được cập nhật</p>
            <p className="text-xs mt-2">Coming soon...</p>
          </div>
        )}

        {/* Tab: Thanh khoản */}
        {activeTab === "liquidity" && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Dữ liệu thanh khoản đang được cập nhật</p>
            <p className="text-xs mt-2">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
