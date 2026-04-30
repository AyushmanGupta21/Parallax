"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
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
      } catch (err) {
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
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Live Secret Key</label>
            <div className="flex items-center bg-surface-container-lowest border border-white/10 rounded overflow-hidden group focus-within:border-primary focus-within:shadow-[0_0_8px_rgba(138,235,255,0.2)] transition-all">
                <input 
                    className="bg-transparent border-none w-full px-4 py-3 font-body-sm text-body-sm text-on-surface terminal-text focus:ring-0 cursor-text" 
                    readOnly 
                    type="password" 
                    value={isAlreadyRegistered && apiKey ? apiKey : "********************************"} 
                />
                <button 
                    className="p-3 text-on-surface-variant hover:text-white bg-surface-container/50 hover:bg-surface-bright border-l border-white/10 transition-colors" 
                    title="Copy to clipboard"
                    onClick={() => apiKey && navigator.clipboard.writeText(apiKey)}
                >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">Keep this key secret. Do not expose it in client-side code.</p>
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
