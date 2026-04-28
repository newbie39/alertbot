// src/api/twelvedata.ts

import axios from "axios";

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_MS = 60_000; // 1 minute

export async function fetchPrices(tickers: string[]) {
  const apiKey = process.env.TWELVE_API_KEY;
  const results = [];

  for (const t of tickers) {
    const symbol = t.toUpperCase();

    // 1. Check cache
    const cached = cache[symbol];
    if (cached && Date.now() - cached.timestamp < CACHE_MS) {
      results.push(cached.data);
      continue;
    }

    // 2. Fetch fresh
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

    try {
      const { data } = await axios.get(url);

      if (data.status === "error") {
        console.error("TwelveData error:", data.message);
        continue;
      }

      const formatted = {
        symbol: data.symbol,
        regularMarketPrice: Number(data.price),
        regularMarketPreviousClose: Number(data.previous_close),
        regularMarketVolume: Number(data.volume)
      };

      // 3. Save to cache
      cache[symbol] = { data: formatted, timestamp: Date.now() };

      results.push(formatted);
    } catch (err) {
      console.error("TwelveData fetch error for", symbol);
    }
  }

  return results;
}

