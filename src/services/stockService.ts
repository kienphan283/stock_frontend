// Stock service - API calls for stock data
import { apiRequest, PYTHON_API_URL } from "./apiBase";
import type {
  Stock,
  DividendEvent,
  NewsArticle,
  FinancialDataResponse,
  StatementType,
  PeriodType,
} from "@/types";

export interface PriceChangeData {
  ticker: string;
  currentPrice: number;
  previousClose: number;
  absoluteChange: number;
  percentageChange: number;
}

export const stockService = {
  /**
   * Get all stocks
   */
  async getStocks(): Promise<Stock[]> {
    return apiRequest<Stock[]>("/api/stocks");
  },

  /**
   * Get single stock by ticker
   */
  async getStock(ticker: string): Promise<Stock> {
    return apiRequest<Stock>(`/api/stocks/${ticker}`);
  },

  /**
   * Get dividend events for a stock
   */
  async getDividends(ticker: string): Promise<DividendEvent[]> {
    return apiRequest<DividendEvent[]>(`/api/dividends/${ticker}`);
  },

  /**
   * Get all dividend calendar events
   */
  async getAllDividends(): Promise<DividendEvent[]> {
    return apiRequest<DividendEvent[]>("/api/dividends");
  },

  /**
   * Get financial data for a stock
   */
  async getFinancials(
    company: string,
    type: StatementType,
    period: PeriodType
  ): Promise<FinancialDataResponse> {
    // Map frontend types to backend API types
    const typeMapping: Record<StatementType, string> = {
      income: "IS",
      balance: "BS",
      cash: "CF",
    };

    const params = new URLSearchParams({
      company,
      type: typeMapping[type],
      period,
    });

    return apiRequest<FinancialDataResponse>(`/api/financials?${params}`);
  },

  /**
   * Get news for a stock
   */
  async getNews(ticker: string): Promise<NewsArticle[]> {
    return apiRequest<NewsArticle[]>(`/api/news/${ticker}`);
  },

  /**
   * Search stocks
   */
  async searchStocks(query: string): Promise<Stock[]> {
    return apiRequest<Stock[]>(
      `/api/stocks/search?q=${encodeURIComponent(query)}`
    );
  },

  /**
   * Get price change data for a stock (from FastAPI)
   */
  async getPriceChange(ticker: string): Promise<PriceChangeData> {
    const response = await fetch(`${PYTHON_API_URL}/api/stocks/${ticker}/price-change`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price change for ${ticker}`);
    }
    return response.json();
  },

  /**
   * Get real-time quote for a stock
   */
  async getQuote(ticker: string): Promise<any> {
    return apiRequest<any>(`/api/stocks/${ticker}/quote`);
  },
};
