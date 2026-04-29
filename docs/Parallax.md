# Advanced Core Stellar Ecosystem Architectures: Strategic Project Proposals for the Rise In Mastery Program

The convergence of advanced cryptographic primitives and decentralized ledger technology represents the frontier of Web3 innovation, fundamentally altering the parameters of programmatic finance. As the Stellar network continues its aggressive expansion through the 2025 and 2026 fiscal cycles, the ecosystem has matured to support high-throughput operations, sophisticated smart contracts via the Soroban execution environment, and native zero-knowledge (ZK) infrastructure. For developers participating in the Rise In Stellar Journey to Mastery program—specifically those targeting the advanced Level 5 (Blue Belt) and Level 6 (Black Belt) tiers—the expectations transcend basic decentralized application deployment.

Success at these highest echelons requires the orchestration of complex, production-ready full-stack applications that leverage advanced Stellar primitives such as Account Abstraction, Fee Sponsorship, ZK proofs, and comprehensive Stellar Ecosystem Proposals (SEPs) for cross-border liquidity flows. This exhaustive research report provides an architectural and strategic blueprint for multiple advanced, pure-blockchain full-stack projects. These proposals are explicitly engineered to meet the stringent technical requirements of the Rise In Level 6 Black Belt, align with the proven trajectories of Stellar Community Fund (SCF) winners, and establish a high-conversion, deterministic pathway to onboarding the requisite user base for final Demo Day validation.

## The Macro-Architectural Landscape of Stellar in 2025-2026

To architect solutions capable of securing top-tier grants and Rise In belt advancements, it is imperative to thoroughly contextualize the current state of the Stellar ecosystem. The network has undergone a profound transformation, evolving from a strictly payments-focused ledger into a comprehensive, Turing-complete decentralized finance (DeFi) and asset tokenization platform.

By the conclusion of 2025, the Stellar network achieved significant adoption milestones, demonstrating that over a decade of infrastructure development had successfully prepared the protocol for institutional deployment.

During this period, real-world asset (RWA) tokenization experienced a 172% year-over-year growth, characterized by consistent issuance distributed across multiple global institutions rather than isolated pilot programs. Total Value Locked (TVL) across the network increased by 95%, surpassing the $211 million threshold, supported by over 800 active projects iterating across payments, savings, lending, and liquidity protocols.

Institutional validation became highly visible with the integration of major financial entities. Franklin Templeton expanded its fully tokenized U.S. Treasury fund, representing over $580 million in assets, to European institutional investors operating directly on the Stellar network. Concurrently, global payment processors such as MoneyGram launched stablecoin-powered applications, and PayPal's PYUSD stablecoin achieved native integration on Stellar. Furthermore, the Chicago Mercantile Exchange (CME) Group announced the addition of regulated XLM futures, signaling immense institutional demand.

The underlying catalyst for this growth was a series of aggressive protocol upgrades. Protocol 23 (Whisk) introduced parallel transaction processing for Soroban, unified event structures, and fee reductions targeting 5,000 TPS. Protocol 25 (X-Ray) introduced native support for zero-knowledge primitives (BN254 elliptic curves and Poseidon hash functions), allowing developers to build configurable, compliance-forward privacy applications.

## Mastering the Rise In Belt Progression Framework

The Rise In Stellar Journey to Mastery program is a structured, progressive framework. Participants advance through a belt system competing for a portion of an $8,000+ monthly prize pool.

- **Level 5, Blue Belt** — "MVP with Users" ($100 tier): Deliver a real MVP with at least **5 real users**.
- **Level 6, Black Belt** — "Scale and Demo Day" ($150 tier): Scale to **20–30+ verified users** with Account Abstraction, cross-border flows, and Fee Sponsorship.

## Core Technological Primitives Required for Black Belt Certification

### 1. Account Abstraction and Biometric Smart Wallets
Implemented via `CustomAccountInterface` and `__check_auth` in Soroban. Allows secp256r1 / WebAuthn passkey authentication (FaceID, TouchID, Windows Hello) instead of seed phrases.

### 2. Algorithmic Fee Sponsorship (CAP-0015)
Fee-bump transactions allow the application to sponsor XLM gas fees on behalf of users. Must use `simulateTransaction` to precisely calculate STROOPs before submission.

### 3. Comprehensive Interoperability via SEPs
SEP-24 (hosted deposit/withdrawal), SEP-31 (cross-border remittances), SEP-38 (quote endpoints), SEP-12 (KYC/AML).

### 4. Zero-Knowledge Primitives (Protocol 25 / X-Ray)
Native BN254 / Poseidon host functions allow Groth16 proof verification on-chain — enabling confidential token balances and private DeFi operations.

## Strategic Project Proposal: Universal "Prices API" & Oracle Indexer

