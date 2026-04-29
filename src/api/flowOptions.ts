import axios from "axios";

export async function getOptionsFlowLite(ticker: string) {
  const url = `https://finnhub.io/api/v1/stock/option-chain?symbol=${ticker}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const { data } = await axios.get(url);

    let calls = 0;
    let puts = 0;
    let activeStrike = "N/A";
    let activeExpiry = "N/A";

    let maxVolume = 0;

    for (const expiry of data.data) {
      for (const opt of expiry.options) {
        if (opt.type === "call") calls += opt.volume;
        if (opt.type === "put") puts += opt.volume;

        if (opt.volume > maxVolume) {
          maxVolume = opt.volume;
          activeStrike = opt.strike;
          activeExpiry = expiry.expirationDate;
        }
      }
    }

    const cpr = puts === 0 ? "∞" : (calls / puts).toFixed(2);

    return {
      calls,
      puts,
      cpr,
      activeStrike,
      activeExpiry
    };

  } catch (err) {
    console.error("Options flow error:", err);
    return {
      calls: 0,
      puts: 0,
      cpr: "N/A",
      activeStrike: "N/A",
      activeExpiry: "N/A"
    };
  }
}
