"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Loader2, Lock, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import type { PriceRow } from "@/lib/prices";

type Props = { publicKey: string; className?: string };
type LoadState = "idle" | "loading" | "loaded" | "error" | "unregistered";

/** Must match deriveApiKey in ApiKeyCard.tsx and deriveExpectedApiKey in apiAuth.ts */
function deriveApiKey(publicKey: string): string {
  const hash = publicKey.slice(2, 18) + publicKey.slice(-8);
  return `pk_${hash.toLowerCase()}`;
}

export function PriceDataCard({ publicKey, className }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [servedAt, setServedAt] = useState<string | null>(null);
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
        // Distinguish "not registered" from other auth errors
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
      setServedAt(json.meta?.servedAt ?? null);
      setLoadState("loaded");
    } catch {
      setErrorMsg("Network error — could not reach /api/prices");
      setLoadState("error");
    }
  };

  const timeLabel = servedAt
    ? new Date(servedAt).toLocaleTimeString()
    : null;

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
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Level 5 — Live API</p>
            <p className="text-lg sm:text-xl font-bold text-white">Price Data Feed</p>
          </div>
        </div>
        {timeLabel && (
          <span className="text-[10px] text-white/30 hidden sm:block">
            Updated {timeLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loadState === "loaded" ? (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-[10px] uppercase tracking-widest">
                  <th className="text-left pb-3 font-normal">Pair</th>
                  <th className="text-right pb-3 font-normal">Price</th>
                  <th className="text-right pb-3 font-normal hidden sm:table-cell">Bid</th>
                  <th className="text-right pb-3 font-normal hidden md:table-cell">Ask</th>
                  <th className="text-right pb-3 font-normal hidden lg:table-cell">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {prices.map((row) => (
                  <tr key={row.pair} className="group">
                    <td className="py-3 font-mono font-bold text-white text-xs sm:text-sm">
                      {row.pair}
                    </td>
                    <td className="py-3 text-right font-mono text-cyan-400 text-xs sm:text-sm">
                      {row.price}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400/80 text-xs hidden sm:table-cell">
                      {row.bid}
                    </td>
                    <td className="py-3 text-right font-mono text-red-400/80 text-xs hidden md:table-cell">
                      {row.ask}
                    </td>
                    <td className="py-3 text-right text-[10px] text-white/25 hidden lg:table-cell">
                      {row.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-1">
                <Zap size={9} className="text-cyan-500" />
                Stellar DEX + CoinGecko — Live
              </span>
              <button
                onClick={handleFetch}
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
              Generate your API Key above to unlock live price feeds.
            </p>
          </motion.div>

        ) : loadState === "error" ? (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-3"
          >
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            <button
              onClick={() => setLoadState("idle")}
              className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={10} /> Try again
            </button>
          </motion.div>

        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-6"
          >
            <div className="space-y-2 w-full mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-8 rounded-lg bg-white/3 ${loadState === "loading" ? "animate-pulse" : ""}`} />
              ))}
            </div>
            <p className="text-white/30 text-xs mb-1">
              {loadState === "loading" ? "Fetching from /api/prices…" : "Real-time prices from Stellar DEX"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fetch Button */}
      {loadState !== "loaded" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFetch}
          disabled={loadState === "loading"}
          className="mt-4 w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-600/80 to-violet-600/80 text-white flex items-center justify-center gap-3 hover:from-cyan-600 hover:to-violet-600 transition-all disabled:opacity-60"
        >
          {loadState === "loading" ? (
            <><Loader2 size={16} className="animate-spin" /> Calling /api/prices…</>
          ) : (
            <>Fetch Live Prices</>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
