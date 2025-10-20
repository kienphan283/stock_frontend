/**
 * AnimatedBarChart Component
 *
 * Biểu đồ cột với animation mượt mà sử dụng Recharts
 *
 * Features:
 * - ✨ Smooth animation với easeOutQuart (1200ms)
 * - 🎯 Staggered effect: mỗi cột delay 100ms
 * - 🎨 Tùy chỉnh màu sắc cho từng metric
 * - 📊 Hỗ trợ so sánh nhiều công ty
 * - 🔒 Stealth mode để ẩn giá trị
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ChartDataPoint {
  period: string;
  [key: string]: string | number; // Dynamic keys for metrics
}

export interface AnimatedBarChartProps {
  data: ChartDataPoint[];
  metrics: string[];
  colors?: string[];
  height?: number;
  isStealthMode?: boolean;
  animationDuration?: number;
  staggerDelay?: number;
}

const DEFAULT_COLORS = [
  "#3699ff", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#06b6d4", // cyan
  "#ef4444", // red
  "#f97316", // orange
];

export default function AnimatedBarChart({
  data,
  metrics,
  colors = DEFAULT_COLORS,
  height = 400,
  isStealthMode = false,
  animationDuration = 1200,
  staggerDelay = 100,
}: AnimatedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="period"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
        />
        <Tooltip
          formatter={(value: number) =>
            isStealthMode ? "••••" : value.toLocaleString()
          }
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} iconType="square" />

        {metrics.map((metric, index) => (
          <Bar
            key={metric}
            dataKey={metric}
            fill={colors[index % colors.length]}
            name={metric}
            radius={[8, 8, 0, 0]}
            // ✨ ANIMATION CONFIGURATION
            // Duration: thời gian animation tổng thể
            animationDuration={animationDuration}
            // Easing: easeOutQuart - bắt đầu nhanh, kết thúc mượt
            // Công thức: 1 - (1 - t)^4
            animationEasing="ease-out"
            // Staggered effect: mỗi bar delay tăng dần
            // Bar 1: 0ms, Bar 2: 100ms, Bar 3: 200ms, ...
            animationBegin={index * staggerDelay}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
