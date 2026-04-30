# Parallax — Soroban Smart Contract

This directory contains the `api_registry` Soroban smart contract, written in Rust and deployed to Stellar Testnet.

## Contract: `api_registry`

| Field | Value |
|---|---|
| **Network** | Stellar Testnet |
| **Contract ID** | `CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE` |
| **Deployer** | `GAWJNUSBQAKG3X6UT6NJAGL4YWJDYINR3MULB7FU4EY6B6BOOMY2FPOK` |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCJ7YKWSXJ35PM7EWVVJRIK66KDYHQ2HILTP364KHEF3XNRK2O7XUXVE) |
| **Registration Fee** | 10 XLM (100,000,000 stroops) |

## Contract Interface

```rust
// Initialise the contract with a treasury address
pub fn init(env: Env, treasury: Address)

// Register a developer — pays 10 XLM fee via token::Client inter-contract call
pub fn register(env: Env, caller: Address, token: Address) -> Result<(), Error>

// Returns true if the address is registered
pub fn is_registered(env: Env, caller: Address) -> bool

// Returns the current registration fee in stroops
pub fn get_fee(_env: Env) -> i128
```

## Events

The contract emits a `registered` event on successful registration:
```
topic: ("registered",)
value: caller_address (String)
```

## Local Development

### Prerequisites
- Rust stable toolchain
- `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`

### Run Unit Tests
```bash
cargo test --manifest-path contracts/Cargo.toml
```

### Build WASM
```bash
cargo build \
  --manifest-path contracts/Cargo.toml \
  --target wasm32-unknown-unknown \
  --release
```

### Deploy to Testnet (requires `stellar` CLI)
```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/api_registry.wasm \
  --source <your-secret-key> \
  --network testnet
```

After deployment, update `NEXT_PUBLIC_CONTRACT_ID` in your `.env.local` with the new contract address.
