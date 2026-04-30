"use client";

import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StellarWalletsKit,
  Networks,
  KitEventType,
  type KitEventStateUpdated,
  type KitEventWalletSelected,
} from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { getNetwork as freighterGetNetwork } from "@stellar/freighter-api";

// ─────────────────────────────────────────────────────────────────────────────
// Custom Freighter postMessage helpers
// The published @stellar/freighter-api has a typo bug: it sends "messageId"
// but listens for "messagedId" in responses.  Newer Freighter extension builds
// corrected the typo and now respond with "messageId", so the library's
// promise never resolves.  We bypass the library for the two critical calls.
// ─────────────────────────────────────────────────────────────────────────────

type FreighterMsgType = "REQUEST_CONNECTION_STATUS" | "REQUEST_ACCESS";

function sendFreighterMessage(
  type: FreighterMsgType,
  timeoutMs?: number
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const msgId = Date.now() + Math.random();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handler = (ev: MessageEvent) => {
      if (ev.source !== window) return;
      const d = ev.data as Record<string, unknown> | undefined;
      if (!d || d["source"] !== "FREIGHTER_EXTERNAL_MSG_RESPONSE") return;
      // Check BOTH spellings to survive the freighter-api typo bug
      const id = d["messagedId"] ?? d["messageId"];
      if (id !== msgId) return;

      clearTimeout(timer);
      window.removeEventListener("message", handler);
      resolve(d);
    };

    window.addEventListener("message", handler, false);

    if (timeoutMs) {
      timer = setTimeout(() => {
        window.removeEventListener("message", handler);
        reject(new Error("FREIGHTER_TIMEOUT"));
      }, timeoutMs);
    }

    window.postMessage(
      { source: "FREIGHTER_EXTERNAL_MSG_REQUEST", messageId: msgId, type },
      window.location.origin
    );
  });
}

/** Returns true if Freighter extension is installed and its content-script responds. */
async function freighterIsInstalled(): Promise<boolean> {
  // Fast path: window.freighter is set once access has been granted previously
  if (typeof window !== "undefined" && (window as Record<string, unknown>)["freighter"]) {
    return true;
  }
  try {
    await sendFreighterMessage("REQUEST_CONNECTION_STATUS", 2500);
    return true; // Extension responded → installed
  } catch {
    return false;
  }
}

/** Request Freighter access — handles both messagedId & messageId response fields. */
async function freighterRequestAccess(): Promise<{ address: string }> {
  // No timeout here: we must wait for the user to interact with the popup.
  const result = await sendFreighterMessage("REQUEST_ACCESS");
  const address = result["publicKey"] as string | undefined;
  const apiError = result["apiError"] as { message?: string; code?: number } | undefined;

  if (apiError) {
    throw new Error(apiError.message ?? "Freighter error");
  }
  if (!address) {
    throw new Error("No address returned from Freighter.");
  }
  return { address };
}

export type WalletState = {
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  isChecking: boolean;
  walletId: string | null;
};

export type ConnectResult =
  | { success: true; publicKey: string }
  | { success: false; error: string };

type WalletContextValue = {
  wallet: WalletState;
  connect: () => Promise<ConnectResult>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<string>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const STORAGE = {
  walletId: "swk_wallet_id",
  publicKey: "swk_public_key",
};

let isKitInitialized = false;

function initializeKit() {
  if (isKitInitialized) {
    return;
  }

  StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: defaultModules({
      filterBy: (module) => module.productId !== "xbull",
    }),
    authModal: {
      showInstallLabel: false,       // Don't show "Install" — show all wallets as selectable
      hideUnsupportedWallets: false, // Always show Freighter even if availability check is slow
    },
  });

  isKitInitialized = true;
}

