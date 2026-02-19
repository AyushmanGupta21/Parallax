"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, LogOut, Copy, CheckCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { WalletState } from "@/hooks/useFreighter";

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
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-blue-500/20 text-slate-400 text-sm">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500/50 border-t-transparent animate-spin" />
                Checking...
            </div>
        );
    }

    if (!wallet.isInstalled) {
        return (
            <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary text-white text-sm font-medium relative z-10"
            >
                <ExternalLink size={15} />
                Install Freighter
            </a>
        );
    }

    if (!wallet.isConnected) {
        return (
            <motion.button
                id="connect-wallet-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConnect}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full btn-primary text-white text-sm font-semibold relative z-10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Wallet size={16} />
                        Connect Wallet
                    </>
                )}
            </motion.button>
        );
    }

    return (
        <div className="relative z-50">
            <motion.button
                id="wallet-menu-btn"
                whileHover={{ scale: 1.02 }}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-strong border border-blue-500/30 text-sm font-medium"
            >
                {/* Status dot */}
                <span className="w-2 h-2 rounded-full bg-emerald-400 blink" />
                <span className="text-slate-300 font-mono-custom text-xs">
                    {truncate(wallet.publicKey!)}
                </span>
                {wallet.network && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs uppercase">
                        {wallet.network}
                    </span>
                )}
                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
            </motion.button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl p-1 shadow-2xl border border-blue-500/20"
                    >
                        <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-xs text-slate-500 mb-1">Connected Address</p>
                            <p className="text-xs font-mono-custom text-slate-300 break-all">
                                {wallet.publicKey}
                            </p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition-colors"
                        >
                            {copied ? <CheckCheck size={15} className="text-emerald-400" /> : <Copy size={15} />}
                            {copied ? "Copied!" : "Copy Address"}
                        </button>
                        <button
                            id="disconnect-wallet-btn"
                            onClick={() => { onDisconnect(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={15} />
                            Disconnect
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
