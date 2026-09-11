#!/usr/bin/env node
/**
 * Post-build prerendering for search engines and social-link crawlers.
 *
 * WHY THIS EXISTS
 * FINAIW is a client-rendered Vite/React SPA. Every page's <title>,
 * meta description, and Open Graph/Twitter tags are injected at
 * runtime by react-helmet-async (see src/components/seo/Seo.jsx) —
 * they do not exist in the raw HTML Vercel serves. Google executes
 * JavaScript, so it mostly sees the real tags anyway, but most
 * link-preview crawlers (Twitterbot, redditbot, facebookexternalhit,
 * LinkedInBot, Slackbot, Discordbot, WhatsApp) do NOT run JavaScript.
 * They only ever see the static homepage title from index.html, so
 * shared links show a blank or wrong preview card no matter which
 * page was actually shared.
 *
 * WHAT IT DOES
 * Runs after `vite build`. It serves the built `dist/` output locally,
 * visits every indexable route (read from public/sitemap.xml, minus
 * anything public/robots.txt disallows), lets React + Helmet finish
 * rendering, then overwrites dist/<route>/index.html with the fully
 * rendered HTML — real <title>/<meta>/OG tags baked in as static
 * markup other crawlers can read without executing anything.
 *
 * Real visitors are unaffected: src/main.jsx uses createRoot (a full
 * client render, not hydrateRoot), so the browser just re-renders the
 * interactive app over this static HTML on load — no hydration
 * mismatch risk. They may see this static markup flash briefly before
 * React takes over, which is a harmless side benefit (faster first
 * paint), not a regression.
 *
 * HOW IT RUNS
 * Wired up as the "postbuild" script in package.json, so it fires
 * automatically every time `npm run build` runs — no separate step to
 * remember.
 *
 * ONE-TIME SETUP
 *   npm install --save-dev puppeteer
 * Then just run `npm run build` as usual.
 *
 * NOTE ON DEPLOYING
 * Puppeteer downloads a real Chromium binary, which makes this step
 * slow (and sometimes flaky) to run inside Vercel's own build
 * container. It's more reliable to run `npm run build` locally (or in
 * a GitHub Actions job) and deploy the resulting prebuilt `dist/`
 * folder, e.g. with `vercel deploy --prebuilt`, rather than letting
 * Vercel run the build itself. If you'd rather have Vercel do the
 * build, you'll likely need to add `--no-sandbox` to the launch args
 * below and confirm the build container has enough memory.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
// The real domain crawlers hit in production. Falls back to the same
// default src/components/seo/Seo.jsx uses so the two never drift apart.
// Snapshots are captured against BASE_URL (localhost), so every
// absolute URL baked into canonical/og:url/og:image/twitter:image gets
// rewritten to this before writing — otherwise every prerendered file
// would ship pointing crawlers at localhost.
const SITE_URL = (process.env.VITE_SITE_URL || "https://finaiw.com").replace(/\/+$/, "");

// Reads the canonical route list straight from the files you already
// maintain, so this script never drifts out of sync with them.
function getIndexableRoutes() {
  const sitemapXml = readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf-8");
  const locs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => {
    const url = new URL(m[1]);
    return url.pathname || "/";
  });

  const robotsTxt = readFileSync(path.join(ROOT, "public/robots.txt"), "utf-8");
  const disallowed = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);

  // Skip anything robots.txt says not to crawl — those are app-state
  // pages (e.g. /settings) that render generic/empty content anyway
  // outside of a logged-in session, so prerendering them wastes build
  // time and would just bake in a placeholder.
  const routes = locs.filter(
    (route) => !disallowed.some((d) => route === d || route.startsWith(d + "/"))
  );

  // "/" must be prerendered LAST. This script overwrites dist/index.html
  // with each route's fully-rendered output, but dist/index.html also
  // doubles as vite preview's SPA fallback for every route that doesn't
  // yet have its own dist/<route>/index.html on disk. If "/" is
  // processed first, every other route's initial HTML load starts from
  // the homepage's baked Helmet tags (title/OG/canonical) instead of
  // the neutral pre-render template, and react-helmet-async doesn't
  // remove those leftovers — it just adds its own on top, leaving the
  // wrong (homepage) tag first and the correct one appended after it.
  // Since most non-JS link-preview crawlers use the first matching tag,
  // that silently broke previews for every page except the homepage.
  const homeIndex = routes.indexOf("/");
  if (homeIndex !== -1) {
    routes.splice(homeIndex, 1);
    routes.push("/");
  }
  return routes;
}

// Keeps only the first occurrence of each singleton head tag. With "/"
// prerendered last (see getIndexableRoutes), Helmet's own tags are
// always the first of their kind in a fresh snapshot — this is a
// defensive backstop (e.g. it also cleans up the homepage's own
// harmless duplicate <title> from the static index.html template)
// rather than the primary fix.
function dedupeHeadTags(html) {
  // og:* and twitter:* each cover many distinct properties (title,
  // description, url, image, ...) that legitimately coexist — dedupe
  // per property name, not per pattern, or every property after the
  // first would be stripped outright instead of just its duplicates.
  html = dedupeByCapturedKey(html, /<meta property="(og:[a-z:]+)"[^>]*>/g);
  html = dedupeByCapturedKey(html, /<meta name="(twitter:[a-z:]+)"[^>]*>/g);

  const singletonPatterns = [
    /<title>[\s\S]*?<\/title>/g,
    /<link rel="canonical"[^>]*>/g,
    /<meta name="description"[^>]*>/g,
    /<meta name="robots"[^>]*>/g,
    /<meta name="keywords"[^>]*>/g,
  ];
  for (const pattern of singletonPatterns) {
    let seen = false;
    html = html.replace(pattern, (match) => {
      if (seen) return "";
      seen = true;
      return match;
    });
  }
  return html;
}

function dedupeByCapturedKey(html, pattern) {
  const seenKeys = new Set();
  return html.replace(pattern, (match, key) => {
    if (seenKeys.has(key)) return "";
    seenKeys.add(key);
    return match;
  });
}

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // Server isn't accepting connections yet — keep polling.
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("Preview server did not start in time"));
      }
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

async function main() {
  if (!existsSync(DIST)) {
    console.error("dist/ not found — run `npm run build` first (this script expects to run as its postbuild step).");
    process.exit(1);
  }

  const routes = getIndexableRoutes();
  console.log(`Prerendering ${routes.length} routes for crawlers...`);

  const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: "pipe",
  });

  let serverErrorOutput = "";
  server.stderr?.on("data", (d) => {
    serverErrorOutput += d.toString();
  });

  let failures = 0;

  try {
    await waitForServer(BASE_URL);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    for (const route of routes) {
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle0", timeout: 15000 });
        // Helmet applies its tags synchronously on mount, but give
        // slower pages (e.g. ones fetching data before rendering
        // <Seo>) a moment before we snapshot the DOM.
        await page
          .waitForSelector('meta[property="og:title"]', { timeout: 5000 })
          .catch(() => {});

        const html = dedupeHeadTags(
          (await page.content()).split(BASE_URL).join(SITE_URL)
        );
        const outPath =
          route === "/"
            ? path.join(DIST, "index.html")
            : path.join(DIST, route.replace(/^\//, ""), "index.html");

        mkdirSync(path.dirname(outPath), { recursive: true });
        writeFileSync(outPath, html, "utf-8");
        console.log(`  \u2713 ${route}`);
      } catch (err) {
        failures += 1;
        console.warn(`  \u2717 ${route} \u2014 ${err.message}`);
      }
    }

    await browser.close();
  } finally {
    server.kill();
    if (serverErrorOutput) console.error(serverErrorOutput);
  }

  console.log(`Prerendering complete: ${routes.length - failures}/${routes.length} routes succeeded.`);
  if (failures > 0) process.exitCode = 1;
}

main();
