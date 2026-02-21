# Parallax | The Universal Stellar Oracle

Parallax is a high-performance, minimalist decentralized application (DApp) built for the Stellar Network. Designed with a focus on premium aesthetics and seamless usability, it serves as a modern interface for interacting with the Stellar blockchain.

## Vision

Parallax serves as the ultimate "Oracle" and command center for the Stellar network. We are bridging the gap between complex blockchain data and user experience by converging real-time asset feeds, portfolio management, and smart contract interactions into a single, unified interface. We are leaving behind cluttered Web3 tools to deliver the refined, professional experience that the next generation of global finance demands.

## Features

### Currently Supported
- **Wallet Integration**: Secure, non-custodial connection via [Freighter](https://www.freighter.app/).
- **Asset Dashboard**: Real-time view of your XLM balance and account status.
- **Transaction Builder**: 
  - Streamlined interface to send XLM.
  - Dynamic recipient address validation.
  - Real-time transaction signing and hash tracking.
- **Live Market Data**: Real-time XLM/USD price ticker powered by market APIs.
- **Responsive Design**: A modular "Bento Grid" layout that adapts to any screen size.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router + Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Blockchain**:
  - [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api)
  - [stellar-sdk](https://github.com/stellar/js-stellar-sdk)

## Getting Started

### Prerequisites
- Node.js (v18+)
- [Freighter Wallet Extension](https://www.freighter.app/) installed in your browser.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyushmanGupta21/Parallax.git
   cd Parallax
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the DApp.

## License

MIT License.
