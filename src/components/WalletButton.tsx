"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WalletState } from "@/hooks/useWallet";

type Props = {
    wallet: WalletState;
    onConnect: () => Promise<void>;
    onDisconnect: () => void;
    isLoading: boolean;
};

function truncate(key: string) {
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

export function WalletButton({ wallet, onConnect, onDisconnect, isLoading }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (wallet.publicKey) {
            navigator.clipboard.writeText(wallet.publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (wallet.isChecking) {
        return (
            <div className="flex items-center gap-[8px] px-[16px] py-[6px] text-[13px] font-medium bg-transparent border border-white/10 text-[#8a8f9e] rounded-[6px]">
                <div className="w-[12px] h-[12px] rounded-full border-[2px] border-[#8a8f9e]/50 border-t-transparent animate-spin" />
                Checking...
            </div>
        );
    }

    if (!wallet.isConnected) {
        return (
            <button
                id="connect-wallet-btn"
                onClick={onConnect}
                disabled={isLoading}
                className="px-[16px] py-[8px] text-[13px] font-bold text-[#0b0c0e] bg-gradient-to-r from-[#8aebff] to-[#00c8d4] border-none rounded-[6px] hover:brightness-110 shadow-[0_0_15px_rgba(0,200,212,0.3)] hover:shadow-[0_0_25px_rgba(0,200,212,0.5)] transition-all whitespace-nowrap flex items-center gap-[8px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="w-[12px] h-[12px] rounded-full border-[2px] border-[#0d0e10]/40 border-t-[#0d0e10] animate-spin" />
                        Connecting...
                    </>
                ) : (
                    "Connect Wallet"
                )}
            </button>
        );
    }

    return (
        <div className="relative z-50">
            <button
                id="wallet-menu-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[6px] text-[13px] font-medium bg-[#13151a] border border-white/10 text-[#f0f0f2] hover:bg-[#161820] transition-colors active:scale-95"
            >
                <span className="w-[8px] h-[8px] rounded-full bg-[#22c55e] animate-pulse" />
                <span className="font-mono text-[12px]">
                    {truncate(wallet.publicKey!)}
                </span>
                <svg className="w-[14px] h-[14px] text-[#8a8f9e] transition-transform" style={{ transform: menuOpen ? "rotate(180deg)" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-[#13151a] border border-white/10 rounded-lg p-2 shadow-2xl"
                    >
                        <div className="px-3 py-3 border-b border-white/5 mb-2">
                            <p className="text-[10px] font-bold tracking-[0.05em] text-[#8a8f9e] uppercase mb-1">Connected Address</p>
                            <p className="text-xs font-mono text-[#f0f0f2] break-all">
                                {wallet.publicKey}
                            </p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-[#f0f0f2] hover:bg-white/5 transition-colors"
                        >
                            <svg className={`w-4 h-4 ${copied ? 'text-[#22c55e]' : 'text-[#8a8f9e]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {copied ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                )}
                            </svg>
                            {copied ? "Copied!" : "Copy Address"}
                        </button>
                        <button
                            id="disconnect-wallet-btn"
                            onClick={() => { onDisconnect(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors mt-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Disconnect
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
