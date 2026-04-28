# Advanced Core Stellar Ecosystem Architectures: Strategic Project Proposals for the Rise In Mastery Program

The convergence of advanced cryptographic primitives and decentralized ledger technology represents the frontier of Web3 innovation, fundamentally altering the parameters of programmatic finance. As the Stellar network continues its aggressive expansion through the 2025 and 2026 fiscal cycles, the ecosystem has matured to support high-throughput operations, sophisticated smart contracts via the Soroban execution environment, and native zero-knowledge (ZK) infrastructure. For developers participating in the Rise In Stellar Journey to Mastery program—specifically those targeting the advanced Level 5 (Blue Belt) and Level 6 (Black Belt) tiers—the expectations transcend basic decentralized application deployment.

1

Success at these highest echelons requires the orchestration of complex, production-ready full-stack applications that leverage advanced Stellar primitives such as Account Abstraction, Fee Sponsorship, ZK proofs, and comprehensive Stellar Ecosystem Proposals (SEPs) for cross-border liquidity flows. This exhaustive research report provides an architectural and strategic blueprint for multiple advanced, pure-blockchain full-stack projects. These proposals are explicitly engineered to meet the stringent technical requirements of the Rise In Level 6 Black Belt, align with the proven trajectories of Stellar Community Fund (SCF) winners, and establish a high-conversion, deterministic pathway to onboarding the requisite user base for final Demo Day validation.

1

## The Macro-Architectural Landscape of Stellar in 2025-2026

To architect solutions capable of securing top-tier grants and Rise In belt advancements, it is imperative to thoroughly contextualize the current state of the Stellar ecosystem. The network has undergone a profound transformation, evolving from a strictly payments-focused ledger into a comprehensive, Turing-complete decentralized finance (DeFi) and asset tokenization platform.

3 By the conclusion of 2025, the Stellar network achieved significant adoption milestones, demonstrating that over a decade of infrastructure development had successfully prepared the protocol for institutional deployment.

5 During this period, real-world asset (RWA) tokenization experienced a 172% year-over-year growth, characterized by consistent issuance distributed across multiple global institutions rather than isolated pilot programs.

5 Total Value Locked (TVL) across the network increased by 95%, surpassing the $211 million threshold, supported by over 800 active projects iterating across payments, savings, lending, and liquidity protocols.

5

Institutional validation became highly visible with the integration of major financial entities. Franklin Templeton expanded its fully tokenized U.S. Treasury fund, representing over $580 million in assets, to European institutional investors operating directly on the Stellar network.

5 Concurrently, global payment processors such as MoneyGram launched stablecoin-powered applications, and PayPal's PYUSD stablecoin achieved native integration on Stellar.

5 Furthermore, the Chicago Mercantile Exchange (CME) Group announced the addition of regulated XLM futures, signaling immense institutional demand.

The underlying catalyst for this growth was a series of aggressive protocol upgrades designed to maximize the efficacy of the Soroban smart contract platform. The implementation of Protocol 23, codenamed Whisk, introduced parallel transaction processing for Soroban, unified event structures, and comprehensive fee reductions, effectively scaling the network's theoretical throughput toward a target of 5,000 transactions per second (TPS).

7 Most recently, the Protocol 25 (X-Ray) upgrade went live on mainnet, introducing native support for zero-knowledge primitives, specifically BN254 elliptic curves and Poseidon hash functions. This allows developers to build configurable, compliance-forward privacy applications necessary for true enterprise DeFi adoption.

Ecosystem Metric /
Upgrade

2025-2026 Status &
Impact

Relevance to Rise In
Black Belt Projects

Real-World Assets (RWA) 172% growth; >$580M in
Franklin Templeton fund;
Korean Bonds live.

Highlights the necessity of
building compliance-ready
interfaces.

Protocol 23 (Whisk) Parallel execution for
Soroban; targets 5000
TPS.

7

Ensures complex smart
contracts execute without
latency.

Protocol 25 (X-Ray) Native zero-knowledge
primitives (BN254,
Poseidon).

Enables the integration of
privacy-preserving DeFi
and KYC.

Developer Base 30-35% YoY growth; 800+
active projects.

5

