#!/usr/bin/env node
// Checks every URL in a deployed sitemap.xml the way a crawler sees it.
//
//   node scripts/check-sitemap-seo.mjs [base] [--js]
//
// base defaults to https://www.finaiw.com. For a preview, pass its origin
// (e.g. https://pr-17-finaiw.<account>.workers.dev): the sitemap's www URLs
// are fetched from that origin instead, but canonicals must still be www.
//
// Without JavaScript (plain fetch, no redirects followed), each URL must:
//   - return 200 with no redirect
//   - have a non-empty <title>
//   - have exactly one canonical, equal to its sitemap URL (www, no
//     trailing slash)
//   - have exactly one <h1>
//   - carry real page text (at least MIN_TEXT characters of visible text)
//   - not be noindex (meta robots, or X-Robots-Tag on www)
// With --js it also loads each page in Chrome and checks that the SEO tags
// still appear exactly once after the app has rendered.
//
// Prints one row per URL and exits 1 if any row fails.
import { createRequire } from "node:module";

const SITE = "https://www.finaiw.com";
const MIN_TEXT = 500;
const args = process.argv.slice(2);
const withJs = args.includes("--js");
const base = (args.find((a) => !a.startsWith("--")) || SITE).replace(/\/+$/, "");
const isPreview = new URL(base).hostname.endsWith(".workers.dev");

const count = (html, re) => (html.match(re) || []).length;
const first = (html, re) => (html.match(re) || [])[1];
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

function visibleText(html) {
  const body = html.slice(html.search(/<body[\s>]/i));
  return decode(
    body
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

async function checkNoJs(loc) {
  const url = base + new URL(loc).pathname;
  const res = await fetch(url, { redirect: "manual", headers: { "User-Agent": "finaiw-sitemap-check" } });
  const html = res.status === 200 ? await res.text() : "";
  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g)].map((m) => m[1]);
  const robotsMeta = first(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/) || "";
  const xRobots = res.headers.get("x-robots-tag") || "";
  const row = {
    path: new URL(loc).pathname,
    status: res.status,
    location: res.headers.get("location") || "",
    title: decode(first(html, /<title[^>]*>([^<]*)<\/title>/) || ""),
    titleCount: count(html, /<title[\s>]/g),
    canonical: canonicals.join(" "),
    h1: count(html, /<h1[\s>]/g),
    text: visibleText(html).length,
    robots: robotsMeta,
    xRobots,
  };
  const problems = [];
  if (row.status !== 200) problems.push(`status ${row.status}${row.location ? ` -> ${row.location}` : ""}`);
  if (row.status === 200) {
    if (!row.title.trim()) problems.push("no title");
    if (row.titleCount !== 1) problems.push(`${row.titleCount} titles`);
    if (canonicals.length !== 1) problems.push(`${canonicals.length} canonicals`);
    else if (canonicals[0] !== loc) problems.push(`canonical ${canonicals[0]} != ${loc}`);
    if (row.h1 !== 1) problems.push(`${row.h1} h1`);
    if (row.text < MIN_TEXT) problems.push(`only ${row.text} chars of text`);
    if (/noindex/i.test(robotsMeta)) problems.push("meta noindex");
    if (!isPreview && xRobots) problems.push(`x-robots-tag: ${xRobots}`);
  }
  return { ...row, problems };
}

async function checkWithJs(browser, loc) {
  const page = await browser.newPage();
  try {
    await page.goto(base + new URL(loc).pathname, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));
    const counts = await page.evaluate(() => {
      const n = (s) => document.querySelectorAll(s).length;
      return {
        title: n("head title"),
        description: n('meta[name="description"]'),
        canonical: n('link[rel="canonical"]'),
        robots: n('meta[name="robots"]'),
        "og:title": n('meta[property="og:title"]'),
        "og:description": n('meta[property="og:description"]'),
        "og:url": n('meta[property="og:url"]'),
        "og:image": n('meta[property="og:image"]'),
        "twitter:card": n('meta[name="twitter:card"]'),
        "twitter:title": n('meta[name="twitter:title"]'),
        "twitter:image": n('meta[name="twitter:image"]'),
        h1: n("h1"),
      };
    });
    const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.href || "");
    const problems = Object.entries(counts)
      .filter(([, v]) => v !== 1)
      .map(([k, v]) => `${v}x ${k} after JS`);
    if (canonical !== loc) problems.push(`canonical after JS ${canonical}`);
    return problems;
  } finally {
    await page.close();
  }
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

const sitemapRes = await fetch(`${base}/sitemap.xml`, { redirect: "manual" });
const sitemapType = sitemapRes.headers.get("content-type") || "";
const sitemap = await sitemapRes.text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const lastmods = [...sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)].filter((u) => /<lastmod>/.test(u[0])).length;
console.log(`${base}/sitemap.xml: ${sitemapRes.status} ${sitemapType}, ${locs.length} URLs, ${lastmods} with lastmod`);

const badLocs = locs.filter((l) => !l.startsWith(`${SITE}/`) || (l !== `${SITE}/` && l.endsWith("/")));
const rows = await pool(locs, 8, checkNoJs);

if (withJs) {
  const puppeteer = createRequire(import.meta.url)("puppeteer-core");
  const browser = await puppeteer.launch({ channel: "chrome", headless: true });
  try {
    await pool(rows, 4, async (row) => {
      if (row.status === 200) row.problems.push(...(await checkWithJs(browser, SITE + row.path)));
    });
  } finally {
    await browser.close();
  }
}

const pad = (s, n) => String(s).slice(0, n).padEnd(n);
console.log(
  `\n${pad("RESULT", 6)} ${pad("STATUS", 6)} ${pad("H1", 3)} ${pad("TEXT", 6)} ${pad("PATH", 46)} ${pad("TITLE", 62)} CANONICAL`
);
for (const r of rows) {
  const ok = r.problems.length === 0;
  console.log(
    `${pad(ok ? "PASS" : "FAIL", 6)} ${pad(r.status, 6)} ${pad(r.h1, 3)} ${pad(r.text, 6)} ${pad(r.path, 46)} ${pad(r.title, 62)} ${r.canonical}`
  );
  if (!ok) console.log(`       ↳ ${r.problems.join("; ")}`);
}

const failed = rows.filter((r) => r.problems.length > 0).length;
const sitemapProblems = [];
if (sitemapRes.status !== 200) sitemapProblems.push(`sitemap status ${sitemapRes.status}`);
if (!/application\/xml|text\/xml/.test(sitemapType)) sitemapProblems.push(`sitemap content-type ${sitemapType}`);
if (badLocs.length) sitemapProblems.push(`non-www or trailing-slash <loc>: ${badLocs.join(", ")}`);
if (lastmods !== locs.length) sitemapProblems.push(`${locs.length - lastmods} URLs without lastmod`);

console.log(
  `\n${rows.length - failed}/${rows.length} URLs pass${withJs ? " (with and without JS)" : " (no JS)"}.` +
    (sitemapProblems.length ? `\nSitemap: ${sitemapProblems.join("; ")}` : "\nSitemap: OK")
);
process.exit(failed || sitemapProblems.length ? 1 : 0);
