"use client";

import { STOCK_TABS, StockTabId } from "@/constants";

interface StockTabNavigationProps {
  activeTab: StockTabId;
  onTabChange: (tabId: StockTabId) => void;
}

export default function StockTabNavigation({
  activeTab,
  onTabChange,
}: StockTabNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-6">
        <nav className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {STOCK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as StockTabId)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
