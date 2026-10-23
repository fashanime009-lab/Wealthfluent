// Canonical list of public, indexable routes — the single source of truth
// for both scripts/generate-sitemap.js (which writes this list into
// dist/sitemap.xml) and scripts/prerender.mjs (which crawls this same
// list, plus its own noindex-but-still-prerendered extras). Neither
// script reads the other's generated output anymore — that round-trip
// (prerender reading a previously-generated public/sitemap.xml) was the
// root cause of a Vercel build silently shipping a dateless, stale
// sitemap: generate-sitemap.js wrote to public/ after Vite had already
// copied public/ into dist/, so the regeneration never reached what was
// actually deployed.
import { readFileSync } from "node:fs";
import path from "node:path";
import { LESSONS } from "../../src/data/lessons.js";
import { getBlogPosts } from "./blogPosts.mjs";

// `lastmod` is intentionally absent from every entry below. This project
// has no page with a real, trustworthy "last substantively changed" date
// available at build time without git history (which Vercel's build
// container doesn't check out — see the bug this replaced). Blog posts
// are the one exception — see blogPostRouteDefs() below, which reads each
// post's own frontmatter ("dateModified", falling back to
// "datePublished") instead.
export const ROUTE_DEFS = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/help", changefreq: "monthly", priority: "0.7" },
  { path: "/feedback", changefreq: "monthly", priority: "0.6" },
  // /settings, /goals, /financial-profile, /insights intentionally
  // excluded — these are app-state / personal pages that robots.txt
  // already disallows crawling (generic or user-specific content with
  // no SEO value). Listing them here too sent Google a contradictory
  // signal: "please index this" via the sitemap while robots.txt says
  // "you may not even fetch this to look." Keeping both files in sync
  // going forward — anything disallowed in robots.txt shouldn't appear
  // here. getIndexableRoutes() below also filters against robots.txt
  // directly, as a safety net against this list drifting out of sync.

  { path: "/calculators", changefreq: "weekly", priority: "0.9" },
  { path: "/sip-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-sip", changefreq: "weekly", priority: "0.8" },
  { path: "/emi-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/fd-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/cagr-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/gst-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/rd-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/gratuity-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/ppf-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/hra-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/swp-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/power-of-compounding", changefreq: "weekly", priority: "0.8" },
  { path: "/cost-of-delay-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/lumpsum-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/step-up-sip-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/inflation-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/future-value-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/rate-of-return-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/bond-yield-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/networth-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/emergency-fund-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/home-affordability-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/wealth-age-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/net-worth-percentile", changefreq: "weekly", priority: "0.9" },
  { path: "/income-percentile", changefreq: "weekly", priority: "0.9" },
  { path: "/retirement-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/annual-retirement-income", changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-investment-tracker", changefreq: "weekly", priority: "0.8" },
  { path: "/fire-calculator", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-planner", changefreq: "weekly", priority: "0.8" },

  { path: "/verdict", changefreq: "weekly", priority: "0.8" },
  { path: "/verdict/rent-vs-buy", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/debt-vs-invest", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/lease-vs-buy-car", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/insurance-need", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/term-vs-endowment", changefreq: "weekly", priority: "0.7" },

  { path: "/tools", changefreq: "weekly", priority: "0.7" },
  // These 4 are the site's "advanced tools" tier, distinct from the
  // calculators above — financial-goal-planner and investment-risk-
  // analyzer were live pages that had never been added here at all.
  { path: "/financial-goal-planner", changefreq: "weekly", priority: "0.7" },
  { path: "/investment-risk-analyzer", changefreq: "weekly", priority: "0.7" },
  { path: "/financial-health-checkup", changefreq: "weekly", priority: "0.7" },
  { path: "/debt-payoff-planner", changefreq: "weekly", priority: "0.7" },
  // /journeys/home-buying intentionally excluded — feature isn't ready/
  // tested yet, so it's not something we want Google to discover or index.
  // Also excluded from robots.txt (see public/robots.txt) and left out of
  // the in-app search index and Sitemap page — reachable only by direct
  // URL for now.

  { path: "/learn", changefreq: "daily", priority: "0.8" },
  // Individual lesson pages — generated from src/data/lessons.js so a
  // newly added lesson is automatically indexable and prerendered
  // without anyone remembering to add it here by hand.
  ...LESSONS.map((lesson) => ({
    path: `/learn/${lesson.slug}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
  { path: "/news", changefreq: "daily", priority: "0.8" },
  { path: "/quizzes", changefreq: "weekly", priority: "0.7" },

  { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.4" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.4" },
  { path: "/sitemap", changefreq: "monthly", priority: "0.5" },

  { path: "/blog", changefreq: "daily", priority: "0.8" },
  // Individual posts aren't listed here — see blogPostRouteDefs() below,
  // which reads content/blog/*.md at build time, the same pattern as
  // LESSONS.map() above but with a real per-post lastmod.
];

// Each post's own frontmatter is the one place in this project with a
// genuinely trustworthy "last substantively changed" date — unlike every
// other route, which gets none (see the comment on ROUTE_DEFS above).
// Falls back to datePublished for a post that's never been updated.
function blogPostRouteDefs(repoRoot) {
  return getBlogPosts(repoRoot).map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: post.frontmatter.dateModified || post.frontmatter.datePublished || undefined,
  }));
}

export function getDisallowedPrefixes(repoRoot) {
  const robotsTxt = readFileSync(path.join(repoRoot, "public/robots.txt"), "utf-8");
  return [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
}

function isDisallowed(routePath, disallowedPrefixes) {
  return disallowedPrefixes.some((d) => routePath === d || routePath.startsWith(d + "/"));
}

// ROUTE_DEFS plus the dynamic blog post routes, filtered against
// robots.txt — a safety net in case a route is ever added without also
// being kept out of robots.txt, or vice versa. Returns the full route
// objects (path/changefreq/priority/lastmod), not just paths. This is
// the one function both generate-sitemap.js and prerender.mjs call —
// neither reads ROUTE_DEFS directly anymore, so neither can miss a post.
export function getIndexableRoutes(repoRoot) {
  const disallowed = getDisallowedPrefixes(repoRoot);
  const allRoutes = [...ROUTE_DEFS, ...blogPostRouteDefs(repoRoot)];
  return allRoutes.filter((route) => !isDisallowed(route.path, disallowed));
}
