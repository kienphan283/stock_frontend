import { Card } from "@/components/ui/Card";
import { useStealthMode } from "@/contexts/StealthContext";
import { useState, useEffect } from "react";
import {
  getFinancials,
  type PeriodType,
  type FinancialDataResponse,
} from "@/lib/api";

interface FinancialsTabProps {
  ticker: string;
}

export default function FinancialsTab({ ticker }: FinancialsTabProps) {
  const { isStealthMode } = useStealthMode();
  const [activeTab, setActiveTab] = useState<"income" | "balance" | "cashflow">(
    "income"
  );
  const [periodType, setPeriodType] = useState<PeriodType>("quarterly");

  // API Data States
  const [incomeStatementData, setIncomeStatementData] =
    useState<FinancialDataResponse | null>(null);
  const [balanceSheetData, setBalanceSheetData] =
    useState<FinancialDataResponse | null>(null);
  const [cashFlowData, setCashFlowData] =
    useState<FinancialDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [income, balance, cashflow] = await Promise.all([
          getFinancials(ticker, "IS", periodType),
          getFinancials(ticker, "BS", periodType),
          getFinancials(ticker, "CF", periodType),
        ]);

        setIncomeStatementData(income);
        setBalanceSheetData(balance);
        setCashFlowData(cashflow);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch financial data"
        );
        console.error("Error fetching financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [ticker, periodType]);

  const formatValue = (value: number | undefined) => {
    if (isStealthMode) return "••••";
    if (value === undefined) return "-";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const getCurrentData = (): FinancialDataResponse | null => {
    switch (activeTab) {
      case "income":
        return incomeStatementData;
      case "balance":
        return balanceSheetData;
      case "cashflow":
        return cashFlowData;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "income":
        return "Income Statement";
      case "balance":
        return "Balance Sheet";
      case "cashflow":
        return "Cash Flow Statement";
      default:
        return "";
    }
  };

  const renderFinancialTable = () => {
    const data = getCurrentData();

    if (!data) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10">
                Line Item
              </th>
              {data.periods.map((period) => (
                <th
                  key={period}
                  className="text-center py-3 px-4 font-medium text-gray-500 min-w-[120px]"
                >
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.data).map(([itemName, values]) => (
              <tr
                key={itemName}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-700 sticky left-0 bg-white">
                  {itemName}
                </td>
                {data.periods.map((period) => (
                  <td
                    key={period}
                    className="py-3 px-4 text-center text-gray-700"
                  >
                    {formatValue(values[period])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Statement Type Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "income"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Income Statement
            </button>
            <button
              onClick={() => setActiveTab("balance")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "balance"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Balance Sheet
            </button>
            <button
              onClick={() => setActiveTab("cashflow")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "cashflow"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cash Flow
            </button>
          </div>

          {/* Period Type Selector */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setPeriodType("quarterly")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                periodType === "quarterly"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setPeriodType("annual")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                periodType === "annual"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </Card>

      {/* Data Card */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {getTabTitle()}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company: {ticker} | Period: {periodType}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error loading financial data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && renderFinancialTable()}

        {!loading && !error && !getCurrentData() && (
          <div className="text-center py-12 text-gray-500">
            <p>No financial data available</p>
          </div>
        )}
      </Card>

      {/* Data Summary Card */}
      {!loading && !error && getCurrentData() && (
        <Card className="p-6 bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-2">Data Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Company</p>
              <p className="font-medium text-gray-900">
                {getCurrentData()?.company}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Statement Type</p>
              <p className="font-medium text-gray-900">
                {getCurrentData()?.type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Periods Available</p>
              <p className="font-medium text-gray-900">
                {getCurrentData()?.periods.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Line Items</p>
              <p className="font-medium text-gray-900">
                {getCurrentData()?.data
                  ? Object.keys(getCurrentData()!.data).length
                  : 0}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
