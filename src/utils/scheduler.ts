import cron from "node-cron";
import { runPriceAlerts } from "../alerts/priceAlerts";
// import { runNewsAlerts } from "../alerts/newsAlerts";
// import { runVolumeAlerts } from "../alerts/volumeAlerts";

export function scheduleJobs() {
  // every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏱️ Running S&P 500 alert cycle...");
    await runPriceAlerts();
    // await runNewsAlerts();
    // await runVolumeAlerts();
  });
}
