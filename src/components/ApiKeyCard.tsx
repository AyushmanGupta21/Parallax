"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Key, AlertTriangle, CheckCircle2, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import {
  buildRegisterTx,
  submitSorobanTx,
  checkIsRegistered,
  fetchRegistrationEvents,
  NATIVE_TOKEN_CONTRACT_ID,
  API_REGISTRY_CONTRACT_ID,
  RegistrationEvent,
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
  | { state: "error"; message: string; code: "not_found" | "not_deployed" | "rejected" | "registered" | "balance" | "generic" };

// Derive a deterministic API key from the public key
function deriveApiKey(publicKey: string): string {
  const hash = publicKey.slice(2, 18) + publicKey.slice(-8);
  return `pk_${hash.toLowerCase()}`;
}

function truncateMiddle(value: string, left = 6, right = 4): string {
  if (value.length <= left + right) {
    return value;
  }
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}

export function ApiKeyCard({ className }: Props) {
  const { wallet, signTransaction } = useWallet();
  const [status, setStatus] = useState<TxStatus>({ state: "idle" });
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<RegistrationEvent[]>([]);

  // On mount: check localStorage cache then contract
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

  // Real-time event sync for registration updates.
  useEffect(() => {
    const connectedPublicKey = wallet.publicKey;
    if (!connectedPublicKey) return;
    if (API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") return;

    let isActive = true;
    let cursor: string | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const response = await fetchRegistrationEvents(
          cursor ? { cursor, limit: 20 } : { limit: 20 }
        );

        cursor = response.cursor;

        if (!isActive) return;

        if (response.events.length) {
          setLiveEvents((prev) => {
            const merged = [...response.events, ...prev];
            const unique = merged.filter(
              (event, index, arr) => arr.findIndex((e) => e.id === event.id) === index
            );
            return unique.slice(0, 6);
          });
        }

        const ownRegistration = response.events.find(
          (event) => event.address === connectedPublicKey
        );

        if (ownRegistration) {
          setIsAlreadyRegistered(true);
          setApiKey(deriveApiKey(connectedPublicKey));
          localStorage.setItem(`api_registry_${connectedPublicKey}`, "registered");
        }
      } catch {
        // Ignore transient RPC failures; polling retries automatically.
      } finally {
        if (isActive) {
          timer = setTimeout(poll, 5000);
        }
      }
    };

    void poll();

    return () => {
      isActive = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [wallet.publicKey]);

  const handleGenerate = async () => {
    if (!wallet.publicKey) return;

    // Error type 1: Contract not yet deployed
    if (API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") {
      setStatus({
        state: "error",
        message: "The smart contract has not been deployed to testnet yet. Set NEXT_PUBLIC_CONTRACT_ID in your .env.local file.",
        code: "not_deployed",
      });
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
        const msg = err instanceof Error ? err.message : "";
        // Error type 2: User rejected the transaction
        if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("declined") || msg.toLowerCase().includes("cancel")) {
          setStatus({ state: "error", message: "Transaction rejected. Please approve it in your wallet.", code: "rejected" });
        } else if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("installed")) {
          setStatus({ state: "error", message: "Wallet not found. Please install Freighter or another supported wallet.", code: "not_found" });
        } else {
          setStatus({ state: "error", message: msg || "Signing failed.", code: "generic" });
        }
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
      // Error type 3: Already registered (contract error) or insufficient balance
      if (msg.includes("AlreadyRegistered") || msg.includes("already")) {
        setStatus({ state: "error", message: "This address is already registered.", code: "registered" });
        setIsAlreadyRegistered(true);
        setApiKey(deriveApiKey(wallet.publicKey));
      } else if (msg.toLowerCase().includes("balance") || msg.toLowerCase().includes("insufficient")) {
        setStatus({ state: "error", message: "Insufficient XLM balance. You need at least 10 XLM to register.", code: "balance" });
      } else {
        setStatus({ state: "error", message: msg, code: "generic" });
      }
    }
  };

  const isInProgress = ["building", "signing", "submitting", "checking"].includes(status.state);

  const steps = [
    { key: "building", label: "Preparing contract call..." },
    { key: "signing", label: "Waiting for wallet signature..." },
    { key: "submitting", label: "Broadcasting to Stellar Testnet..." },
  ];

  if (!wallet.isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`glass-card rounded-[32px] p-6 sm:p-8 relative flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <Key size={20} className="text-violet-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Level 2 — Smart Contract</p>
          <p className="text-lg sm:text-xl font-bold text-white">API Key Registry</p>
        </div>
      </div>

      {/* Registration info */}
      <div className="bg-black/40 rounded-2xl p-4 sm:p-5 mb-5 border border-white/5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Registration Fee</span>
          <span className="font-mono font-bold text-cyan-400">10 XLM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Contract</span>
          <span className="font-mono text-xs text-white/40 truncate max-w-[150px] sm:max-w-[200px]">
            {API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE"
              ? "Pending deployment"
              : `${API_REGISTRY_CONTRACT_ID.slice(0, 8)}...${API_REGISTRY_CONTRACT_ID.slice(-6)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Status</span>
          <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${isAlreadyRegistered ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40"}`}>
            {isAlreadyRegistered ? "Registered" : "Not Registered"}
          </span>
        </div>
      </div>

      {/* Registered state: show API key */}
      {isAlreadyRegistered && apiKey && (
        <div className="mb-5 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Your API Key</p>
          <p className="font-mono text-sm text-white break-all">{apiKey}</p>
        </div>
      )}

      {/* Live event feed */}
      <div className="mb-5 p-4 rounded-2xl bg-black/40 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Live Contract Events
          </p>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Auto-sync</span>
        </div>

        {liveEvents.length === 0 ? (
          <p className="text-xs text-white/35">Waiting for contract events...</p>
        ) : (
          <div className="space-y-2">
            {liveEvents.map((event) => {
              const isMine = event.address === wallet.publicKey;
              return (
                <div
                  key={event.id}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                    isMine
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-medium ${isMine ? "text-emerald-300" : "text-white/70"}`}>
                      registered {truncateMiddle(event.address, 7, 5)}
                    </p>
                    <p className="text-[10px] text-white/30">Ledger {event.ledger}</p>
                  </div>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                    target="_blank"
                    rel="noopener"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    aria-label="Open transaction"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={!isInProgress ? { scale: 1.02 } : {}}
        whileTap={!isInProgress ? { scale: 0.98 } : {}}
        onClick={isAlreadyRegistered ? undefined : handleGenerate}
        disabled={isInProgress || isAlreadyRegistered}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all
          ${isAlreadyRegistered
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
            : "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-violet-500/25"
          }
          disabled:opacity-80 disabled:cursor-not-allowed`}
      >
        {isInProgress ? (
          <><Loader2 size={18} className="animate-spin" /><span className="animate-pulse">Processing...</span></>
        ) : status.state === "checking" ? (
          <><Loader2 size={18} className="animate-spin" />Checking status...</>
        ) : isAlreadyRegistered ? (
          <><CheckCircle2 size={18} />API Key Active</>
        ) : (
          <>Generate API Key → 10 XLM</>
        )}
      </motion.button>

      {/* Step progress */}
      <AnimatePresence>
        {isInProgress && status.state !== "checking" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="mt-5 space-y-2 overflow-hidden"
          >
            {steps.map((step) => {
              const order = ["building", "signing", "submitting"];
              const curIdx = order.indexOf(status.state);
              const stepIdx = order.indexOf(step.key);
              const isDone = stepIdx < curIdx;
              const isActive = step.key === status.state;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${isDone ? "bg-emerald-500 border-emerald-500" : isActive ? "border-violet-400" : "border-white/10"}`}>
                    {isDone && <CheckCircle2 size={12} className="text-white" />}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                  </div>
                  <span className={`text-xs ${isActive ? "text-violet-300 font-medium" : isDone ? "text-white/30" : "text-white/20"}`}>{step.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Messages */}
      <AnimatePresence>
        {status.state === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-300 text-xs sm:text-sm"
          >
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wide mb-1">
                {status.code === "not_deployed" && "Contract Not Deployed"}
                {status.code === "not_found" && "Wallet Not Found"}
                {status.code === "rejected" && "Transaction Rejected"}
                {status.code === "registered" && "Already Registered"}
                {status.code === "balance" && "Insufficient Balance"}
                {status.code === "generic" && "Error"}
              </p>
              {status.message}
              <button onClick={() => setStatus({ state: "idle" })} className="flex items-center gap-1 mt-2 text-red-400 hover:text-red-300 transition-colors">
                <RefreshCw size={10} /> Try again
              </button>
            </div>
          </motion.div>
        )}

        {status.state === "success" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Transaction Hash</p>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${status.hash}`}
              target="_blank" rel="noopener"
              className="font-mono text-xs text-emerald-400 hover:underline flex items-center justify-center gap-2 break-all"
            >
              {status.hash.slice(0, 20)}... <ExternalLink size={12} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
