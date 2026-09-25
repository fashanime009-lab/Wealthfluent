// Renders a shareable result card to a PNG Blob entirely client-side — an
// off-screen canvas, no server round trip, nothing about the visitor's
// actual figures ever leaves their device. The caller supplies a
// draw(ctx, { width, height }) function, so the card's actual content
// stays specific to whichever tool is using it (see ShareResult.jsx).
const WIDTH = 1080;
const HEIGHT = 1350; // Instagram portrait-post ratio (4:5)

// The site's own webfonts (Archivo, IBM Plex Mono) are already loaded for
// on-page text; canvas text needs them explicitly ready via the Font
// Loading API first, or it silently falls back to the browser default
// before the real face has finished loading. Best-effort: if this fails
// for any reason, drawing still proceeds with whatever font is available.
async function ensureFontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  const specs = ['800 10px Archivo', '700 10px Archivo', '600 10px "IBM Plex Mono"'];
  await Promise.all(specs.map((spec) => document.fonts.load(spec).catch(() => {})));
}

export async function renderShareCard(draw) {
  await ensureFontsReady();
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  draw(ctx, { width: WIDTH, height: HEIGHT });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Card render produced no image"))), "image/png");
  });
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Draws text wrapped to maxWidth from (x, y); returns the y of the last line
// so callers can position whatever follows it.
export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, lineY);
  return lineY;
}
