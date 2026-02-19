"use client";

import { motion } from "framer-motion";
import { Database, Zap, Activity } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full bg-black overflow-hidden flex flex-col justify-between px-6 pb-12 pt-32 md:pt-40">
            <div className="flex flex-col items-center justify-center w-full z-10 mt-auto mb-auto">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="select-none text-center"
                >
                    <h1 className="text-[12vw] font-anton font-normal leading-none text-white tracking-wide uppercase mix-blend-difference">
                        STELLAR<br />ORACLE
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 text-center space-y-4 max-w-2xl mx-auto"
                >
                    <p className="text-sm md:text-lg tracking-[0.3em] uppercase text-white/40 font-outfit">
                        Aggregated Price Feeds for
                    </p>
                    <p className="font-serif text-3xl md:text-5xl italic text-white leading-tight">
                        Soroban & Native Assets.
                    </p>
                </motion.div>
            </div>

            <div className="w-full flex justify-between items-end z-30 pointer-events-none mt-12 md:mt-0">
                <div className="flex flex-col items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <div className="text-xs md:text-sm tracking-wider uppercase text-center font-display">
                        <span className="text-white font-medium">Protocol 21</span>
                        <br />
                        <span className="text-white/50">Ready</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/30"
                >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                </motion.div>

                <div className="flex flex-col items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan-500" />
                    <div className="text-xs md:text-sm tracking-wider uppercase text-center font-display">
                        <span className="text-white font-medium">Latency</span>
                        <br />
                        <span className="text-white/50">&lt; 2s Finality</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
