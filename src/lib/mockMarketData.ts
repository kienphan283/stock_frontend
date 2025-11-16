/**
 * Mock Market Data Generators
 *
 * Tạo mock data cho Market Overview Dashboard
 * TODO: Remove khi WebSocket integration hoàn thiện
 */

import type {
  MarketIndex,
  CandleBar,
  HeatmapData,
  MarketStatus,
  StockHeatmapItem,
  SectorGroup,
  TimeframeType,
  FeaturedNews,
} from "@/types/market";

// ==========================================
// MOCK MARKET INDICES
// ==========================================

const US_INDICES = [
  { code: "SPY", name: "S&P 500 ETF", basePrice: 467.84 },
  { code: "QQQ", name: "NASDAQ-100", basePrice: 387.23 },
  { code: "DIA", name: "Dow Jones", basePrice: 350.15 },
  { code: "IWM", name: "Russell 2000", basePrice: 212.56 },
];

export function generateMockIndices(): MarketIndex[] {
  return US_INDICES.map((index) => {
    const changePercent = (Math.random() - 0.45) * 2; // -0.9% to 1.1%
    const change = index.basePrice * (changePercent / 100);
    const price = index.basePrice + change;

    return {
      code: index.code,
      name: index.name,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 30000000,
      high: Number((price * 1.005).toFixed(2)),
      low: Number((price * 0.995).toFixed(2)),
      sparklineData: generateSparkline(price, changePercent, 50),
      timestamp: new Date().toISOString(),
    };
  });
}

function generateSparkline(
  currentPrice: number,
  changePercent: number,
  points: number
): number[] {
  const data: number[] = [];
  const startPrice = currentPrice * (1 - changePercent / 100);
  const priceRange = currentPrice - startPrice;

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    // Thêm random noise để realistic
    const noise = (Math.random() - 0.5) * priceRange * 0.1;
    const price = startPrice + priceRange * progress + noise;
    data.push(Number(price.toFixed(2)));
  }

  return data;
}

// ==========================================
// MOCK CANDLESTICK BARS
// ==========================================

export function generateMockCandles(
  ticker: string,
  timeframe: TimeframeType,
  count: number,
  basePrice: number = 150
): CandleBar[] {
  const candles: CandleBar[] = [];
  const now = new Date();

  // Tính interval dựa trên timeframe
  const intervalMs = getIntervalMs(timeframe);

  let currentPrice = basePrice;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now.getTime() - i * intervalMs;
    const time = new Date(timestamp).toISOString();

    // Generate OHLC with realistic movements
    const volatility = basePrice * 0.002; // 0.2% volatility
    const change = (Math.random() - 0.5) * volatility * 2;

    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    const volume = Math.floor(Math.random() * 1000000) + 100000;
    const vwap = (open + high + low + close) / 4;

    candles.push({
      timestamp,
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      vwap: Number(vwap.toFixed(2)),
      tradeCount: Math.floor(Math.random() * 500) + 50,
    });

    currentPrice = close; // Next candle starts where this one closed
  }

  return candles;
}

function getIntervalMs(timeframe: TimeframeType): number {
  const intervals: Record<TimeframeType, number> = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "1D": 24 * 60 * 60 * 1000,
  };
  return intervals[timeframe];
}

// ==========================================
// MOCK HEATMAP DATA
// ==========================================

const US_SECTORS = [
  { sector: "Technology", displayName: "Công nghệ", color: "#3b82f6" },
  { sector: "Financials", displayName: "Tài chính", color: "#10b981" },
  { sector: "Healthcare", displayName: "Y tế", color: "#ef4444" },
  { sector: "Consumer", displayName: "Tiêu dùng", color: "#f59e0b" },
  { sector: "Energy", displayName: "Năng lượng", color: "#8b5cf6" },
  { sector: "Industrials", displayName: "Công nghiệp", color: "#ec4899" },
  { sector: "Materials", displayName: "Nguyên liệu", color: "#14b8a6" },
  { sector: "Real Estate", displayName: "Bất động sản", color: "#f97316" },
];

