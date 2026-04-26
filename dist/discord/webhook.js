"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordAlert = sendDiscordAlert;
const axios_1 = __importDefault(require("axios"));
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
async function sendDiscordAlert(title, message) {
    if (!webhookUrl) {
        console.error("No DISCORD_WEBHOOK_URL set");
        return;
    }
    await axios_1.default.post(webhookUrl, {
        embeds: [
            {
                title,
                description: message,
                timestamp: new Date().toISOString()
            }
        ]
    });
}
