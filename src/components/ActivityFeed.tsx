"use client";

import { useState, useEffect } from "react";
import { fetchRegistrationEvents, RegistrationEvent, API_REGISTRY_CONTRACT_ID } from "@/lib/stellar";
import { useWallet } from "@/hooks/useWallet";
import { Loader2 } from "lucide-react";

function truncateMiddle(value: string, left = 6, right = 4): string {
    if (value.length <= left + right) {
        return value;
    }
    return `${value.slice(0, left)}...${value.slice(-right)}`;
}

export function ActivityFeed() {
    const { wallet } = useWallet();
    const [liveEvents, setLiveEvents] = useState<RegistrationEvent[]>([]);
    
    useEffect(() => {
        const connectedPublicKey = wallet.publicKey;
        if (!connectedPublicKey) return;
        if (API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") return;
    
        let isActive = true;
        let cursor: string | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
    
        const poll = async () => {
            try {
                const response = await fetchRegistrationEvents(cursor ? { cursor, limit: 20 } : { limit: 20 });
                cursor = response.cursor;
                if (!isActive) return;
        
                if (response.events.length) {
                    setLiveEvents((prev) => {
                        const merged = [...response.events, ...prev];
                        const unique = merged.filter((event, index, arr) => arr.findIndex((e) => e.id === event.id) === index);
                        return unique.slice(0, 10);
                    });
                }
            } catch {
            } finally {
                if (isActive) {
                    timer = setTimeout(poll, 5000);
                }
            }
        };
        void poll();
        return () => {
            isActive = false;
            if (timer) clearTimeout(timer);
        };
    }, [wallet.publicKey]);

    return (
        <div className="bg-[#0b0c0e] border border-white/5 rounded-[12px] overflow-hidden flex flex-col h-[280px] w-full max-w-full">
            <div className="bg-[#0a0a0a] border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Live Activity Log</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-container-high border border-white/10"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-container-high border border-white/10"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-container-high border border-white/10"></div>
                </div>
            </div>
            <div className="p-4 bg-[#050505] flex-grow overflow-y-auto overflow-x-hidden terminal-text text-[12px] text-[#8a8f9e] space-y-2">
                <div className="flex gap-2 flex-wrap">
                    <span className="text-[#3c494c] select-none">SYSTEM</span>
                    <span className="text-[#00c8d4]">[INFO]</span>
                    <span className="break-all">Subscribed to contract: <span className="text-[#f0f0f2]">{truncateMiddle(API_REGISTRY_CONTRACT_ID)}</span></span>
                </div>
                {liveEvents.length === 0 ? (
                    <div className="flex gap-2 flex-wrap">
                        <span className="text-[#3c494c] select-none">POLL</span>
                        <span className="text-[#00c8d4]">[INFO]</span>
                        <span>Awaiting new events...<span className="animate-pulse">_</span></span>
                    </div>
                ) : (
                    liveEvents.map(event => {
                        const isMine = event.address === wallet.publicKey;
                        return (
                            <div key={event.id} className="flex gap-2 flex-wrap">
                                <span className="text-[#3c494c] select-none shrink-0">L:{event.ledger}</span>
                                {isMine ? (
                                    <span className="text-[#4ae176]">[SELF]</span>
                                ) : (
                                    <span className="text-[#8aebff]">[NODE]</span>
                                )}
                                <span className="break-all">
                                    Registration: <span className="text-[#f0f0f2]">{truncateMiddle(event.address)}</span>
                                    {" "}(<a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" className="underline hover:text-white">tx</a>)
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
