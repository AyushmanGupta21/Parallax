"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchXLMBalance, fetchRecentPayments } from "@/lib/stellar";

type Props = { publicKey: string; className?: string };

export function BalanceCard({ publicKey, className }: Props) {
    const [balance, setBalance] = useState<string | null>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [bal, recentPayments] = await Promise.all([
                fetchXLMBalance(publicKey),
                fetchRecentPayments(publicKey)
            ]);
            setBalance(bal);
            setPayments(recentPayments);
        } catch {
            setError("Failed to fetch balance.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [publicKey]);

    useEffect(() => { load(); }, [load]);

    const usdValue = balance ? (parseFloat(balance) * 0.11).toFixed(2) : null;

    return (
        <div className={`flex flex-col gap-6 ${className || ""}`}>
            {/* Balance Card */}
            <div className="bg-[#0b0c0e] border border-white/5 rounded-[12px] p-5 sm:p-8 relative overflow-hidden shrink-0 shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[90px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-[12px] text-[#8a8f9e] uppercase tracking-[0.1em]">Available Liquidity</h3>
                        <button
                            onClick={() => load(true)}
                            disabled={refreshing}
                            className="w-8 h-8 rounded-[8px] bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined text-[16px] text-[#8a8f9e] ${refreshing ? "animate-spin" : ""}`}>sync</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-2 py-2">
                            <div className="h-10 w-40 bg-white/5 animate-pulse rounded" />
                            <div className="h-4 w-24 bg-white/5 animate-pulse rounded mt-2" />
                        </div>
                    ) : error ? (
                        <p className="text-red-400 font-medium text-[14px] py-4">{error}</p>
                    ) : (
                        <div className="py-2">
                            <div className="font-mono text-[36px] font-bold text-[#f0f0f2] tracking-tight mb-1 flex items-baseline gap-2">
                                {balance} <span className="text-[16px] text-[#8a8f9e] font-sans font-medium">XLM</span>
                            </div>
                            {usdValue && (
                                <div className="text-[14px] font-medium text-[#8a8f9e]">≈ ${usdValue} USD</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-[#0b0c0e] border border-white/5 rounded-[12px] p-5 sm:p-8 flex flex-col shadow-lg">
                <div className="mb-4 shrink-0">
                    <h3 className="font-bold text-[11px] text-[#8a8f9e] uppercase tracking-[0.15em]">Recent Transactions</h3>
                </div>

                {loading ? (
                    <div className="space-y-3 mt-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[68px] rounded-[12px] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-grow text-center">
                        <span className="material-symbols-outlined text-[40px] text-white/10 mb-3">history</span>
                        <p className="text-[14px] font-medium text-[#8a8f9e]">No recent transactions</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto pr-2 space-y-[12px] max-h-[320px] styled-scrollbar">
                        {payments.map((p) => {
                            const amt = p.amount || p.starting_balance || "0";
                            const isReceived = p.to === publicKey || p.account === publicKey;
                            const displayAmount = parseFloat(amt).toFixed(2);
                            const rawCounterparty = isReceived ? (p.from || p.funder || "") : (p.to || "");
                            
                            const counterparty = rawCounterparty
                                ? ((rawCounterparty).slice(0, 15) + "...")
                                : "Unknown";

                            return (
                                <div key={p.id} className="bg-[#121316] border border-white/5 rounded-[12px] p-[16px] flex items-center justify-between hover:bg-[#16181d] transition-colors group">
                                    <div className="flex items-center gap-[16px]">
                                        <div className="w-[42px] h-[42px] rounded-full bg-[#1c1d21] flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                                            <span className={`material-symbols-outlined text-[18px] ${isReceived ? "text-[#00c8d4]" : "text-[#f0f0f2]"}`}>
                                                {isReceived ? "south_west" : "north_east"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="font-bold text-[15px] text-[#f0f0f2] leading-tight mb-[2px]">
                                                {isReceived ? "Received" : "Sent"}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#565d70]">
                                                {counterparty}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-mono text-[14px] font-bold ${isReceived ? "text-[#00c8d4]" : "text-[#f0f0f2]"}`}>
                                        {isReceived ? "+" : "-"}{displayAmount} XLM
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
