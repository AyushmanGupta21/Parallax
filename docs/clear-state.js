// Run this in the browser DevTools Console to reset registration state
// This clears ONLY the Parallax registration cache — not your wallet connection

Object.keys(localStorage)
  .filter(k => k.startsWith("api_registry_") || k === "swk_wallet_id" || k === "swk_public_key")
  .forEach(k => {
    console.log("Removing:", k);
    localStorage.removeItem(k);
  });

console.log("✅ Parallax state cleared. Refresh the page.");
