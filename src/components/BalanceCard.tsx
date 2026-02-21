"use client";

import { motion } from "framer-motion";
import { Coins, RefreshCw, Activity, ArrowDownLeft, ArrowUpRight } from "lucide-react";
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-card rounded-[32px] p-8 relative overflow-hidden group flex flex-col justify-between h-full ${className}`}
        >
            <div className="relative z-10 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Coins size={22} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Testnet Balance</p>
                            <p className="text-base font-bold text-white">Native XLM</p>
                        </div>
                    </div>
                    <button
                        onClick={() => load(true)}
                        disabled={refreshing}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                    >
                        <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3 py-2">
                        <div className="h-10 w-48 bg-white/5 animate-pulse rounded-xl" />
                        <div className="h-5 w-24 bg-white/5 animate-pulse rounded-lg" />
                    </div>
                ) : error ? (
                    <p className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm font-medium">{error}</p>
                ) : (
                    <div className="py-2">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-5xl sm:text-6xl font-black font-grotesk text-white tracking-tight">
                                {balance}
                            </span>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">XLM</span>
                        </div>
                        <p className="text-slate-400 font-medium">≈ ${usdValue} USD</p>
                    </div>
                )}

                {/* Transaction History Section */}
                {!loading && payments.length > 0 && (
                    <div className="mt-6 flex-1 max-h-[520px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Recent Transactions</h4>
                        <div className="space-y-2">
                            {payments.map((p) => {
                                // some payments might be create_account, check if amount exists
                                const amount = p.amount || p.starting_balance || "0";
                                const isReceived = p.to === publicKey || p.account === publicKey; // account is for create
                                const displayAmount = parseFloat(amount).toFixed(2);

                                return (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isReceived ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white"}`}>
                                                {isReceived ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{isReceived ? "Received" : "Sent"}</p>
                                                <p className="text-[10px] text-white/40 font-mono truncate w-24">
                                                    {isReceived ? p.from || p.funder : p.to || "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-bold font-mono ${isReceived ? "text-emerald-400" : "text-white"}`}>
                                            {isReceived ? "+" : "-"}{displayAmount} XLM
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-6 mt-auto pt-6 border-t border-white/5 shrink-0">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Testnet Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wide">
                        <Activity size={14} />
                        <span>Horizon Live</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
