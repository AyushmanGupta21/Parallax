"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { buildSendXlmTx, submitSignedTx, TREASURY_ADDRESS } from "@/lib/stellar";
import { useWallet } from "@/hooks/useWallet";

type Props = { publicKey: string; onSuccess?: (hash: string) => void; className?: string };

type TxStatus =
    | { state: "idle" }
    | { state: "building" }
    | { state: "signing" }
    | { state: "submitting" }
    | { state: "success"; hash: string }
    | { state: "error"; message: string };

export function SendXLMForm({ publicKey, onSuccess, className }: Props) {
    const [status, setStatus] = useState<TxStatus>({ state: "idle" });
    const [destination, setDestination] = useState("");
    const [memo, setMemo] = useState("");
    const [amount, setAmount] = useState("");
    const { signTransaction } = useWallet();

    const handleSend = async () => {
        if (!destination || !amount) return;
        setStatus({ state: "building" });
        try {
            const xdr = await buildSendXlmTx(publicKey, destination, amount);
            setStatus({ state: "signing" });

            let signedXdr: string;
            try {
                signedXdr = await signTransaction(xdr);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Transaction rejected.";
                if (msg.toLowerCase().includes("closed")) {
                    throw new Error("Transaction rejected. Please approve it in your wallet.");
                }
                throw new Error(msg);
            }

            setStatus({ state: "submitting" });
            const hash = await submitSignedTx(signedXdr);
            setStatus({ state: "success", hash });
            onSuccess?.(hash);
        } catch (err: unknown) {
            setStatus({ state: "error", message: err instanceof Error ? err.message : "Error." });
        }
    };

    const handleReset = () => {
        setStatus({ state: "idle" });
        setDestination("");
        setAmount("");
        setMemo("");
    };

    const isInProgress = ["building", "signing", "submitting"].includes(status.state);
    const steps = [
        { key: "building", label: "Constructing XDR envelope..." },
        { key: "signing", label: "Waiting for wallet signature..." },
        { key: "submitting", label: "Broadcasting to Stellar network..." },
    ];

    return (
        <div className={`bg-[#0b0c0e] border border-white/5 rounded-[12px] p-5 sm:p-8 relative overflow-hidden shadow-lg ${className || ""}`}>
            {/* Inner gradient highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
                {status.state === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center text-center gap-6 py-8"
                    >
                        <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <div>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Transfer Confirmed</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">Your transaction has been broadcast to the Stellar network.</p>
                        </div>
                        <a
                            href={`https://stellar.expert/explorer/testnet/tx/${status.hash}`}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
                        >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                            View on Stellar Expert
                        </a>
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 border border-white/20 hover:border-white/50 text-on-surface font-label-md text-label-md rounded transition-all hover:bg-white/5"
                        >
                            Send Another Transfer
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        className="relative z-10 flex flex-col gap-8"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        {/* === Destination Section === */}
                        <div className="space-y-6">
                            <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/20 pb-3">Destination</h2>
                            <div>
                                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Recipient Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-outline">account_circle</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder={`e.g. ${TREASURY_ADDRESS.slice(0, 12)}...`}
                                        disabled={isInProgress}
                                        className="w-full bg-[#121316] border border-white/5 rounded-[8px] focus:border-[#00c8d4] focus:ring-1 focus:ring-[#00c8d4]/50 font-body-md text-[#f0f0f2] py-4 pl-12 pr-4 transition-all placeholder:text-[#565d70] disabled:opacity-50 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Transaction Memo (Optional)</label>
                                <input
                                    type="text"
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="e.g. Invoice #4920"
                                    disabled={isInProgress}
                                    className="w-full bg-[#121316] border border-white/5 rounded-[8px] focus:border-[#00c8d4] focus:ring-1 focus:ring-[#00c8d4]/50 font-body-md text-[#f0f0f2] py-3 px-4 transition-all placeholder:text-[#565d70] disabled:opacity-50 outline-none"
                                />
                            </div>
                        </div>

                        {/* === Asset & Amount Section === */}
                        <div className="space-y-6">
                            <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/20 pb-3">Asset &amp; Amount</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="md:col-span-1">
                                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Asset</label>
                                    <div className="relative">
                                        <select
                                            disabled={isInProgress}
                                            className="w-full bg-[#121316] border border-white/5 rounded-[8px] focus:border-[#00c8d4] focus:ring-1 focus:ring-[#00c8d4]/50 font-body-md text-[#f0f0f2] py-4 pl-4 pr-10 appearance-none transition-all outline-none disabled:opacity-50"
                                        >
                                            <option value="xlm">XLM - Stellar Lumens</option>
                                            <option value="usdc">USDC - USD Coin</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-outline">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Amount</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            disabled={isInProgress}
                                            className="w-full bg-[#121316] border border-white/5 rounded-[8px] focus:border-[#00c8d4] focus:ring-1 focus:ring-[#00c8d4]/50 font-body-lg text-[#f0f0f2] py-4 pl-4 pr-16 transition-all placeholder:text-[#565d70] disabled:opacity-50 outline-none"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span className="font-label-md text-label-md text-on-surface-variant">MAX</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* === Summary Panel === */}
                        <div className="bg-[#121316] p-6 rounded-[8px] border border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Network Fee</span>
                                <span className="font-body-sm text-body-sm text-on-surface">0.00001 XLM</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Estimated Arrival</span>
                                <span className="font-body-sm text-body-sm text-on-surface">~3 seconds</span>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Total Output</span>
                                <span className="font-headline-md text-headline-md text-primary">
                                    {amount ? `${amount} XLM` : "0.00 XLM"}
                                </span>
                            </div>
                        </div>

                        {/* === Submit === */}
                        <button
                            type="submit"
                            disabled={isInProgress || !amount || parseFloat(amount) <= 0 || !destination}
                            className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest py-5 rounded hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(138,235,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isInProgress ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                    Confirm Transfer
                                </>
                            )}
                        </button>

                        {/* === Step Progress === */}
                        <AnimatePresence>
                            {isInProgress && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    {steps.map((step) => {
                                        const order = ["building", "signing", "submitting"];
                                        const curIdx = order.indexOf(status.state);
                                        const stepIdx = order.indexOf(step.key);
                                        const isDone = stepIdx < curIdx;
                                        const isActive = step.key === status.state;
                                        return (
                                            <div key={step.key} className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 transition-colors ${isDone ? "bg-secondary border-secondary" : isActive ? "border-primary" : "border-white/10"}`}>
                                                    {isDone && <span className="material-symbols-outlined text-[10px] text-on-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                                </div>
                                                <span className={`text-xs font-body-sm ${isActive ? "text-primary" : isDone ? "text-on-surface-variant" : "text-outline-variant"}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* === Error === */}
                        <AnimatePresence>
                            {status.state === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 rounded bg-error-container/20 border border-error-container/30 flex gap-3 text-error text-sm"
                                >
                                    <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
                                    <div>
                                        <p className="font-label-md text-label-md mb-1">Error</p>
                                        <p className="font-body-sm text-body-sm">{status.message}</p>
                                        <button onClick={() => setStatus({ state: "idle" })} className="flex items-center gap-1 mt-2 text-error/70 hover:text-error transition-colors text-xs">
                                            <span className="material-symbols-outlined text-xs">refresh</span> Try again
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
