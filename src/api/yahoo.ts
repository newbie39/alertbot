import axios from "axios";

export async function fetchPrices(tickers: string[]) {
  const symbols = tickers.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

  const { data } = await axios.get(url);
  return data.quoteResponse.result as Array<{
    symbol: string;
    regularMarketPrice: number;
    regularMarketPreviousClose: number;
    regularMarketVolume: number;
  }>;
}
