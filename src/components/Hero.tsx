"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="flex flex-col items-center text-center mt-20 mb-32 w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-panel px-4 py-1.5 rounded-full mb-8 inline-flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(102,221,139,0.5)]"></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Stellar Mainnet Active</span>
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-display md:text-[72px] lg:text-[88px] text-on-background max-w-4xl leading-[1.05] tracking-tight mb-8"
            >
                The Oracle for Stellar's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed to-tertiary-fixed">Next Frontier</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12"
            >
                Institutional-grade infrastructure delivering verifiable data and seamless cross-chain interoperability with absolute precision.
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6"
            >
                <Link href="/dashboard" className="button-primary text-white font-body-md text-body-md font-medium px-8 py-4 rounded-lg hover:shadow-[0_0_30px_rgba(15,82,186,0.4)] transition-all duration-300 min-w-[200px] text-center">
                    Get Started
                </Link>
                <Link href="/dashboard" className="glass-panel text-on-surface font-body-md text-body-md font-medium px-8 py-4 rounded-lg hover:bg-white/5 transition-all duration-300 min-w-[200px] flex items-center justify-center gap-2">
                    Explore Dashboard
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </section>
    );
}
