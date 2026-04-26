import dotenv from "dotenv";
import { scheduleJobs } from "./utils/scheduler";

dotenv.config();

console.log("🚀 S&P 500 Alert Bot starting...");
scheduleJobs();
