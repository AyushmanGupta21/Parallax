"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function WaveBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center z-0">
      <div className="absolute w-[140%] h-[100%] top-[10%] opacity-40">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main wave */}
          <motion.path
            d="M 0,200 C 300,100 600,300 900,200 C 1200,100 1440,200 1440,200 L 1440,400 L 0,400 Z"
            fill="url(#wave-gradient)"
            initial={{ d: "M 0,200 C 300,100 600,300 900,200 C 1200,100 1440,200 1440,200 L 1440,400 L 0,400 Z" }}
            animate={{
              d: [
                "M 0,200 C 300,100 600,300 900,200 C 1200,100 1440,200 1440,200 L 1440,400 L 0,400 Z",
                "M 0,200 C 300,300 600,100 900,200 C 1200,300 1440,200 1440,200 L 1440,400 L 0,400 Z",
                "M 0,200 C 300,100 600,300 900,200 C 1200,100 1440,200 1440,200 L 1440,400 L 0,400 Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
            }}
          />
          {/* Secondary wave with less opacity for depth */}
          <motion.path
            d="M 0,250 C 400,150 800,350 1440,250 L 1440,400 L 0,400 Z"
            fill="url(#wave-gradient-2)"
            initial={{ d: "M 0,250 C 400,150 800,350 1440,250 L 1440,400 L 0,400 Z" }}
            animate={{
              d: [
                "M 0,250 C 400,150 800,350 1440,250 L 1440,400 L 0,400 Z",
                "M 0,250 C 400,350 800,150 1440,250 L 1440,400 L 0,400 Z",
                "M 0,250 C 400,150 800,350 1440,250 L 1440,400 L 0,400 Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />

          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c8d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0d0e10" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-gradient-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c8d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0d0e10" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle animated floating dots for "data stream" feel */}
      <div className="absolute inset-0" style={{ opacity: 0.4 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00c8d4]"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -20 - Math.random() * 30],
              opacity: [0, 0.8, 0],
              x: [0, (Math.random() - 0.5) * 20]
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 5 + 5,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
