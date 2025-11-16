/**
 * Advanced Candlestick Chart Component
 *
 * Hiển thị biểu đồ nến với OHLCV data
 * Features:
 * - 🕯️ Candlestick rendering with green/red colors
 * - 📊 Volume bars below
 * - 📈 Support multiple timeframes
 * - ✨ Smooth animations
 *
 * TODO: Add realtime WebSocket updates
 */

"use client";

import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { CandleBar } from "@/types/market";

export interface CandlestickChartProps {
  data: CandleBar[];
  height?: number;
  showVolume?: boolean;
  showGrid?: boolean;
}

export default function CandlestickChart({
  data,
  height = 500,
  showVolume = true,
  showGrid = true,
}: CandlestickChartProps) {
  // Calculate min/max for Y-axis domain
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 1000000 };
    }

    const prices = data.flatMap((d) => [d.high, d.low]);
    const volumes = data.map((d) => d.volume);

    return {
      minPrice: Math.min(...prices) * 0.998, // 0.2% padding
      maxPrice: Math.max(...prices) * 1.002,
      maxVolume: Math.max(...volumes),
    };
  }, [data]);

  // Format data for display
  const chartData = useMemo(() => {
    return data.map((candle) => ({
      ...candle,
      time: formatTime(candle.time),
      // Add dummy value for XAxis
      _time: new Date(candle.time).getTime(),
    }));
  }, [data]);

  // Custom Candlestick Layer
  const CandlestickLayer = (props: any) => {
    const { xAxisMap, yAxisMap, data: chartData } = props;

    if (!xAxisMap || !yAxisMap || !chartData) return null;

    const xAxis = xAxisMap[0];
    const yAxis = yAxisMap["price"]; // Use price yAxisId

    if (!xAxis || !yAxis) return null;

    const candleWidth = Math.max((xAxis.width / chartData.length) * 0.7, 2);

    return (
      <g>
        {chartData.map((entry: any, index: number) => {
          const { open, high, low, close } = entry;
          const isUp = close >= open;
          const fillColor = isUp ? "#10b981" : "#ef4444"; // green-500 : red-500
          const strokeColor = isUp ? "#059669" : "#dc2626"; // green-600 : red-600

          const x = xAxis.scale(entry._time);
          const candleX = x - candleWidth / 2;

          const yHigh = yAxis.scale(high);
          const yLow = yAxis.scale(low);
          const yOpen = yAxis.scale(open);
          const yClose = yAxis.scale(close);

          const bodyTop = Math.min(yOpen, yClose);
          const bodyBottom = Math.max(yOpen, yClose);
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          return (
            <g key={`candle-${index}`}>
              {/* Wick - from high to low */}
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={yLow}
                stroke={strokeColor}
                strokeWidth={1}
              />
              {/* Candle body */}
              <rect
                x={candleX}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1}
              />
            </g>
          );
        })}
      </g>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    // Guard against undefined values
    if (
      !data ||
      typeof data.open === "undefined" ||
      typeof data.close === "undefined"
    ) {
      return null;
    }

    const isUp = data.close >= data.open;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {formatFullTime(data.time)}
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Open:</span>
            <span className="font-semibold">
              ${data.open?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">High:</span>
            <span className="font-semibold text-green-600">
              ${data.high?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Low:</span>
            <span className="font-semibold text-red-600">
              ${data.low?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Close:</span>
            <span
              className={`font-semibold ${
                isUp ? "text-green-600" : "text-red-600"
              }`}
            >
              ${data.close?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          {showVolume && (
            <div className="flex justify-between gap-4 pt-1 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Volume:</span>
              <span className="font-semibold">{formatVolume(data.volume)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No candle data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
        )}

        {/* X Axis - Time */}
        <XAxis
          dataKey="_time"
          type="number"
          domain={["dataMin", "dataMax"]}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickFormatter={(value) => formatAxisTime(value)}
          interval="preserveStartEnd"
          minTickGap={50}
        />

        {/* Y Axis - Price (Left) */}
        <YAxis
          yAxisId="price"
          orientation="right"
          domain={[minPrice, maxPrice]}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickFormatter={(value) => `$${value?.toFixed(2) ?? "0.00"}`}
          width={70}
        />

        {/* Y Axis - Volume (Hidden, for scaling) */}
        {showVolume && (
          <YAxis
            yAxisId="volume"
            orientation="left"
            domain={[0, maxVolume * 4]}
            hide
          />
        )}

        <Tooltip content={<CustomTooltip />} />

        {/* Volume Bars */}
        {showVolume && (
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#94a3b8"
            opacity={0.3}
            isAnimationActive={false}
          />
        )}

        {/* Custom Candlestick Rendering */}
        <g className="candlesticks">
          <CandlestickLayer />
        </g>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

function formatFullTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

function formatAxisTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatVolume(volume: number): string {
  if (!volume || isNaN(volume)) return "0";

  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(1)}M`;
  } else if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(1)}K`;
  }
  return volume.toString();
}