Validates the vast
availability of open-source
tooling.

## Mastering the Rise In Belt Progression Framework

The Rise In Stellar Journey to Mastery program is a meticulously structured, progressive framework designed to guide developers from foundational blockchain concepts to the deployment of enterprise-grade applications.

1 As depicted in the program's visual roadmap, participants advance through a belt system, competing for a portion of an $8,000+ monthly prize pool. The early stages—White Belt ($10), Yellow Belt ($30), Orange Belt ($60), and Green Belt—focus on core competencies such as wallet integration, basic smart contract deployment, event handling, and preparation for production environments.

However, the transition to the advanced tiers requires a paradigm shift from theoretical understanding to practical, user-centric execution. Level 5, the Blue Belt, explicitly mandates the delivery of a real "MVP with Users" and offers a $100 prize pool tier.

1 This phase serves as an alpha validation stage, proving that the application's core logic is sound and that the user interface is accessible to at least 5 real users.

1

Level 6, the Black Belt, represents the pinnacle of the program. Earning the $150 prize at this stage requires "Scale and Demo Day" readiness.

1 Achieving this rank requires developers to scale their application to accommodate 20 to 30+ verified users. To impress the judges and secure validation at this level, the application cannot rely on basic native token transfers. It must integrate advanced ecosystem features—specifically Account Abstraction, cross-border flows, and Fee Sponsorship—that abstract the underlying blockchain complexity, rendering the decentralized application indistinguishable from a top-tier Web2 fintech product.

## Core Technological Primitives Required for Black Belt Certification

To successfully navigate the Rise In Level 6 requirements and position a project for an SCF Build Award, developers must synthesize a specific set of advanced Stellar and Soroban capabilities. The integration of the following four pure-blockchain pillars is non-negotiable for an elite-tier submission.

### 1. Account Abstraction and Biometric Smart Wallets

Traditional blockchain architectures burden users with the catastrophic risk of managing cryptographic seed phrases and private keys. Account abstraction eradicates this friction by decoupling the authentication of a user from the authorization of a transaction.

10 Within the Soroban execution environment, this is achieved by implementing the CustomAccountInterface, wherein a developer defines a contract-specific __check_auth function.

10 When the Soroban host detects a require_auth call associated with a custom abstract account, it automatically routes the signature payload, the user-defined signatures, and the list of contract invocations to this __check_auth function.

10 This programmable authorization framework allows for the creation of smart wallets that utilize WebAuthn standards, widely known as passkeys.

11 By leveraging the secp256r1 cryptographic curve, users can authenticate transactions using the secure enclave of their mobile devices or laptops (e.g., Apple FaceID or Android Biometrics).

11 This primitive is essential for onboarding the 30+ non-technical users required for Level 6.

### 2. Algorithmic Fee Sponsorship (CAP-0015)

A secondary barrier to decentralized application adoption is the necessity for users to hold native network tokens (XLM) to pay for network compute. Stellar mitigates this friction through the implementation of Core Advancement Proposal 15 (CAP-0015), which introduced fee-bump transactions.

13 This mechanism allows an application provider to subsidize the cost of user interactions programmatically.

A fee-bump transaction consists of an inner transaction envelope encapsulated within an outer transaction envelope signed by a sponsor account that covers the associated fees.

13 On the Soroban platform, fee calculations are multidimensional. The total transaction fee is the sum of a resource fee—which covers the specific CPU and memory consumed—and an inclusion fee.

14 A critical architectural consideration for Black Belt projects is the management of the refundable fee bug, a known edge case where refunds for fee-bumped transactions may incorrectly route to the sponsored user account rather than the sponsor treasury.

15 Advanced applications must mitigate this by utilizing the simulateTransaction RPC method to precisely calculate required fees prior to submission.

13

### 3. Comprehensive Interoperability via Stellar Ecosystem Proposals (SEPs)

To interface with global fiat systems and provide real-world utility, projects must deeply integrate the standardized API frameworks known as Stellar Ecosystem Proposals. These protocols define how decentralized applications communicate with anchors—regulated financial entities that serve as on-ramps and off-ramps.

16

For foundational connectivity, SEP-24 facilitates hosted deposit and withdrawal flows, allowing wallets and applications to interact programmatically with anchors.

