import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, checkRegisteredOnChain } from "@/lib/apiAuth";
import { fetchPrices } from "@/lib/prices";

// Force Node.js runtime so stellar-sdk works correctly
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // ── 1. Read auth headers ────────────────────────────────────────────────────
  const pubkey = req.headers.get("x-stellar-pubkey") ?? "";
  const apiKey = req.headers.get("x-parallax-apikey") ?? "";

  if (!pubkey || !apiKey) {
    return NextResponse.json(
      { error: "Missing x-stellar-pubkey or x-parallax-apikey headers." },
      { status: 401 }
    );
  }

  // ── 2. Validate API key format (cryptographic derivation from public key) ───
  if (!validateApiKey(pubkey, apiKey)) {
    return NextResponse.json(
      { error: "Invalid API key for the supplied Stellar address." },
      { status: 401 }
    );
  }

  // ── 3. Check on-chain registry (Soroban api_registry contract) ─────────────
  //
  // checkRegisteredOnChain returns:
  //   true  → confirmed registered, proceed
  //   false → confirmed NOT registered, block
  //   null  → RPC/network error, fail-open (API key already verified above)
  //
  const registrationStatus = await checkRegisteredOnChain(pubkey);

  if (registrationStatus === false) {
    // The Soroban contract explicitly confirmed this address has NOT registered.
    return NextResponse.json(
      {
        error:
          "Address not registered. Call register() on the Soroban api_registry contract first.",
        contractId: process.env.NEXT_PUBLIC_CONTRACT_ID,
      },
      { status: 401 }
    );
  }

  // registrationStatus === true  → on-chain confirmed
  // registrationStatus === null  → RPC unavailable, trust the valid API key

  // ── 4. Fetch real prices from Stellar DEX ────────────────────────────────────
  try {
    const prices = await fetchPrices();
    return NextResponse.json(
      {
        ok: true,
        prices,
        meta: {
          source: "Stellar DEX — Horizon Mainnet Order Books",
          network: "Stellar Testnet (auth) / Mainnet DEX (prices)",
          authMethod:
            registrationStatus === true
              ? "on-chain-verified"
              : "api-key-verified (rpc-unavailable)",
          cachedFor: "30s",
          servedAt: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=30",
          "X-Parallax-Version": "level5",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price data from Stellar DEX." },
      { status: 500 }
    );
  }
}
