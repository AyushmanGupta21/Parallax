// Server-side only — API key validation + on-chain registry check

import * as StellarSdk from "@stellar/stellar-sdk";

const SOROBAN_RPC =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID ?? "";
const NETWORK = StellarSdk.Networks.TESTNET;

/**
 * Derive the expected API key from a Stellar public key.
 * Must match the client-side deriveApiKey() in ApiKeyCard.tsx and PriceDataCard.tsx.
 */
export function deriveExpectedApiKey(publicKey: string): string {
  const hash = publicKey.slice(2, 18) + publicKey.slice(-8);
  return `pk_${hash.toLowerCase()}`;
}

/**
 * Step 1: Verify that the supplied API key matches the one
 * deterministically derived from the supplied public key.
 */
export function validateApiKey(publicKey: string, apiKey: string): boolean {
  if (!publicKey || !apiKey) return false;
  try {
    StellarSdk.StrKey.decodeEd25519PublicKey(publicKey); // throws if invalid G-address
  } catch {
    return false;
  }
  return deriveExpectedApiKey(publicKey) === apiKey;
}

/**
 * Step 2: Query the Soroban api_registry contract to confirm registration.
 *
 * Returns:
 *   true  — confirmed registered on-chain
 *   false — confirmed NOT registered (explicit contract response)
 *   null  — RPC/network error; caller decides whether to fail-open or fail-closed
 */
export async function checkRegisteredOnChain(
  publicKey: string
): Promise<boolean | null> {
  if (!CONTRACT_ID || CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") {
    console.warn("[Parallax] CONTRACT_ID not set — skipping on-chain check");
    return null;
  }

  try {
    const rpc = new StellarSdk.rpc.Server(SOROBAN_RPC);
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await rpc.getAccount(publicKey);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: "1000000",
      networkPassphrase: NETWORK,
    })
      .addOperation(
        contract.call(
          "is_registered",
          StellarSdk.Address.fromString(publicKey).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const sim = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
      const retval = sim.result?.retval;
      return retval ? StellarSdk.scValToNative(retval) === true : false;
    }
    // Simulation returned an error response
    console.warn("[Parallax] simulateTransaction did not succeed:", sim);
    return null;
  } catch (err) {
    console.error("[Parallax] on-chain registry check threw:", err);
    return null; // RPC/network failure — let caller decide
  }
}