17 For complex, international value transfer, SEP-31 provides a rigid, highly secure API framework that connects sending and receiving anchors.

20 The SEP-31 architecture manages cross-border remittances by aggregating data from the stellar.toml file, negotiating exchange rates and fees via SEP-38 quote endpoints, and monitoring continuous transaction statuses.

20 Both domestic and cross-border flows are bound by AML and KYC regulations, addressed natively via SEP-12.

18

### 4. Zero-Knowledge Primitives (Protocol 25 / X-Ray)

The ultimate differentiator for an elite 2026 project is the native integration of privacy-preserving smart contracts using the newly launched Protocol 25 (X-Ray) upgrades. Public ledgers inherently expose transaction amounts and wallet balances, which is a non-starter for enterprise adoption.

Protocol 25 introduced native host functions for the BN254 elliptic curve and Poseidon hash functions. This allows Soroban smart contracts to efficiently verify zero-knowledge proofs (specifically Groth16 proofs) on-chain without prohibitive gas costs. Developers can now build "zkTokens" or "Confidential Tokens" that prove a user has sufficient balance to execute a transaction without revealing the balance or the transaction amount to the public ledger, whilst maintaining total supply integrity. Mastering these primitives demonstrates absolute cutting-edge competence in the Stellar ecosystem.

Advanced Primitive Technical
Implementation

Requirement

Strategic Value for Black
Belt Validation

Account Abstraction CustomAccountInterface,
__check_auth, secp256r1
signature validation.

10

Eliminates seed phrases,
enabling Web2-style user
onboarding via biometrics.

Fee Sponsorship CAP-0015 wrapper, RPC
simulation for STROOP
optimization.

13

Removes the necessity for
users to acquire and hold
native XLM for gas fees.

SEP Integration REST API orchestration of
SEP-12, SEP-24, SEP-31,
SEP-38.

17

Connects the decentralized
protocol to real-world fiat
liquidity and compliance.

Zero-Knowledge (ZK) Protocol 25 BN254 /
Poseidon verification via
Soroban.

Unlocks enterprise DeFi by
shielding transaction
amounts and wallet
balances.

## Strategic Project Proposal : Universal "Prices API" & Oracle Indexer

A backend-heavy full-stack developer tooling platform that aggregates, normalizes, and indexes real-time and historical price data for all native Stellar assets and SEP-41 Soroban contract tokens, delivered via a highly available REST/GraphQL API.

### Architectural Blueprint and Data Flow

While consumer-facing dApps are popular, developer infrastructure is the lifeblood of the ecosystem. Currently, the Stellar ecosystem suffers from fragmented price data, making it difficult to build accurate portfolio trackers or DeFi lending protocols.

37

This project involves building a robust Rust-based indexer that continuously ingests data from Stellar Core and Soroban RPC nodes. The system will track liquidity pool ratios (e.g., Soroswap AMMs), orderbook states on the Stellar DEX, and cross-reference on-chain oracle feeds (like Chainlink or Reflector) to calculate the precise, real-time USD value of any given asset on the network.

37

The frontend component will be a developer dashboard where users can generate API keys (secured via Soroban Smart Wallets and Account Abstraction) to access the data endpoints. Billing for API usage can be handled directly via Soroban smart contracts, allowing developers to pay for API calls incrementally using stablecoins, with the transaction fees sponsored via CAP-0015 to ensure a frictionless developer experience.

10

### Fulfillment of Rise In and SCF Parameters

This project is strategically designed to answer the explicit, active "Prices API" Request for Proposal (RFP) listed for Q1 2026 in the SCF v7.0 RFP Track. By solving a known, highly prioritized ecosystem bottleneck, it virtually guarantees post-hackathon grant funding. Furthermore, it easily meets the Blue/Black belt requirements by deploying sophisticated smart contracts for API access control and billing.

1

### User Acquisition Strategy (Path to 30+ Users)

Because this is a B2B/Developer tool, acquiring 30 users means acquiring 30 developers. This will be achieved by open-sourcing the API documentation and actively promoting it in the dev-hack channels of the Stellar Discord.

