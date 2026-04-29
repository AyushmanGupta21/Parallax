// Server-side only — do NOT import from client components

const HORIZON = "https://horizon.stellar.org";
const COINGECKO = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 30_000; // 30 seconds

// ── Types ─────────────────────────────────────────────────────────────────────

type AssetConfig =
  | { type: "native" }
  | { type: "credit_alphanum4" | "credit_alphanum12"; code: string; issuer: string };

interface OrderBookPair {
  kind: "orderbook";
  pair: string;
  selling: AssetConfig;
  buying: AssetConfig;
}

interface CoinGeckoPair {
  kind: "coingecko";
  pair: string;
  // Derive price as: numeratorId.usd / denominatorId.usd
  // If denominatorId is null, price = numeratorId.usd
  numeratorId: string;
  denominatorId: string | null;
  decimals: number;
}

type PairConfig = OrderBookPair | CoinGeckoPair;

export interface PriceRow {
  pair: string;
  price: string;
  bid: string;
  ask: string;
  source: string;
  fetchedAt: string;
}

// ── Pair Definitions ──────────────────────────────────────────────────────────

const PAIRS: PairConfig[] = [
  // DEX Order Book pairs — Stellar mainnet has liquidity for these
  {
    kind: "orderbook",
    pair: "XLM/USDC",
    selling: { type: "native" },
    buying: {
      type: "credit_alphanum4",
      code: "USDC",
      issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    },
  },
  {
    kind: "orderbook",
    pair: "XLM/yXLM",
    selling: { type: "native" },
    buying: {
      type: "credit_alphanum4",
      code: "yXLM",
      issuer: "GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55",
    },
  },
  // CoinGecko pairs — always available, cross-market prices
  {
    kind: "coingecko",
    pair: "XLM/USD",
    numeratorId: "stellar",
    denominatorId: null,
    decimals: 5,
  },
  {
    kind: "coingecko",
    pair: "XLM/BTC",
    numeratorId: "stellar",
    denominatorId: "bitcoin",
    decimals: 8,
  },
  {
    kind: "coingecko",
    pair: "XLM/ETH",
    numeratorId: "stellar",
    denominatorId: "ethereum",
    decimals: 7,
  },
];

// ── Order Book Fetcher ────────────────────────────────────────────────────────

function buildOrderBookUrl(cfg: OrderBookPair): string {
  const p = new URLSearchParams();
  p.set("selling_asset_type", cfg.selling.type);
  if (cfg.selling.type !== "native") {
    p.set("selling_asset_code", cfg.selling.code);
    p.set("selling_asset_issuer", cfg.selling.issuer);
  }
  p.set("buying_asset_type", cfg.buying.type);
  if (cfg.buying.type !== "native") {
    p.set("buying_asset_code", cfg.buying.code);
    p.set("buying_asset_issuer", cfg.buying.issuer);
  }
  p.set("limit", "3");
  return `${HORIZON}/order_book?${p}`;
}

function fmt(n: number, decimals = 6): string {
  if (n <= 0) return "—";
  return n.toFixed(decimals).replace(/\.?0+$/, "") || "0";
}

async function fetchOrderBook(cfg: OrderBookPair): Promise<PriceRow> {
  try {
    const res = await fetch(buildOrderBookUrl(cfg), {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const bestBid = parseFloat(data.bids?.[0]?.price ?? "0");
    const bestAsk = parseFloat(data.asks?.[0]?.price ?? "0");
    const mid =
      bestBid > 0 && bestAsk > 0
        ? (bestBid + bestAsk) / 2
        : bestBid || bestAsk;

    return {
      pair: cfg.pair,
      price: fmt(mid),
      bid: fmt(bestBid),
      ask: fmt(bestAsk),
      source: "Stellar DEX",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return { pair: cfg.pair, price: "—", bid: "—", ask: "—", source: "error", fetchedAt: new Date().toISOString() };
  }
}

// ── CoinGecko Fetcher ─────────────────────────────────────────────────────────

let _cgCache: { data: Record<string, { usd: number }>; at: number } | null = null;

async function fetchCoinGeckoRaw(): Promise<Record<string, { usd: number }>> {
  if (_cgCache && Date.now() - _cgCache.at < CACHE_TTL) return _cgCache.data;
  try {
    const ids = "stellar,bitcoin,ethereum";
    const res = await fetch(
      `${COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd`,
      { headers: { Accept: "application/json" }, next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const data = await res.json();
    _cgCache = { data, at: Date.now() };
    return data;
  } catch {
    return {};
  }
}

async function fetchCoinGeckoPair(cfg: CoinGeckoPair): Promise<PriceRow> {
  try {
    const raw = await fetchCoinGeckoRaw();
    const numUsd = raw[cfg.numeratorId]?.usd ?? 0;
    const denUsd = cfg.denominatorId ? (raw[cfg.denominatorId]?.usd ?? 0) : 1;
    const price = denUsd > 0 ? numUsd / denUsd : 0;

    return {
      pair: cfg.pair,
      price: fmt(price, cfg.decimals),
      bid: "—",
      ask: "—",
      source: "CoinGecko",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return { pair: cfg.pair, price: "—", bid: "—", ask: "—", source: "error", fetchedAt: new Date().toISOString() };
  }
}

// ── Main Export ───────────────────────────────────────────────────────────────

let _cache: { data: PriceRow[]; at: number } | null = null;

export async function fetchPrices(): Promise<PriceRow[]> {
  if (_cache && Date.now() - _cache.at < CACHE_TTL) return _cache.data;

  const results = await Promise.all(
    PAIRS.map((cfg) =>
      cfg.kind === "orderbook" ? fetchOrderBook(cfg) : fetchCoinGeckoPair(cfg)
    )
  );

  _cache = { data: results, at: Date.now() };
  return results;
}
