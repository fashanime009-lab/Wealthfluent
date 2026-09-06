import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── All your routes ──────────────────────────────────────────────
// Kept in sync with the actual routes in src/App.jsx. Two routes
// (/WorkspacePage, /NetWorthPage) are deliberately left out — they use
// PascalCase URLs unlike every other route on the site, which suggests
// they're leftover internal/dev routes rather than intentional public
// pages; worth a look to confirm before ever adding them here.
const today = "2026-09-06";

const routes = [
  { path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
  { path: "/about", lastmod: today, changefreq: "monthly", priority: "0.8" },
  { path: "/contact", lastmod: today, changefreq: "monthly", priority: "0.7" },
  { path: "/help", lastmod: today, changefreq: "monthly", priority: "0.7" },
  { path: "/feedback", lastmod: today, changefreq: "monthly", priority: "0.6" },
  { path: "/settings", lastmod: today, changefreq: "monthly", priority: "0.5" },

  { path: "/calculators", lastmod: today, changefreq: "weekly", priority: "0.9" },
  { path: "/sip-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/goal-sip", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/emi-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/fd-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/cagr-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/gst-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/inflation-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/future-value-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/rate-of-return-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/bond-yield-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/networth-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/emergency-fund-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/wealth-age-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/annual-retirement-income", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-investment-tracker", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/fire-calculator", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/goal-planner", lastmod: today, changefreq: "weekly", priority: "0.8" },

  { path: "/verdict", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/verdict/rent-vs-buy", lastmod: today, changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/debt-vs-invest", lastmod: today, changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/lease-vs-buy-car", lastmod: today, changefreq: "weekly", priority: "0.7" },
  { path: "/verdict/insurance-need", lastmod: today, changefreq: "weekly", priority: "0.7" },

  { path: "/tools", lastmod: today, changefreq: "weekly", priority: "0.7" },
  { path: "/goals", lastmod: today, changefreq: "weekly", priority: "0.6" },
  { path: "/financial-profile", lastmod: today, changefreq: "monthly", priority: "0.6" },
  { path: "/insights", lastmod: today, changefreq: "weekly", priority: "0.6" },
  { path: "/journeys/home-buying", lastmod: today, changefreq: "monthly", priority: "0.6" },

  { path: "/learn", lastmod: today, changefreq: "daily", priority: "0.8" },
  { path: "/news", lastmod: today, changefreq: "daily", priority: "0.8" },
  { path: "/quizzes", lastmod: today, changefreq: "weekly", priority: "0.7" },

  { path: "/privacy-policy", lastmod: today, changefreq: "yearly", priority: "0.4" },
  { path: "/disclaimer", lastmod: today, changefreq: "yearly", priority: "0.4" },
  { path: "/terms-of-service", lastmod: today, changefreq: "yearly", priority: "0.4" },
  { path: "/sitemap", lastmod: today, changefreq: "monthly", priority: "0.5" },
];

// ─── Base URL ──────────────────────────────────────────────────────
const baseUrl = "https://finaiw.com";

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
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
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
console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`✅ Total URLs: ${routes.length}`);
