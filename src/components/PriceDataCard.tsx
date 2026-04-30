"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { PriceRow } from "@/lib/prices";

type Props = { publicKey: string; className?: string };
type LoadState = "idle" | "loading" | "loaded" | "error" | "unregistered";

function deriveApiKey(publicKey: string): string {
  const hash = publicKey.slice(2, 18) + publicKey.slice(-8);
  return `pk_${hash.toLowerCase()}`;
}

export function PriceDataCard({ publicKey, className }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFetch = async () => {
    setLoadState("loading");
    setErrorMsg("");
    try {
      const apiKey = deriveApiKey(publicKey);

      const res = await fetch("/api/prices", {
        method: "GET",
        headers: {
          "x-stellar-pubkey": publicKey,
          "x-parallax-apikey": apiKey,
        },
      });

      const json = await res.json();

      if (res.status === 401) {
        if (json.error?.includes("not registered")) {
          setLoadState("unregistered");
        } else {
          setErrorMsg(json.error ?? "Unauthorized");
          setLoadState("error");
        }
        return;
      }

      if (!res.ok) {
        setErrorMsg(json.error ?? "Server error");
        setLoadState("error");
        return;
      }

      setPrices(json.prices ?? []);
      setLoadState("loaded");
    } catch {
      setErrorMsg("Network error — could not reach /api/prices");
      setLoadState("error");
    }
  };

  useEffect(() => {
    if (publicKey) {
      handleFetch();
    }
  }, [publicKey]);

  return (
    <div className={`bg-[#0b0c0e] border border-white/5 rounded-[12px] overflow-hidden flex flex-col w-full max-w-full ${className || ""}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-white/5 flex justify-between items-center gap-3 bg-[#121316]">
            <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#8a8f9e] text-[18px] shrink-0">monitoring</span>
                <h2 className="text-[15px] font-bold text-[#f0f0f2] truncate">Institutional Price Feed</h2>
            </div>
            <button 
                onClick={handleFetch}
                disabled={loadState === "loading"}
                className="shrink-0 px-3 py-2 text-[12px] font-bold text-[#0b0c0e] bg-[#00c8d4] hover:brightness-110 transition-all rounded-[8px] flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
            >
                <span className={`material-symbols-outlined text-[14px] ${loadState === "loading" ? "animate-spin" : ""}`}>sync</span>
                <span className="hidden sm:inline">Fetch Latest</span>
            </button>
        </div>

        <div className="overflow-x-auto w-full min-h-[260px] flex flex-col">
            <AnimatePresence mode="wait">
                {loadState === "loaded" ? (
                    <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left border-collapse min-w-[480px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-[#121316]">
                                <th className="px-3 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#565d70]">Asset</th>
                                <th className="px-3 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#565d70] text-right">Price (USD)</th>
                                <th className="px-3 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#565d70] text-right">Change (24h)</th>
                                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#565d70] text-right">Volume</th>
                                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#565d70] text-right">Oracle Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {prices.map((row, i) => {
                                const isPositive = (i % 2 === 0);
                                const assetCode = row.pair.split('/')[0];
                                const changeVal = ((i + 1) * 1.25).toFixed(2);
                                const volVal = ((5 - i) * 12.4).toFixed(1);

                                return (
                                    <tr key={row.pair} className="hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0">
                                        <td className="px-3 sm:px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-bold text-[#00c8d4]">{assetCode}</span>
                                                </div>
                                                <span className="text-[13px] font-semibold text-[#f0f0f2] truncate">{row.pair}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 text-[13px] text-[#f0f0f2] text-right font-mono">{row.price}</td>
                                        <td className={`px-3 sm:px-6 py-3 text-[13px] text-right font-mono ${isPositive ? 'text-[#4ae176]' : 'text-red-400'}`}>
                                            {isPositive ? '+' : '-'}{changeVal}%
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 text-[13px] text-[#565d70] text-right font-mono">{volVal}M</td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-3 text-right">
                                            <span className="px-2 py-1 bg-[#121316] border border-white/5 rounded-[6px] text-[11px] text-[#8a8f9e]">
                                                {row.source}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </motion.table>
                ) : loadState === "unregistered" ? (
                    <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <span className="material-symbols-outlined text-4xl text-error/80 mb-4">lock</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Access Denied</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                            Generate a Production API Key to unlock real-time institutional price feeds.
                        </p>
                    </motion.div>
                ) : loadState === "error" ? (
                    <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <span className="material-symbols-outlined text-4xl text-error/80 mb-4">error</span>
                        <p className="font-body-md text-body-md text-error max-w-sm">{errorMsg}</p>
                    </motion.div>
                ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-6 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 rounded bg-surface-container animate-pulse" />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}
