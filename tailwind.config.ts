import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-outfit)", "var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
                display: ["var(--font-oswald)", "sans-serif"],
                anton: ["var(--font-anton)", "sans-serif"],
                grotesk: ["var(--font-space-grotesk)", "sans-serif"],
                mono: ["var(--font-space-mono)", "monospace"],
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
            colors: {
                black: "#000000",
                neutral: {
                    900: "#0a0a0a",
                    800: "#171717",
                },
            },
            animation: {
                "spin-slow": "spin 12s linear infinite",
                marquee: "marquee 25s linear infinite",
                float: "float 6s ease-in-out infinite",
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
