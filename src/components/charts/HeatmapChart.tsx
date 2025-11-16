/**
 * Market Heatmap Component (Treemap)
 *
 * Hiển thị tất cả stocks grouped by sector
 * - Size: Market Cap
 * - Color: % Change (red = giảm, green = tăng)
 *
 * TODO: Add WebSocket realtime price updates
 */

"use client";

import React, { useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import type { HeatmapData, StockHeatmapItem } from "@/types/market";

export interface HeatmapChartProps {
  data: HeatmapData | null;
  height?: number;
}

export default function HeatmapChart({
  data,
  height = 600,
}: HeatmapChartProps) {
  // Transform data for Recharts Treemap
  const treemapData = useMemo(() => {
    if (!data || !data.sectors) return [];

    return data.sectors
      .filter((sector) => sector.stocks.length > 0)
      .map((sector) => ({
        name: sector.displayName,
        children: sector.stocks.map((stock) => ({
          name: stock.ticker,
          fullName: stock.name,
          value: stock.marketCap, // Size của ô
          changePercent: stock.changePercent,
          price: stock.price,
          change: stock.change,
          sector: sector.displayName,
        })),
      }));
  }, [data]);

  // Custom content for each cell
  const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, fullName, changePercent, price, value } =
      props;

    // Guard against undefined values
    if (typeof changePercent === "undefined" || typeof price === "undefined") {
      return null;
    }

    // Không render nếu ô quá nhỏ
    if (width < 40 || height < 40) return null;

    // Determine color based on change percentage
    const getColor = (change: number) => {
      if (change > 2) return "#059669"; // Dark green
      if (change > 0.5) return "#10b981"; // Green
      if (change > 0) return "#34d399"; // Light green
      if (change === 0) return "#fbbf24"; // Yellow
      if (change > -0.5) return "#fca5a5"; // Light red
      if (change > -2) return "#ef4444"; // Red
      return "#dc2626"; // Dark red
    };

    const bgColor = getColor(changePercent);
    const textColor = Math.abs(changePercent) > 1 ? "#ffffff" : "#000000";

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: bgColor,
            stroke: "#ffffff",
            strokeWidth: 1,
          }}
        />
        {/* Ticker Symbol */}
        {width > 55 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2 - 3}
            textAnchor="middle"
            fill={textColor}
            fontSize={width > 100 ? 8 : 6}
            fontWeight="bold"
          >
            {name}
          </text>
        )}
        {/* Change Percentage */}
        {width > 55 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 5}
            textAnchor="middle"
            fill={textColor}
            fontSize={width > 100 ? 7 : 5}
          >
            {changePercent > 0 ? "+" : ""}
            {changePercent?.toFixed(2) ?? "0.00"}%
          </text>
        )}
        {/* Price (if large enough) */}
        {width > 110 && height > 75 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 18}
            textAnchor="middle"
            fill={textColor}
            fontSize={8}
            opacity={0.7}
          >
            ${price?.toFixed(2) ?? "0.00"}
          </text>
        )}
      </g>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const isPositive = data.changePercent >= 0;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <div className="space-y-1">
          <div>
            <p className="font-bold text-sm">{data.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.fullName}
            </p>
          </div>
          <div className="pt-2 space-y-1 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 dark:text-gray-400">Sector:</span>
              <span className="font-medium">{data.sector}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 dark:text-gray-400">Price:</span>
              <span className="font-semibold">
                ${data.price?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 dark:text-gray-400">Change:</span>
              <span
                className={`font-semibold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {data.change?.toFixed(2) ?? "0.00"} ({isPositive ? "+" : ""}
                {data.changePercent?.toFixed(2) ?? "0.00"}%)
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 dark:text-gray-400">
                Market Cap:
              </span>
              <span className="font-medium">{formatMarketCap(data.value)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!data || treemapData.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-gray-400"
        style={{ height }}
      >
        No heatmap data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treemapData}
          dataKey="value"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
          isAnimationActive={false}
          aspectRatio={1}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">&gt;2% Tăng</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">0-2% Tăng</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Không đổi</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">0-2% Giảm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">&gt;2% Giảm</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatMarketCap(value: number): string {
  if (!value || isNaN(value)) return "$0";

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toFixed(0)}`;
}
