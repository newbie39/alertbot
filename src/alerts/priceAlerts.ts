import { SP500_TICKERS } from "../data/sp500";
import { fetchPrices } from "../api/twelvedata";
import { sendDiscordAlert } from "../discord/webhook";

const BATCH_SIZE = 50;
const MOVE_THRESHOLD = 3; // % move to alert on

export async function runPriceAlerts() {
  for (let i = 0; i < SP500_TICKERS.length; i += BATCH_SIZE) {
    const batch = SP500_TICKERS.slice(i, i + BATCH_SIZE);
    const quotes = await fetchPrices(batch);

    for (const q of quotes) {
      if (!q.regularMarketPrice || !q.regularMarketPreviousClose) continue;

      const move =
        ((q.regularMarketPrice - q.regularMarketPreviousClose) /
          q.regularMarketPreviousClose) *
        100;

      if (Math.abs(move) >= MOVE_THRESHOLD) {
        await sendDiscordAlert(
          `📈 ${q.symbol} moved ${move.toFixed(2)}%`,
          `Price: ${q.regularMarketPrice}\nPrev Close: ${q.regularMarketPreviousClose}`
        );
      }
    }

    await new Promise((r) => setTimeout(r, 1500));
  }
}