38 By providing a generous free tier (subsidized via Fee Sponsorship) for fellow Rise In hackathon participants to use in their dApps, this project can organically acquire dozens of highly active developer users, easily satisfying the Level 6 Black Belt metrics.

## Comprehensive Go-To-Market and Technical Risk Mitigation

Developing highly sophisticated Soroban contracts fulfills only the technical mandate of the Rise In Black Belt; the secondary mandate is demonstrating verifiable real-world traction to claim the $150 tier.

1 A technically flawless architecture will fail the Demo Day evaluation if it operates in a vacuum.

### Eliminating Friction Through Advanced UI/UX Architecture

Blockchain applications historically suffer from abysmal user retention rates due to the cognitive overload of seed phrases and gas tokens.

29 To onboard 30+ active users efficiently, the frontend must completely abstract the underlying blockchain infrastructure. Developers must utilize comprehensive tooling such as the Scaffold Stellar boilerplate, in conjunction with React/Next.js and Tailwind CSS, to construct a Web2-grade interface.

33 By meticulously integrating Account Abstraction (passkeys) and Fee Sponsorship (paymasters), users interact with the application seamlessly; they never view a cryptographic public key or encounter an XLM gas fee prompt.

29

### Gamified Onboarding via Stellar QuestHub

Stellar QuestHub has proven to be an exceptional, high-conversion engine for user activation.

36 By creating a custom quest for the deployed project—such as "Mint a Smart Wallet" or "Complete a cross-border test transaction"—the project taps into a highly engaged pool of active testnet users. Offering a small XLM bounty or a unique NFT skill badge for completion guarantees an immediate influx of technologically competent users to satisfy the numerical user requirements of the Blue and Black belts.

1

### Mitigating the Refundable Fee Vulnerability

When utilizing CAP-0015 FeeBump transactions, developers must be acutely aware of Soroban's refundable fee component. A known edge case exists where execution refunds are incorrectly credited to the sponsored account rather than the sponsor treasury that originated the fee.

15 In projects utilizing Fee Sponsorship, the backend infrastructure must accurately estimate the exact resource consumption (STROOPs) prior to transaction submission using the simulateTransaction RPC method.

14 By highly optimizing the allocated fee limits to match the simulated consumption precisely, the contract minimizes the total refundable buffer, thereby neutralizing the financial risk of misdirected refunds.

14

By pursuing these deep, pure-blockchain architectures and rigorously applying Soroban best practices, developers can definitively prove their absolute mastery over Stellar's most complex capabilities, guarantee their Black Belt validation, and perfectly position themselves for a
major SCF grant.

## Prompt - Parallax API

Here is the step-by-step workflow and the exact Antigravity prompts to build the Universal "Prices API" & Oracle Indexer from Level 1 to Level 6.

### Level 1: White Belt (Foundation & Wallets)

Goal: Prove you can handle basic Stellar testnet connections and UI setup. Project Implementation: Build the developer dashboard landing page where users connect their wallet to eventually claim an API key.

● Antigravity Prompt:

"Agent, I am building a Web3 developer dashboard for a Stellar Prices API. Scaffold a Next.js project with Tailwind CSS. Implement a landing page with a 'Connect Wallet' button. Use the @stellar/freighter-api to connect to the Freighter wallet. Once connected, fetch the user's XLM balance on the Stellar Testnet and display it. Finally, create a simple form that allows the connected wallet to send exactly 1 testnet XLM to a hardcoded treasury address, and display the transaction success hash to the user. Provide clear error handling for rejected transactions."

### Level 2: Yellow Belt (Multi-Wallet & Basic Contract)

Goal: Deploy your first Soroban contract and handle multi-wallet support. Project Implementation: Create a basic "API Registration" smart contract. Replace the simple Freighter connection with StellarWalletsKit so users can log in with different wallets.

● Antigravity Prompt:

"Agent, let's upgrade our Stellar dashboard. First, replace the basic Freighter integration with @creit.tech/stellar-wallets-kit to support multiple wallets. Next, initialize a Soroban Rust smart contract in a /contracts/api_registry folder. Write a simple contract with a register_developer(caller: Address) function that stores the developer's address in the contract's storage and emits an event saying 'registered'. Create a deployment script for the Soroban testnet. Update the Next.js frontend to call this register_developer function when the user clicks 'Generate API Key', and display the pending/success transaction status."

