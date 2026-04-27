import { REST, Routes, SlashCommandBuilder } from "discord.js";

export async function registerSlashCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId || !guildId) {
    console.log("⚠️ Missing env vars for slash command registration.");
    return;
  }

  const commands = [
    new SlashCommandBuilder()
      .setName("price")
      .setDescription("Get the price of a stock")
      .addStringOption(option =>
        option.setName("ticker")
          .setDescription("Stock ticker (e.g., AAPL)")
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName("status")
      .setDescription("Show bot status"),

    new SlashCommandBuilder()
      .setName("help")
      .setDescription("Show help menu")
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("🔄 Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log("✅ Slash commands registered!");
  } catch (err) {
    console.error("❌ Error registering slash commands:", err);
  }
}