A backend-heavy full-stack developer tooling platform that aggregates, normalizes, and indexes real-time and historical price data for all native Stellar assets and SEP-41 Soroban contract tokens, delivered via a highly available REST/GraphQL API.

The frontend is a developer dashboard where users generate API keys (secured via Soroban Smart Wallets and Account Abstraction). Billing is handled directly via Soroban smart contracts, allowing developers to pay incrementally using stablecoins, with fees sponsored via CAP-0015.

This project directly answers the active **SCF v7.0 RFP** for a "Prices API", virtually guaranteeing post-hackathon grant funding.

## Level-by-Level Build Prompts

### Level 1: White Belt — Foundation & Wallets
Build the developer dashboard landing page with wallet connection and XLM balance display.

### Level 2: Yellow Belt — Multi-Wallet & Basic Contract
Replace Freighter with StellarWalletsKit. Deploy a Soroban `api_registry` contract with `register_developer()`.

### Level 3: Orange Belt — Mini-dApp, Tests & Polish
Add 3+ Rust unit tests, mock price data gated by registration, loading states, localStorage caching.

### Level 4: Green Belt — Advanced Contracts & CI/CD
Inter-contract token call (10 XLM registration fee), mobile responsiveness, GitHub Actions CI/CD pipeline.

### Level 5: Blue Belt — The Real MVP Checkpoint
Build the actual Node.js/Express backend indexer: fetch real prices from Stellar RPC, store in SQLite/PostgreSQL, expose `/api/prices` with wallet-signature middleware checking on-chain registry. Onboard first 5 real developers.

### Level 6: Black Belt — Scale & Advanced Web3 Features
Implement Account Abstraction (secp256r1 / WebAuthn passkeys) and CAP-0015 Fee Sponsorship. Backend Paymaster wraps transactions in FeeBump. Admin metrics dashboard. Scale to 30+ users.

---

## Project Overview

