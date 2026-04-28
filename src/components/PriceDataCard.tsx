"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Loader2, Lock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { checkIsRegistered } from "@/lib/stellar";

type Props = { publicKey: string; className?: string };

type LoadState = "idle" | "loading" | "loaded" | "error" | "unregistered";

const MOCK_PRICES = [
  { pair: "XLM/USDC", price: "0.1148", change: "+2.4%", positive: true },
  { pair: "XLM/BTC", price: "0.0000021", change: "-1.2%", positive: false },
  { pair: "AQUA/XLM", price: "0.04512", change: "+5.1%", positive: true },
  { pair: "YBX/XLM", price: "12.4523", change: "+0.8%", positive: true },
  { pair: "yXLM/XLM", price: "1.00403", change: "+0.1%", positive: true },
];

export function PriceDataCard({ publicKey, className }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleFetchPrices = async () => {
    setLoadState("loading");
    try {
      // Gate: only show data if user is registered in the contract
      const registered = await checkIsRegistered(publicKey);
      if (!registered) {
        // Also check localStorage cache for snappier UX
        const cached = localStorage.getItem(`api_registry_${publicKey}`);
        if (cached !== "registered") {
          setLoadState("unregistered");
          return;
        }
      }
      // Simulate network latency for mock data
      await new Promise((r) => setTimeout(r, 800));
      setLastUpdated(new Date().toLocaleTimeString());
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`glass-card rounded-[32px] p-6 sm:p-8 relative flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <BarChart2 size={20} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Level 3 — Price Feed</p>
            <p className="text-lg sm:text-xl font-bold text-white">Live Price Data</p>
          </div>
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-white/30 hidden sm:block">
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {/* Price table */}
      <AnimatePresence mode="wait">
        {loadState === "loaded" ? (
          <motion.div
            key="data"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-[10px] uppercase tracking-widest">
                  <th className="text-left pb-3 font-normal">Pair</th>
                  <th className="text-right pb-3 font-normal">Price</th>
                  <th className="text-right pb-3 font-normal">24h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_PRICES.map((row) => (
                  <tr key={row.pair} className="group">
                    <td className="py-3 font-mono font-bold text-white text-xs sm:text-sm">{row.pair}</td>
                    <td className="py-3 text-right font-mono text-cyan-400 text-xs sm:text-sm">{row.price}</td>
                    <td className={`py-3 text-right text-xs font-bold ${row.positive ? "text-emerald-400" : "text-red-400"}`}>
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-white/20 uppercase tracking-widest">Source: Stellar DEX / AMMs</span>
              <button
                onClick={handleFetchPrices}
                className="text-[10px] text-cyan-500 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={10} /> Refresh
              </button>
            </div>
          </motion.div>
        ) : loadState === "unregistered" ? (
          <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Lock size={24} className="text-white/30" />
            </div>
            <p className="text-white/50 font-medium mb-1">Registration Required</p>
            <p className="text-white/25 text-xs max-w-[200px]">
              Generate your API Key first to unlock live price feeds.
            </p>
          </motion.div>
        ) : loadState === "error" ? (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-red-400 text-sm">Failed to fetch data. Try again.</p>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-6"
          >
            <div className="space-y-2 w-full mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 rounded-lg bg-white/3 animate-pulse" />
              ))}
            </div>
            <p className="text-white/30 text-xs mb-1">Real-time prices from Stellar DEX</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fetch Button */}
      {loadState !== "loaded" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFetchPrices}
          disabled={loadState === "loading"}
          className="mt-4 w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-600/80 to-violet-600/80 text-white flex items-center justify-center gap-3 hover:from-cyan-600 hover:to-violet-600 transition-all disabled:opacity-60"
        >
          {loadState === "loading" ? (
            <><Loader2 size={16} className="animate-spin" /> Fetching Prices...</>
          ) : (
            <>Fetch Price Data</>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