### Level 3: Orange Belt (Mini-dApp, Tests, & Polish)

Goal: Deliver a complete, tested mini-dApp with loading states. Project Implementation: Add a mock API data display to the dashboard that only shows up if the smart contract confirms the user is registered. Write unit tests.

● Antigravity Prompt:

"Agent, we need to finalize the MVP for our API dashboard. First, write at least 3 comprehensive Rust unit tests for our api_registry Soroban contract testing successful registration and duplicate registrations. In the Next.js frontend, add a 'Fetch Mock Price Data' button that queries the contract state; if the user is registered, display a mock JSON response of asset prices. Implement strict loading spinners for all contract interactions and cache the user's wallet connection state in local storage. Finally, generate a comprehensive README.md detailing the project architecture, setup instructions, and test commands."

### Level 4: Green Belt (Advanced Contracts & CI/CD)

Goal: Prepare for production with inter-contract calls and automation. Project Implementation: Upgrade the API registry so developers must pay a 10 USDC (testnet) fee to register. The contract must interact with the native Stellar token contract.

● Antigravity Prompt:

"Agent, upgrade our api_registry Soroban contract to include an inter-contract call. The register_developer function must now accept a token address and transfer 10 tokens from the caller to the contract's treasury using the Soroban token interface. Update the Rust unit tests to mock this token transfer. Update the Next.js frontend to be perfectly mobile-responsive using Tailwind breakpoints. Finally, create a GitHub Actions CI/CD pipeline (.github/workflows/deploy.yml) that automatically runs cargo test on the Rust contracts and builds the Next.js frontend on every push."

### Level 5: Blue Belt (The Real MVP Checkpoint)

Goal: Transition from a frontend dashboard to a full-stack, working MVP. Project Implementation: Build the actual Node.js/Rust backend indexer that fetches real price data from the Stellar RPC and serves it via a REST API to registered users. This is the stage where you onboard your first 5 real developer friends to use your API endpoints.

● Antigravity Prompt:

"Agent, we are building the actual data infrastructure now. Create a new Node.js Express backend service. Write a scheduled script that connects to the Stellar Testnet RPC, fetches the current state of 5 major Soroban Liquidity Pools, calculates their exchange rates, and stores the prices in a local SQLite/PostgreSQL database. Expose a REST API endpoint /api/prices. Add middleware to this endpoint that verifies the requester's Stellar wallet signature, checks our Soroban api_registry contract to ensure they paid the subscription, and only then returns the live price data. Update our architecture documentation to reflect this full-stack flow."

### Level 6: Black Belt (Scale & Advanced Web3 Features)

Goal: Production readiness, Demo Day presentation, and zero-friction onboarding to reach 30+ users. Project Implementation: Implement Account Abstraction (Smart Wallets) and Fee Sponsorship. Developers should be able to log in with a Passkey (FaceID/TouchID) and subscribe to your API without paying XLM gas fees.

● Antigravity Prompt:

"Agent, we are optimizing for massive scale by removing Web3 friction. First, implement Account Abstraction. Update our Soroban contract to act as a Smart Wallet implementing CustomAccountInterface, utilizing secp256r1 verification so users can authenticate with WebAuthn Passkeys instead of Freighter. Second, implement a backend Paymaster service using the Stellar SDK. When a user calls the register_developer function, our backend must wrap their transaction in a CAP-0015 FeeBump transaction, simulate it to estimate STROOPs, and pay the network XLM inclusion fee on their behalf. Create an admin metrics dashboard in the frontend tracking active API subscribers."

By following this exact progression, you satisfy the unbroken chain requirement, meet the specific technical checklist of every single belt, and arrive at Demo Day with a highly complex, highly requested developer tooling platform.

Here is the comprehensive documentation and workflow for the Universal "Prices API" & Oracle Indexer project.

## 1. Project Overview: What It Is

