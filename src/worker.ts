// Cooldown map: ticker → timestamp of last alert
const alertCooldown = new Map<string, number>();

// Cooldown duration in minutes
const COOLDOWN_MINUTES = 60; // adjust as needed

import dotenv from "dotenv";
dotenv.config();

import { scheduleJobs } from "./utils/scheduler";

console.log("⏱️ Starting alert worker...");
scheduleJobs();
