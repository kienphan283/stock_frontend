"use client";

import { Card } from "@/components/ui/Card";
import { Transaction } from "@/types";
import { useStealthMode } from "@/contexts/StealthContext";
import { useState, useEffect } from "react";
import { portfolioService } from '@/services/portfolioService';
import { useRouter, useSearchParams } from 'next/navigation';
import AddTransactionModal from './AddTransactionModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface PortfolioTransactionsProps {
    transactions: Transaction[];
    onRefresh?: () => void;
    portfolioId: string;
}

export default function PortfolioTransactions({ transactions, onRefresh, portfolioId }: PortfolioTransactionsProps) {
    const { formatPrice } = useStealthMode();
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialTab = searchParams.get('tab') as 'trades' | 'incomes' | 'all' | null;
    const initialFilter = searchParams.get('filter') || '';
    const selectTicker = searchParams.get('selectTicker');
    const mode = searchParams.get('mode');

    const [activeTab, setActiveTab] = useState<'trades' | 'incomes' | 'all'>(initialTab || 'trades');
    const [filter, setFilter] = useState(initialFilter);

    const filteredTransactions = transactions.filter(t => {
        // Filter by tab
        if (activeTab === 'trades' && !['BUY', 'SELL'].includes(t.type)) return false;
        if (activeTab === 'incomes' && !['DIVIDEND'].includes(t.type)) return false;

        // Filter by text
        if (filter && !t.ticker?.toLowerCase().includes(filter.toLowerCase())) return false;
        return true;
    });

    const getOperationColor = (type: string) => {
        switch (type) {
            case 'BUY': return 'text-green-500 bg-green-500/10';
            case 'SELL': return 'text-red-500 bg-red-500/10';
            case 'DIVIDEND': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    // State for Modals
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSuccess = () => {
        router.refresh();
        if (onRefresh) onRefresh();
    };

    return (
        <div className="space-y-4">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-8 border-b border-transparent">
                    <button
                        onClick={() => setActiveTab('trades')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'trades' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Trades
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        All
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">

                    <div className="relative group">
                        <button className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors bg-blue-600 hover:bg-blue-500`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>
                            Import
                        </button>
                    </div>
                    <div className="relative group">
                        <button className={`px-3 py-1.5 text-gray-300 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors bg-gray-800 hover:bg-gray-700`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Import history
                        </button>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Export
                    </button>
                </div>
            </div>

            <Card className="!p-0 overflow-hidden bg-[#1E1E2D]">
                {filteredTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="py-3 px-4">Operation</th>
                                    <th className="py-3 px-4">Holding</th>
                                    <th className="py-3 px-4 text-right">Date</th>
                                    <th className="py-3 px-4 text-right">Shares</th>
                                    <th className="py-3 px-4 text-right">Price</th>
                                    <th className="py-3 px-4 text-right">Summ</th>
                                    <th className="py-3 px-4 text-right">Total profit</th>
                                    <th className="py-3 px-4">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredTransactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-gray-800/50 transition-colors group text-sm"
                                    >
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getOperationColor(tx.type)}`}>
                                                {tx.type === 'BUY' && 'Buy'}
                                                {tx.type === 'SELL' && 'Sell'}
                                                {tx.type === 'DIVIDEND' && 'Dividend'}
                                                {tx.type === 'DEPOSIT' && 'Deposit'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {tx.ticker ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{tx.name}</span>
                                                    <span className="text-xs text-gray-500">{tx.ticker}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right text-white">
                                            {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right text-white">
                                            {tx.shares}
                                        </td>
                                        <td className="py-3 px-4 text-right text-white">
                                            {formatPrice(tx.price || 0)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={tx.type === 'BUY' ? 'text-red-400' : 'text-green-400'}>
                                                {tx.type === 'BUY' ? '-' : '+'}{formatPrice(tx.amount)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {tx.totalProfit !== undefined ? (
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-medium ${tx.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {tx.totalProfit >= 0 ? '▲' : '▼'} {((tx.totalProfit / tx.amount) * 100).toFixed(2)}%
                                                    </span>
                                                    <span className={`text-xs ${tx.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {tx.totalProfit >= 0 ? '+' : ''}{formatPrice(tx.totalProfit)}
                                                    </span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {tx.note && (
                                                <svg className="w-4 h-4 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 20 20" title={tx.note}>
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {/* Total Row */}
                                <tr className="border-t border-gray-700 bg-gray-800/30 font-semibold text-sm">
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4 text-white">Total</td>
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4 text-right text-white">
                                        {filteredTransactions.reduce((acc, t) => acc + (t.type === 'BUY' ? (t.shares || 0) : -(t.shares || 0)), 0)}
                                    </td>
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4 text-right text-red-400">
                                        -{formatPrice(filteredTransactions.reduce((acc, t) => acc + (t.type === 'BUY' ? t.amount : 0), 0))}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className={`text-sm font-medium ${filteredTransactions.reduce((acc, t) => acc + (t.totalProfit || 0), 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                                            {filteredTransactions.reduce((acc, t) => acc + (t.totalProfit || 0), 0) >= 0 ? "+" : ""}{formatPrice(filteredTransactions.reduce((acc, t) => acc + (t.totalProfit || 0), 0))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No transactions found.
                    </div>
                )}
            </Card>

            <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 flex items-center gap-2 text-white">
                    25 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <span>See 1-{filteredTransactions.length} from {filteredTransactions.length}</span>
            </div>

            <AddTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleSuccess}
                portfolioName="Current Portfolio"
                portfolioId={portfolioId}
                initialData={editingTransaction}
            />


        </div>
    );
}
