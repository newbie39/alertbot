import axios from "axios";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;

export async function sendDiscordAlert(title: string, message: string) {
  if (!webhookUrl) {
    console.error("❌ No DISCORD_WEBHOOK_URL set");
    return;
  }

  await axios.post(webhookUrl, {
    embeds: [
      {
        title,
        description: message,
        timestamp: new Date().toISOString()
      }
    ]
  });
}
