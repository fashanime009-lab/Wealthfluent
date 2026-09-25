import { wrapText } from "@/utils/shareCard";

// The downloadable 1080x1350 card for the Global Net Worth Percentile page
// — see ShareResult.jsx / shareCard.js for the generic render/download
// mechanics this plugs into. Deliberately shows only the percentile, never
// the net worth figure that produced it (the site's privacy promise:
// nothing a visitor enters is sent anywhere, and that includes what gets
// shared on their behalf).
export function drawNetWorthShareCard(ctx, { width, height }, result) {
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

  // Category label
  ctx.font = "700 24px Archivo, sans-serif";
  ctx.fillStyle = "#34d399";
  ctx.fillText("GLOBAL NET WORTH PERCENTILE", pad, 168);

  // Headline — "Top X% globally", the same framing as the on-page result
  ctx.font = "800 132px Archivo, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Top ${result.topPercent}%`, pad, 470);

  ctx.font = "700 54px Archivo, sans-serif";
  ctx.fillStyle = "#34d399";
  ctx.fillText("globally", pad, 545);

  // Subtitle
  ctx.font = "500 42px Archivo, sans-serif";
  ctx.fillStyle = "rgba(238,241,236,0.82)";
  wrapText(ctx, `Wealthier than ${result.percentile}% of the world's adults`, pad, 660, width - pad * 2, 56);

  // Data-source line (small, honest, matches the on-page disclosure)
  ctx.font = "500 26px Archivo, sans-serif";
  ctx.fillStyle = "rgba(238,241,236,0.45)";
  ctx.fillText("Data: UBS Global Wealth Report 2026 (estimate)", pad, height - 260);

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
  ctx.fillText("finaiw.com", pad, height - 120);

  ctx.font = "400 28px Archivo, sans-serif";
  ctx.fillStyle = "rgba(238,241,236,0.45)";
  ctx.fillText("Free global net worth percentile calculator — any currency, no signup", pad, height - 72);
}
