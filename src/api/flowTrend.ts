import { fetchPrices } from "./twelvedata";

export async function getTrendFlow(ticker: string) {
  const [q] = await fetchPrices([ticker]);

  const price = q.regularMarketPrice;
  const prev = q.regularMarketPreviousClose;
  const volume = q.regularMarketVolume;

  const momentum = price > prev ? "Bullish" : "Bearish";
  const volatility = Math.abs(price - prev) / prev > 0.02 ? "High" : "Normal";

  return {
    price,
    volume,
    avgVolume: "N/A", // TwelveData free tier doesn't provide avg volume
    momentum,
    volatility
  };
}
