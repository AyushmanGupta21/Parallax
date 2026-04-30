"use client";

import { motion } from "framer-motion";

const tickers = [
    { pair: "XLM/USD", price: "$0.1142", change: "+1.24%" },
    { pair: "BTC/USD", price: "$64,230", change: "+0.85%" },
    { pair: "ETH/USD", price: "$3,450", change: "-0.42%" },
    { pair: "USDC/XLM", price: "8.75", change: "+0.01%" },
    { pair: "yXLM/XLM", price: "1.004", change: "+0.12%" },
];

export function PriceTicker() {
    const items = [...tickers, ...tickers, ...tickers, ...tickers]; // Quadruplicate

    return (
        <div className="w-full border-y border-white/5 py-4 overflow-hidden bg-surface-container-lowest/50 backdrop-blur-md">
            <motion.div
                className="flex gap-12 whitespace-nowrap w-max"
                animate={{ x: [0, "-50%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {items.map((ticker, i) => (
                    <div key={i} className="flex items-center gap-3 shrink-0">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">{ticker.pair}</span>
                        <span className="font-body-md text-body-md text-on-background">{ticker.price}</span>
                        <span className={`font-label-caps text-label-caps ${ticker.change.startsWith("-") ? "text-error" : "text-secondary"}`}>
                            {ticker.change}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
