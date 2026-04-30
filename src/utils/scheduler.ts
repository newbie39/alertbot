import cron from "node-cron";
import { runPriceAlerts } from "../alerts/priceAlerts";

export function scheduleJobs() {
  // Runs every 5 minutes
  cron.schedule("*/5 9-16 * * 1-5", async () => {
    console.log("⏱️ Running S&P 500 alert cycle...");
    await runPriceAlerts();
  });
}
