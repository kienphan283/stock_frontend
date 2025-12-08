// API and application constants
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
export const DEFAULT_TICKER = "AAPL";
export const ITEMS_PER_PAGE = 20;

// Stock tabs
export const STOCK_TABS = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "community", label: "Community" },
] as const;

export type StockTabId = (typeof STOCK_TABS)[number]["id"];
