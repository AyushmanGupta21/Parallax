"use client";

import { ApiKeyCard } from "@/components/ApiKeyCard";
import { PriceDataCard } from "@/components/PriceDataCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useWallet } from "@/hooks/useWallet";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import ShinyText from "@/components/ShinyText";

export default function Dashboard() {
    const { wallet, connect } = useWallet();

    if (!wallet.isConnected) {
        return (
            <div className="w-full flex-grow flex items-center justify-center min-h-[70vh] max-w-[1440px] mx-auto px-4 sm:px-8 pt-[80px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0b0c0e] border border-white/5 rounded-[16px] p-8 sm:p-12 w-full max-w-[480px] flex flex-col items-center text-center shadow-lg"
                >
                    {/* Icon */}
                    <div className="w-[72px] h-[72px] rounded-full bg-[#00c8d4]/10 border border-[#00c8d4]/20 flex items-center justify-center mb-8">
                        <Shield className="w-8 h-8 text-[#00c8d4]" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h2 className="text-[28px] font-bold text-[#f0f0f2] mb-3 tracking-tight">
                        Authentication Required
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[15px] text-[#8a8f9e] leading-relaxed mb-10 max-w-[320px]">
                        Connect your wallet to access the API Terminal and institutional data feeds.
                    </p>

                    {/* Connect Button */}
                    <button
                        onClick={connect}
                        className="w-full py-4 px-6 bg-[#00c8d4] text-[#0b0c0e] font-bold text-[14px] uppercase tracking-widest rounded-[10px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(0,200,212,0.25)] flex items-center justify-center gap-2"
                    >
                        <Shield className="w-4 h-4" strokeWidth={2.5} />
                        Connect Wallet
                    </button>

                    {/* Footnote */}
                    <p className="mt-6 text-[12px] text-[#565d70]">
                        Stellar Testnet · Non-custodial · Secure
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-5 sm:gap-6 pb-16 sm:pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 pt-[90px] sm:pt-[100px] overflow-x-hidden">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 border-b border-white/5 pb-5">
                <div>
                    <h1 className="text-[26px] sm:text-[34px] font-bold text-[#f0f0f2] mb-1">
                        <ShinyText text="API &amp; Webhooks" speed={3} />
                    </h1>
                    <p className="text-[13px] sm:text-[14px] text-[#8a8f9e] max-w-2xl">
                        Manage your programmatic access, monitor smart contract synchronization, and inspect live data feeds from the Stellar Mainnet.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-[8px] border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse" />
                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a8f9e]">Live Sync</span>
                    </div>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="flex flex-col xl:flex-row gap-5 sm:gap-6">
                {/* Left Column: Data Feeds & Status */}
                <div className="w-full xl:flex-1 flex flex-col gap-5 sm:gap-6">
                    {/* Contract Status Strip */}
                    <div className="bg-[#0b0c0e] border border-white/5 rounded-[12px] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#00c8d4]/10 rounded-[10px] border border-[#00c8d4]/20 shrink-0">
                                <span className="material-symbols-outlined text-[#00c8d4] text-2xl">hub</span>
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#565d70] mb-1">Network Status</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px] font-bold text-[#f0f0f2]">Stellar Mainnet</span>
                                    <span className="px-2 py-0.5 bg-[#4ae176]/10 text-[#4ae176] text-[11px] font-bold rounded-full border border-[#4ae176]/20">ACTIVE</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-white/10" />
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#565d70] mb-1">Protocol Version</h3>
                            <span className="text-[15px] font-medium text-[#f0f0f2]">Smart Contract: V2.1.0</span>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-white/10" />
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#565d70] mb-1">Latency</h3>
                            <span className="text-[16px] font-bold text-[#00c8d4] font-mono">12ms</span>
                        </div>
                    </div>

                    {/* Price Feed Table */}
                    <PriceDataCard publicKey={wallet.publicKey!} />
                </div>

                {/* Right Column: Controls & Keys */}
                <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-5 sm:gap-6">
                    <ApiKeyCard />

                    {/* Webhook Configuration */}
                    <div className="bg-[#0b0c0e] border border-white/5 rounded-[12px] p-6 flex-grow">
                        <h2 className="text-[16px] font-bold text-[#f0f0f2] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#8a8f9e] text-[18px]">webhook</span>
                            <ShinyText text="Webhook Endpoints" speed={3} />
                        </h2>
                        <div className="space-y-3">
                            <div className="p-4 bg-[#121316] border border-white/5 rounded-[8px]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[14px] font-medium text-[#f0f0f2]">Liquidity Events</span>
                                    <span className="w-2 h-2 rounded-full bg-[#4ae176]" />
                                </div>
                                <div className="text-[12px] text-[#565d70] font-mono truncate">
                                    https://api.parallax.finance/webhooks/events
                                </div>
                            </div>
                            <button className="w-full py-2.5 px-4 border border-dashed border-white/15 hover:border-white/30 text-[#8a8f9e] hover:text-[#f0f0f2] text-[13px] rounded-[8px] transition-all flex justify-center items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Add Endpoint
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Row: Activity Feed Terminal */}
            <div className="mt-4">
                <ActivityFeed />
            </div>
        </div>
    );
}
