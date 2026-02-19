"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertTriangle, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { buildSendOneLumenTx, submitSignedTx, TREASURY_ADDRESS } from "@/lib/stellar";

type Props = { publicKey: string; onSuccess?: (hash: string) => void; className?: string };

type TxStatus =
    | { state: "idle" }
    | { state: "building" }
    | { state: "signing" }
    | { state: "submitting" }
    | { state: "success"; hash: string }
    | { state: "error"; message: string };

function truncate(addr: string) {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export function SendXLMForm({ publicKey, onSuccess, className }: Props) {
    const [status, setStatus] = useState<TxStatus>({ state: "idle" });
    const [destination, setDestination] = useState(TREASURY_ADDRESS);

    const handleSend = async () => {
        if (!destination) return;
        console.log("[SendXLMForm] Starting transaction flow...");
        setStatus({ state: "building" });
        try {
            console.log("[SendXLMForm] Building XDR...");
            const xdr = await buildSendOneLumenTx(publicKey, destination);
            console.log("[SendXLMForm] XDR built:", xdr);

            setStatus({ state: "signing" });

            const freighter = await import("@stellar/freighter-api");
            console.log("[SendXLMForm] Freighter module loaded for signing");

            // Check if signTransaction is available
            if (!freighter.signTransaction) {
                throw new Error("Freighter 'signTransaction' not found. Is the extension installed?");
            }

            console.log("[SendXLMForm] Requesting signature...");
            const signResult = await freighter.signTransaction(xdr, {
                networkPassphrase: "Test SDF Network ; September 2015",
            });
            console.log("[SendXLMForm] Sign result:", signResult);

            if (!signResult || (typeof signResult === "object" && "error" in signResult)) {
                throw new Error(
                    typeof signResult === "object" && "error" in signResult
                        ? signResult.error
                        : "Transaction rejected."
                );
            }

            const signedXdr = typeof signResult === "string" ? signResult : signResult.signedTxXdr;
            if (!signedXdr) throw new Error("Could not retrieve signed transaction.");

            setStatus({ state: "submitting" });
            console.log("[SendXLMForm] Submitting to Horizon...");
            const hash = await submitSignedTx(signedXdr);
            console.log("[SendXLMForm] Success hash:", hash);
            setStatus({ state: "success", hash });
            onSuccess?.(hash);
        } catch (err: unknown) {
            console.error("[SendXLMForm] Transaction error:", err);
            setStatus({ state: "error", message: err instanceof Error ? err.message : "Error." });
        }
    };

    const isInProgress = ["building", "signing", "submitting"].includes(status.state);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`glass-card rounded-[32px] p-8 relative flex flex-col justify-between h-full ${className}`}
        >
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Send size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Level 1 Demo</p>
                        <p className="text-xl font-bold text-white">Send Transaction</p>
                    </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-6 mb-6 space-y-4 border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-medium">Amount</span>
                        <span className="text-xl font-bold text-white font-grotesk tracking-tight">1.0000 XLM</span>
                    </div>
                    <div className="h-px bg-white/5 w-full" />
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm font-medium">To Address</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="G..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={!isInProgress ? { scale: 1.02 } : {}}
                    whileTap={!isInProgress ? { scale: 0.98 } : {}}
                    onClick={handleSend}
                    disabled={isInProgress || status.state === "success"}
                    className={`
            w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 relative overflow-hidden transition-all
            ${status.state === "success"
                            ? "bg-emerald-500 text-white shadow-emerald-500/30"
                            : "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/25"}
            disabled:opacity-80 disabled:cursor-not-allowed
          `}
                >
                    {isInProgress ? (
                        <>
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <span className="animate-pulse">Processing...</span>
                        </>
                    ) : status.state === "success" ? (
                        <>
                            <CheckCircle2 size={20} />
                            Success!
                        </>
                    ) : (
                        <>
                            Confirm 1 XLM Send <ArrowRight size={20} />
                        </>
                    )}
                </motion.button>

                {/* Status Indicators */}
                <AnimatePresence>
                    {isInProgress && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-6 space-y-3 overflow-hidden"
                        >
                            {[
                                { key: "building", label: "Constructing XDR..." },
                                { key: "signing", label: "Waiting for Freighter signature..." },
                                { key: "submitting", label: "Broadcasting to Stellar Testnet..." }
                            ].map((step) => {
                                const stepOrder = ["building", "signing", "submitting"];
                                const currentIdx = stepOrder.indexOf(status.state);
                                const stepIdx = stepOrder.indexOf(step.key);

                                const isDone = stepIdx < currentIdx;
                                const isActive = step.key === status.state;

                                return (
                                    <div key={step.key} className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isDone ? "bg-emerald-500 border-emerald-500" :
                                            isActive ? "border-cyan-400" : "border-slate-700"
                                            }`}>
                                            {isDone && <CheckCircle2 size={14} className="text-white" />}
                                            {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                                        </div>
                                        <span className={`text-sm ${isActive ? "text-cyan-300 font-medium" : "text-slate-500"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Messages */}
                <AnimatePresence>
                    {status.state === "error" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-300 text-sm">
                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                            <div>{status.message}</div>
                        </motion.div>
                    )}

                    {status.state === "success" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                            <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">Transaction Hash</p>
                            <a href={`https://stellar.expert/explorer/testnet/tx/${status.hash}`} target="_blank" rel="noopener" className="font-mono text-xs text-emerald-400 break-all hover:underline flex items-center justify-center gap-2">
                                {status.hash.slice(0, 20)}... <ExternalLink size={12} />
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
