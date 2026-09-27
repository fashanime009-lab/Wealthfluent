import { wrapText } from "@/utils/shareCard";

// The downloadable 1080x1350 card for the verdict pages (rent vs buy, debt
// vs invest, lease vs buy a car). Shows the decision's name and the verdict
// headline as the page displays it — the visitor's own inputs (prices,
// balances, rates) are never drawn, matching the net worth card's rule.
export function drawVerdictShareCard(ctx, { width, height }, { label, headline }) {
  const pad = 72;

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#0e1512");
  bg.addColorStop(1, "#04140f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Wordmark
  ctx.font = "800 46px Archivo, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("FIN", pad, 110);
  const finWidth = ctx.measureText("FIN").width;
  ctx.fillStyle = "#34d399";
  ctx.fillText("AIW", pad + finWidth, 110);

  // Decision label
  ctx.font = "700 24px Archivo, sans-serif";
  ctx.fillStyle = "#34d399";
  ctx.fillText(`VERDICT · ${label.toUpperCase()}`, pad, 168);

  // Headline — the verdict, large
  ctx.font = "800 96px Archivo, sans-serif";
  ctx.fillStyle = "#ffffff";
  wrapText(ctx, headline, pad, 400, width - pad * 2, 118);

  // Divider
  ctx.strokeStyle = "rgba(238,241,236,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, height - 190);
  ctx.lineTo(width - pad, height - 190);
  ctx.stroke();

  // Footer / brand
  ctx.font = '600 36px "IBM Plex Mono", monospace';
  ctx.fillStyle = "rgba(238,241,236,0.9)";
  ctx.fillText("finaiw.com/verdict", pad, height - 120);

  ctx.font = "400 28px Archivo, sans-serif";
  ctx.fillStyle = "rgba(238,241,236,0.45)";
  ctx.fillText("Run the real numbers for your own decision — free, no signup", pad, height - 72);
}