const SAMPLE_STOCKS = [
  // Technology
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    basePrice: 189.5,
    marketCap: 3000,
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    sector: "Technology",
    basePrice: 378.9,
    marketCap: 2800,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet",
    sector: "Technology",
    basePrice: 141.8,
    marketCap: 1800,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    sector: "Technology",
    basePrice: 495.2,
    marketCap: 1200,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    sector: "Technology",
    basePrice: 330.5,
    marketCap: 850,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    sector: "Technology",
    basePrice: 242.8,
    marketCap: 770,
  },

  // Financials
  {
    ticker: "JPM",
    name: "JPMorgan Chase",
    sector: "Financials",
    basePrice: 152.3,
    marketCap: 450,
  },
  {
    ticker: "BAC",
    name: "Bank of America",
    sector: "Financials",
    basePrice: 34.2,
    marketCap: 280,
  },
  {
    ticker: "WFC",
    name: "Wells Fargo",
    sector: "Financials",
    basePrice: 48.5,
    marketCap: 180,
  },
  {
    ticker: "GS",
    name: "Goldman Sachs",
    sector: "Financials",
    basePrice: 385.7,
    marketCap: 130,
  },

  // Healthcare
  {
    ticker: "UNH",
    name: "UnitedHealth",
    sector: "Healthcare",
    basePrice: 528.3,
    marketCap: 500,
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    basePrice: 156.8,
    marketCap: 380,
  },
  {
    ticker: "PFE",
    name: "Pfizer",
    sector: "Healthcare",
    basePrice: 28.4,
    marketCap: 160,
  },
  {
    ticker: "ABBV",
    name: "AbbVie",
    sector: "Healthcare",
    basePrice: 175.9,
    marketCap: 310,
  },

  // Consumer
  {
    ticker: "AMZN",
    name: "Amazon",
    sector: "Consumer",
    basePrice: 145.7,
    marketCap: 1500,
  },
  {
    ticker: "WMT",
    name: "Walmart",
    sector: "Consumer",
    basePrice: 167.3,
    marketCap: 450,
  },
  {
    ticker: "HD",
    name: "Home Depot",
    sector: "Consumer",
    basePrice: 345.2,
    marketCap: 350,
  },
  {
    ticker: "MCD",
    name: "McDonald's",
    sector: "Consumer",
    basePrice: 293.8,
    marketCap: 210,
  },

  // Energy
  {
    ticker: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    basePrice: 112.5,
    marketCap: 480,
  },
  {
    ticker: "CVX",
    name: "Chevron",
    sector: "Energy",
    basePrice: 158.3,
    marketCap: 310,
  },
  {
    ticker: "COP",
    name: "ConocoPhillips",
    sector: "Energy",
    basePrice: 118.7,
    marketCap: 140,
  },

  // Industrials
  {
    ticker: "BA",
    name: "Boeing",
    sector: "Industrials",
    basePrice: 175.4,
    marketCap: 110,
  },
  {
    ticker: "CAT",
    name: "Caterpillar",
    sector: "Industrials",
    basePrice: 345.8,
    marketCap: 180,
  },
  {
    ticker: "GE",
    name: "General Electric",
    sector: "Industrials",
    basePrice: 125.3,
    marketCap: 140,
  },

  // Materials
  {
    ticker: "LIN",
    name: "Linde",
    sector: "Materials",
    basePrice: 425.6,
    marketCap: 210,
  },
  {
    ticker: "APD",
    name: "Air Products",
    sector: "Materials",
    basePrice: 278.4,
    marketCap: 62,
  },

  // Real Estate
  {
    ticker: "PLD",
    name: "Prologis",
    sector: "Real Estate",
    basePrice: 128.5,
    marketCap: 120,
  },
  {
    ticker: "AMT",
    name: "American Tower",
    sector: "Real Estate",
    basePrice: 198.7,
    marketCap: 90,
  },
];

export function generateMockHeatmap(): HeatmapData {
  const stocks: StockHeatmapItem[] = SAMPLE_STOCKS.map((stock) => {
    const changePercent = (Math.random() - 0.45) * 6; // -2.7% to 3.3%
    const change = stock.basePrice * (changePercent / 100);
    const price = stock.basePrice + change;

    return {
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      marketCap: stock.marketCap * 1_000_000_000, // Billions to actual value
      volume: Math.floor(Math.random() * 50000000) + 1000000,
    };
  });

  // Group by sector
  const sectorMap = new Map<string, StockHeatmapItem[]>();
  stocks.forEach((stock) => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector)!.push(stock);
  });

  const sectors: SectorGroup[] = US_SECTORS.map((sectorInfo) => {
    const sectorStocks = sectorMap.get(sectorInfo.sector) || [];
    const totalMarketCap = sectorStocks.reduce(
      (sum, s) => sum + s.marketCap,
      0
    );
    const avgChange =
      sectorStocks.length > 0
        ? sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) /
          sectorStocks.length
        : 0;

    return {
      sector: sectorInfo.sector,
      displayName: sectorInfo.displayName,
      color: sectorInfo.color,
      stocks: sectorStocks,
      totalMarketCap,
      avgChange: Number(avgChange.toFixed(2)),
    };
  }).filter((sector) => sector.stocks.length > 0);

  return {
    sectors,
    totalStocks: stocks.length,
    lastUpdate: new Date().toISOString(),
  };
}

