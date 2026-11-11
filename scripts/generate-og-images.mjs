// Pre-renders every Global Net Worth Percentile share card for the
// Cloudflare build.
//
// On Cloudflare's free plan a Worker gets 10 ms of CPU per request, far
// too little to run satori + resvg on demand the way the Vercel/Netlify
// function did. The card only varies by one number, which
// api/og/_card.js's clampPercent() rounds to one decimal in (0, 100], so
// every possible card is known ahead of time: 0.0 through 100.0 in 0.1
// steps. cloudflare/worker.mjs maps /api/og?p=... onto these files, so
// share URLs already out in the wild keep working unchanged.
//
// Rendering is slow (~0.7 s a card on one core), so cards go to .cache/og/
// rather than dist/ (Vite empties dist/ on every build), split across
// worker threads, and skipped when they already exist. CI caches .cache/og
// keyed on everything that changes how a card looks, so ordinary builds
// render nothing; scripts/build-cloudflare.mjs copies them into dist/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OG_CACHE_DIR = path.join(ROOT, ".cache", "og", "net-worth");
const TOTAL = 1001; // 0.0 ... 100.0

// Must name files exactly the way the Worker looks them up: the same
// rounding clampPercent() applies, rendered with String() (so "12.5",
// "3", "100", never "3.0").
const fileFor = (tenths) => path.join(OG_CACHE_DIR, `${String(Math.round(tenths) / 10)}.png`);

async function renderSome(list) {
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");
  const require = createRequire(import.meta.url);
  const { WIDTH, HEIGHT, buildCard } = require("../api/og/_card.js");
  const fontData = readFileSync(path.join(ROOT, "api/og/Geist-Regular.ttf"));

  for (const tenths of list) {
    const svg = await satori(buildCard(tenths / 10), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Geist", data: fontData, weight: 700, style: "normal" }],
    });
    writeFileSync(fileFor(tenths), new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng());
  }
}

if (isMainThread) {
  mkdirSync(OG_CACHE_DIR, { recursive: true });
  const missing = Array.from({ length: TOTAL }, (_, i) => i).filter((tenths) => !existsSync(fileFor(tenths)));

  if (missing.length === 0) {
    console.log(`✅ Share cards: all ${TOTAL} already in .cache/og (nothing to render)`);
  } else {
    const started = Date.now();
    const threads = Math.min(missing.length, Math.max(1, os.availableParallelism()));
    const chunks = Array.from({ length: threads }, (_, t) => missing.filter((_, i) => i % threads === t));
    await Promise.all(
      chunks.map(
        (list) =>
          new Promise((resolve, reject) => {
            const worker = new Worker(fileURLToPath(import.meta.url), { workerData: list });
            worker.once("message", resolve);
            worker.once("error", reject);
            worker.once("exit", (code) => code !== 0 && reject(new Error(`share card worker exited with ${code}`)));
          })
      )
    );
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`✅ Share cards: rendered ${missing.length} of ${TOTAL} on ${threads} threads in ${seconds}s`);
  }
} else {
  await renderSome(workerData);
  parentPort.postMessage("done");
}
