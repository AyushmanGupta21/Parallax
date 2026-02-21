"use client";

import { useState, useCallback, useEffect } from "react";

export type WalletState = {
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  isInstalled: boolean;
  isChecking: boolean;
};

export type ConnectResult =
  | { success: true; publicKey: string }
  | { success: false; error: string };

/**
 * Hook to manage Freighter wallet connection.
 * Uses dynamic imports to avoid SSR issues with browser-extension APIs.
 */
export function useFreighter() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    network: null,
    isInstalled: false,
    isChecking: true,
  });

  const checkInstalled = useCallback(async () => {
    try {
      const { isConnected } = await import("@stellar/freighter-api");
      const result = await isConnected();
      const installed = result && typeof result === "object" ? result.isConnected : !!result;
      setWallet((prev) => ({ ...prev, isInstalled: installed, isChecking: false }));
      return installed;
    } catch {
      setWallet((prev) => ({ ...prev, isInstalled: false, isChecking: false }));
      return false;
    }
  }, []);

  const connect = useCallback(async (): Promise<ConnectResult> => {
    console.log("[useFreighter] Connect requested");
    try {
      const freighter = await import("@stellar/freighter-api");
      console.log("[useFreighter] Freighter module loaded", freighter);
      const { requestAccess, getNetwork } = freighter;

      console.log("[useFreighter] Calling requestAccess...");
      const accessResult = await requestAccess();
      console.log("[useFreighter] requestAccess result:", accessResult);

      if (!accessResult) {
        return { success: false, error: "Connection rejected by user." };
      }

      // Handle both v1 (string) and v2 (object with .address) APIs
      const publicKey =
        typeof accessResult === "string"
          ? accessResult
          : (accessResult as { address?: string }).address ?? null;

      if (!publicKey) {
        return { success: false, error: "Could not retrieve public key." };
      }

      // Get network info
      const networkResult = await getNetwork();
      const network =
        typeof networkResult === "string"
          ? networkResult
          : (networkResult as { network?: string }).network ?? "TESTNET";

      console.log("[useFreighter] Connected:", { publicKey, network });

      setWallet({
        isConnected: true,
        publicKey,
        network,
        isInstalled: true,
        isChecking: false,
      });

      localStorage.setItem("freighter_connected", "true");

      return { success: true, publicKey };
    } catch (err: unknown) {
      console.error("[useFreighter] Connection error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet.";
      return { success: false, error: message };
    }
  }, []);

  useEffect(() => {
    checkInstalled().then((installed) => {
      if (installed && localStorage.getItem("freighter_connected") === "true") {
        connect();
      }
    });
  }, [checkInstalled, connect]);

  const disconnect = useCallback(() => {
    localStorage.removeItem("freighter_connected");
    setWallet((prev) => ({
      ...prev,
      isConnected: false,
      publicKey: null,
      network: null,
    }));
  }, []);

  return { wallet, connect, disconnect, checkInstalled };
}
