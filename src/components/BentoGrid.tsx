"use client";

import { motion } from "framer-motion";
import { BalanceCard } from "./BalanceCard";
import { SendXLMForm } from "./SendXLMForm";
import { ApiKeyCard } from "./ApiKeyCard";
import { PriceDataCard } from "./PriceDataCard";
import { useWallet } from "@/hooks/useWallet";
import { Shield, Activity, Globe, Zap } from "lucide-react";

export function BentoGrid() {
  const { wallet, connect } = useWallet();

  return (
    <section id="dashboard" className="px-4 sm:px-6 py-16 sm:py-20 max-w-7xl mx-auto">
      {/* ── Row 1: Network Status + Global + Wallet/Balance ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">

        {/* Card 1: Network Status */}
        <motion.div
          className="glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[240px] sm:min-h-[280px]"
          whileHover={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <Activity size={22} className="text-white" />
            </div>
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/50">
              System Health
            </div>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-anton text-white uppercase leading-none mb-2">Testnet<br />Live</h3>
            <p className="font-serif italic text-white/50 text-sm sm:text-base">Horizon Protocol 21.0</p>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
            <div className="w-full h-full bg-emerald-500 animate-pulse origin-left" />
          </div>
        </motion.div>

        {/* Card 2: Global Coverage */}
        <motion.div
          className="glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group bg-[#0a0a0a] min-h-[240px] sm:min-h-[280px]"
          whileHover={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-20" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <Globe size={22} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">45ms</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-anton text-white uppercase leading-none mb-2">Global<br />Coverage</h3>
            <p className="text-xs text-white/40 font-outfit uppercase tracking-widest">
              San Francisco • Frankfurt • Singapore
            </p>
          </div>
        </motion.div>

        {/* Card 3: Wallet / Balance (tall) */}
        <div className="sm:col-span-2 lg:col-span-1">
          {!wallet.isConnected ? (
            <motion.div
              className="glass-card rounded-[32px] p-6 sm:p-8 h-full min-h-[280px] flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer"
              onClick={connect}
              whileHover={{ scale: 0.98 }}
            >
              <div className="mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Shield size={40} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-4xl sm:text-5xl font-anton text-white uppercase mb-4">Connect<br />Wallet</h3>
              <p className="font-serif italic text-white/50 text-lg sm:text-xl max-w-[200px]">
                Unlock the developer console.
              </p>
              <div className="mt-6 px-6 sm:px-8 py-3 bg-white text-black font-bold rounded-full uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors">
                Authenticate
              </div>
            </motion.div>
          ) : (
            <BalanceCard publicKey={wallet.publicKey!} className="h-full min-h-[280px]" />
          )}
        </div>
      </div>

      {/* ── Row 2: Send Form + API Key Card ── */}
      {wallet.isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <SendXLMForm publicKey={wallet.publicKey!} className="h-full" />
          <ApiKeyCard className="h-full" />
        </div>
      )}

      {/* ── Row 3: Price Data (full width when connected) ── */}
      {wallet.isConnected && (
        <div>
          <PriceDataCard publicKey={wallet.publicKey!} className="h-full" />
        </div>
      )}

      {/* Disconnected placeholder rows */}
      {!wallet.isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[0, 1].map((i) => (
            <motion.div key={i} className="glass-card rounded-[32px] min-h-[240px] flex items-center justify-center p-8 bg-[#080808]">
              <p className="text-white/20 font-anton text-3xl sm:text-4xl uppercase tracking-wide text-center">
                Authentication<br />Required
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
