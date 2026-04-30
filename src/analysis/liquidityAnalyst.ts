type FlowSnapshot = {
  ticker: string;
  sector: string;
  movePct: number;
  volumeRel: number;   // volume / avgVolume
  cpr?: number;        // call/put ratio
};

export function analyzeInstitutionalLiquidity(flows: FlowSnapshot[]): string {
  const highVolume = flows.filter(f => f.volumeRel >= 2);
  const strongUp = highVolume.filter(f => f.movePct >= 2);
  const strongDown = highVolume.filter(f => f.movePct <= -2);

  const bySector = (items: FlowSnapshot[]) =>
    items.reduce<Record<string, number>>((acc, f) => {
      acc[f.sector] = (acc[f.sector] || 0) + 1;
      return acc;
    }, {});

  const upSectors = bySector(strongUp);
  const downSectors = bySector(strongDown);

  const topUpSector = Object.entries(upSectors).sort((a, b) => b[1] - a[1])[0];
  const topDownSector = Object.entries(downSectors).sort((a, b) => b[1] - a[1])[0];

  let lines: string[] = [];

  if (topUpSector) {
    lines.push(
      `📈 **Liquidity is rotating into ${topUpSector[0]}** — elevated volume and broad upside across key names.`
    );
  }

  if (topDownSector) {
    lines.push(
      `📉 **Liquidity is exiting ${topDownSector[0]}** — heavy selling pressure with outsized downside moves.`
    );
  }

  const highCPR = flows.filter(f => (f.cpr ?? 1) >= 1.5);
  if (highCPR.length > 0) {
    const names = highCPR.slice(0, 5).map(f => f.ticker).join(", ");
    lines.push(
      `🔥 **Call‑side interest is concentrated in:** ${names} — options flow suggests aggressive upside positioning.`
    );
  }

  if (lines.length === 0) {
    lines.push("⚖️ Liquidity appears broadly balanced — no dominant sector rotation detected right now.");
  }

  return lines.join("\n");
}
