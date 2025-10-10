'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { useStealthMode } from '@/contexts/StealthContext'
import { Stock } from '../../types/shared'

interface OverviewTabProps {
  stock: Stock
}

export default function OverviewTab({ stock }: OverviewTabProps) {
  const { formatPrice, formatNumber, isStealthMode } = useStealthMode()
  const [selectedPeriod, setSelectedPeriod] = useState('1y')

  const portfolioData = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 195,
      avgCost: 156.88,
      currentPrice: 258.305,
      returns: 19797.83,
      returnsPercent: 64.65,
      totalValue: 50370.48
    }
  ]

  const faqQuestions = [
    "What sector does Apple Inc (AAPL) operate in?",
    "What is Apple Inc (AAPL) current stock price?",
    "What is Apple Inc (AAPL) current market capitalization?",
    "What is Apple Inc (AAPL) price-to-earnings ratio?",
    "What is Apple Inc (AAPL) price-to-book ratio?",
    "What is Apple Inc (AAPL) current P/E ratio?",
    "What is Apple Inc (AAPL) PEG ratio?",
    "How does Apple Inc (AAPL) perform vs its most recent earnings report?",
    "What does Apple Inc (AAPL) company do?",
    "What is Apple Inc (AAPL) book value/equity ratio?"
  ]

  return (
    <div className="space-y-8">
      {/* Main Layout - Chart + Sidebar */}
      <div className="flex gap-8">
        {/* Left Side - Price History Chart */}
        <div className="flex-1">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Price history</h3>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['7d', '1m', '3m', '6m', 'YTD', '1y', '5y', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period || period === '1y'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart with gradient fill */}
            <div className="relative h-80">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
                  </linearGradient>
                </defs>
                
                {/* Chart area with gradient fill */}
                <path
                  d="M50,250 L100,240 L150,200 L200,180 L250,160 L300,120 L350,140 L400,110 L450,90 L500,80 L550,60 L600,45 L650,40 L700,35 L750,30 L750,280 L50,280 Z"
                  fill="url(#chartGradient)"
                />
                
                {/* Chart line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  points="50,250 100,240 150,200 200,180 250,160 300,120 350,140 400,110 450,90 500,80 550,60 600,45 650,40 700,35 750,30"
                />
                
                {/* Current price dot */}
                <circle cx="750" cy="30" r="4" fill="#3B82F6" />
                
                {/* Performance indicator */}
                <text x="720" y="50" fill="#22C55E" fontSize="12" textAnchor="end">+11.36%</text>
              </svg>
              
              {/* Date range and performance */}
              <div className="absolute bottom-4 left-4 text-sm text-gray-600">
                Oct 10, 24 - Oct 10, 25
              </div>
              <div className="absolute bottom-4 right-4 text-sm text-green-600 flex items-center">
                <span>📈 +11.36%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - Statistics Sidebar */}
        <div className="w-80 space-y-6">
          {/* Benchmarks */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Benchmarks</h4>
              <button className="text-blue-600 text-sm">Select</button>
            </div>
          </Card>

          {/* Estimate */}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">Estimate</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">P/E</span>
                <span className="font-medium">39.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPS</span>
                <span className="font-medium">6.58</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Beta</span>
                <span className="font-medium">1.165</span>
              </div>
            </div>
          </Card>

          {/* Growth */}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">Growth</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue, YoY</span>
                <span className="font-medium">9.63%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net income, YoY</span>
                <span className="font-medium">9.26%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FCF, YoY</span>
                <span className="font-medium text-red-600">-8.62%</span>
              </div>
            </div>
          </Card>

          {/* Forecast */}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">Forecast</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">P/E (FWD)</span>
                <span className="font-medium">32.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPS (FWD)</span>
                <span className="font-medium">7.944</span>
              </div>
            </div>
          </Card>

          {/* Dividends */}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">Dividends</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend yield</span>
                <span className="font-medium">0.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual payout</span>
                <span className="font-medium">$1.04</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next ex. div date</span>
                <span className="font-medium">November 11, 25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payout</span>
                <span className="font-medium">15.47%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Div.growth, 5y</span>
                <span className="font-medium">4.99%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend growth streak</span>
                <span className="font-medium">1 year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Div.rating</span>
                <span className="font-medium text-green-600">81</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* My Position */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">My position</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-3">STOCK PORTFOLIO</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Avg cost</th>
                <th className="pb-3">Returns</th>
                <th className="pb-3">Current</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <div>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-sm text-gray-500">{item.name}</div>
                    </div>
                  </td>
                  <td className="py-4">{item.quantity} shares</td>
                  <td className="py-4">${item.avgCost.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="text-green-600">
                      <div>${item.returns.toLocaleString()}</div>
                      <div className="text-sm">+{item.returnsPercent}%</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="font-medium">${item.currentPrice}</div>
                      <div className="text-sm text-gray-500">${item.totalValue.toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* About the company */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">About the company</h3>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.
          </p>
          <p>
            The company also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. In addition, it offers various services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a mobile payment service, as well as licenses its intellectual property.
          </p>
          <p>
            The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.
          </p>
        </div>
      </Card>

      {/* FAQ */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">Frequently asked questions</h3>
        <div className="space-y-4">
          {[
            "What sector does Apple Inc (AAPL) operate in?",
            "What is Apple Inc (AAPL) current stock price?",
            "What is Apple Inc (AAPL) current market capitalization?",
            "What is Apple Inc (AAPL) price-to-earnings ratio?",
            "What is Apple Inc (AAPL) price-to-book ratio?",
            "What is Apple Inc (AAPL) current P/E ratio?",
            "What is Apple Inc (AAPL) PEG ratio?",
            "How does Apple Inc (AAPL) perform vs its most recent earnings report?",
            "What does Apple Inc (AAPL) company do?",
            "What is Apple Inc (AAPL) book value/equity ratio?"
          ].map((question, index) => (
            <div key={index} className="border-b pb-3">
              <button className="text-left w-full flex justify-between items-center text-gray-800 hover:text-blue-600 transition-colors">
                <span>{question}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