The Universal Prices API is a full-stack, developer-facing decentralized application (dApp) and indexing service. It continuously aggregates, normalizes, and serves real-time and historical price data for all native Stellar assets and SEP-41 Soroban smart contract tokens. The system consists of a backend data-ingestion engine, a REST/GraphQL API for data delivery, and a Web3 frontend dashboard where developers manage their API keys, authenticated and billed entirely via Soroban smart contracts.

## 2. Strategic Rationale: Why It Was Chosen

This project was specifically chosen because it perfectly aligns with the current funding priorities of the Stellar ecosystem. For the Q1 2026 funding cycle, the Stellar Community Fund (SCF) published an active Request for Proposals (RFP) explicitly asking developers to build a "Prices API". By building exactly what the network has requested, you maximize your chances of securing a post-hackathon grant through the SCF RFP Track.

Furthermore, based on the Rise In belt progression requirements, your project must evolve into a functional dApp. Because this project requires a web dashboard interacting with smart contracts for user registration, access control, and billing, it perfectly fulfills the program's mandate for building a production-ready Web3 application.

## 3. Ecosystem Impact

Currently, the Stellar ecosystem suffers from fragmented price data, meaning developers have to build custom indexing logic or rely on disparate sources to find asset prices. This fragmentation severely hinders the creation of accurate decentralized finance (DeFi) protocols, such as lending platforms or portfolio trackers, and increases the integration complexity for builders. By providing a single, reliable, and standardized API that aggregates prices from the Stellar DEX, Automated Market Makers (AMMs), and on-chain oracles (like Chainlink or Reflector), this project directly solves a major pain point and empowers the broader developer community.

## 4. User-Based Workflow

The primary users of this dApp are other developers. The workflow is designed to completely eliminate traditional Web3 friction to help you easily reach the 30+ user requirement for your Black Belt:

- Step 1: Frictionless Onboarding: A developer visits your web dashboard. Instead of being forced to install a browser wallet extension or write down a 24-word seed phrase, they log in using a WebAuthn passkey (e.g., Apple FaceID, Android Biometrics, or Windows Hello). This is powered by Soroban's Account Abstraction, which uses the secp256r1 cryptographic curve to securely verify device biometrics directly on-chain.
- Step 2: Gasless Registration: The user clicks "Generate API Key." This triggers a Soroban smart contract transaction to register their account. To ensure a smooth experience, the application uses CAP-0015 Fee-bump transactions to sponsor the network XLM inclusion fees on behalf of the user.
- Step 3: Smart Contract Billing: The developer gets a generous free tier (perfect for getting your Rise In testnet users onboarded). If they require a high-volume premium tier later, they deposit Stellar-native stablecoins (like USDC) into the platform's Soroban smart contract. The contract tracks their balance and deducts micro-payments based on their actual API usage.
- Step 4: Data Consumption: The developer integrates your REST endpoint into their own application, passing their API key in the header to securely fetch the aggregated token prices for their DeFi platform.

## 5. Why It Is Unique

What sets this project apart is how it blends heavy backend data infrastructure with cutting-edge Web3 user experience. While many dApps focus on consumer retail features (like simple token swaps or NFTs), this is a vital B2B (Business-to-Business) tool. It uses the blockchain not just for storing data, but as the actual authentication and billing infrastructure for a SaaS (Software as a Service) product. By leveraging Account Abstraction for seedless logins and Fee Sponsorship for gasless transactions, it offers the seamless, instant experience of a traditional Web2 platform while remaining entirely decentralized.

Here is a professional, high-impact pitch you can use to explain the Universal Prices API & Oracle Indexer to Rise In mentors, hackathon judges, or Stellar Community Fund (SCF) reviewers. It is structured to highlight exactly what they are looking for: technical depth, ecosystem alignment, and a realistic scaling strategy.

## The Elevator Pitch (For a quick introduction)

"I am building the Universal Prices API—a full-stack developer platform that aggregates and indexes real-time price data for all native Stellar assets and Soroban tokens. It solves a major ecosystem bottleneck by providing a single, standardized REST API for DeFi builders. To make onboarding frictionless, the developer dashboard uses Soroban Account Abstraction for passkey logins and Fee Sponsorship for gasless API key generation and billing."

## The Deep Dive (For the Level 4 to 5 Mentor Checkpoint & Demo Day)

