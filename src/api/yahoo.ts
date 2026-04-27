import axios from "axios";

export async function fetchPrices(tickers: string[]) {
  const results = [];

  for (const ticker of tickers) {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      });

      const chart = data.chart?.result?.[0];
      if (!chart) continue;

      const meta = chart.meta;

      results.push({
        symbol: meta.symbol,
        regularMarketPrice: meta.regularMarketPrice,
        regularMarketPreviousClose: meta.chartPreviousClose,
        regularMarketVolume: chart.indicators?.quote?.[0]?.volume?.[0] ?? 0
      });
    } catch (err) {
      console.error("Yahoo fetch error for", ticker);
    }
  }

  return results;
}
