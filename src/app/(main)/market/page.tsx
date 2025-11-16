/**
 * Market Overview Page
 *
 * Dashboard chính hiển thị toàn bộ thị trường
 * Layout theo FireAnt design:
 * - Header: 4 market indices (SPY, QQQ, DIA, IWM)
 * - Content Layout (3 columns):
 *   - Left (35%): Candlestick chart - Full Height
 *   - Center (50%):
 *       TOP (60%): Market Status (pie + bar ngang)
 *       BOTTOM (40%): Heatmap
 *   - Right (35%): Featured news - Full Height
 *
 * TODO: Add WebSocket connections for realtime updates
 */

"use client";

import React, { useState } from "react";
import {
  IndexHeader,
  CandlestickPanel,
  MarketStatusPanel,
  HeatmapPanel,
} from "@/components/market";
import FeaturedNewsPanel from "@/components/market/FeaturedNewsPanel";

export default function MarketOverviewPage() {
  const [selectedIndex, setSelectedIndex] = useState<string>("SPY");

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* ===================================
          MAIN CONTENT - Fit to viewport
          =================================== */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 lg:px-6 xl:px-8 py-3 flex flex-col overflow-hidden">
        {/* Page Title */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Market Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time market data and analysis
          </p>
        </div>

        {/* 3 Column Layout: (Candlestick + Indices) | (MarketStatus + Heatmap) | News */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
          {/* LEFT COLUMN: Candlestick + Indices Below (35% = 4/12) */}
          <div className="lg:col-span-4 flex flex-col gap-2 overflow-hidden">
            {/* Candlestick Chart - Reduced height */}
            <div className="flex-1 min-h-0">
              <CandlestickPanel initialTicker={selectedIndex} />
            </div>

            {/* Market Indices - Fixed height */}
            <div className="h-[280px]">
              <IndexHeader onIndexSelect={setSelectedIndex} />
            </div>
          </div>

          {/* CENTER COLUMN: Market Status + Heatmap (50% = 6/12) */}
          <div className="lg:col-span-6 flex flex-col overflow-hidden">
            {/* Market Status - 55% height */}
            <div className="h-[55%] mb-2">
              <MarketStatusPanel />
            </div>

            {/* Heatmap - 45% height */}
            <div className="flex-1 min-h-0">
              <HeatmapPanel />
            </div>
          </div>

          {/* RIGHT COLUMN: Featured News (35% = 2/12) */}
          <div className="lg:col-span-2 overflow-hidden">
            <FeaturedNewsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
