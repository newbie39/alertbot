import axios from "axios";

export async function fetchPrices(tickers: string[]) {
  const symbols = tickers.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  return data.quoteResponse.result as Array<{
    symbol: string;
    regularMarketPrice: number;
    regularMarketPreviousClose: number;
    regularMarketVolume: number;
  }>;
}
