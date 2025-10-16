import {
  Stock,
  PortfolioPosition,
  ApiResponse,
  FinancialDataResponse,
  StatementType,
  PeriodType,
  FinancialDataRequest,
} from '../types/shared'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const PYTHON_API_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;
  private pythonApiUrl: string;

  constructor(baseUrl: string, pythonApiUrl: string) {
    this.baseUrl = baseUrl;
    this.pythonApiUrl = pythonApiUrl;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data: ApiResponse<T> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || "Unknown API error");
    }
    return data.data;
  }

  async getStocks(): Promise<Stock[]> {
    return this.request<Stock[]>("/api/stocks");
  }

  async getStock(ticker: string): Promise<Stock> {
    return this.request<Stock>(`/api/stocks/${ticker}`);
  }

  async getPortfolio(): Promise<PortfolioPosition[]> {
    return this.request<PortfolioPosition[]>("/api/portfolio");
  }

  // New: Financial Data API
  async getFinancials(
    company: string,
    type: StatementType,
    period: PeriodType
  ): Promise<FinancialDataResponse> {
    const params = new URLSearchParams({
      company,
      type,
      period,
    });

    const response = await fetch(
      `${this.pythonApiUrl}/api/financials?${params}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch financial data");
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(BACKEND_URL, PYTHON_API_URL);

export const getStocks = () => apiClient.getStocks();
export const getStock = (ticker: string) => apiClient.getStock(ticker);
export const getPortfolio = () => apiClient.getPortfolio();
export const getFinancials = (
  company: string,
  type: StatementType,
  period: PeriodType
) => apiClient.getFinancials(company, type, period);
