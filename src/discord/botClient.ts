import { fetchPrices } from "../api/yahoo";
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

  client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /price
  if (interaction.commandName === "price") {
  console.log("PRICE COMMAND FIRED");

  const ticker = interaction.options.getString("ticker")!.toUpperCase();
  console.log("TICKER:", ticker);

  try {
    const quotes = await fetchPrices([ticker]);
    console.log("QUOTES:", quotes);

    const q = quotes[0];

  // /status
  if (interaction.commandName === "status") {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);

    await interaction.reply(
      `🤖 **Bot Status**\n` +
      `• Uptime: ${uptimeMinutes} minutes\n` +
      `• Alerts running every 5 minutes\n` +
      `• Webhook + Bot client active`
    );
  }

  // /help
  if (interaction.commandName === "help") {
    await interaction.reply(
      "**📘 Bot Commands**\n" +
      "`/price <TICKER>` — Get live stock price\n" +
      "`/status` — Bot health + uptime\n" +
      "`/help` — Show this help menu"
    );
  }
});

  
  client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const content = msg.content.trim().toLowerCase();

  // -------------------------
  // !test
  // -------------------------
  if (content === "!test") {
    await msg.reply("✅ Bot is online and responding!");
    await sendDiscordAlert("Test Command Triggered", `User **${msg.author.username}** ran !test`);
    return;
  }

  // -------------------------
  // !price <TICKER>
  // -------------------------
  if (content.startsWith("!price")) {
    const parts = msg.content.split(" ");
    if (parts.length < 2) {
      await msg.reply("Usage: `!price AAPL`");
      return;
    }

    const ticker = parts[1].toUpperCase();

    try {
      const quotes = await fetchPrices([ticker]);
      const q = quotes[0];

      if (!q) {
        await msg.reply(`❌ Unknown ticker: ${ticker}`);
        return;
      }

      await msg.reply(
        `📈 **${ticker}**\nPrice: **$${q.regularMarketPrice}**\nPrev Close: **$${q.regularMarketPreviousClose}**`
      );
    } catch (err) {
      console.error(err);
      await msg.reply("❌ Error fetching price.");
    }

    return;
  }

  // -------------------------
  // !status
  // -------------------------
  if (content === "!status") {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);

    await msg.reply(
      `🤖 **Bot Status**\n` +
      `• Uptime: ${uptimeMinutes} minutes\n` +
      `• Alerts running every 5 minutes\n` +
      `• Webhook + Bot client active`
    );
    return;
  }

  // -------------------------
  // !help
  // -------------------------
  if (content === "!help") {
    await msg.reply(
      "**📘 Bot Commands**\n" +
      "`!test` — Check if bot is alive\n" +
      "`!price <TICKER>` — Get live stock price\n" +
      "`!status` — Bot health + uptime\n" +
      "`!help` — Show this help menu"
    );
    return;
  }
});

  client.login(token);
}


