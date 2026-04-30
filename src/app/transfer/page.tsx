"use client";

import { SendXLMForm } from "@/components/SendXLMForm";
import { BalanceCard } from "@/components/BalanceCard";
import { useWallet } from "@/hooks/useWallet";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import ShinyText from "@/components/ShinyText";

export default function Transfer() {
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
                        Connect your wallet to access the secure transfer interface and route liquidity.
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
        <div className="w-full flex flex-col gap-6 sm:gap-8 pb-16 sm:pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 pt-[90px] sm:pt-[100px] overflow-x-hidden">
            {/* Page Header */}
            <header className="mb-2 border-b border-white/5 pb-5">
                <h1 className="text-[28px] sm:text-[38px] font-bold text-[#f0f0f2] mb-2">
                    <ShinyText text="Execute Transfer" speed={3} />
                </h1>
                <p className="text-[14px] sm:text-[16px] text-[#8a8f9e]">
                    Securely route liquidity across institutional networks.
                </p>
            </header>

            {/* Main Layout Grid */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Left Panel: Transfer Form */}
                <div className="w-full lg:w-2/3 shrink-0">
                    <SendXLMForm publicKey={wallet.publicKey!} />
                </div>

                {/* Right Panel: Balance + Recent Transactions */}
                <div className="w-full lg:w-1/3 shrink-0 flex flex-col">
                    <BalanceCard publicKey={wallet.publicKey!} />
                </div>
            </div>
        </div>
    );
}
