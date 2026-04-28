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
      showInstallLabel: true,
      hideUnsupportedWallets: false,
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
    try {
      initializeKit();

      const { address } = await StellarWalletsKit.authModal();
      const network = await StellarWalletsKit.getNetwork().catch(() => ({
        network: "TESTNET",
        networkPassphrase: Networks.TESTNET,
      }));

      const selectedWalletId = StellarWalletsKit.selectedModule.productId;

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
      const message = err instanceof Error ? err.message : "Connection failed.";
      return { success: false, error: message };
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // Some wallets don't implement disconnect; local state cleanup still runs.
    }

    localStorage.removeItem(STORAGE.walletId);
    localStorage.removeItem(STORAGE.publicKey);
    // Keep backward compatibility with previously used key.
    localStorage.removeItem("freighter_connected");

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
