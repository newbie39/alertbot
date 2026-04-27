import axios from "axios";

export async function fetchPrices(tickers: string[]) {
  const apiKey = process.env.TWELVE_API_KEY;
  const results = [];

  for (const t of tickers) {
    const symbol = t.toUpperCase();
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

    try {
      const { data } = await axios.get(url);

      if (data.status === "error") {
        console.error("TwelveData error:", data.message);
        continue;
      }

      results.push({
        symbol: data.symbol,
        regularMarketPrice: Number(data.price),
        regularMarketPreviousClose: Number(data.previous_close),
        regularMarketVolume: Number(data.volume)
      });
    } catch (err) {
      console.error("TwelveData fetch error for", symbol);
    }
  }

  return results;
}

