import { LESSONS } from "../lessons";

/**
 * One entry per calculator page, keyed by its route. An entry does two jobs:
 *
 *   1. It is what OTHER pages show when they link here — `label` is the
 *      anchor text (kept equal to the page's own H1, so a link and its
 *      destination name the same thing) and `summary` is the note beside it.
 *   2. It is what THIS page's <RelatedLinks /> block shows: `lesson` is a
 *      slug from src/data/lessons.js and `calculator` is another entry's key.
 *      Either may be left out — the block only renders what exists.
 *
 * So adding a calculator is one entry here plus a <RelatedLinks /> in the
 * page. Adding a lesson needs nothing here until a calculator points at it.
 *
 * Anchor text for the two "goal planner" pages is deliberately distinct.
 * /goal-planner (retirement corpus) and /financial-goal-planner (splits a
 * monthly budget across several goals) have near-identical names on the
 * pages themselves, so never link to either as just "Goal Planner".
 */
export const CALCULATOR_RECOMMENDATIONS = {
  // ── Interest & Loan ────────────────────────────────────────────────
  "/emi-calculator": {
    label: "Loan EMI Calculator",
    summary: "Monthly payment, total interest and total cost for any loan amount, rate and tenure.",
    lesson: "home-loan-basics",
    calculator: "/home-affordability-calculator",
  },
  "/future-value-calculator": {
    label: "Future Value (Compound Interest) Calculator",
    summary: "What a lump sum grows to at a compound annual rate.",
    lesson: "compound-interest",
    calculator: "/sip-calculator",
  },
  "/rate-of-return-calculator": {
    label: "Rate of Return Calculator",
    summary: "The annualized return between a starting and an ending value.",
    lesson: "understanding-cagr",
    calculator: "/cagr-calculator",
  },
  "/bond-yield-calculator": {
    label: "Bond Yield Calculator",
    summary: "Current yield and approximate yield to maturity from price, coupon and years.",
    lesson: "market-basics",
    calculator: "/cagr-calculator",
  },
  "/fd-calculator": {
    label: "Fixed Deposit Calculator",
    summary: "Maturity value and interest earned on a fixed deposit, at your compounding frequency.",
    lesson: "compound-interest",
    calculator: "/sip-calculator",
  },
  "/gst-calculator": {
    label: "GST Calculator",
    summary: "Add GST to a base amount, or work it out of a GST-inclusive price.",
    lesson: "understanding-gst",
  },
  "/home-affordability-calculator": {
    label: "Home Affordability Calculator",
    summary: "Whether a property price fits your income, from the EMI and debt-to-income ratios.",
    lesson: "home-loan-basics",
    calculator: "/emi-calculator",
  },

  // ── Investment Planning ────────────────────────────────────────────
  "/sip-calculator": {
    label: "SIP Calculator",
    summary: "What a recurring monthly investment grows to over time.",
    lesson: "sip-vs-lump-sum",
    calculator: "/goal-sip",
  },
  "/goal-sip": {
    label: "Goal SIP Calculator",
    summary: "The monthly SIP needed to reach a target amount.",
    lesson: "sip-vs-lump-sum",
    calculator: "/sip-calculator",
  },
  "/inflation-calculator": {
    label: "Inflation Calculator",
    summary: "What today's expenses will cost in future, and how much purchasing power you lose.",
    lesson: "understanding-inflation",
    calculator: "/retirement-calculator",
  },
  "/cagr-calculator": {
    label: "CAGR Calculator",
    summary: "The compound annual growth rate between two values.",
    lesson: "understanding-cagr",
    calculator: "/rate-of-return-calculator",
  },

  // ── Retirement ─────────────────────────────────────────────────────
  "/retirement-calculator": {
    label: "Retirement Calculator",
    summary: "The corpus a fixed monthly investment builds by the time you retire.",
    lesson: "retirement-planning",
    calculator: "/fire-calculator",
  },
  "/fire-calculator": {
    label: "FIRE Calculator",
    summary: "Your FIRE number at 25× expenses, and how close your investments get you.",
    lesson: "fire-movement-basics",
    calculator: "/retirement-calculator",
  },
  "/annual-retirement-income": {
    label: "Annual Retirement Income Calculator",
    summary: "The yearly income a retirement corpus can pay out over the retirement period.",
    lesson: "retirement-planning",
    calculator: "/retirement-calculator",
  },
  "/retirement-investment-tracker": {
    label: "Retirement Investment Tracker",
    summary: "Year-by-year targets against actual contributions, with progress and variance.",
    lesson: "retirement-planning",
    calculator: "/retirement-calculator",
  },

  // ── Wealth & Goals ─────────────────────────────────────────────────
  "/networth-calculator": {
    label: "Net Worth Calculator",
    summary: "Your net worth from itemised assets and liabilities.",
    lesson: "net-worth-tracking",
    calculator: "/net-worth-percentile",
  },
  "/goal-planner": {
    label: "Retirement Corpus Planner",
    summary: "The corpus you need to retire, with inflation, life expectancy and returns by asset class.",
    lesson: "nps-vs-ppf-vs-epf",
    calculator: "/retirement-calculator",
  },
  "/emergency-fund-calculator": {
    label: "Emergency Fund Calculator",
    summary: "The safety net to hold, your shortfall, and how many months you're covered today.",
    lesson: "emergency-funds",
  },
  "/wealth-age-calculator": {
    label: "Wealth Age Calculator",
    summary: "A wealth age and score from your savings rate and net worth, against your real age.",
    lesson: "life-stages-and-asset-allocation",
    calculator: "/networth-calculator",
  },
  "/net-worth-percentile": {
    label: "Global Net Worth Percentile Calculator",
    summary: "Where your net worth ranks among the world's adults.",
    lesson: "net-worth-tracking",
    // No `calculator`: the page already links /networth-calculator inline,
    // next to the assets-minus-liabilities input where it's most useful.
  },

  // ── Advanced tool that other pages may link to (no block of its own) ─
  "/financial-goal-planner": {
    label: "Multi-Goal Budget Optimizer",
    summary: "Splits a monthly budget across several goals at once and compares the result with simpler strategies.",
  },
};

const lessonBySlug = new Map(LESSONS.map((lesson) => [lesson.slug, lesson]));

// The route may arrive with a trailing slash (or, during prerender, not).
const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/**
 * The links a calculator page should show, as
 * [{ kind, to, label, note }] — a lesson first, then a calculator. Unknown
 * routes, unknown lesson slugs and unknown calculator targets are skipped
 * rather than throwing, so a typo here can never blank a page.
 */
export function getCalculatorRelated(path) {
  const entry = CALCULATOR_RECOMMENDATIONS[normalize(path)];
  if (!entry) return [];

  const items = [];

  const lesson = entry.lesson && lessonBySlug.get(entry.lesson);
  if (lesson) {
    items.push({ kind: "Lesson", to: `/learn/${lesson.slug}`, label: lesson.title, note: lesson.summary });
  }

  const target = entry.calculator && CALCULATOR_RECOMMENDATIONS[entry.calculator];
  if (target) {
    items.push({ kind: "Calculator", to: entry.calculator, label: target.label, note: target.summary });
  }

  return items;
}
