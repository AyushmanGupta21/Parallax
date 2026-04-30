"use client";

import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ParticleCard, GlobalSpotlight, useMobileDetection } from "@/components/MagicBento";
import { useRef } from "react";
import ShinyText from "@/components/ShinyText";
import { WaveBackground } from "@/components/WaveBackground";

export default function Home() {
    const { connect, wallet, isLoading } = useWallet();
    const router = useRouter();
    const bentoRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = isMobile;

    const handleConnect = async () => {
        if (!wallet.isConnected) {
            await connect();
        }
    };

    return (
        <main className="flex-grow pb-20 w-full max-w-full relative overflow-x-hidden">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center px-5 pt-[90px] pb-[60px] sm:pt-[110px] sm:pb-[80px] relative min-h-[480px] justify-center">
                <WaveBackground />
                <h1 className="font-bold tracking-[-0.025em] text-[#f0f0f2] mb-[24px] relative z-10" style={{ fontSize: "clamp(48px, 6vw, 84px)", lineHeight: "1.1", maxWidth: "800px" }}>
                    <ShinyText text="Sovereign Institutional" speed={3} /><br />
                    <ShinyText text="Liquidity" speed={3} /> <span className="text-[#00c8d4] drop-shadow-[0_0_12px_rgba(0,200,212,0.4)]"><ShinyText text="for Stellar" speed={3} color="#00c8d4" shineColor="#ffffff" /></span>
                </h1>

                <p className="text-[16px] sm:text-[18px] leading-[1.6] text-[#8a8f9e] mb-[48px] relative z-10" style={{ maxWidth: "580px" }}>
                    The premier oracle and price API platform for enterprise developers. Secure, high-frequency data feeds engineered for the intersection of traditional finance and Web3.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 relative z-10 w-full px-2 sm:px-0">
                    {!wallet.isConnected ? (
                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-[28px] py-[13px] text-[15px] font-bold text-[#0b0c0e] bg-gradient-to-r from-[#8aebff] to-[#00c8d4] rounded-[8px] hover:brightness-110 shadow-[0_0_20px_rgba(0,200,212,0.3)] hover:shadow-[0_0_30px_rgba(0,200,212,0.5)] transition-all flex items-center justify-center gap-[8px]"
                        >
                            {isLoading ? "Connecting..." : "Connect Wallet"}
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full sm:w-auto px-[28px] py-[13px] text-[15px] font-bold text-[#0b0c0e] bg-gradient-to-r from-[#8aebff] to-[#00c8d4] rounded-[8px] hover:brightness-110 shadow-[0_0_20px_rgba(0,200,212,0.3)] hover:shadow-[0_0_30px_rgba(0,200,212,0.5)] transition-all flex items-center justify-center gap-[8px]"
                        >
                            Go to Dashboard
                        </button>
                    )}
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto px-[28px] py-[13px] text-[15px] font-semibold text-[#f0f0f2] bg-[#13151a]/80 backdrop-blur-md border border-white/10 rounded-[8px] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-center"
                    >
                        Explore Dashboard
                    </Link>
                </div>
            </section>

            {/* Stats Row */}
            <section className="max-w-[1000px] mx-auto mb-[60px] sm:mb-[100px] px-4 relative z-10 overflow-x-hidden">
                <div className="bg-[#111318]/90 backdrop-blur-md border border-white/10 rounded-[16px] p-[32px_0] flex flex-col sm:flex-row items-center justify-evenly shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="text-center w-full sm:w-1/3 py-2">
                        <div className="text-[36px] font-bold text-[#f0f0f2] tracking-[-0.02em] mb-[4px]">$1B+</div>
                        <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#8a8f9e]">Total Volume Secured</div>
                    </div>
                    <div className="hidden sm:block w-[1px] h-[60px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                    <div className="text-center w-full sm:w-1/3 py-2 mt-6 sm:mt-0">
                        <div className="text-[36px] font-bold text-[#f0f0f2] tracking-[-0.02em] mb-[4px]">15ms</div>
                        <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#8a8f9e]">Oracle Latency</div>
                    </div>
                    <div className="hidden sm:block w-[1px] h-[60px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                    <div className="text-center w-full sm:w-1/3 py-2 mt-6 sm:mt-0">
                        <div className="text-[36px] font-bold text-[#f0f0f2] tracking-[-0.02em] mb-[4px]">99.99%</div>
                        <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#8a8f9e]">Network Uptime</div>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="max-w-[1200px] mx-auto mb-[100px] px-4 sm:px-[24px] relative z-10 overflow-x-hidden">
                <style>
                    {`
                  .bento-section {
                    --glow-x: 50%;
                    --glow-y: 50%;
                    --glow-intensity: 0;
                    --glow-radius: 300px;
                  }
                  
                  .card--border-glow::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                        rgba(0, 200, 212, calc(var(--glow-intensity) * 0.8)) 0%,
                        rgba(0, 200, 212, calc(var(--glow-intensity) * 0.2)) 50%,
                        transparent 100%);
                    border-radius: inherit;
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    pointer-events: none;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                  }
                  
                  .card--border-glow:hover::after {
                    opacity: 1;
                  }
                  
                  .card--border-glow:hover {
                    box-shadow: 0 4px 30px rgba(0, 200, 212, 0.08), inset 0 0 20px rgba(0,200,212,0.02);
                  }
                  
                  .particle::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: rgba(0, 200, 212, 0.3);
                    border-radius: 50%;
                    z-index: -1;
                    filter: blur(2px);
                  }
                `}
                </style>
                <div ref={bentoRef} className="bento-section relative">
                    <GlobalSpotlight
                        gridRef={bentoRef}
                        disableAnimations={shouldDisableAnimations}
                        enabled={true}
                        spotlightRadius={400}
                        glowColor="0, 200, 212"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[16px]">

                        {/* Left Column (Features) */}
                        <div className="flex flex-col gap-[16px]">
                            {/* Top Card (Full width of left col) */}
                            <ParticleCard
                                disableAnimations={shouldDisableAnimations}
                                enableTilt={true}
                                enableMagnetism={true}
                                clickEffect={true}
                                glowColor="0, 200, 212"
                                className="card card--border-glow bg-[#111318]/80 backdrop-blur-xl border border-white/10 rounded-[16px] p-[32px] flex flex-col gap-[16px] transition-all duration-300 ease-in-out"
                            >
                                <div className="w-[44px] h-[44px] border border-white/10 rounded-[10px] flex items-center justify-center bg-white/[0.03] shrink-0 shadow-inner shadow-white/5">
                                    <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[#8a8f9e] fill-none stroke-[2px]">
                                        <polyline points="23 4 23 10 17 10" />
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                    </svg>
                                </div>
                                <h3 className="text-[20px] font-bold text-[#f0f0f2]">
                                    <ShinyText text="Real-time Oracle Feeds" speed={3} />
                                </h3>
                                <p className="text-[15px] font-normal leading-[1.6] text-[#8a8f9e] max-w-[440px]">
                                    Sub-second price updates directly from top-tier liquidity providers. Designed for high-frequency trading applications and exact settlement protocols.
                                </p>
                                <div className="flex flex-wrap gap-[10px] mt-[4px]">
                                    <span className="px-[12px] py-[4px] text-[12px] font-medium text-[#f0f0f2] border border-white/10 rounded-[6px] bg-[#1a1d24]">XLM/USD</span>
                                    <span className="px-[12px] py-[4px] text-[12px] font-medium text-[#f0f0f2] border border-white/10 rounded-[6px] bg-[#1a1d24]">BTC/USD</span>
                                    <span className="px-[12px] py-[4px] text-[12px] font-medium text-[#f0f0f2] border border-white/10 rounded-[6px] bg-[#1a1d24]">ETH/USD</span>
                                </div>
                            </ParticleCard>

                            {/* Bottom Row of Left Col (Two cards) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                                <ParticleCard
                                    disableAnimations={shouldDisableAnimations}
                                    enableTilt={true}
                                    enableMagnetism={true}
                                    clickEffect={true}
                                    glowColor="0, 200, 212"
                                    className="card card--border-glow bg-[#111318]/80 backdrop-blur-xl border border-white/10 rounded-[16px] p-[28px] flex flex-col gap-[14px] transition-all duration-300 ease-in-out"
                                >
                                    <div className="w-[40px] h-[40px] border border-white/10 rounded-[10px] flex items-center justify-center bg-white/[0.03] shrink-0 shadow-inner shadow-white/5">
                                        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[#8a8f9e] fill-none stroke-[2px]">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[17px] font-bold text-[#f0f0f2]">
                                        <ShinyText text="Institutional Security" speed={3} />
                                    </h3>
                                    <p className="text-[14px] font-normal leading-[1.6] text-[#8a8f9e]">
                                        Cryptographically signed data feeds with multiple node consensus. Bank-grade security architecture securing billions.
                                    </p>
                                    <div className="inline-flex items-center gap-[8px] text-[12px] font-bold tracking-[0.08em] uppercase text-[#00c8d4] mt-auto pt-[10px]">
                                        <span className="w-[8px] h-[8px] rounded-full bg-[#00c8d4] shadow-[0_0_8px_rgba(0,200,212,0.6)]"></span>
                                        Audited by Certik
                                    </div>
                                </ParticleCard>

                                <ParticleCard
                                    disableAnimations={shouldDisableAnimations}
                                    enableTilt={true}
                                    enableMagnetism={true}
                                    clickEffect={true}
                                    glowColor="0, 200, 212"
                                    className="card card--border-glow bg-[#111318]/80 backdrop-blur-xl border border-white/10 rounded-[16px] p-[28px] flex flex-col gap-[14px] transition-all duration-300 ease-in-out"
                                >
                                    <div className="w-[40px] h-[40px] border border-white/10 rounded-[10px] flex items-center justify-center bg-white/[0.03] shrink-0 shadow-inner shadow-white/5">
                                        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[#8a8f9e] fill-none stroke-[2px]">
                                            <rect x="3" y="3" width="7" height="7" rx="1" />
                                            <rect x="14" y="3" width="7" height="7" rx="1" />
                                            <rect x="14" y="14" width="7" height="7" rx="1" />
                                            <rect x="3" y="14" width="7" height="7" rx="1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[17px] font-bold text-[#f0f0f2]">
                                        <ShinyText text="Enterprise API" speed={3} />
                                    </h3>
                                    <p className="text-[14px] font-normal leading-[1.6] text-[#8a8f9e]">
                                        Seamlessly integrate deterministic pricing data into your infrastructure. REST, WebSockets, and GraphQL endpoints.
                                    </p>
                                </ParticleCard>
                            </div>
                        </div>

                        {/* Right Column (Code Block) */}
                        <ParticleCard
                            disableAnimations={shouldDisableAnimations}
                            enableTilt={false}
                            enableMagnetism={false}
                            clickEffect={false}
                            glowColor="0, 200, 212"
                            className="card card--border-glow bg-[#111318]/90 backdrop-blur-xl border border-white/10 rounded-[16px] flex flex-col overflow-hidden h-full min-h-[380px]"
                        >
                            {/* Mac OS Style Header */}
                            <div className="h-[44px] bg-[#16181f] border-b border-white/5 flex items-center px-[16px] justify-between">
                                <div className="flex gap-[6px]">
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="text-[11px] font-medium text-[#8a8f9e] font-mono">response.json</div>
                                <div className="w-[42px] h-[26px] border border-white/10 rounded-[6px] flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-[#8a8f9e] fill-none stroke-[2px]">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                </div>
                            </div>
                            {/* Code Content */}
                            <div className="p-[24px] font-mono text-[13px] leading-[1.8] text-[#8a9ab8] overflow-x-auto h-full bg-[#0d0e11]">
                                <div className="mb-4">
                                    <span className="text-[#00c8d4] font-bold">GET</span> <span className="text-[#f0f0f2]">/api/v1/prices?symbol=XLM</span>
                                </div>
                                {"{"}<br />
                                {"  "}<span className="text-[#8aebff]">"symbol"</span>: <span className="text-[#4ae176]">"XLM"</span>,<br />
                                {"  "}<span className="text-[#8aebff]">"price"</span>: <span className="text-[#ffb4ab]">0.1142</span>,<br />
                                {"  "}<span className="text-[#8aebff]">"timestamp"</span>: <span className="text-[#ffb4ab]">1715428901</span>,<br />
                                {"  "}<span className="text-[#8aebff]">"signatures"</span>: <span className="text-[#ffb4ab]">12</span>,<br />
                                {"  "}<span className="text-[#8aebff]">"nodes"</span>: [<br />
                                {"    "}<span className="text-[#4ae176]">"stellar-core-us-1"</span>,<br />
                                {"    "}<span className="text-[#4ae176]">"stellar-core-eu-2"</span>,<br />
                                {"    "}<span className="text-[#4ae176]">"parallax-oracle-1"</span><br />
                                {"  "}]<br />
                                {"}"}
                            </div>
                        </ParticleCard>

                    </div>
                </div>
            </section>
        </main>
    );
}
