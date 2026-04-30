import { analyzeInstitutionalLiquidity } from "../analysis/liquidityAnalyst";
import { getTrendFlow } from "../api/flowTrend";
import { getOptionsFlowYahoo } from "../api/flowOptionsYahoo";
import { EmbedBuilder } from "discord.js";
import { fetchPrices } from "../api/twelvedata";
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
    const ticker = interaction.options.getString("ticker")!.toUpperCase();
    await interaction.deferReply();

    try {
      const quotes = await fetchPrices([ticker]);
      const q = quotes[0];

      if (!q) {
        await interaction.editReply(`❌ Unknown ticker: ${ticker}`);
        return;
      }

      await interaction.editReply(
        `📈 **${ticker}**\n` +
        `Price: **$${q.regularMarketPrice}**\n` +
        `Prev Close: **$${q.regularMarketPreviousClose}**`
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Error fetching price.");
    }

  // /status
  } else if (interaction.commandName === "status") {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);

    await interaction.reply(
      `🤖 **Bot Status**\n` +
      `• Uptime: ${uptimeMinutes} minutes\n` +
      `• Alerts running every 5 minutes\n` +
      `• Webhook + Bot client active`
    );

  // /help
  } else if (interaction.commandName === "help") {
    await interaction.reply(
      "**📘 Bot Commands**\n" +
      "`/price <TICKER>` — Get live stock price\n" +
      "`/status` — Bot health + uptime\n" +
      "`/help` — Show this help menu"
    );
  
  //liquidity
  } else if (interaction.commandName === "liquidity") {
  await interaction.deferReply();

  // 1. Pull a subset of the S&P 500 (top 50 for speed)
  const tickers = SP500.slice(0, 50);

  // 2. Fetch price + options data in batches
  const snapshots = [];

  for (const ticker of tickers) {
    try {
      const price = await fetchPrices([ticker]);
      const opt = await getOptionsFlowYahoo(ticker);

      const quote = price[0];
      if (!quote) continue;

      const movePct =
        ((quote.regularMarketPrice - quote.regularMarketPreviousClose) /
          quote.regularMarketPreviousClose) *
        100;

      const volumeRel =
        quote.regularMarketVolume && quote.averageDailyVolume3Month
          ? quote.regularMarketVolume / quote.averageDailyVolume3Month
          : 1;

      snapshots.push({
        ticker,
        sector: quote.sector || "Unknown",
        movePct,
        volumeRel,
        cpr: opt.cpr === "N/A" ? 1 : Number(opt.cpr)
      });
    } catch (err) {
      console.error("Liquidity snapshot error:", err);
    }
  }

  // 3. Run the hedge‑fund style analysis
  const narrative = analyzeInstitutionalLiquidity(snapshots);

  // 4. Send embed
  const embed = {
    title: "📊 Institutional Liquidity Read",
    description: narrative,
    color: 0x00aaff,
    timestamp: new Date().toISOString()
  };

  await interaction.editReply({ embeds: [embed] });
);
  


    
  // /flow
  } else if (interaction.commandName === "flow") {
    const ticker = interaction.options.getString("ticker")!.toUpperCase();
    await interaction.deferReply();

    try {
      const [trend, options] = await Promise.all([
        getTrendFlow(ticker),
        getOptionsFlowYahoo(ticker)
      ]);

      const embed = new EmbedBuilder()
        .setTitle(`📊 Flow Report — ${ticker}`)
        .setColor("#4b9cff")
        .addFields(
          {
            name: "📈 Trend Flow",
            value:
              `• **Price:** $${trend.price}\n` +
              `• **Volume:** ${trend.volume} (avg ${trend.avgVolume})\n` +
              `• **Momentum:** ${trend.momentum}\n` +
              `• **Volatility:** ${trend.volatility}`,
            inline: false
          },
          {
            name: "🔥 Options Flow (Lite)",
            value:
              `• **Calls:** ${options.calls}\n` +
              `• **Puts:** ${options.puts}\n` +
              `• **Call/Put Ratio:** ${options.cpr}\n` +
              `• **Most Active Strike:** ${options.activeStrike}\n` +
              `• **Most Active Expiry:** ${options.activeExpiry}`,
            inline: false
          }
        )
        .setFooter({ text: "Flow data powered by Finnhub + Multi‑API Trend Engine" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Error generating flow report.");
    }
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


