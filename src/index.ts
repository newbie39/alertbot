import dotenv from "dotenv";
import { scheduleJobs } from "./utils/scheduler";
import { initBotClient } from "./discord/botClient";

dotenv.config();

console.log("🚀 S&P 500 Alert Bot starting...");

initBotClient();   // <-- enables !test command
scheduleJobs();    // <-- keeps your alerts running
