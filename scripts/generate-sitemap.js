// Writes dist/sitemap.xml directly — the same output directory
// prerender.mjs writes into, and the one Vercel actually deploys. This
// used to write to public/sitemap.xml instead, which Vite had already
// copied into dist/ *before* this script ran (postbuild runs after
// `vite build`), so every regeneration here was silently discarded —
// the live site kept serving whatever had last been committed, not what
// this script produced. It also used to compute each route's lastmod
// from `git log`, which isn't available in Vercel's build container (no
// .git checked out there) — see getIndexableRoutes()/ROUTE_DEFS in
// scripts/lib/routes.mjs for why lastmod is simply omitted for every
// route now instead.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexableRoutes } from "./lib/routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const dist = path.join(repoRoot, "dist");

function fail(message) {
  console.error(`Sitemap generation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dist)) {
  fail("dist/ not found — run `npm run build` first (this script expects to run as its postbuild step).");
}

let routes;
try {
  routes = getIndexableRoutes(repoRoot);
} catch (err) {
  fail(`could not resolve the route list — ${err.message}`);
}

if (!routes || routes.length === 0) {
  fail("resolved zero routes — a sitemap with no URLs would silently deindex the entire site.");
}

const baseUrl = "https://www.finaiw.com";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ""}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}

</urlset>`;

const outputPath = path.join(dist, "sitemap.xml");

try {
  fs.writeFileSync(outputPath, sitemap, "utf-8");
} catch (err) {
  fail(`could not write ${outputPath} — ${err.message}`);
}

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`✅ Total URLs: ${routes.length}`);
