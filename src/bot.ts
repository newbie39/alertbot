import dotenv from "dotenv";
dotenv.config();

import { initBotClient } from "./discord/botClient";
import { registerSlashCommands } from "./discord/registerCommands";

console.log("🤖 Starting Discord bot...");
registerSlashCommands();
initBotClient();
