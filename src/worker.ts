import dotenv from "dotenv";
dotenv.config();

import { scheduleJobs } from "./utils/scheduler";

console.log("⏱️ Starting alert worker...");
scheduleJobs();