### 1. The Problem (Ecosystem Gap)
Currently, the Stellar ecosystem suffers from highly fragmented price data. The network lacks a single, reliable API to source aggregated, real-time, and historical price data for both classic Stellar assets and SEP-41 Soroban contract tokens. This fragmentation forces DeFi developers to build custom indexers just to fetch prices, which severely hinders the development of accurate lending protocols, AMMs, and portfolio trackers.

### 2. The Solution & Technical Architecture
To solve this, I am building a robust indexing engine that continuously aggregates data from the Stellar DEX, Soroban Liquidity Pools, and on-chain oracles.

However, this isn't just a traditional Web2 backend; it is a fully functioning dApp. Developers log into a web dashboard to generate their API keys and manage their data subscriptions. The access control and incremental billing are handled entirely on-chain via Soroban smart contracts.

### 3. Why This Wins the Black Belt & SCF Funding (The "Aha!" Moment)
There are three strategic reasons why this project is perfectly positioned for the highest tier of rewards:

- Direct Alignment with SCF Goals: This project is not a random idea; it is a direct response to the active Q1 2026 Request for Proposal (RFP) published in the SCF v7.0 RFP track, which explicitly asks the community to build a "Prices API". By building exactly what the Stellar Development Foundation is asking for, we guarantee immediate market fit and ecosystem utility.
- Frictionless Web3 UX: To meet the advanced Level 6 requirements, the platform completely abstracts the blockchain from the end-user. I am implementing Account Abstraction using the secp256r1 curve so developers can authenticate using WebAuthn passkeys (like FaceID) instead of managing seed phrases. Furthermore, all registration transactions are wrapped in CAP-0015 Fee-bump transactions, meaning the platform sponsors the network XLM gas fees on behalf of the user.
- A Deterministic Path to 30+ Users: Hitting the 30 active user metric for the Black Belt is highly achievable because my target users are fellow developers. By offering a subsidized free tier and sharing the API in the Stellar Discord dev-hack channels or via gamified onboarding on Stellar QuestHub , I can rapidly onboard the necessary active user base right from within our own builder community.

Why judges love this pitch: It shows you aren't just building a toy project. It demonstrates that you have researched the exact needs of the 2026 Stellar ecosystem, you understand the advanced Soroban primitives (Account Abstraction and Fee Bumps), and you have a realistic Go-To-Market strategy to acquire users.

Project Name: Parallax (Universal Prices API & Oracle Indexer)

The Problem: Currently, the Stellar ecosystem lacks a single, reliable, and standardized API to source aggregated, real-time, and historical price data for all native Stellar assets and SEP-41 Soroban contract tokens. This fragmentation forces DeFi developers to build custom indexers, which hinders the development of lending protocols, portfolio trackers, and AMMs.

The Solution & dApp Architecture: I am building a full-stack data infrastructure platform to solve this. The backend will index prices from the Stellar DEX, Soroban liquidity pools, and on-chain oracles. However, the user-facing product is a fully decentralized Web3 developer dashboard. Developers will use this dApp to register, generate API keys, and manage their data subscriptions, with all access control and incremental billing executed entirely on-chain via Soroban smart contracts.

Alignment with Level 5 & 6 Requirements: To hit the "MVP with users" (Level 5) and "Scale to 30+ users" (Level 6) milestones, my architecture focuses entirely on a frictionless, Web2-like user experience powered by advanced Stellar primitives:
- Account Abstraction: Instead of forcing developers to manage seed phrases, the platform will use Soroban Smart Wallets allowing users to authenticate via WebAuthn passkeys (e.g., FaceID, TouchID).
- Fee Sponsorship: I will utilize CAP-0015 Fee-Bump transactions so the application sponsors the XLM network gas fees for user registration and API key generation.
- User Acquisition Strategy: Because my target users are fellow Web3 developers, I will acquire my first 5 to 30+ active users by offering a subsidized free tier to the Rise In builder community and sharing the tool in the Stellar developer Discord channels.

This project not only proves technical mastery over advanced Soroban contracts for the Black Belt Demo Day, but it also directly addresses the active "Prices API" Request for Proposal (RFP) currently listed by the Stellar Community Fund, guaranteeing strong ecosystem market fit.
