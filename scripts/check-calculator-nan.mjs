#!/usr/bin/env node
/**
 * One-off audit script (not wired into the build): for every calculator
 * wired to calculatorDefaults.js, in every currency Settings offers, load
 * the real page in a real browser with that currency pre-selected and
 * check its rendered output for NaN/Infinity/undefined/blank results.
 *
 * Deliberately drives the actual page through Vite's dev server rather
 * than reimplementing each calculator's formula here — most of the math
 * lives inline in each page's JSX, so a from-scratch reimplementation
 * would duplicate (and risk silently diverging from) the real logic this
 * is supposed to be checking.
 *
 * Usage: node scripts/check-calculator-nan.mjs
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { defaultFor } from "../src/data/calculatorDefaults.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 5190;
const BASE_URL = `http://localhost:${PORT}`;
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"];

const ROUTES = [
  "/sip-calculator",
  "/emi-calculator",
  "/cagr-calculator",
  "/rate-of-return-calculator",
  "/lumpsum-calculator",
  "/step-up-sip-calculator",
  "/goal-sip",
  "/retirement-calculator",
  "/swp-calculator",
  "/inflation-calculator",
  "/future-value-calculator",
  "/bond-yield-calculator",
  "/power-of-compounding",
  "/cost-of-delay-calculator",
  "/annual-retirement-income",
  "/home-affordability-calculator",
  "/emergency-fund-calculator",
  "/fire-calculator",
  "/wealth-age-calculator",
];

const BAD_TOKEN = /\bNaN\b|\bInfinity\b|\bundefined\b|\bnull\b/;

// Wealth Age-specific edge cases (see src/pages/WealthAgeCalculatorPage.jsx):
// the income-relative scoring falls back to annual expenses when there's
// no income, and skips its net-worth term entirely (no divide-by-zero)
// when both income and expenses are 0. The retiree profile (0 income,
// large investments, normal expenses) is the realistic case that
// motivated the expenses fallback, so its score is reported, not just
// checked for bad tokens. "Large investments" is 20x that currency's own
// default — proportional to its own scale rather than one flat number
// that would be trivial for JPY and enormous for GBP.
const WEALTH_AGE_FIELD_LABELS = {
  monthlyIncome: "Monthly Income",
  monthlyExpenses: "Monthly Expenses",
  investments: "Investments",
};

function wealthAgeEdgeCasesFor(currency) {
  const normalInvestments = defaultFor("wealthAge", "investments", currency);
  return [
    { label: "zero income, expenses > 0 (default)", values: { monthlyIncome: 0 } },
    { label: "both income and expenses zero", values: { monthlyIncome: 0, monthlyExpenses: 0 } },
    {
      label: "retiree profile: zero income, large investments, normal expenses",
      values: { monthlyIncome: 0, investments: normalInvestments * 20 },
      reportScore: true,
    },
  ];
}

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // keep polling
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("Dev server did not start in time"));
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

async function runWealthAgeEdgeCases(browser, problems, retireeScores) {
  let checked = 0;

  for (const currency of CURRENCIES) {
    for (const edgeCase of wealthAgeEdgeCasesFor(currency)) {
      checked += 1;
      const page = await browser.newPage();
      const label = `wealth-age [${currency}] (${edgeCase.label})`;

      try {
        await page.evaluateOnNewDocument((cur) => {
          window.__PRERENDER__ = true;
          localStorage.setItem(
            "finaiw-settings",
            JSON.stringify({ currency: cur, region: "manual", compactNumbers: false })
          );
        }, currency);

        await page.goto(`${BASE_URL}/wealth-age-calculator`, { waitUntil: "networkidle0", timeout: 20000 });
        await page.waitForSelector("input[type=range]", { timeout: 10000 });

        for (const [field, value] of Object.entries(edgeCase.values)) {
          const fieldLabel = WEALTH_AGE_FIELD_LABELS[field];
          const input = await page.$(`input[aria-label^="${fieldLabel}"]`);
          if (!input) throw new Error(`could not find input for "${fieldLabel}"`);
          // A synthetic triple-click doesn't reliably select existing text in
          // a number input here — type() then appends to it instead of
          // replacing it (50000 + typed "0" silently became 500000). Select
          // via the DOM API directly instead, which is reliable.
          await input.evaluate((el) => {
            el.focus();
            el.select();
          });
          await input.type(String(value));
          // Blur so the final onChange commits before we read the DOM.
          await page.keyboard.press("Tab");
        }

        const bodyText = await page.evaluate(() => document.body.innerText);
        const bodyMatch = bodyText.match(BAD_TOKEN);
        if (bodyMatch) {
          problems.push(`${label}: page text contains "${bodyMatch[0]}"`);
        }

        if (edgeCase.reportScore) {
          const score = await page.evaluate(() => {
            const el = Array.from(document.querySelectorAll("p")).find((p) => p.textContent === "Wealth Score");
            return el?.nextElementSibling?.textContent ?? null;
          });
          retireeScores.push(`${currency}: wealth score = ${score}`);
        }
      } catch (err) {
        problems.push(`${label}: failed to load/evaluate — ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  return checked;
}

async function main() {
  const server = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: "pipe",
  });

  let serverErr = "";
  server.stderr?.on("data", (d) => (serverErr += d.toString()));

  const problems = [];
  const retireeScores = [];
  let checked = 0;

  try {
    await waitForServer(BASE_URL);

    const browser = await puppeteer.launch({
      headless: true,
      channel: "chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const currency of CURRENCIES) {
      const page = await browser.newPage();
      await page.evaluateOnNewDocument((cur) => {
        window.__PRERENDER__ = true;
        localStorage.setItem(
          "finaiw-settings",
          JSON.stringify({ currency: cur, region: "manual", compactNumbers: false })
        );
      }, currency);

      for (const route of ROUTES) {
        checked += 1;
        try {
          await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle0", timeout: 20000 });
          // The route is lazy-loaded (React.lazy + Suspense) — networkidle0
          // can fire while the "Loading..." fallback is still showing, before
          // the chunk finishes evaluating and the real inputs mount.
          await page.waitForSelector("input[type=range]", { timeout: 10000 });

          // Headline result — the single CalcResultPanel readout styled
          // in the shared green-on-dark instrument panel.
          const headline = await page.evaluate(() => {
            const p = Array.from(document.querySelectorAll("p")).find(
              (el) => el.className.includes("font-mono-tech") && el.className.includes("text-[#34d399]")
            );
            return p ? p.textContent : null;
          });

          const bodyText = await page.evaluate(() => document.body.innerText);

          if (headline == null || headline.trim() === "" || headline.trim() === "—") {
            problems.push(`${route} [${currency}]: headline result is blank/placeholder ("${headline}")`);
          } else if (BAD_TOKEN.test(headline)) {
            problems.push(`${route} [${currency}]: headline result = "${headline}"`);
          }

          const bodyMatch = bodyText.match(BAD_TOKEN);
          if (bodyMatch && !(headline && BAD_TOKEN.test(headline))) {
            // Something else on the page (a secondary stat, chart label,
            // breakdown line) shows a bad token even though the headline
            // itself looked fine.
            problems.push(`${route} [${currency}]: page text contains "${bodyMatch[0]}" outside the headline`);
          }
        } catch (err) {
          problems.push(`${route} [${currency}]: failed to load/evaluate — ${err.message}`);
        }
      }

      await page.close();
    }

    checked += await runWealthAgeEdgeCases(browser, problems, retireeScores);

    await browser.close();
  } finally {
    server.kill();
    if (serverErr && problems.length > 0) console.error(serverErr);
  }

  console.log(`Checked ${checked} (route x currency) combinations across ${ROUTES.length} calculators x ${CURRENCIES.length} currencies, plus Wealth Age edge cases.\n`);

  console.log("Retiree profile (0 income, 20x default investments, normal expenses) — wealth score by currency:");
  for (const line of retireeScores) console.log(`  - ${line}`);
  console.log();

  if (problems.length > 0) {
    console.warn(`${problems.length} problem(s) found:\n`);
    for (const p of problems) console.warn(`  - ${p}`);
    process.exitCode = 1;
  } else {
    console.log("No NaN / Infinity / undefined / null / blank results found in any calculator x currency combination.");
  }
}

main();
