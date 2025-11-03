/**
 * PriceHistoryChart Component
 *
 * Biểu đồ lịch sử giá cổ phiếu với animation mượt mà sử dụng Recharts
 *
 * Features:
 * - 📈 Line chart với area fill gradient
 * - 🎯 Hiển thị min/max price với đường reference
 * - ✨ Smooth animation
 * - 🔒 Stealth mode để ẩn giá trị
 * - 📊 Tooltip hiển thị thông tin chi tiết
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
  Dot,
  Customized,
  Scatter,
} from "recharts";

export interface PriceDataPoint {
  date: string; // Format: "2024-11-01" or "Nov '24"
  price: number; // Close price (for line chart)
  open?: number; // For candlestick
  high?: number; // For candlestick
  low?: number; // For candlestick
  close?: number; // For candlestick
}

export type ChartType = "line" | "candlestick";

export interface PriceHistoryChartProps {
  data: PriceDataPoint[];
  height?: number;
  isStealthMode?: boolean;
  showMinMax?: boolean; // Hiển thị đường min/max
  animationDuration?: number;
  color?: string;
  period?: string; // Period để điều chỉnh tick interval
  chartType?: ChartType; // Line or candlestick
  onChartTypeChange?: (type: ChartType) => void; // Callback for chart type change
}

export default function PriceHistoryChart({
  data,
  height = 400,
  isStealthMode = false,
  showMinMax = true,
  animationDuration = 1500,
  color = "#3B82F6", // blue-500
  period = "1m",
  chartType = "line",
  onChartTypeChange,
}: PriceHistoryChartProps) {
  // Tính toán interval để chia đều ticks
  const getTickInterval = () => {
    const dataLength = data.length;
    if (dataLength <= 1) return 0;
    
    // Số tick tối đa mong muốn cho mỗi period
    const maxTicks: Record<string, number> = {
      "1d": 8,
      "5d": 5,
      "1m": 8,    // 8 tick cho 1 tháng
      "3m": 8,    // 8 tick cho 3 tháng  
      "6m": 6,    // 6 tick cho 6 tháng
      "1y": 12,   // 12 tick cho 1 năm
      "5y": 10,   // 10 tick cho 5 năm
      "max": 8,
    };
    
    const maxDesired = maxTicks[period] || 8;
    
    // Nếu data ít hơn hoặc bằng maxTicks, hiển thị hết
    if (dataLength <= maxDesired) {
      return 0; // Show all ticks
    }
    
    // Tính interval để có đúng số tick mong muốn
    // Công thức: interval = floor(dataLength / maxTicks) - 1
    const interval = Math.ceil(dataLength / maxDesired) - 1;
    
    return Math.max(0, interval);
  };

  // Format date cho trục X dựa trên period
  const formatXAxisDate = (dateStr: string) => {
    if (dateStr.includes("'")) return dateStr;
    
    try {
      const date = new Date(dateStr + 'T00:00:00');
      
      // Format khác nhau cho từng period
      switch (period) {
        case "1d":
        case "5d":
          // Hiển thị ngày đầy đủ: "Oct 31"
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        
        case "1m":
        case "3m":
          // Hiển thị ngày: "Oct 31"
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        
        case "6m":
        case "1y":
          // Hiển thị tháng/năm: "Oct 2024"
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        
        case "5y":
        case "max":
          // Hiển thị năm: "2024"
          return date.toLocaleDateString("en-US", {
            year: "numeric",
          });
        
        default:
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
      }
    } catch {
      return dateStr;
    }
  };

  // Tính min/max price - cần tính từ high/low cho candlestick
  const getMinMaxPrices = () => {
    if (chartType === "candlestick") {
      // For candlestick: use high/low values
      const highs = data.map((d) => d.high || d.price);
      const lows = data.map((d) => d.low || d.price);
      return {
        min: Math.min(...lows),
        max: Math.max(...highs),
      };
    } else {
      // For line chart: use close price
      const prices = data.map((d) => d.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
  };

  const { min: minPrice, max: maxPrice } = getMinMaxPrices();
  const currentPrice = data[data.length - 1]?.price || 0;

  // Tính toán domain để chia đều các mốc
  const calculateNiceDomain = () => {
    const range = maxPrice - minPrice;
    const padding = range * 0.1; // 10% padding
    const domainMin = minPrice - padding;
    const domainMax = maxPrice + padding;
    
    // Làm tròn đẹp cho min/max
    const niceMin = Math.floor(domainMin / 10) * 10;
    const niceMax = Math.ceil(domainMax / 10) * 10;
    
    return [niceMin, niceMax];
  };

  const [yMin, yMax] = calculateNiceDomain();

  // Format price cho tooltip và labels
  const formatPrice = (value: number) => {
    if (isStealthMode) return "••••";
    return `$${value.toFixed(2)}`;
  };

  // Format date cho tooltip
  const formatDate = (dateStr: string) => {
    // Nếu đã format sẵn dạng "Nov '24" thì giữ nguyên
    if (dateStr.includes("'")) return dateStr;
    
    // Convert "2024-11-01" → "Nov 01, 2024"
    try {
      // Thêm 'T00:00:00' để tránh timezone issues
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Custom tooltip for both line and candlestick
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      if (chartType === "candlestick" && data.open !== undefined) {
        // Candlestick tooltip with OHLC
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-xs text-gray-600 mb-2">{formatDate(data.date)}</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Open:</span>
                <span className="font-semibold text-gray-900">{formatPrice(data.open)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">High:</span>
                <span className="font-semibold text-green-600">{formatPrice(data.high)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Low:</span>
                <span className="font-semibold text-red-600">{formatPrice(data.low)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Close:</span>
                <span className="font-semibold text-gray-900">{formatPrice(data.close || data.price)}</span>
              </div>
            </div>
          </div>
        );
      }

      // Line chart tooltip
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-xs text-gray-600 mb-1">{formatDate(data.date)}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(data.price)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot cho điểm cuối (current price)
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    // Chỉ hiển thị dot cho điểm cuối cùng
    if (index === data.length - 1) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill={color}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      );
    }
    return <></>;
  };

  // Custom Candlestick Layer
  const CandlestickLayer = (props: any) => {
    const { xAxisMap, yAxisMap, data, width, height } = props;

    if (!xAxisMap || !yAxisMap || !data || data.length === 0) return null;

    const xAxis = xAxisMap[0];
    const yAxis = yAxisMap[0];

    if (!xAxis || !yAxis) return null;

    // Limit max candle width to prevent overflow, especially for small datasets
    const candleWidth = Math.min(Math.max((width / data.length) * 0.6, 2), 12);

    return (
      <g>
        {data.map((entry: any, index: number) => {
          if (!entry.open || !entry.high || !entry.low) return null;

          const { open, high, low, close } = entry;
          const actualClose = close || entry.price;

          const isUp = actualClose >= open;
          const fillColor = isUp ? "#10b981" : "#ef4444"; // green-500 : red-500
          const strokeColor = isUp ? "#059669" : "#dc2626"; // green-600 : red-600

          // Calculate X position
          const xValue = xAxis.scale(entry.date);
          const x = xValue - candleWidth / 2;

          // Calculate Y positions
          const yHigh = yAxis.scale(high);
          const yLow = yAxis.scale(low);
          const yOpen = yAxis.scale(open);
          const yClose = yAxis.scale(actualClose);

          // Candle body
          const bodyTop = Math.min(yOpen, yClose);
          const bodyBottom = Math.max(yOpen, yClose);
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          // Wick position
          const wickX = xValue;

          return (
            <g key={`candle-${index}`}>
              {/* Wick - from high to low */}
              <line
                x1={wickX}
                y1={yHigh}
                x2={wickX}
                y2={yLow}
                stroke={strokeColor}
                strokeWidth={1}
              />
              {/* Candle body - from open to close */}
              <rect
                x={x}
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        {/* X Axis */}
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
          interval={getTickInterval()}
          tickFormatter={formatXAxisDate}
        />

        {/* Y Axis */}
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
          tickFormatter={formatPrice}
          domain={[yMin, yMax]}
          tickCount={8}
          allowDataOverflow={false}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Reference lines cho min/max */}
        {showMinMax && !isStealthMode && (
          <>
            <ReferenceLine
              y={maxPrice}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Max: ${formatPrice(maxPrice)}`,
                position: "insideTopRight",
                fill: "#059669",
                fontSize: 11,
                fontWeight: 500,
                dy: -15,
              }}
            />
            <ReferenceLine
              y={minPrice}
              stroke="#ef4444"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Min: ${formatPrice(minPrice)}`,
                position: "insideBottomRight",
                fill: "#dc2626",
                fontSize: 11,
                fontWeight: 500,
                dy: 15,
              }}
            />
          </>
        )}

        {/* Conditional rendering based on chart type */}
        {chartType === "candlestick" ? (
          <>
            <Customized component={CandlestickLayer} />
            {/* Invisible scatter to enable tooltip on hover */}
            <Scatter
              dataKey="close"
              fill="transparent"
              isAnimationActive={false}
            />
          </>
        ) : (
          <>
            {/* Area fill với gradient */}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="linear"
              dataKey="price"
              fill="url(#priceGradient)"
              stroke="none"
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />

            {/* Line chart */}
            <Line
              type="linear"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={CustomDot}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