function toNetworkLabel(passphrase: string): string {
  if (passphrase === Networks.TESTNET) return "TESTNET";
  if (passphrase === Networks.PUBLIC) return "PUBLIC";
  if (passphrase === Networks.FUTURENET) return "FUTURENET";
  if (passphrase === Networks.SANDBOX) return "SANDBOX";
  if (passphrase === Networks.STANDALONE) return "STANDALONE";
  return passphrase;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    network: null,
    isChecking: true,
    walletId: null,
  });

  useEffect(() => {
    initializeKit();

    const savedWalletId = localStorage.getItem(STORAGE.walletId);
    const savedKey = localStorage.getItem(STORAGE.publicKey);

    if (savedWalletId && savedKey) {
      try {
        StellarWalletsKit.setWallet(savedWalletId);
        setWallet({
          isConnected: true,
          publicKey: savedKey,
          network: "TESTNET",
          isChecking: false,
          walletId: savedWalletId,
        });
      } catch {
        localStorage.removeItem(STORAGE.walletId);
        localStorage.removeItem(STORAGE.publicKey);
        setWallet((prev) => ({ ...prev, isChecking: false }));
      }
    } else {
      setWallet((prev) => ({ ...prev, isChecking: false }));
    }

    const unsubState = StellarWalletsKit.on(
      KitEventType.STATE_UPDATED,
      (event: KitEventStateUpdated) => {
      const nextAddress = event.payload.address ?? null;
      const networkLabel = toNetworkLabel(event.payload.networkPassphrase);

      setWallet((prev) => ({
        ...prev,
        isConnected: Boolean(nextAddress),
        publicKey: nextAddress,
        network: networkLabel,
        isChecking: false,
      }));

      if (nextAddress) {
        localStorage.setItem(STORAGE.publicKey, nextAddress);
      }
      }
    );

    const unsubWallet = StellarWalletsKit.on(
      KitEventType.WALLET_SELECTED,
      (event: KitEventWalletSelected) => {
        const walletId = event.payload.id ?? null;
        setWallet((prev) => ({ ...prev, walletId }));

        if (walletId) {
          localStorage.setItem(STORAGE.walletId, walletId);
        }
      }
    );

    const unsubDisconnect = StellarWalletsKit.on(KitEventType.DISCONNECT, () => {
      localStorage.removeItem(STORAGE.walletId);
      localStorage.removeItem(STORAGE.publicKey);
      setWallet({
        isConnected: false,
        publicKey: null,
        network: null,
        isChecking: false,
        walletId: null,
      });
    });

    return () => {
      unsubState();
      unsubWallet();
      unsubDisconnect();
    };
  }, []);

  const connect = useCallback(async (): Promise<ConnectResult> => {
    initializeKit();

    // ── Path 1: Freighter (custom postMessage — fixes freighter-api typo bug) ─
    const installed = await freighterIsInstalled();
    if (installed) {
      try {
        const { address } = await freighterRequestAccess();

        const networkResult = await freighterGetNetwork().catch(() => ({
          network: "TESTNET",
          networkPassphrase: Networks.TESTNET,
        }));

        StellarWalletsKit.setWallet("freighter");
        localStorage.setItem(STORAGE.walletId, "freighter");
        localStorage.setItem(STORAGE.publicKey, address);

        setWallet({
          isConnected: true,
          publicKey: address,
          network: toNetworkLabel(
            (networkResult as { networkPassphrase?: string }).networkPassphrase ?? Networks.TESTNET
          ),
          isChecking: false,
          walletId: "freighter",
        });

        return { success: true, publicKey: address };
      } catch (err) {
        const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
        if (msg.includes("reject") || msg.includes("denied") || msg.includes("user rejected")) {
          return { success: false, error: "Freighter: request rejected by user." };
        }
        // Other error → fall through to SWK modal
      }
    }

    // ── Path 2: SWK modal for Albedo / Rabet / LOBSTR / etc. ─────────────────
    try {
      const { address } = await StellarWalletsKit.authModal();

      const network = await StellarWalletsKit.getNetwork().catch(() => ({
        network: "TESTNET",
        networkPassphrase: Networks.TESTNET,
      }));

      let selectedWalletId = "freighter";
      try {
        selectedWalletId = StellarWalletsKit.selectedModule.productId;
      } catch {
        StellarWalletsKit.setWallet("freighter");
      }

      localStorage.setItem(STORAGE.walletId, selectedWalletId);
      localStorage.setItem(STORAGE.publicKey, address);

      setWallet({
        isConnected: true,
        publicKey: address,
        network: toNetworkLabel(network.networkPassphrase),
        isChecking: false,
        walletId: selectedWalletId,
      });

      return { success: true, publicKey: address };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err ?? "Connection failed.");
      return { success: false, error: message };
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // Some wallets don't implement disconnect; local state cleanup still runs.
    }

    // Clear all app-related localStorage keys
    localStorage.removeItem(STORAGE.walletId);
    localStorage.removeItem(STORAGE.publicKey);
    localStorage.removeItem("freighter_connected"); // legacy key

    // Clear all api_registry_* entries (API key registration cache)
    Object.keys(localStorage)
      .filter((k) => k.startsWith("api_registry_"))
      .forEach((k) => localStorage.removeItem(k));

    setWallet({
      isConnected: false,
      publicKey: null,
      network: null,
      isChecking: false,
      walletId: null,
    });
  }, []);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    initializeKit();
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: Networks.TESTNET,
    });
    return signedTxXdr;
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      wallet,
      connect,
      disconnect,
      signTransaction,
    }),
    [wallet, connect, disconnect, signTransaction]
  );

  return createElement(WalletContext.Provider, { value }, children);
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider.");
  }

  return context;
}
