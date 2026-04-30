"use client";

import { motion } from "framer-motion";
import { Shield, Key, Activity, RefreshCw } from "lucide-react";

export function BentoGrid() {
  return (
    <div className="w-full flex flex-col items-center">
        {/* Stats Row */}
        <section className="glass-panel rounded-xl p-8 mb-32 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
                <div className="flex flex-col items-center justify-center">
                    <span className="font-h2 text-h2 text-primary-fixed mb-1">Active</span>
                    <span className="font-label-caps text-label-caps text-outline-variant">Testnet</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="font-h2 text-h2 text-primary-fixed mb-1">99.9%</span>
                    <span className="font-label-caps text-label-caps text-outline-variant">Uptime</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="font-h2 text-h2 text-primary-fixed mb-1">Verified</span>
                    <span className="font-label-caps text-label-caps text-outline-variant">Contract</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="font-h2 text-h2 text-primary-fixed mb-1">&lt;5s</span>
                    <span className="font-label-caps text-label-caps text-outline-variant">Finality</span>
                </div>
            </div>
        </section>

        {/* Features Bento Grid */}
        <section className="mb-32 w-full">
            <div className="flex flex-col items-center text-center mb-16">
                <h2 className="font-h1 text-h1 text-on-background mb-4">Core Infrastructure</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Machined for absolute reliability and verifiable truth on-chain.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1: Large Panel */}
                <div className="glass-panel rounded-xl p-8 lg:col-span-2 group hover:bg-white/[0.02] transition-colors duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-[60px] group-hover:bg-primary-container/20 transition-all duration-500"></div>
                    <div className="relative z-10">
                        <Shield className="w-8 h-8 text-primary-fixed mb-6 block" strokeWidth={1.5} />
                        <h3 className="font-h2 text-h2 text-on-background mb-3">Wallet Authentication</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Multi-signature protocol utilizing advanced cryptographic primitives to ensure secure, verifiable identity mapping across networks.</p>
                    </div>
                </div>
                
                {/* Feature 2: Small Panel */}
                <div className="glass-panel rounded-xl p-8 group hover:bg-white/[0.02] transition-colors duration-500">
                    <Key className="w-8 h-8 text-primary-fixed mb-6 block" strokeWidth={1.5} />
                    <h3 className="font-h2 text-h2 text-on-background mb-3">On-chain Registration</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Immutable ledger entry for all active nodes, ensuring transparent consensus participation.</p>
                </div>
                
                {/* Feature 3: Small Panel */}
                <div className="glass-panel rounded-xl p-8 group hover:bg-white/[0.02] transition-colors duration-500">
                    <Activity className="w-8 h-8 text-primary-fixed mb-6 block" strokeWidth={1.5} />
                    <h3 className="font-h2 text-h2 text-on-background mb-3">Price Feeds</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Sub-second latency data delivery from decentralized, authenticated institutional sources.</p>
                </div>
                
                {/* Feature 4: Large Panel */}
                <div className="glass-panel rounded-xl p-8 lg:col-span-2 group hover:bg-white/[0.02] transition-colors duration-500 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary-container/10 rounded-full blur-[60px] group-hover:bg-tertiary-container/20 transition-all duration-500"></div>
                    <div className="relative z-10">
                        <RefreshCw className="w-8 h-8 text-primary-fixed mb-6 block" strokeWidth={1.5} />
                        <h3 className="font-h2 text-h2 text-on-background mb-3">Secure Transaction Flow</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">End-to-end encrypted messaging layer facilitating cross-chain asset transfers with guaranteed finality and rollback protection.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