// ==========================================
// MOCK MARKET STATUS
// ==========================================

export function generateMockMarketStatus(): MarketStatus {
  const totalStocks = SAMPLE_STOCKS.length;
  const advancing = Math.floor(totalStocks * (0.4 + Math.random() * 0.2)); // 40-60%
  const declining = Math.floor(totalStocks * (0.3 + Math.random() * 0.2)); // 30-50%
  const unchanged = totalStocks - advancing - declining;

  return {
    advancing,
    declining,
    unchanged,
    cashFlow: {
      advancing: Number((Math.random() * 8000 + 4000).toFixed(2)), // 4-12 tỷ $
      declining: Number((Math.random() * 6000 + 2000).toFixed(2)), // 2-8 tỷ $
      unchanged: Number((Math.random() * 2000 + 500).toFixed(2)), // 0.5-2.5 tỷ $
    },
    foreignTrading: {
      buy: Number((Math.random() * 500 + 200).toFixed(2)),
      sell: Number((Math.random() * 500 + 200).toFixed(2)),
      net: Number(((Math.random() - 0.5) * 300).toFixed(2)),
    },
    timestamp: new Date().toISOString(),
  };
}

// ==========================================
// MOCK DATA EXPORTS
// ==========================================

// ==========================================
// MOCK FEATURED NEWS
// ==========================================

const NEWS_TITLES = [
  "Cập nhật mới nhất về lệ năm giữ của khối ngoại",
  "Dòn bẩy vốn cho tăng trưởng",
  "EU đạt thỏa thuận tạm thời về ngân sách năm 2026",
  "Canada đầu tư 1,4 tỷ USD mở rộng đường ống dẫn dầu xuất khẩu",
  "Vàng và bitcoin tiếp tục được xem như 'tài sản' trước biến động thị trường",
  "Ngại xếp hàng, người dân đổ xô mua bạc 'trao tay'",
  "Fed dự kiến duy trì lãi suất ổn định trong quý I/2026",
  "Thị trường châu Á phục hồi nhờ tín hiệu tích cực từ Trung Quốc",
  "Giá dầu tăng mạnh sau quyết định cắt giảm sản xuất của OPEC+",
  "Cổ phiếu công nghệ dẫn dắt đà tăng của phố Wall",
];

const NEWS_THUMBNAILS = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=300&h=200&fit=crop",
];

const NEWS_SOURCES = [
  "Bloomberg",
  "Reuters",
  "CNBC",
  "Financial Times",
  "Wall Street Journal",
];
const NEWS_CATEGORIES: FeaturedNews["category"][] = [
  "market",
  "economy",
  "stock",
  "commodity",
  "crypto",
];

export function generateMockNews(): FeaturedNews[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const publishedAt = new Date(now.getTime() - i * 3600000); // 1 hour intervals
    return {
      id: `news-${i + 1}`,
      title: NEWS_TITLES[i % NEWS_TITLES.length],
      thumbnail: NEWS_THUMBNAILS[i % NEWS_THUMBNAILS.length],
      source: NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)],
      publishedAt: publishedAt.toISOString(),
      category:
        NEWS_CATEGORIES[Math.floor(Math.random() * NEWS_CATEGORIES.length)],
    };
  });
}

/**
 * Pre-generated mock data for quick access
 * Refresh mỗi 5-10 giây trong development
 */
export const MOCK_DATA = {
  indices: generateMockIndices(),
  candles: {
    SPY: generateMockCandles("SPY", "1m", 390, 467.84),
    QQQ: generateMockCandles("QQQ", "1m", 390, 387.23),
    DIA: generateMockCandles("DIA", "1m", 390, 350.15),
    IWM: generateMockCandles("IWM", "1m", 390, 212.56),
  },
  heatmap: generateMockHeatmap(),
  status: generateMockMarketStatus(),
  news: generateMockNews(),
};

/**
 * Refresh mock data
 * Call này để update mock data mới
 */
export function refreshMockData() {
  MOCK_DATA.indices = generateMockIndices();
  MOCK_DATA.heatmap = generateMockHeatmap();
  MOCK_DATA.status = generateMockMarketStatus();
  MOCK_DATA.news = generateMockNews();
  // Không refresh candles vì quá nặng
}
