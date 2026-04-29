# Parallax — Universal Prices API & Oracle Indexer
## Rise In Stellar Journey to Mastery — Full Project Documentation

---

## Project Identity

| Field | Value |
|---|---|
| **Project Name** | Parallax — Universal Prices API & Oracle Indexer |
| **Live Demo** | [parallax-eight-psi.vercel.app](https://parallax-eight-psi.vercel.app) |
| **GitHub** | [github.com/AyushmanGupta21/Parallax](https://github.com/AyushmanGupta21/Parallax) |
| **Network** | Stellar Testnet |
| **Deployed Contract** | `CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE` |
| **Contract Explorer** | [stellar.expert/explorer/testnet/contract/CCJ7...](https://stellar.expert/explorer/testnet/contract/CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE) |
| **Deployer Address** | `GAWJNUSBQAKG3X6UT6NJAGL4YWJDYINR3MULB7FU4EY6B6BOOMY2FPOK` |
| **Deployment Date** | 2026-04-28 |
| **Current Belt** | 🔵 Level 5 — Blue Belt (technical MVP complete) |

---

## The Problem

The Stellar ecosystem lacks a single, reliable, and standardized API to source aggregated real-time and historical price data for both classic Stellar assets and SEP-41 Soroban contract tokens. This fragmentation forces DeFi developers to build custom indexers just to fetch prices, hindering the development of lending protocols, portfolio trackers, and AMMs.

## The Solution

Parallax is a full-stack, production-grade developer platform that:
1. **Indexes prices** from the Stellar DEX (order books via Horizon) and CoinGecko
2. **Serves them** via a REST API endpoint (`GET /api/prices`)
3. **Gates access** using a Soroban smart contract — developers must pay a 10 XLM registration fee to receive an API key
4. **Provides a Web3 dashboard** where developers connect a wallet, generate their API key, and view live price data

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Language** | TypeScript + Rust | TS 5.x, Rust 2021 edition |
| **Styling** | Tailwind CSS | v4 |
| **Animations** | Framer Motion | v12 |
| **Multi-Wallet** | @creit.tech/stellar-wallets-kit | v2.1.0 |
| **Blockchain SDK** | @stellar/stellar-sdk | v14 |
| **Smart Contracts** | Soroban SDK (Rust) | v22 |
| **Network** | Stellar Testnet | Horizon + Soroban RPC |
| **CI/CD** | GitHub Actions | — |
| **Deployment** | Vercel | — |

---

## Full Implementation Audit by Belt Level

---

### ✅ Level 1 — White Belt: COMPLETE

**Goal:** Prove Stellar testnet connection, wallet integration, and basic XLM operations.

#### What Was Built

| Feature | File | Detail |
|---|---|---|
| Next.js 16 + Tailwind v4 scaffold | `package.json`, `tailwind.config.ts` | App Router, TypeScript, Framer Motion |
| Landing page with Connect Wallet CTA | `src/components/Hero.tsx` | Animated hero with gradient effects |
| Multi-wallet connection | `src/hooks/useWallet.ts` | StellarWalletsKit with localStorage persistence |
| XLM balance display | `src/lib/stellar.ts` → `fetchXLMBalance()` | Calls Horizon `/accounts/{id}`, extracts native balance |
| Send XLM form | `src/components/SendXLMForm.tsx` | Custom amount input, destination address, real signing |
| Transaction hash display | `src/components/SendXLMForm.tsx` | Links to Stellar Expert explorer |
| Error handling | All components | Wallet not found, rejected, insufficient balance |
| Animated price ticker | `src/components/PriceTicker.tsx` | Infinite scroll banner |
| Navbar with ScrollSpy | `src/components/Navbar.tsx` | Active state tracks scroll position |

#### Key Functions (`src/lib/stellar.ts`)
```typescript
fetchXLMBalance(publicKey)  // GET /accounts/{id} → native balance
buildSendXlmTx(sender, destination, amount)  // Builds XDR transaction
submitSignedTx(signedXdr)  // Submits to Horizon, returns tx hash
```

---

### ✅ Level 2 — Yellow Belt: COMPLETE

**Goal:** Multi-wallet support + first Soroban smart contract deployed.

#### What Was Built

| Feature | File | Detail |
|---|---|---|
| StellarWalletsKit integration | `src/hooks/useWallet.ts` | Freighter, LOBSTR, xBull, all default modules |
| Wallet state persistence | `src/hooks/useWallet.ts` | walletId + publicKey stored in localStorage |
| Wallet event listeners | `src/hooks/useWallet.ts` | STATE_UPDATED, WALLET_SELECTED, DISCONNECT events |
| Soroban api_registry contract | `contracts/api_registry/src/lib.rs` | Rust, Soroban SDK v22 |
| Contract: `register()` | `contracts/api_registry/src/lib.rs` | Stores developer address in persistent storage |
| Contract: `is_registered()` | `contracts/api_registry/src/lib.rs` | Returns bool from persistent storage |
| Contract: `get_fee()` | `contracts/api_registry/src/lib.rs` | Returns 10_000_000 stroops constant |
| Contract events | `contracts/api_registry/src/lib.rs` | Emits `registered` event on successful call |
| Error types | `contracts/api_registry/src/lib.rs` | AlreadyRegistered(1), NotRegistered(2), InsufficientBalance(3) |
| Frontend calls register | `src/components/ApiKeyCard.tsx` | `buildRegisterTx()` + `submitSorobanTx()` |
| Tx status tracking | `src/components/ApiKeyCard.tsx` | Building → Signing → Submitting → Success/Error |
| Live contract events feed | `src/components/ApiKeyCard.tsx` | Polls `fetchRegistrationEvents()` every 5s |

#### Smart Contract Functions
```rust
pub fn init(env: Env, treasury: Address)
pub fn register(env: Env, caller: Address, token: Address) -> Result<(), Error>
pub fn is_registered(env: Env, caller: Address) -> bool
pub fn get_fee(_env: Env) -> i128  // returns 10_000_000 stroops
```

#### Contract Deployment
```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/api_registry.wasm \
  --source deployer --network testnet
# → CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE
```

---

### ✅ Level 3 — Orange Belt: COMPLETE

**Goal:** Full tested mini-dApp with loading states and polished UX.

#### What Was Built

| Feature | File | Detail |
|---|---|---|
| 4 Rust unit tests | `contracts/api_registry/src/lib.rs` | Exceeds the 3-test requirement |
| Mock price data (gated) | `src/components/PriceDataCard.tsx` | Only shown if `is_registered()` returns true |
| Loading spinners | All components | Every async operation has a loading state |
| localStorage registration cache | `src/hooks/useWallet.ts`, `ApiKeyCard.tsx` | Key: `api_registry_{publicKey}` |
| README.md | `README.md` | Architecture, setup, contract commands, CI docs |

#### 4 Rust Unit Tests
| Test | Validates |
|---|---|
| `test_register_new_developer` | Happy path registration succeeds |
| `test_register_duplicate_fails` | Second call returns `AlreadyRegistered` error |
| `test_is_registered_false_for_unknown` | Unknown address returns false |
| `test_token_transfer_on_register` | Exactly `REGISTRATION_FEE` stroops deducted from developer, credited to treasury |

---

### ✅ Level 4 — Green Belt: COMPLETE

**Goal:** Advanced contracts with inter-contract calls and CI/CD pipeline.

#### What Was Built

| Feature | File | Detail |
|---|---|---|
| Inter-contract token call | `contracts/api_registry/src/lib.rs` | `register()` calls `token::Client::transfer()` to move 10 XLM |
| Native token contract address | `.env` | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` (Stellar Testnet SAC) |
| Token transfer test | `contracts/api_registry/src/lib.rs` | `test_token_transfer_on_register` verifies exact REGISTRATION_FEE deduction |
| Mobile responsive UI | All components | Tailwind breakpoints from 375px → 1440px+ |
| GitHub Actions CI/CD | `.github/workflows/ci.yml` | Two jobs: Rust tests + Next.js build |
| CI: Rust tests | `.github/workflows/ci.yml` | `cargo test --manifest-path contracts/Cargo.toml` |
| CI: WASM build verify | `.github/workflows/ci.yml` | Builds `wasm32-unknown-unknown` target |
| CI: Frontend build | `.github/workflows/ci.yml` | `npm run build` with testnet env vars |

#### Inter-Contract Call (Level 4 Core Requirement)
```rust
// Inside register():
let token_client = token::Client::new(&env, &token);
token_client.transfer(&caller, &treasury, &REGISTRATION_FEE);
// REGISTRATION_FEE = 10_000_000 stroops (10 XLM)
```

#### GitHub Actions Jobs
```yaml
jobs:
  contract-tests:   # cargo test + wasm32 build
  frontend-build:   # npm ci + npm run build
```

---

### ✅ Level 5 — Blue Belt: TECHNICAL IMPLEMENTATION COMPLETE

**Goal:** Full-stack working MVP — real backend indexer, authenticated REST API, real price data.

#### Architecture Overview

```
User Browser
    │
    ├─→ GET /api/prices (with auth headers)
    │       │
    │       ▼
    │   src/app/api/prices/route.ts   [Node.js runtime]
    │       │
    │       ├─ Step 1: Validate header presence
    │       ├─ Step 2: validateApiKey() → checks key = pk_{slice(pubkey)}
    │       ├─ Step 3: checkRegisteredOnChain() → Soroban RPC simulation
    │       │               │
    │       │               ├─ true  → proceed
    │       │               ├─ false → 401 "not registered"
    │       │               └─ null  → fail-open (RPC error, trust key)
    │       │
    │       └─ fetchPrices() → return JSON
    │               │
    │               ├─ XLM/USDC: Horizon mainnet order book
    │               ├─ XLM/yXLM: Horizon mainnet order book
    │               ├─ XLM/USD:  CoinGecko simple price API
    │               ├─ XLM/BTC:  CoinGecko (stellar.usd / bitcoin.usd)
    │               └─ XLM/ETH:  CoinGecko (stellar.usd / ethereum.usd)
    │
    └─→ Wallet signs tx → Soroban contract register()
```

#### Files Created for Level 5

**`src/lib/prices.ts`** — Server-side price indexer
- Fetches 5 asset pairs using a hybrid architecture
- **Stellar DEX order books** (Horizon mainnet) for XLM/USDC and XLM/yXLM
- **CoinGecko API** (free tier, no API key) for XLM/USD, XLM/BTC, XLM/ETH
- 30-second in-memory server cache (`_cache` module-level variable)
- Returns `PriceRow[]` with `pair`, `price`, `bid`, `ask`, `source`, `fetchedAt`

**`src/lib/apiAuth.ts`** — Server-side authentication
- `validateApiKey(pubkey, apiKey)` — verifies deterministic derivation: `pk_ + pubkey.slice(2,18) + pubkey.slice(-8)`; also validates G-address format via `StrKey.decodeEd25519PublicKey()`
- `checkRegisteredOnChain(pubkey)` — builds a Soroban `simulateTransaction` call for `is_registered(caller)` on the deployed contract; returns `boolean | null` (null on RPC/network error)

**`src/app/api/prices/route.ts`** — REST API endpoint
```
GET /api/prices
Headers required:
  x-stellar-pubkey:   G-address of the developer
  x-parallax-apikey:  Derived API key (pk_ prefix)

Response 200:
{
  "ok": true,
  "prices": [{ pair, price, bid, ask, source, fetchedAt }],
  "meta": { source, network, authMethod, cachedFor, servedAt }
}

Response 401:
  - Missing headers
  - Invalid API key format
  - Address confirmed not registered on-chain
```

#### Auth Flow Detail
```
1. Missing x-stellar-pubkey or x-parallax-apikey → 401
2. StrKey.decodeEd25519PublicKey(pubkey) fails → 401
3. apiKey !== pk_{pubkey.slice(2,18)+pubkey.slice(-8)} → 401
4. checkRegisteredOnChain() === false → 401 "not registered"
5. checkRegisteredOnChain() === null → PASS (RPC unavailable, trust key)
6. checkRegisteredOnChain() === true → PASS (on-chain confirmed)
7. fetchPrices() → 200 with live data
```

#### Price Data Sources

| Pair | Source | Method | Data |
|---|---|---|---|
| XLM/USDC | Stellar DEX | `horizon.stellar.org/order_book` | Best bid, best ask, mid price |
| XLM/yXLM | Stellar DEX | `horizon.stellar.org/order_book` | Best bid, best ask, mid price |
| XLM/USD | CoinGecko | `simple/price?ids=stellar` | Market price in USD |
| XLM/BTC | CoinGecko | `stellar.usd / bitcoin.usd` | Computed cross rate |
| XLM/ETH | CoinGecko | `stellar.usd / ethereum.usd` | Computed cross rate |

#### Client-Side Changes for Level 5

**`src/components/PriceDataCard.tsx`** (fully rewritten)
- Derives API key client-side: `pk_${pubkey.slice(2,18)+pubkey.slice(-8).toLowerCase()}`
- Sends `GET /api/prices` with `x-stellar-pubkey` and `x-parallax-apikey` headers
- Displays real price table: Pair / Price / Bid / Ask / Source
- Handles 401 "not registered" → shows lock screen
- Handles 401 "invalid key" / 500 → shows error with retry
- "Refresh" button re-fetches from the API

#### Other Level 5 Fixes
- **AlreadyRegistered → silent success**: When the contract returns `AlreadyRegistered`, `ApiKeyCard.tsx` now silently activates the API key instead of showing a red error banner
- **TypeScript build fix**: Replaced manual XDR buffer construction (`xdr.Hash.fromXDR(Buffer)`) with `new Contract(id).address().toScVal()` — fixes strict TypeScript build on Vercel
- **Environment consolidation**: Merged `.env.local` and `.env.example` into a single `.env` file (gitignored via `.env*` rule)

---

## Project File Structure

```
parallax/
├── .env                          # Single env file (gitignored)
├── .github/workflows/ci.yml      # GitHub Actions: Rust tests + Next.js build
├── contracts/
│   └── api_registry/
│       └── src/lib.rs            # Soroban smart contract (Rust)
├── docs/
│   ├── Parallax.md               # This file — full project documentation
│   └── clear-state.js            # Browser console script to reset localStorage
├── src/
│   ├── app/
│   │   ├── api/prices/route.ts   # GET /api/prices — Level 5 REST endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Main page (Navbar + Hero + PriceTicker + BentoGrid)
│   ├── components/
│   │   ├── ApiKeyCard.tsx        # Soroban register() + live contract events
│   │   ├── BalanceCard.tsx       # XLM balance + recent payments
│   │   ├── BentoGrid.tsx         # Dashboard layout
│   │   ├── Hero.tsx              # Landing page hero section
│   │   ├── Navbar.tsx            # Navigation with ScrollSpy + wallet button
│   │   ├── PriceDataCard.tsx     # Level 5: calls /api/prices with auth
│   │   ├── PriceTicker.tsx       # Animated infinite scroll ticker
│   │   ├── SendXLMForm.tsx       # XLM send with signing
│   │   └── WalletButton.tsx      # Connect/disconnect wallet UI
│   ├── hooks/
│   │   └── useWallet.ts          # WalletProvider context + StellarWalletsKit
│   └── lib/
│       ├── apiAuth.ts            # Server: validateApiKey + checkRegisteredOnChain
│       ├── axios-stub.ts         # Browser-side axios stub
│       ├── prices.ts             # Server: fetchPrices() — DEX + CoinGecko indexer
│       └── stellar.ts            # Client: Horizon + Soroban RPC helpers
└── next.config.ts                # Turbopack root, transpilePackages, webpack fallbacks
```

---

## Environment Variables

All variables are `NEXT_PUBLIC_*` (exposed to browser). No private keys stored.

| Variable | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ID` | `CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE` | Deployed api_registry contract |
| `NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT_ID` | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` | Native XLM Stellar Asset Contract |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | `GAWJNUSBQAKG3X6UT6NJAGL4YWJDYINR3MULB7FU4EY6B6BOOMY2FPOK` | Receives 10 XLM registration fees |
| `NEXT_PUBLIC_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon RPC for Soroban contract calls |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC for contract simulation |

---

## User Flow (End-to-End)

```
1. Developer visits parallax-eight-psi.vercel.app
2. Clicks "Connect Wallet" → StellarWalletsKit modal
3. Selects Freighter / LOBSTR / xBull → approves connection
4. Dashboard loads with live XLM balance and transaction history
5. Clicks "Generate API Key → 10 XLM"
   a. App builds Soroban transaction (register + token transfer)
   b. Wallet prompts for signature approval
   c. Transaction submitted to Stellar Testnet
   d. Smart contract deducts 10 XLM from developer to treasury
   e. Developer address stored in contract persistent storage
   f. "registered" event emitted on-chain
   g. API key displayed: pk_{deterministic_hash}
6. Clicks "Fetch Live Prices"
   a. Client sends GET /api/prices
      Headers: x-stellar-pubkey, x-parallax-apikey
   b. Server validates API key format
   c. Server calls is_registered() on Soroban contract
   d. Returns live prices from Stellar DEX + CoinGecko
   e. Dashboard shows 5 asset pairs with bid/ask/mid/source
```

---

## Complete Feature List

| Feature | Belt | Status |
|---|---|---|
| Next.js 16 + Tailwind v4 scaffold | L1 | ✅ |
| Connect Wallet (StellarWalletsKit — all wallets) | L1/L2 | ✅ |
| Live XLM balance via Horizon API | L1 | ✅ |
| Transaction history (last 10 payments) | L1 | ✅ |
| Send XLM with signing and tx hash | L1 | ✅ |
| Animated price ticker | L1 | ✅ |
| ScrollSpy navigation | L1 | ✅ |
| Soroban api_registry smart contract | L2 | ✅ |
| `register()` with event emission | L2 | ✅ |
| `is_registered()` query | L2 | ✅ |
| Live contract event feed (5s polling) | L2 | ✅ |
| Tx status: Building → Signing → Submitting | L2 | ✅ |
| 3 error types handled | L2 | ✅ |
| 4 Rust unit tests | L3 | ✅ |
| Loading spinners on all async operations | L3 | ✅ |
| localStorage registration cache | L3 | ✅ |
| Inter-contract 10 XLM token transfer | L4 | ✅ |
| Mobile responsive (375px → 1440px) | L4 | ✅ |
| GitHub Actions CI/CD pipeline | L4 | ✅ |
| Contract deployed on Stellar Testnet | L4/L5 | ✅ |
| `GET /api/prices` REST endpoint | L5 | ✅ |
| API key auth middleware | L5 | ✅ |
| On-chain registry verification (server-side) | L5 | ✅ |
| Real price indexer (5 pairs, 30s cache) | L5 | ✅ |
| Stellar DEX order book integration | L5 | ✅ |
| CoinGecko price feed integration | L5 | ✅ |
| Vercel production deployment | L5 | ✅ |
| TypeScript strict build passing | L5 | ✅ |
| **5 real users onboarded** | **L5** | **⏳ Needed** |

---

## Level 5 Approval Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Production-ready full-stack MVP | ✅ | Deployed on Vercel, build passes |
| Backend data infrastructure | ✅ | `src/lib/prices.ts` + `src/app/api/prices/route.ts` |
| Real price data from Stellar network | ✅ | Horizon DEX order books + CoinGecko |
| REST API with auth middleware | ✅ | API key + Soroban on-chain registry check |
| Soroban contract interaction (server-side) | ✅ | `simulateTransaction` for `is_registered()` |
| Updated architecture documentation | ✅ | This file |
| **5 real users registered on-chain** | ⏳ | Share at Stellar Discord `#dev-hack` |

---

## Elevator Pitch

> *"I am building Parallax — the Universal Prices API. It aggregates and indexes real-time price data for all native Stellar assets and Soroban tokens, delivering it via an authenticated REST API. Developers log into a Web3 dashboard, pay a 10 XLM registration fee via a Soroban smart contract, receive an API key, and immediately access live price feeds from the Stellar DEX and CoinGecko. The access control and billing are executed entirely on-chain. This directly addresses the active SCF v7.0 Prices API RFP."*

---

## SCF Alignment

This project directly targets the **Stellar Community Fund v7.0 Q1 2026 Prices API Request for Proposal**. By building exactly what the SDF is asking for, the project is positioned for post-hackathon grant funding while satisfying every technical requirement of the Rise In Blue Belt.
