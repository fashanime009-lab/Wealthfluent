import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import { LESSONS } from "../src/data/lessons.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

// ─── Real per-page lastmod, not a blanket "today" ──────────────────
// Every route used to get today's date stamped on it regardless of
// whether anything actually changed, which meant every URL kept claiming
// "just updated" forever — search engines stop trusting lastmod once
// they've seen it be wrong often enough. Each route below instead gives
// the git commit date of its own primary source file. This tracks that
// file only, not components or data it imports — a shared component
// changing doesn't bump every page that uses it. That's a deliberate
// simplification, not full dependency tracking.
function lastCommitDate(relativeFilePath) {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cd", "--date=short", "--", relativeFilePath],
      { cwd: repoRoot, encoding: "utf-8" }
    ).trim();
    return out || null; // empty string = file has no commits yet (e.g. untracked)
  } catch {
    return null;
  }
}

// ─── All your routes ──────────────────────────────────────────────
// Kept in sync with the actual routes in src/App.jsx. Two routes
// (/WorkspacePage, /NetWorthPage) are deliberately left out — they use
// PascalCase URLs unlike every other route on the site, which suggests
// they're leftover internal/dev routes rather than intentional public
// pages; worth a look to confirm before ever adding them here.
// `file` is the page's own primary source — used only to look up its
// lastmod; it never changes the route itself. Regenerate (npm run
// sitemap, or just build — this now runs in postbuild) whenever pages
// change.
const routeDefs = [
  { path: "/", file: "src/pages/WealthFluentHomepage.jsx", changefreq: "daily", priority: "1.0" },
  { path: "/about", file: "src/pages/AboutPage.jsx", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", file: "src/pages/ContactPage.jsx", changefreq: "monthly", priority: "0.7" },
  { path: "/help", file: "src/pages/HelpPage.jsx", changefreq: "monthly", priority: "0.7" },
  { path: "/feedback", file: "src/pages/FeedbackPage.jsx", changefreq: "monthly", priority: "0.6" },
  // /settings, /goals, /financial-profile, /insights intentionally
  // excluded — these are app-state / personal pages that robots.txt
  // already disallows crawling (generic or user-specific content with
  // no SEO value). Listing them here too sent Google a contradictory
  // signal: "please index this" via the sitemap while robots.txt says
  // "you may not even fetch this to look." Keeping both files in sync
  // going forward — anything disallowed in robots.txt shouldn't appear
  // here.

  { path: "/calculators", file: "src/pages/CalculatorsPage.jsx", changefreq: "weekly", priority: "0.9" },
  { path: "/sip-calculator", file: "src/pages/SIPCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-sip", file: "src/pages/GoalSIPCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/emi-calculator", file: "src/pages/EMICalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/fd-calculator", file: "src/pages/FDCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/cagr-calculator", file: "src/pages/CAGRCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/gst-calculator", file: "src/pages/GSTCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/rd-calculator", file: "src/pages/RDCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/gratuity-calculator", file: "src/pages/GratuityCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/ppf-calculator", file: "src/pages/PPFCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/hra-calculator", file: "src/pages/HRACalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/swp-calculator", file: "src/pages/SWPCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/power-of-compounding", file: "src/pages/PowerOfCompoundingPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/cost-of-delay-calculator", file: "src/pages/CostOfDelayCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/lumpsum-calculator", file: "src/pages/LumpsumCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/step-up-sip-calculator", file: "src/pages/StepUpSIPCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/inflation-calculator", file: "src/pages/InflationCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/future-value-calculator", file: "src/pages/FutureValueCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/rate-of-return-calculator", file: "src/pages/RateOfReturnCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/bond-yield-calculator", file: "src/pages/BondYieldCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/networth-calculator", file: "src/pages/NetWorthCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/emergency-fund-calculator", file: "src/pages/EmergencyFundCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/home-affordability-calculator", file: "src/pages/HomeAffordabilityCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/wealth-age-calculator", file: "src/pages/WealthAgeCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/net-worth-percentile", file: "src/pages/NetWorthPercentilePage.jsx", changefreq: "weekly", priority: "0.9" },
  { path: "/income-percentile", file: "src/pages/IncomePercentilePage.jsx", changefreq: "weekly", priority: "0.9" },
  { path: "/retirement-calculator", file: "src/pages/RetirementCalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/annual-retirement-income", file: "src/pages/AnnualRetirementIncomePage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-investment-tracker", file: "src/pages/RetirementInvestmentTrackerPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/fire-calculator", file: "src/pages/FIRECalculatorPage.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-planner", file: "src/pages/GoalPlannerPage.jsx", changefreq: "weekly", priority: "0.8" },

  { path: "/verdict", file: "src/pages/verdict/VerdictIndex.jsx", changefreq: "weekly", priority: "0.8" },
  { path: "/verdict/rent-vs-buy", file: "src/pages/verdict/RentVsBuyPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/debt-vs-invest", file: "src/pages/verdict/DebtVsInvestPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/lease-vs-buy-car", file: "src/pages/verdict/LeaseVsBuyPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/insurance-need", file: "src/pages/verdict/InsuranceNeedPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/term-vs-endowment", file: "src/pages/verdict/TermVsEndowmentPage.jsx", changefreq: "weekly", priority: "0.7" },

  { path: "/tools", file: "src/pages/ToolsPage.jsx", changefreq: "weekly", priority: "0.7" },
  // These 4 are the site's "advanced tools" tier, distinct from the
  // calculators above — financial-goal-planner and investment-risk-
  // analyzer were live pages that had never been added here at all.
  { path: "/financial-goal-planner", file: "src/pages/FinancialGoalPlannerPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/investment-risk-analyzer", file: "src/pages/InvestmentRiskAnalyzerPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/financial-health-checkup", file: "src/pages/FinancialHealthCheckupPage.jsx", changefreq: "weekly", priority: "0.7" },
  { path: "/debt-payoff-planner", file: "src/pages/DebtPayoffPlannerPage.jsx", changefreq: "weekly", priority: "0.7" },
  // /journeys/home-buying intentionally excluded — feature isn't ready/
  // tested yet, so it's not something we want Google to discover or index.
  // Also excluded from robots.txt (see public/robots.txt) and left out of
  // the in-app search index and Sitemap page — reachable only by direct
  // URL for now.

  { path: "/learn", file: "src/pages/LearnPage.jsx", changefreq: "daily", priority: "0.8" },
  // Individual lesson pages — generated from src/data/lessons.js so a
  // newly added lesson is automatically indexable and prerendered (see
  // scripts/prerender.mjs) without anyone remembering to add it here by
  // hand. All lessons share one source file, so they all get that file's
  // lastmod — not perfectly per-lesson, but honest about what actually
  // changed and when, which "today" for all 30 wasn't.
  ...LESSONS.map((lesson) => ({
    path: `/learn/${lesson.slug}`,
    file: "src/data/lessons.js",
    changefreq: "monthly",
    priority: "0.6",
  })),
  { path: "/news", file: "src/pages/NewsPage.jsx", changefreq: "daily", priority: "0.8" },
  { path: "/quizzes", file: "src/pages/QuizzesPage.jsx", changefreq: "weekly", priority: "0.7" },

  { path: "/privacy-policy", file: "src/pages/PrivacyPolicyPage.jsx", changefreq: "yearly", priority: "0.4" },
  { path: "/disclaimer", file: "src/pages/DisclaimerPage.jsx", changefreq: "yearly", priority: "0.4" },
  { path: "/terms-of-service", file: "src/pages/TermsOfServicePage.jsx", changefreq: "yearly", priority: "0.4" },
  { path: "/sitemap", file: "src/pages/SitemapPage.jsx", changefreq: "monthly", priority: "0.5" },
];

// Resolve each route's lastmod once, up front.
const routes = routeDefs.map((route) => ({
  ...route,
  lastmod: lastCommitDate(route.file),
}));

// ─── Base URL ──────────────────────────────────────────────────────
const baseUrl = "https://www.finaiw.com";

// ─── Generate sitemap ─────────────────────────────────────────────
const generateSitemap = () => {
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

  return sitemap;
};

// ─── Write to public folder ──────────────────────────────────────
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, "../public/sitemap.xml");

fs.writeFileSync(outputPath, sitemap, "utf-8");
const missingDates = routes.filter((r) => !r.lastmod).length;
console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`✅ Total URLs: ${routes.length}`);
if (missingDates > 0) {
  console.log(`⚠️  ${missingDates} URL(s) had no git history for their source file — lastmod omitted for those.`);
}
