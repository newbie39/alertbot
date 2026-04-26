"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPriceAlerts = runPriceAlerts;
const sp500_1 = require("../data/sp500");
const yahoo_1 = require("../api/yahoo");
const webhook_1 = require("../discord/webhook");
const BATCH_SIZE = 50; // to avoid huge URLs / rate issues
const MOVE_THRESHOLD = 3; // % move to alert on
async function runPriceAlerts() {
    for (let i = 0; i < sp500_1.SP500_TICKERS.length; i += BATCH_SIZE) {
        const batch = sp500_1.SP500_TICKERS.slice(i, i + BATCH_SIZE);
        const quotes = await (0, yahoo_1.fetchPrices)(batch);
        for (const q of quotes) {
            if (!q.regularMarketPrice || !q.regularMarketPreviousClose)
                continue;
            const move = ((q.regularMarketPrice - q.regularMarketPreviousClose) /
                q.regularMarketPreviousClose) *
                100;
            if (Math.abs(move) >= MOVE_THRESHOLD) {
                await (0, webhook_1.sendDiscordAlert)(`📈 ${q.symbol} moved ${move.toFixed(2)}%`, `Price: ${q.regularMarketPrice}\nPrev Close: ${q.regularMarketPreviousClose}`);
            }
        }
        // small delay between batches
        await new Promise((r) => setTimeout(r, 1500));
    }
}
