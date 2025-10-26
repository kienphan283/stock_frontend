/**
 * ComparisonBarChart Component
 *
 * Biểu đồ so sánh nhiều công ty với animation
 *
 * Features:
 * - 📊 So sánh 2+ công ty cùng lúc
 * - 🎨 Màu chính cho công ty chính, màu nhạt cho comparison
 * - ✨ Animation riêng cho từng nhóm bars
 * - 🔄 Tự động group bars theo metric
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

export interface ComparisonDataPoint {
  period: string;
  [key: string]: string | number;
}

export interface ComparisonBarChartProps {
  data: ComparisonDataPoint[];
  mainCompany: string;
  comparisonCompany: string | null;
  metrics: string[];
  colors?: string[];
  height?: number;
  isStealthMode?: boolean;
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

export default function ComparisonBarChart({
  data,
  mainCompany,
  comparisonCompany,
  metrics,
  colors = DEFAULT_COLORS,
  height = 400,
  isStealthMode = false,
}: ComparisonBarChartProps) {
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

        {metrics.map((metric, index) => {
          const color = colors[index % colors.length];
          const bars = [];

          // Main company bar (màu đậm, animation trước)
          bars.push(
            <Bar
              key={`${mainCompany}-${metric}`}
              dataKey={`${mainCompany}: ${metric}`}
              fill={color}
              name={`${mainCompany}: ${metric}`}
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
              animationBegin={index * 100}
            />
          );

          // Comparison company bar (màu nhạt hơn 50%, animation sau 50ms)
          if (comparisonCompany) {
            bars.push(
              <Bar
                key={`${comparisonCompany}-${metric}`}
                dataKey={`${comparisonCompany}: ${metric}`}
                fill={`${color}80`} // 80 = 50% opacity in hex
                name={`${comparisonCompany}: ${metric}`}
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
                animationBegin={index * 100 + 50}
              />
            );
          }

          return bars;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
