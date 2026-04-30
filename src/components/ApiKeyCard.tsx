"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import {
  buildRegisterTx,
  submitSorobanTx,
  checkIsRegistered,
  NATIVE_TOKEN_CONTRACT_ID,
  API_REGISTRY_CONTRACT_ID,
} from "@/lib/stellar";
import { useWallet } from "@/hooks/useWallet";

type Props = { className?: string };

type TxStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "building" }
  | { state: "signing" }
  | { state: "submitting" }
  | { state: "success"; hash: string; apiKey: string }
  | { state: "error"; message: string; code: string };

function deriveApiKey(publicKey: string): string {
  const hash = publicKey.slice(2, 18) + publicKey.slice(-8);
  return `pk_${hash.toLowerCase()}`;
}

export function ApiKeyCard({ className }: Props) {
  const { wallet, signTransaction } = useWallet();
  const [status, setStatus] = useState<TxStatus>({ state: "idle" });
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) return;
    const cached = localStorage.getItem(`api_registry_${wallet.publicKey}`);
    if (cached === "registered") {
      setIsAlreadyRegistered(true);
      setApiKey(deriveApiKey(wallet.publicKey));
      return;
    }
    setStatus({ state: "checking" });
    checkIsRegistered(wallet.publicKey)
      .then((registered) => {
        if (registered) {
          setIsAlreadyRegistered(true);
          setApiKey(deriveApiKey(wallet.publicKey!));
          localStorage.setItem(`api_registry_${wallet.publicKey}`, "registered");
        }
        setStatus({ state: "idle" });
      })
      .catch(() => setStatus({ state: "idle" }));
  }, [wallet.publicKey]);

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!wallet.publicKey) return;

    if (API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") {
      setStatus({ state: "error", message: "Contract not deployed. Check .env.", code: "not_deployed" });
      return;
    }

    try {
      setStatus({ state: "building" });
      const xdr = await buildRegisterTx(wallet.publicKey, NATIVE_TOKEN_CONTRACT_ID);

      setStatus({ state: "signing" });
      let signedXdr: string;
      try {
        signedXdr = await signTransaction(xdr);
      } catch {
        setStatus({ state: "error", message: "Transaction rejected.", code: "rejected" });
        return;
      }

      setStatus({ state: "submitting" });
      const hash = await submitSorobanTx(signedXdr);
      const key = deriveApiKey(wallet.publicKey);
      localStorage.setItem(`api_registry_${wallet.publicKey}`, "registered");
      setIsAlreadyRegistered(true);
      setApiKey(key);
      setStatus({ state: "success", hash, apiKey: key });

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      if (msg.includes("AlreadyRegistered") || msg.includes("already")) {
        const key = deriveApiKey(wallet.publicKey);
        localStorage.setItem(`api_registry_${wallet.publicKey}`, "registered");
        setIsAlreadyRegistered(true);
        setApiKey(key);
        setStatus({ state: "success", hash: "", apiKey: key });
      } else {
        setStatus({ state: "error", message: "Failed to register.", code: "generic" });
      }
    }
  };

  const isInProgress = ["building", "signing", "submitting", "checking"].includes(status.state);

  return (
    <div className={`bg-[#0b0c0e] border border-white/5 rounded-[12px] border-t-2 border-t-[#00c8d4] p-6 flex flex-col w-full max-w-full ${className || ""}`}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                <h2 className="font-headline-md text-headline-md text-on-surface text-lg">Authentication</h2>
            </div>
            {isAlreadyRegistered && (
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 font-label-sm rounded uppercase">
                    Active
                </span>
            )}
        </div>
        
        <div className="mb-6">
            <label className="block text-[11px] font-bold text-[#565d70] uppercase tracking-[0.08em] mb-2">Live Secret Key</label>

            {isAlreadyRegistered && apiKey ? (
                /* ── Key exists: show input with toggle + copy ── */
                <div className="flex items-center bg-[#0d0e11] border border-white/10 rounded overflow-hidden focus-within:border-[#00c8d4]/50 focus-within:shadow-[0_0_8px_rgba(0,200,212,0.15)] transition-all">
                    <input
                        className="bg-transparent border-none w-full px-4 py-3 text-[13px] text-[#f0f0f2] font-mono focus:ring-0 cursor-text"
                        readOnly
                        type={isVisible ? "text" : "password"}
                        value={apiKey}
                    />

                    {/* Show / Hide toggle */}
                    <button
                        className="p-3 text-[#565d70] hover:text-white bg-[#121316] hover:bg-[#1a1d24] border-l border-white/10 transition-colors"
                        title={isVisible ? "Hide key" : "Show key"}
                        onClick={() => setIsVisible((v) => !v)}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isVisible ? (
                                <motion.span key="hide" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}>
                                    <EyeOff size={16} />
                                </motion.span>
                            ) : (
                                <motion.span key="show" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}>
                                    <Eye size={16} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Copy button */}
                    <div className="relative">
                        <button
                            className={`p-3 border-l border-white/10 transition-all duration-200 ${
                                copied ? "text-[#00c8d4] bg-[#00c8d4]/10" : "text-[#565d70] hover:text-white bg-[#121316] hover:bg-[#1a1d24]"
                            }`}
                            title="Copy to clipboard"
                            onClick={handleCopy}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                                        <Check size={16} />
                                    </motion.span>
                                ) : (
                                    <motion.span key="copy" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.15 }}>
                                        <Copy size={16} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Floating "Copied!" toast */}
                        <AnimatePresence>
                            {copied && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute bottom-[calc(100%+8px)] right-0 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#00c8d4] text-[#0b0c0e] text-[11px] font-bold tracking-wide shadow-[0_0_16px_rgba(0,200,212,0.5)] whitespace-nowrap pointer-events-none"
                                >
                                    <Check size={11} strokeWidth={3} />
                                    Copied!
                                    <span className="absolute top-full right-3 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#00c8d4]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                /* ── No key yet: clean empty state ── */
                <div className="flex items-center gap-3 px-4 py-3 bg-[#0d0e11] border border-dashed border-white/10 rounded">
                    <span className="material-symbols-outlined text-[18px] text-[#2e3240] shrink-0">key_off</span>
                    <span className="text-[13px] text-[#2e3240] font-mono">No key generated yet</span>
                </div>
            )}

            <p className="text-[11px] text-[#3a3f50] mt-2">Keep this key secret. Do not expose it in client-side code.</p>
        </div>

        {!isAlreadyRegistered && (
            <button 
                onClick={handleGenerate}
                disabled={isInProgress}
                className="w-full py-3 px-4 border border-white/20 hover:border-white text-on-surface font-label-md text-label-md uppercase tracking-wider rounded transition-all hover:bg-white/5 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isInProgress ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                )}
                {isInProgress ? "Processing..." : "Generate New API Key (10 XLM)"}
            </button>
        )}

        <AnimatePresence>
            {status.state === "error" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 rounded bg-error-container/20 border border-error-container/30 flex gap-3 text-error text-xs">
                    <span className="material-symbols-outlined text-sm shrink-0">error</span>
                    <div>
                        <p className="font-bold text-[10px] uppercase tracking-wide mb-1">Error</p>
                        {status.message}
                        <button onClick={() => setStatus({ state: "idle" })} className="flex items-center gap-1 mt-2 text-error/80 hover:text-error transition-colors">
                            <RefreshCw size={10} /> Try again
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
