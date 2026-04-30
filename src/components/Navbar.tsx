"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { WalletButton } from "./WalletButton";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname() || "/";
    const [isConnecting, setIsConnecting] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { wallet, connect, disconnect } = useWallet();

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connect();
        } finally {
            setIsConnecting(false);
        }
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/transfer", label: "Transfer" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "https://developers.stellar.org/docs", label: "Docs", external: true },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-8 h-[64px] bg-[#0b0c0e]/90 backdrop-blur-[24px] border-b border-white/5">
                {/* Brand Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
                        <Image src="/logo.jpeg" alt="Parallax Logo" width={30} height={30} className="rounded-[6px] transform group-hover:scale-105 transition-transform" />
                        <span className="text-[18px] font-bold tracking-wide text-[#f0f0f2]">Parallax</span>
                    </Link>
                </div>

                {/* Desktop Center Links */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-[36px]">
                    {navLinks.map((link) =>
                        link.external ? (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13.5px] font-medium transition-colors text-[#8a8f9e] hover:text-[#f0f0f2] flex items-center gap-1"
                            >
                                {link.label}
                                <span className="material-symbols-outlined text-[11px] opacity-60">open_in_new</span>
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[13.5px] font-medium transition-colors ${pathname === link.href ? "text-[#f0f0f2]" : "text-[#8a8f9e] hover:text-[#f0f0f2]"}`}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-[6px] px-[10px] py-[4px] bg-white/[0.03] border border-white/10 rounded-full">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#4ae176] shadow-[0_0_6px_rgba(74,225,118,0.5)]" />
                        <span className="text-[12px] font-medium text-[#8a8f9e]">Testnet</span>
                    </div>
                    <WalletButton
                        wallet={wallet}
                        onConnect={handleConnect}
                        onDisconnect={() => { void disconnect(); }}
                        isLoading={isConnecting}
                    />
                </div>

                {/* Mobile: wallet status + hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    {/* Compact wallet indicator on mobile */}
                    {wallet.isConnected && (
                        <div className="flex items-center gap-[5px] px-2 py-1 bg-white/[0.04] border border-white/10 rounded-full">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#00c8d4]" />
                            <span className="text-[11px] font-medium text-[#8a8f9e] max-w-[70px] truncate">
                                {wallet.publicKey?.slice(0, 4)}…{wallet.publicKey?.slice(-4)}
                            </span>
                        </div>
                    )}
                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-[8px] bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-colors"
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            className="block w-[16px] h-[1.5px] bg-[#f0f0f2] rounded-full origin-center"
                        />
                        <motion.span
                            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="block w-[16px] h-[1.5px] bg-[#f0f0f2] rounded-full"
                        />
                        <motion.span
                            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            className="block w-[16px] h-[1.5px] bg-[#f0f0f2] rounded-full origin-center"
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        {/* Drawer Panel */}
                        <motion.div
                            key="drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed top-[64px] right-0 bottom-0 z-[99] w-[min(280px,85vw)] bg-[#0d0e11] border-l border-white/5 flex flex-col md:hidden overflow-y-auto"
                        >
                            {/* Nav Links */}
                            <div className="flex flex-col p-4 gap-1 border-b border-white/5">
                                {navLinks.map((link) =>
                                    link.external ? (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[15px] font-medium transition-all text-[#8a8f9e] hover:text-[#f0f0f2] hover:bg-white/[0.04]"
                                        >
                                            {link.label}
                                            <span className="ml-auto material-symbols-outlined text-[13px] opacity-50">open_in_new</span>
                                        </a>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-[15px] font-medium transition-all ${
                                                pathname === link.href
                                                    ? "bg-white/[0.06] text-[#f0f0f2]"
                                                    : "text-[#8a8f9e] hover:text-[#f0f0f2] hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            {link.label}
                                            {pathname === link.href && (
                                                <span className="ml-auto w-[6px] h-[6px] rounded-full bg-[#00c8d4]" />
                                            )}
                                        </Link>
                                    )
                                )}
                            </div>

                            {/* Status + Wallet */}
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-[10px]">
                                    <div className="w-[7px] h-[7px] rounded-full bg-[#4ae176] shadow-[0_0_6px_rgba(74,225,118,0.5)]" />
                                    <span className="text-[13px] font-medium text-[#8a8f9e]">Testnet Active</span>
                                </div>
                                <WalletButton
                                    wallet={wallet}
                                    onConnect={async () => {
                                        await handleConnect();
                                        setMobileOpen(false);
                                    }}
                                    onDisconnect={() => { void disconnect(); setMobileOpen(false); }}
                                    isLoading={isConnecting}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
