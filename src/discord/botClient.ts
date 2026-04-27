import { Client, GatewayIntentBits } from "discord.js";
import { sendDiscordAlert } from "./webhook";

export function initBotClient() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.log("⚠️ No DISCORD_BOT_TOKEN provided — bot client disabled.");
    return;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  });

  client.on("ready", () => {
    console.log(`🤖 Logged in as ${client.user?.tag}`);
  });

  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    // TEST COMMAND
    if (msg.content.toLowerCase() === "!test") {
      await msg.reply("✅ Bot is online and responding!");
      await sendDiscordAlert("Test Command Triggered", `User **${msg.author.username}** ran !test`);
    }
  });

  client.login(token);
}
