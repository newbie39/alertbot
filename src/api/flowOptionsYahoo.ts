import axios from "axios";

export async function getOptionsFlowYahoo(ticker: string) {
  try {
    const url = `https://query2.finance.yahoo.com/v7/finance/options/${ticker}`;
    const { data } = await axios.get(url);

    const chain = data?.optionChain?.result?.[0];
    if (!chain) {
      return {
        calls: 0,
        puts: 0,
        activeStrike: "N/A",
        activeExpiry: "N/A",
        cpr: "N/A"
      };
    }

    const expiry = chain.expirationDates?.[0];
    const options = chain.options?.[0];

    if (!options) {
      return {
        calls: 0,
        puts: 0,
        activeStrike: "N/A",
        activeExpiry: "N/A",
        cpr: "N/A"
      };
    }

    let calls = 0;
    let puts = 0;
    let activeStrike = "N/A";
    let activeExpiry = expiry ? new Date(expiry * 1000).toISOString().split("T")[0] : "N/A";
    let maxVolume = 0;

    for (const c of options.calls) {
      const vol = c.volume || 0;
      calls += vol;
      if (vol > maxVolume) {
        maxVolume = vol;
        activeStrike = c.strike;
      }
    }

    for (const p of options.puts) {
      const vol = p.volume || 0;
      puts += vol;
    }

    const cpr = puts === 0 ? "∞" : (calls / puts).toFixed(2);

    return {
      calls,
      puts,
      activeStrike,
      activeExpiry,
      cpr
    };

  } catch (err) {
    console.error("Yahoo options error:", err);
    return {
      calls: 0,
      puts: 0,
      activeStrike: "N/A",
      activeExpiry: "N/A",
      cpr: "N/A"
    };
  }
}
