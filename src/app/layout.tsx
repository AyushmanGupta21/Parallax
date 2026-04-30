import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/hooks/useWallet";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Parallax | Sovereign Institutional Liquidity",
  description: "The premier oracle and price API platform for enterprise developers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} bg-[#0b0c0e] bg-grid-pattern text-[#f0f0f2] font-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden w-full max-w-[100vw]`}
      >
        <div className="absolute inset-0 bg-[#0b0c0e]/60 pointer-events-none z-[-1]" />
        <WalletProvider>
          <Navbar />
          <main className="flex-grow flex flex-col pt-[56px] z-10">
            {children}
          </main>
          <footer className="w-full border-t border-white/5 py-[32px] mt-auto z-10 relative bg-[#0b0c0e]">
            <div className="flex flex-col md:flex-row items-center justify-between px-[40px] max-w-[1440px] mx-auto gap-[16px]">
              <div className="flex flex-col md:flex-row items-center gap-[12px]">
                <div className="flex items-center gap-[8px]">
                  <span className="material-symbols-outlined text-[#8a8f9e] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                  <span className="text-[15px] font-bold tracking-wide text-[#f0f0f2]">Parallax</span>
                </div>
                <span className="text-[13px] text-[#565d70] text-center md:text-left tracking-wide">© 2024 Parallax. Sovereign Institutional Liquidity.</span>
              </div>
              <nav className="flex gap-[32px]">
                <a href="#" className="text-[13px] font-medium text-[#8a8f9e] hover:text-[#f0f0f2] transition-colors">Terms</a>
                <a href="#" className="text-[13px] font-medium text-[#8a8f9e] hover:text-[#f0f0f2] transition-colors">Privacy</a>
                <a href="#" className="text-[13px] font-medium text-[#8a8f9e] hover:text-[#f0f0f2] transition-colors">API Docs</a>
                <a href="#" className="text-[13px] font-medium text-[#8a8f9e] hover:text-[#f0f0f2] transition-colors">GitHub</a>
                <a href="#" className="text-[13px] font-medium text-[#8a8f9e] hover:text-[#f0f0f2] transition-colors">Status</a>
              </nav>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
