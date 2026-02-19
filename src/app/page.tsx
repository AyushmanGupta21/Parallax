"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { PriceTicker } from "@/components/PriceTicker";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-black selection:bg-red-500/30 selection:text-red-200 overflow-hidden">
      <Navbar />
      <Hero />
      <PriceTicker />
      <BentoGrid />

      {/* Footer */}
      <footer className="py-12 text-center text-white/20 uppercase tracking-widest text-xs font-bold relative z-10">
        <p>Built for Rise In Stellar Mastery • Level 1</p>
      </footer>
    </main>
  );
}
