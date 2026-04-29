import axios from "axios";

// 60‑second cache to avoid rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_MS = 60_000;

export async function fetchPrices(tickers: string[]) {
  const results = [];

  for (const t of tickers) {
    const symbol = t.toUpperCase();

    // 1. Cache hit
    const cached = cache[symbol];
    if (cached && Date.now() - cached.timestamp < CACHE_MS) {
      results.push(cached.data);
      continue;
    }

    let data = null;

    // 2. Primary: Twelve Data
    data = await fetchFromTwelveData(symbol);

    // 3. Fallback: Alpha Vantage
    if (!data) data = await fetchFromAlphaVantage(symbol);

    // 4. Emergency fallback: Finnhub
    if (!data) data = await fetchFromFinnhub(symbol);

    // 5. Save to cache if successful
    if (data) {
      cache[symbol] = { data, timestamp: Date.now() };
      results.push(data);
    }
  }

  return results;
}

// -----------------------------
// Twelve Data (Primary)
// -----------------------------
async function fetchFromTwelveData(symbol: string) {
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_API_KEY}`;
    const { data } = await axios.get(url);

    if (data.status === "error") return null;

    return {
      symbol: data.symbol,
      regularMarketPrice: Number(data.price),
      regularMarketPreviousClose: Number(data.previous_close),
      regularMarketVolume: Number(data.volume)
    };
  } catch {
    return null;
  }
}

// -----------------------------
// Alpha Vantage (Fallback)
// -----------------------------
async function fetchFromAlphaVantage(symbol: string) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
    const { data } = await axios.get(url);

    const q = data["Global Quote"];
    if (!q) return null;

    return {
      symbol,
      regularMarketPrice: Number(q["05. price"]),
      regularMarketPreviousClose: Number(q["08. previous close"]),
      regularMarketVolume: Number(q["06. volume"])
    };
  } catch {
    return null;
  }
}

// -----------------------------
// Finnhub (Emergency Fallback)
// -----------------------------
async function fetchFromFinnhub(symbol: string) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
    const { data } = await axios.get(url);

    if (!data || !data.c) return null;

    return {
      symbol,
      regularMarketPrice: data.c,
      regularMarketPreviousClose: data.pc,
      regularMarketVolume: data.v
    };
  } catch {
    return null;
  }
}

