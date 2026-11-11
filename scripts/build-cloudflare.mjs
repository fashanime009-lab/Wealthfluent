// Finishes dist/ for Cloudflare after the regular build (npm run build):
// adds the static-asset _headers/_redirects files and the pre-rendered
// share cards. Netlify never runs this, so its deploys are unaffected
// while both hosts exist.
import { cpSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

if (!existsSync(path.join(DIST, "index.html"))) {
  console.error("❌ dist/index.html missing: run `npm run build` first.");
  process.exit(1);
}

cpSync(path.join(ROOT, "cloudflare", "_headers"), path.join(DIST, "_headers"));
cpSync(path.join(ROOT, "cloudflare", "_redirects"), path.join(DIST, "_redirects"));

// Renders only the cards not already in .cache/og (see that script).
execFileSync(process.execPath, [path.join(ROOT, "scripts", "generate-og-images.mjs")], { stdio: "inherit" });

const ogSource = path.join(ROOT, ".cache", "og");
cpSync(ogSource, path.join(DIST, "og"), { recursive: true });
const count = readdirSync(path.join(DIST, "og", "net-worth")).length;
if (count !== 1001) {
  console.error(`❌ Expected 1001 share cards in dist/og/net-worth, found ${count}.`);
  process.exit(1);
}
console.log("✅ dist/ ready for Cloudflare (_headers, _redirects, 1001 share cards)");
