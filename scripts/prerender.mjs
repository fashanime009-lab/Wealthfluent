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
 * RUNNING IN VERCEL'S BUILD CONTAINER
 * Vercel's build image is missing system shared libraries (libnss3.so
 * and others) a normal downloaded Chrome binary needs — the full
 * `puppeteer` package (which bundles that binary) fails there with
 * "error while loading shared libraries: libnss3.so". Fixed by using
 * `puppeteer-core` (no bundled browser) together with
 * `@sparticuz/chromium`, a Chromium build compiled specifically to run
 * standalone in serverless/CI build containers like Vercel's — see
 * launchBrowser() below. Locally (or anywhere not running on Vercel),
 * it instead launches your own installed Chrome via puppeteer-core's
 * `channel: "chrome"`, so no second Chrome download is needed for
 * everyday local builds.
 *
 * ONE-TIME SETUP
 *   npm install --save-dev puppeteer-core @sparticuz/chromium
 * Then just run `npm run build` as usual — locally or on Vercel.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

// Vercel sets VERCEL=1 during both build and runtime — that's the signal
// to use the serverless-compatible Chromium instead of a local install.
// @sparticuz/chromium is only imported in that branch so a local build
// never needs it downloaded/loaded at all.
//
// `vercel build` run locally (e.g. via the CLI, to test a prod build
// before deploying) ALSO sets VERCEL=1 to replicate Vercel's env vars,
// but the build still executes on the local machine, not inside Vercel's
// actual Linux container — @sparticuz/chromium's binary is Linux-only,
// so launching it locally on macOS/Windows fails with ENOEXEC. Requiring
// linux as well as the env var distinguishes a real remote Vercel build
// from a local `vercel build` emulating one.
async function launchBrowser() {
  if (process.env.VERCEL && process.platform === "linux") {
    const { default: chromium } = await import("@sparticuz/chromium");
    // Matches @sparticuz/chromium's own documented usage exactly: args
    // must go through puppeteer's defaultArgs() (merges chromium's flags
    // with puppeteer-core's own required ones) rather than being passed
    // raw, and "shell" is the specific headless mode this Chromium build
    // supports — plain `true` is not.
    return puppeteer.launch({
      headless: "shell",
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
      executablePath: await chromium.executablePath(),
    });
  }

  return puppeteer.launch({
    headless: true,
    channel: "chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
// The real domain crawlers hit in production — www.finaiw.com is the
// domain Vercel actually serves from (finaiw.com redirects to it), so
// that's the correct fallback, not the apex domain. Snapshots are
// captured against BASE_URL (localhost), so every absolute URL baked
// into canonical/og:url/og:image/twitter:image gets rewritten to this
// before writing — otherwise every prerendered file would ship pointing
// crawlers at localhost. See rewriteSiteUrls() for why this replacement
// is scoped to only those tags, never applied to the whole document.
const SITE_URL = (process.env.VITE_SITE_URL || "https://www.finaiw.com").replace(/\/+$/, "");

// Rewrites BASE_URL -> SITE_URL only inside the specific tags meant to
// carry the real production URL: the canonical link, OG/Twitter meta
// content, and inline JSON-LD. Deliberately never touches <script src>
// — a previous version of this function did a blanket find-and-replace
// across the ENTIRE captured HTML, which also rewrote the app's own JS
// bundle <script src> tags to a hardcoded absolute origin. That origin
// didn't match the domain the page actually loads from, so every
// script became cross-origin relative to the page's real 'self' — and
// CSP correctly refused to run any of them, breaking the live site.
//
// <link rel="modulepreload"> hints for lazy-loaded route chunks are a
// separate case: React Router/Vite insert these into the DOM at
// runtime with an ABSOLUTE href (`new URL(path, import.meta.url).href`),
// unlike the static template's script tags, which stay root-relative.
// Rewriting those to SITE_URL would reintroduce the exact same
// domain-mismatch risk, so they're stripped back to root-relative
// instead — matching every other asset reference, and immune to
// www-vs-apex mismatches entirely since there's no domain baked in.
function rewriteSiteUrls(html) {
  const escapedBase = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const baseUrlPattern = new RegExp(escapedBase, "g");
  const swap = (match, prefix, url, suffix) => prefix + url.replace(baseUrlPattern, SITE_URL) + suffix;

  return html
    .replace(/(<link rel="canonical"[^>]*href=")([^"]*)(")/g, swap)
    .replace(/(<meta (?:property|name)="(?:og|twitter):[a-z:]+"[^>]*content=")([^"]*)(")/g, swap)
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, swap)
    .replace(/<link rel="modulepreload"[^>]*href="([^"]*)"[^>]*>/g, (match, url) =>
      match.replace(url, url.replace(baseUrlPattern, ""))
    );
}

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

// Runs INSIDE the page (via page.evaluate) right before content() is
// captured. adsbygoogle.js loads unconditionally (needed for AdSense's
// own non-JS verification crawler — see index.html), so during the
// prerender crawl it genuinely fires: our own AdSlot push(), AND —
// independently of any component we render — Google's Auto Ads feature,
// which scans the page and injects its own ad units directly into the
// DOM whenever it's enabled on the AdSense account, with no <ins> tag of
// ours involved at all. Either source bakes a live ad iframe (real
// doubleclick request URLs, this build server's own localhost origin in
// a query param, sometimes a reCAPTCHA-style verification frame) into
// the static HTML shipped to every visitor. Removing every ad element
// right before capture — regardless of which mechanism created it —
// is the only place that reliably catches both. Real visitors are
// unaffected: this only ever runs against the throwaway prerender
// snapshot, and ads load fresh in their own browser once the client
// bundle takes over.
function stripAdContent() {
  document
    .querySelectorAll(
      [
        "ins.adsbygoogle",
        'iframe[id^="google_ads_iframe"]',
        'iframe[id="google_esf"]',
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]',
        'iframe[src*="google.com/recaptcha"]',
      ].join(",")
    )
    .forEach((el) => el.remove());
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

    const browser = await launchBrowser();
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
        await page.evaluate(stripAdContent);

        const html = dedupeHeadTags(rewriteSiteUrls(await page.content()));
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
