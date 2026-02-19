import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, Outfit, Anton, Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Parallax API | Stellar Oracle",
  description: "Real-time Stellar network price feeds and data aggregation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${outfit.variable} ${anton.variable} ${playfair.variable} ${oswald.variable} font-sans antialiased bg-black text-white selection:bg-white/20 selection:text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
