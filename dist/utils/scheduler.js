"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleJobs = scheduleJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const priceAlerts_1 = require("../alerts/priceAlerts");
// import { runNewsAlerts } from "../alerts/newsAlerts";
// import { runVolumeAlerts } from "../alerts/volumeAlerts";
function scheduleJobs() {
    // every 5 minutes
    node_cron_1.default.schedule("*/5 * * * *", async () => {
        console.log("⏱️ Running S&P 500 alert cycle...");
        await (0, priceAlerts_1.runPriceAlerts)();
        // await runNewsAlerts();
        // await runVolumeAlerts();
    });
}
