import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── All your routes ──────────────────────────────────────────────
const routes = [
  { path: "/", lastmod: "2026-06-26", changefreq: "daily", priority: "1.0" },
  { path: "/about", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/help", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/feedback", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.6" },
  { path: "/calculators", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.9" },
  { path: "/sip-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-sip", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/emi-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/fd-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/cagr-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/gst-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/inflation-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/future-value-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/rate-of-return-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/bond-yield-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/networth-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/annual-retirement-income", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/retirement-investment-tracker", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/fire-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/goal-planner", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/tools", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.8" },
  { path: "/wealth-dashboard", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.7" },
  { path: "/portfolio-tracker", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.7" },
  { path: "/wealth-age-calculator", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.7" },
  { path: "/blogs", lastmod: "2026-06-26", changefreq: "daily", priority: "0.8" },
  { path: "/news", lastmod: "2026-06-26", changefreq: "daily", priority: "0.8" },
  { path: "/quizzes", lastmod: "2026-06-26", changefreq: "weekly", priority: "0.7" },
  { path: "/how-sip-builds-wealth", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy-policy", lastmod: "2026-06-26", changefreq: "yearly", priority: "0.4" },
  { path: "/disclaimer", lastmod: "2026-06-26", changefreq: "yearly", priority: "0.4" },
  { path: "/sitemap", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.5" },
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