# Parallax — The Universal Stellar Oracle

<p align="center">
  <img src="./image.png" alt="Parallax Landing Page — Wallet Connected" width="100%" />
</p>

**Parallax** is a high-performance, minimalist decentralized application (DApp) built on the **Stellar Network**. It provides a modern, premium interface for real-time wallet management, XLM transfers, and live network data — all powered by the Freighter non-custodial wallet extension.

Built as a **Level 1 Stellar Mastery** submission for Rise In, Parallax demonstrates core Stellar blockchain interactions including wallet authentication, native asset transfers on Testnet, and real-time transaction tracking.

---

## Features

- **🔐 Wallet Integration** — Secure, non-custodial connection via [Freighter](https://www.freighter.app/). Automatically reconnects on page reload.
- **💰 Live Balance Dashboard** — Real-time XLM balance with USD equivalent, fetched directly from the Stellar Horizon API.
- **📜 Transaction History** — Scrollable, live list of recent incoming and outgoing payments from your account.
- **📤 Send XLM** — Streamlined transaction builder with custom amount input, recipient address, and real-time signing and hash tracking.
- **📈 Live Price Ticker** — Animated, continuously-scrolling banner of live Stellar asset price pairs (XLM/USDC, AQUA/XLM, etc.).
- **🧭 ScrollSpy Navigation** — Navbar active state shifts dynamically between Home and Dashboard as you scroll.

---

## Screenshots

### Wallet Connected — Hero Page
> The landing page with Freighter wallet connected, showing the "Testnet Active" status and your truncated public key in the navbar.

<p align="center">
  <img src="./image.png" alt="Hero page with wallet connected" width="100%" />
</p>

---

### Balance Displayed, Successful Transaction & Transaction Result
> The Dashboard view showing your live XLM balance, USD equivalent, a filled-in Send Transaction form, and the full recent transaction history. The green **"Send Another Transaction"** button confirms a successful testnet payment, and the transaction hash (clickable link to Stellar Expert) is displayed below the form.

<p align="center">
  <img src="./image1.png" alt="Dashboard — Balance, send form, and transaction history" width="100%" />
</p>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Wallet | [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api) |
| Blockchain SDK | [stellar-sdk](https://github.com/stellar/js-stellar-sdk) |
| Network | Stellar Testnet (Horizon API) |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **[Freighter Wallet](https://www.freighter.app/)** browser extension installed and set to **Testnet** mode

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Connecting Your Wallet

1. Open the app in your browser.
2. Click **"Connect Wallet"** in the navbar.
3. Approve the connection in the Freighter popup.
4. Your wallet address and XLM balance will appear automatically.

> **Note:** Make sure Freighter is configured for **Testnet**. You can get free testnet XLM from the [Stellar Friendbot](https://laboratory.stellar.org/#?network=test).

---

## How to Send a Transaction

1. Connect your Freighter wallet.
2. Scroll down to the **Dashboard** section.
3. Enter the **amount** of XLM to send and the **recipient's Stellar address**.
4. Click **"Confirm XLM Send"** and approve the transaction in Freighter.
5. The transaction hash will appear below the form once confirmed. The balance and transaction history will refresh automatically.

---

## License

MIT License.
