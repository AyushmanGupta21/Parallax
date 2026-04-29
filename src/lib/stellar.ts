"use client";

import * as StellarSdk from "@stellar/stellar-sdk";

// ─── Network Configuration ────────────────────────────────────────────────────
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
export const TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ??
  "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN";

/**
 * Contract address of the deployed api_registry on Stellar Testnet.
 * Updated after deployment.
 */
export const API_REGISTRY_CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID ?? "PLACEHOLDER_DEPLOY_AND_REPLACE";

/**
 * Native XLM token contract address on Stellar Testnet.
 * Derived from Asset('XLM').contractId(TESTNET_PASSPHRASE).
 * stellar-base v14 Address.fromString() cannot parse SAC addresses,
 * so we use contractIdToScVal() which builds the ScVal directly via xdr.
 */
export const NATIVE_TOKEN_CONTRACT_ID =
  process.env.NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT_ID ??
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const rpc = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

/**
 * Convert a Stellar account public key (G-address) to a Soroban ScVal address.
 * Uses Address.fromString which works correctly for G-addresses in all SDK versions.
 */
function accountToScVal(publicKey: string): StellarSdk.xdr.ScVal {
  return StellarSdk.Address.fromString(publicKey).toScVal();
}

/**
 * Convert a Soroban contract ID (C-address strkey) to an ScVal.
 * Uses new Contract(id).address().toScVal() which correctly handles
 * SAC (Stellar Asset Contract) addresses in stellar-sdk v14.
 */
function contractIdToScVal(contractId: string): StellarSdk.xdr.ScVal {
  return new StellarSdk.Contract(contractId).address().toScVal();
}

export type RegistrationEvent = {
  id: string;
  txHash: string;
  ledger: number;
  ledgerClosedAt: string;
  address: string;
};

// ─── Balance Fetching ─────────────────────────────────────────────────────────
export async function fetchXLMBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const xlmBalance = account.balances.find(
    (b: { asset_type: string }) => b.asset_type === "native"
  );
  return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(4) : "0.0000";
}

// ─── Transaction History ──────────────────────────────────────────────────────
export async function fetchRecentPayments(publicKey: string) {
  const paymentsPage = await server
    .payments()
    .forAccount(publicKey)
    .order("desc")
    .limit(10)
    .call();
  return paymentsPage.records;
}

// ─── Send XLM ────────────────────────────────────────────────────────────────
export async function buildSendXlmTx(
  senderPublicKey: string,
  destinationAddress: string,
  amount: string
): Promise<string> {
  const sourceAccount = await server.loadAccount(senderPublicKey);
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .addMemo(StellarSdk.Memo.text("Parallax API - Level 4"))
    .setTimeout(180)
    .build();

  return transaction.toXDR();
}

export async function submitSignedTx(signedXdr: string): Promise<string> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

// ─── Soroban: Check Registration ──────────────────────────────────────────────
export async function checkIsRegistered(publicKey: string): Promise<boolean> {
  try {
    const contractId = API_REGISTRY_CONTRACT_ID;
    if (contractId === "PLACEHOLDER_DEPLOY_AND_REPLACE") return false;

    const contract = new StellarSdk.Contract(contractId);
    const account = await rpc.getAccount(publicKey);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: "1000000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "is_registered",
          accountToScVal(publicKey)        // G-address → account ScVal
        )
      )
      .setTimeout(30)
      .build();

    const simResult = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(simResult)) {
      const result = simResult.result?.retval;
      return result ? StellarSdk.scValToNative(result) === true : false;
    }
    return false;
  } catch {
    return false;
  }
}

export async function fetchRegistrationEvents(params?: {
  cursor?: string;
  startLedger?: number;
  limit?: number;
}): Promise<{
  events: RegistrationEvent[];
  cursor: string;
  latestLedger: number;
}> {
  if (API_REGISTRY_CONTRACT_ID === "PLACEHOLDER_DEPLOY_AND_REPLACE") {
    return { events: [], cursor: params?.cursor ?? "", latestLedger: 0 };
  }

  const filters: StellarSdk.rpc.Api.EventFilter[] = [
    {
      type: "contract",
      contractIds: [API_REGISTRY_CONTRACT_ID],
    },
  ];

  const limit = params?.limit ?? 30;

  const response = params?.cursor
    ? await rpc.getEvents({
        cursor: params.cursor,
        filters,
        limit,
      })
    : await rpc.getEvents({
        startLedger:
          params?.startLedger ??
          Math.max(1, (await rpc.getLatestLedger()).sequence - 200),
        filters,
        limit,
      });

  const events = response.events
    .map((event: StellarSdk.rpc.Api.EventResponse): RegistrationEvent | null => {
      if (!event.topic.length) {
        return null;
      }

      const firstTopic = StellarSdk.scValToNative(event.topic[0]);
      if (firstTopic !== "registered") {
        return null;
      }

      const nativeValue = StellarSdk.scValToNative(event.value);
      if (typeof nativeValue !== "string") {
        return null;
      }

      return {
        id: event.id,
        txHash: event.txHash,
        ledger: event.ledger,
        ledgerClosedAt: event.ledgerClosedAt,
        address: nativeValue,
      };
    })
    .filter((event: RegistrationEvent | null): event is RegistrationEvent => Boolean(event));

  return {
    events,
    cursor: response.cursor,
    latestLedger: response.latestLedger,
  };
}

// ─── Soroban: Build Register Transaction ─────────────────────────────────────
export async function buildRegisterTx(
  publicKey: string,
  tokenContractId: string
): Promise<string> {
  const contractId = API_REGISTRY_CONTRACT_ID;
  const contract = new StellarSdk.Contract(contractId);
  const account = await rpc.getAccount(publicKey);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "register",
        accountToScVal(publicKey),           // G-address → account ScVal
        contractIdToScVal(tokenContractId)   // C-address → contract ScVal (SAC-safe)
      )
    )
    .setTimeout(30)
    .build();

  // Simulate to populate auth and footprint
  const simResult = await rpc.simulateTransaction(tx);
  if (!StellarSdk.rpc.Api.isSimulationSuccess(simResult)) {
    const errMsg =
      (simResult as StellarSdk.rpc.Api.SimulateTransactionErrorResponse)
        .error ?? "Simulation failed";
    throw new Error(errMsg);
  }

  const preparedTx = StellarSdk.rpc.assembleTransaction(
    tx,
    simResult
  ).build();

  return preparedTx.toXDR();
}

// ─── Soroban: Submit Soroban Tx ───────────────────────────────────────────────
export async function submitSorobanTx(signedXdr: string): Promise<string> {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  const sendResult = await rpc.sendTransaction(tx);

  if (sendResult.status === "ERROR") {
    throw new Error(sendResult.errorResult?.toString() ?? "Submission failed");
  }

  // Poll for result
  let getResult = await rpc.getTransaction(sendResult.hash);
  for (let i = 0; i < 20; i++) {
    if (getResult.status !== StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND) {
      break;
    }
    await new Promise((r) => setTimeout(r, 1500));
    getResult = await rpc.getTransaction(sendResult.hash);
  }

  if (getResult.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
    return sendResult.hash;
  }

  throw new Error(`Transaction failed with status: ${getResult.status}`);
}
