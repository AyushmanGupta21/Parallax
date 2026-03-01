"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Moon, Command } from "lucide-react";
import Image from "next/image";
import { useFreighter } from "@/hooks/useFreighter";
import { WalletButton } from "./WalletButton";

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const { wallet, connect, disconnect } = useFreighter();

    // Map scroll range to animation values
    const dividerWidth = useTransform(scrollY, [0, 100], ["200px", "0px"]);
    const dividerOpacity = useTransform(scrollY, [0, 80], [1, 0]);
    const dividerPadding = useTransform(scrollY, [0, 100], ["20px", "0px"]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);

            const dashboard = document.getElementById("dashboard");
            if (dashboard) {
                // Buffer of 150px so it switches right before the section hits the exact top
                if (currentScrollY >= dashboard.offsetTop - 150) {
                    setActiveTab("dashboard");
                } else {
                    setActiveTab("home");
                }
            } else {
                if (currentScrollY > 400) setActiveTab("dashboard");
                else setActiveTab("home");
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Run once on mount to establish initial state correctly
        handleScroll();

        // Also respect hash if present
        if (typeof window !== "undefined" && window.location.hash) {
            setActiveTab(window.location.hash.replace("#", ""));
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-[100] flex justify-center px-4 pt-6 pointer-events-none"
        >
            <div className="w-full flex items-center justify-between max-w-[98%] relative">
                {/* Left Side: Logo */}
                <div className="flex items-center gap-5 pointer-events-auto transition-opacity duration-300">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="overflow-hidden w-[70px] h-[70px] flex items-center justify-center shrink-0"><Image src="/logo.jpeg" alt="Parallax Logo" width={120} height={120} className="object-contain shrink-0" /></div>
                        <span className="font-anton text-2xl text-white tracking-wide uppercase">PARALLAX</span>
                    </div>

                    {/* Vertical Divider & Text */}
                    <motion.div
                        style={{ maxWidth: dividerWidth, opacity: dividerOpacity, paddingLeft: dividerPadding }}
                        className="hidden lg:flex items-center gap-4 h-full border-l border-white/20 py-0.5 overflow-hidden"
                    >
                        <div className="flex flex-col justify-center whitespace-nowrap">
                            <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-white/50 leading-tight">
                                Stellar Oracle
                            </span>
                            <span className="text-[9px] tracking-[0.1em] text-cyan-400 uppercase font-bold leading-tight mt-0.5">
                                Testnet Active
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Center/Right Pill Nav */}
                <div className={`absolute left-0 w-full flex pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'justify-center' : 'justify-end pr-[120px]'}`}>
                    <motion.div
                        layout
                        className="h-[46px] px-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center shadow-2xl shadow-black/50 pointer-events-auto transition-colors duration-300"
                    >
                        <ul className="flex items-center h-full gap-1 text-[15px] font-normal text-white/50">
                            <li>
                                <a
                                    href="#"
                                    onClick={() => setActiveTab("home")}
                                    className={`px-5 py-1.5 rounded-full font-medium transition-all shadow-sm flex items-center ${activeTab === "home" ? "bg-white text-black" : "hover:bg-white/10 hover:text-white"}`}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="hidden md:block">
                                <a
                                    href="#dashboard"
                                    onClick={() => setActiveTab("dashboard")}
                                    className={`px-4 py-1.5 rounded-full font-medium transition-all flex items-center ${activeTab === "dashboard" ? "bg-white text-black shadow-sm" : "hover:bg-white/10 hover:text-white"}`}
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li className="hidden md:block">
                                <a
                                    href="https://developers.stellar.org"
                                    target="_blank"
                                    onClick={() => setActiveTab("docs")}
                                    className={`px-4 py-1.5 rounded-full font-medium transition-all flex items-center ${activeTab === "docs" ? "bg-white text-black shadow-sm" : "hover:bg-white/10 hover:text-white"}`}
                                >
                                    Docs
                                </a>
                            </li>

                            <li className="flex items-center px-1">
                                <div className="w-[1px] h-3 bg-white/10"></div>
                            </li>

                            <li>
                                {/* Compact Wallet Connection in Pill */}
                                {wallet.isConnected ? (
                                    <button onClick={disconnect} className="ml-1 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[12px] rounded-full font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {wallet.publicKey?.slice(0, 4)}...{wallet.publicKey?.slice(-4)}
                                    </button>
                                ) : (
                                    <button onClick={connect} className="ml-1 px-5 py-2 bg-gradient-to-b from-neutral-600 to-neutral-950 text-white text-[14px] rounded-full font-medium hover:from-neutral-500 hover:to-neutral-900 transition-all shadow-inner">
                                        Connect Wallet
                                    </button>
                                )}
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}
