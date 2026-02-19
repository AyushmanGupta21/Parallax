import * as StellarSdk from "@stellar/stellar-sdk";

// ─── Network Configuration ───────────────────────────────────────────────────
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const TREASURY_ADDRESS =
    "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN";

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// ─── Balance Fetching ─────────────────────────────────────────────────────────
export async function fetchXLMBalance(publicKey: string): Promise<string> {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
        (b: { asset_type: string }) => b.asset_type === "native"
    );
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(4) : "0.0000";
}

// ─── Send 1 XLM Transaction ───────────────────────────────────────────────────
export async function buildSendOneLumenTx(
    senderPublicKey: string,
    destinationAddress: string
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
                amount: "1",
            })
        )
        .addMemo(StellarSdk.Memo.text("Parallax API - Level 1"))
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
