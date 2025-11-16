/**
 * Candlestick Panel Component
 *
 * Panel bên trái hiển thị biểu đồ nến
 * Features:
 * - Ticker selector
 * - Timeframe selector
 * - Volume display
 *
 * TODO: WebSocket realtime candle updates
 */

"use client";

import React, { useState, useEffect } from "react";
import type { CandlestickDataset, TimeframeType } from "@/types/market";
import { marketService } from "@/services/marketService";
import CandlestickChart from "@/components/charts/CandlestickChart";

const TIMEFRAMES: { label: string; value: TimeframeType }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "1D", value: "1D" },
];

const TICKERS = [
  { code: "SPY", name: "S&P 500" },
  { code: "QQQ", name: "NASDAQ-100" },
  { code: "DIA", name: "Dow Jones" },
  { code: "IWM", name: "Russell 2000" },
];

export interface CandlestickPanelProps {
  initialTicker?: string;
}

export default function CandlestickPanel({
  initialTicker = "SPY",
}: CandlestickPanelProps) {
  const [selectedTicker, setSelectedTicker] = useState(initialTicker);
  const [timeframe, setTimeframe] = useState<TimeframeType>("1m");
  const [dataset, setDataset] = useState<CandlestickDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCandles();

    // TODO: Replace with WebSocket
    // const ws = new CandleWebSocket(
    //   selectedTicker,
    //   timeframe,
    //   (updatedCandle) => {
    //     // Update current candle or add new candle
    //     setDataset((prev) => {
    //       if (!prev) return prev;
    //       const bars = [...prev.bars];
    //       const lastBar = bars[bars.length - 1];
    //
    //       if (lastBar.timestamp === updatedCandle.timestamp) {
    //         // Update existing candle
    //         bars[bars.length - 1] = updatedCandle;
    //       } else {
    //         // Add new candle
    //         bars.push(updatedCandle);
    //       }
    //
    //       return { ...prev, bars };
    //     });
    //   }
    // );
    // ws.connect();
    // return () => ws.disconnect();
  }, [selectedTicker, timeframe]);

  async function loadCandles() {
    setIsLoading(true);
    try {
      const data = await marketService.getCandles(selectedTicker, timeframe);
      setDataset(data);
    } catch (error) {
      console.error("Failed to load candles:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Biểu đồ nến
          </h3>
          {dataset && !isLoading && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {dataset.bars.length} bars
            </span>
          )}
        </div>

        {/* Ticker Selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {TICKERS.map((ticker) => (
            <button
              key={ticker.code}
              onClick={() => setSelectedTicker(ticker.code)}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${
                  selectedTicker === ticker.code
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              {ticker.code}
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`
                flex-1 px-2 py-1 rounded text-xs font-medium transition-colors
                ${
                  timeframe === tf.value
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                }
              `}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-4 overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading candles...
              </p>
            </div>
          </div>
        ) : dataset && dataset.bars.length > 0 ? (
          <CandlestickChart
            data={dataset.bars}
            height={480}
            showVolume={true}
            showGrid={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <p className="text-sm">No candle data available</p>
          </div>
        )}
      </div>

      {/* Footer - Info */}
      {dataset && !isLoading && dataset.bars.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>
              {/* TODO: Replace with WebSocket live indicator */}
              {/* {dataset.isLive ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              ) : ( */}
              <span>Mock Data</span>
              {/* )} */}
            </span>
            <span>
              Last update: {new Date(dataset.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