**Project Name:** Parallax — Universal Prices API & Oracle Indexer  
**Network:** Stellar Testnet  
**Deployed Contract:** `CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE`  
**Live Demo:** [parallax-eight-psi.vercel.app](https://parallax-eight-psi.vercel.app)

---

## Implementation Audit (Current Status)

> Last updated: 2026-04-29

### ✅ Level 1 — White Belt: COMPLETE

| Requirement | Implementation | File |
|---|---|---|
| Next.js + Tailwind scaffold | Next.js 16 + Tailwind CSS v4 | `package.json` |
| Landing page with Connect Wallet | Hero section with wallet CTA | `src/components/Hero.tsx` |
| Stellar wallet connection | StellarWalletsKit (Freighter, LOBSTR, etc.) | `src/hooks/useWallet.ts` |
| XLM balance display | `fetchXLMBalance()` via Horizon API | `src/lib/stellar.ts` |
| Send XLM with tx hash | `buildSendXlmTx()` + `submitSignedTx()` | `src/components/SendXLMForm.tsx` |
| Error handling | Wallet not found, rejected, insufficient balance | `src/hooks/useWallet.ts` |

### ✅ Level 2 — Yellow Belt: COMPLETE

| Requirement | Implementation | File |
|---|---|---|
| Multi-wallet via StellarWalletsKit | `@creit.tech/stellar-wallets-kit`, all default modules | `src/hooks/useWallet.ts` |
| Soroban `api_registry` contract | `register()`, `is_registered()`, `get_fee()` | `contracts/api_registry/src/lib.rs` |
| Emits `registered` event | `env.events().publish(...)` on successful register | `contracts/api_registry/src/lib.rs` |
| Frontend calls `register` | `buildRegisterTx()` + `submitSorobanTx()` | `src/components/ApiKeyCard.tsx` |
| Tx status tracking | Building → Signing → Submitting → Success/Error | `src/components/ApiKeyCard.tsx` |

### ✅ Level 3 — Orange Belt: COMPLETE

| Requirement | Implementation | File |
|---|---|---|
| ≥3 Rust unit tests | **4 tests**: happy path, duplicate fail, unknown address, token transfer amount | `contracts/api_registry/src/lib.rs` |
| Mock price data gated by registration | `checkIsRegistered()` gates `PriceDataCard` | `src/components/PriceDataCard.tsx` |
| Loading spinners | All async ops have loading states | All component files |
| localStorage caching | Wallet ID + public key persisted | `src/hooks/useWallet.ts` |
| README with architecture & test commands | Full setup guide, contract commands, CI docs | `README.md` |

### ✅ Level 4 — Green Belt: COMPLETE

| Requirement | Implementation | File |
|---|---|---|
| Inter-contract token call | `token::Client::transfer()` for 10 XLM fee | `contracts/api_registry/src/lib.rs` |
| Tests mock token transfer | `test_token_transfer_on_register` validates exact fee deduction | `contracts/api_registry/src/lib.rs` |
| Mobile responsive | Tailwind breakpoints throughout all components | All component files |
| GitHub Actions CI/CD | `cargo test` + Next.js build on every push to `main` | `.github/workflows/ci.yml` |

### ❌ Level 5 — Blue Belt: INCOMPLETE

**Current status:** The project is a fully-functional Level 4 dApp. The smart contract is deployed on Stellar Testnet and all frontend interactions work with real on-chain state. However, the Level 5 backend indexer infrastructure is **not yet built**.

| Requirement | Status | What's Missing |
|---|---|---|
| Smart contract deployed to Testnet | ✅ Done | `CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE` |
| Real wallet integrations verified | ✅ Done | Freighter, LOBSTR tested on testnet |
| Node.js/Express backend indexer | ❌ Missing | No `/backend` or `/server` directory exists |
| Scheduled price fetching from Stellar RPC | ❌ Missing | `PriceDataCard` serves **mock** JSON, not live on-chain prices |
| SQLite/PostgreSQL price storage | ❌ Missing | No database layer |
| `GET /api/prices` REST endpoint | ❌ Missing | No Next.js API routes or Express routes |
| Wallet-signature auth middleware | ❌ Missing | No server-side signature verification |
| On-chain registry check in middleware | ❌ Missing | `checkIsRegistered()` exists client-side only |
| Architecture docs updated | ❌ Missing | README still says "Level 4 — Green Belt" |
| **5 real users onboarded** | ❌ Missing | Required for Level 5 approval |

### ❌ Level 6 — Black Belt: NOT STARTED

| Requirement | Status |
|---|---|
| Account Abstraction (`CustomAccountInterface`, secp256r1) | ❌ Not implemented |
| CAP-0015 FeeBump Paymaster backend service | ❌ Not implemented |
| WebAuthn / Passkey login | ❌ Not implemented |
| Admin metrics dashboard | ❌ Not implemented |
| 20–30+ verified users | ❌ Not achieved |

---

## Gap Analysis: What Needs to Be Done for Level 5

To earn Blue Belt approval, **three things** must be completed:

### 1. Build the Backend Indexer
Create a backend service (Next.js API Routes are acceptable as an alternative to a separate Express server). It must:
- Use a scheduled job (cron or interval) to call Stellar Horizon/Soroban RPC and fetch live DEX prices for 5+ asset pairs
- Store prices in a lightweight database (SQLite via `better-sqlite3` is sufficient for testnet MVP)
- Expose `GET /api/prices` returning the stored price data as JSON

### 2. Implement Auth Middleware on `/api/prices`
The endpoint must:
- Accept a Stellar wallet signature in the request header
- Verify the signature server-side using `stellar-sdk`
- Query the on-chain `is_registered` contract function to confirm the caller paid the registration fee
- Return `401 Unauthorized` if either check fails

### 3. Onboard 5 Real Users
- Share the Vercel deployment link in **Stellar Discord #dev-hack** channel
- Ask 5 fellow Rise In participants to connect their Freighter wallet and call `register()` on testnet
- The `fetchRegistrationEvents()` function already indexes on-chain `registered` events — this can serve as proof of users

### Recommended Approach for Level 5
Use **Next.js API Routes** (`src/app/api/prices/route.ts`) to avoid maintaining a separate server. This keeps the project as a single deployable unit on Vercel and is fully compatible with the Level 5 requirements.

---

## Elevator Pitch

> *"I am building Parallax — the Universal Prices API. It aggregates and indexes real-time price data for all native Stellar assets and Soroban tokens, delivering it via a standardized REST API. Developers log into a Web3 dashboard to generate API keys, with all access control and billing executed entirely on-chain via Soroban smart contracts. The platform uses Account Abstraction for passkey logins and Fee Sponsorship for gasless registration — making it indistinguishable from a top-tier Web2 SaaS product. It directly addresses the active SCF v7.0 Prices API RFP."*

---

## Level 5 Readiness Verdict

| Dimension | Assessment |
|---|---|
| **Smart Contract Quality** | ✅ Production-ready. Deployed, tested (4 unit tests), inter-contract calls working. |
| **Frontend Quality** | ✅ Polished. Multi-wallet, animated UI, mobile-responsive, real on-chain interactions. |
| **Backend Indexer** | ❌ Not built. This is the single biggest blocker for Level 5. |
| **Real Price Data** | ❌ Mock only. Must fetch from Stellar DEX / Soroban pools. |
| **User Count** | ❌ 0 confirmed users. Need 5 for Level 5, 20–30 for Level 6. |
| **Overall Belt** | 🟡 **Level 4 (Green Belt)** — needs backend + users to unlock Level 5. |
