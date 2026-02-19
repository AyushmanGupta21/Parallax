"use client";

import { motion } from "framer-motion";

const tickers = [
    { pair: "XLM/USDC", price: "0.1145", change: "+2.4%" },
    { pair: "XLM/BTC", price: "0.0000021", change: "-1.2%" },
    { pair: "AQUA/XLM", price: "0.045", change: "+5.1%" },
    { pair: "YBX/XLM", price: "12.45", change: "+0.8%" },
    { pair: "yXLM/XLM", price: "1.004", change: "+0.1%" },
    { pair: "LSP/XLM", price: "0.089", change: "-3.4%" },
];

export function PriceTicker() {
    const items = [...tickers, ...tickers, ...tickers, ...tickers]; // Quadruplicate

    return (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-900 py-4 -rotate-2 scale-105 my-20 overflow-hidden shadow-2xl shadow-red-900/50 relative z-20 border-y border-red-500/50">
            <div className="flex animate-marquee gap-12 whitespace-nowrap">
                {items.map((ticker, i) => (
                    <div key={i} className="flex items-center gap-4 shrink-0">
                        <span className="text-white font-bold tracking-[0.2em] text-lg uppercase flex items-center gap-4 font-anton">
                            {ticker.pair} <span className="text-white/50">•</span> {ticker.price}
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full bg-black/20 font-sans ${ticker.change.startsWith("+") ? "text-emerald-400" : "text-red-200"
                                    }`}
                            >
                                {ticker.change}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
