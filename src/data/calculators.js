import {
  LineChart,
  Home,
  BriefcaseBusiness,
  Target,
  Calculator,
  TrendingUp,
  PiggyBank,
  Landmark,
  Flame,
  Wallet,
  Receipt,
} from "lucide-react";

// Category metadata shared across the homepage spotlight and the full
// /calculators listing page so both surfaces stay visually consistent.
// Category metadata only — no hand-counted `count` field, because that
// drifted out of sync with the real listing below more than once (most
// recently when /income-percentile shipped and nobody remembered to bump
// a number in three different files). Anything that needs a count derives
// it from CATEGORY_DATA / TOTAL_CALCULATORS instead.
export const calculatorCategories = [
  {
    id: "loan",
    name: "Interest & Loan",
    description: "Loan payments, future values, investment returns & bond yields.",
    icon: Landmark,
    tone: "sky",
  },
  {
    id: "investment",
    name: "Investment Planning",
    description: "Plan recurring investments and long-term wealth creation.",
    icon: TrendingUp,
    tone: "emerald",
  },
  {
    id: "retirement",
    name: "Retirement Planning",
    description: "Secure your future with smart retirement strategies.",
    icon: Flame,
    tone: "amber",
  },
  {
    id: "wealth",
    name: "Wealth & Goals",
    description: "Track your net worth and plan your financial goals.",
    icon: Wallet,
    tone: "violet",
  },
  {
    id: "tax",
    name: "Tax & Salary",
    description: "GST, HRA and other salary and tax calculations.",
    icon: Receipt,
    tone: "rose",
  },
];

// The single source of truth for which calculators exist and what their
// /calculators listing example reads — the homepage spotlight and the
// full listing page both render from this same object, and every count
// shown anywhere on the site (category tab counts, "N calculators" stats,
// the homepage headline) is derived from it rather than hand-maintained,
// so adding or removing a calculator can't leave a stale number behind
// again. Each `example` is a function of `{ inr, fmt }` (see
// useExampleCurrency) because it was originally written in INR.
export const CATEGORY_DATA = {
  loan: {
    calculators: [
      { title: "EMI Calculator", desc: "Monthly payments for a home, car, or personal loan.", route: "/emi-calculator", example: ({ inr, fmt }) => { const p = inr(3000000); return `${fmt(p)} at 8.5% for 20 yrs → ${fmt(Math.round(p * 0.00867833))}/mo`; } },
      { title: "Future Value Calculator", desc: "What a lump sum grows to with compound interest.", route: "/future-value-calculator", example: ({ inr, fmt }) => { const p = inr(100000); return `${fmt(p)} at 10% for 10 yrs → ${fmt(Math.round(p * 2.59))}`; } },
      { title: "Rate of Return Calculator", desc: "The annualized return between two values.", route: "/rate-of-return-calculator", example: ({ inr, fmt }) => { const p = inr(100000); return `${fmt(p)} → ${fmt(Math.round(p * 2.5))} in 8 yrs → 12.1%/yr`; } },
      { title: "Bond Yield Calculator", desc: "Current yield and yield to maturity on a bond.", route: "/bond-yield-calculator", example: ({ fmt }) => `${fmt(1000)} face, 8% coupon, ${fmt(950)} price → 8.4%` },
      { title: "Fixed Deposit Calculator", desc: "Maturity value and interest earned on an FD.", route: "/fd-calculator", example: ({ inr, fmt }) => { const p = inr(200000); return `${fmt(p)} at 7% for 5 yrs → ${fmt(Math.round(p * 1.415))}`; } },
      { title: "RD Calculator", desc: "Maturity value and interest earned on a recurring deposit, India.", route: "/rd-calculator", example: ({ inr, fmt }) => { const p = inr(5000); return `${fmt(p)}/mo at 7% for 5 yrs → ${fmt(Math.round(p * 72))}`; }, note: "New" },
      { title: "Home Affordability Calculator", desc: "Check whether a property actually fits your income.", route: "/home-affordability-calculator", example: ({ inr, fmt }) => `${fmt(inr(5000000))} home, ${fmt(inr(100000))}/mo income → Good fit`, note: "New" },
    ],
  },
  investment: {
    calculators: [
      { title: "SIP Calculator", desc: "What a recurring monthly investment grows to.", route: "/sip-calculator", example: ({ inr, fmt }) => { const p = inr(5000); return `${fmt(p)}/mo at 12% for 15 yrs → ${fmt(Math.round(p * 504))}`; }, note: "Most used" },
      { title: "Goal Investment Calculator", desc: "The monthly SIP needed to hit a target amount.", route: "/goal-sip", example: ({ inr, fmt }) => { const target = inr(1000000); return `${fmt(target)} in 5 yrs at 12% → ${fmt(Math.round(target * 0.012123))}/mo`; } },
      { title: "Inflation Calculator", desc: "What today's money will cost you later.", route: "/inflation-calculator", example: ({ inr, fmt }) => { const p = inr(100); return `${fmt(p)} today, 6% inflation, 10 yrs → ${fmt(Math.round(p * 1.79))}`; } },
      { title: "CAGR Calculator", desc: "The compound annual growth rate between two values.", route: "/cagr-calculator", example: ({ inr, fmt }) => { const p = inr(100000); return `${fmt(p)} → ${fmt(p * 2)} in 5 yrs → 14.9% CAGR`; } },
      { title: "Power of Compounding Calculator", desc: "Compound interest next to simple interest, same numbers.", route: "/power-of-compounding", example: ({ inr, fmt }) => { const p = inr(100000); return `${fmt(p)} at 10% for 20 yrs → ${fmt(Math.round(p * 3.73))} extra`; }, note: "New" },
      { title: "Cost of Delay Calculator", desc: "What waiting a few years to start investing actually costs.", route: "/cost-of-delay-calculator", example: ({ inr, fmt }) => { const p = inr(10000); return `5-yr delay on ${fmt(p)}/mo → ${fmt(Math.round(p * 898))} less`; }, note: "New" },
      { title: "PPF Calculator", desc: "Maturity value of your Public Provident Fund contributions, India.", route: "/ppf-calculator", example: ({ inr, fmt }) => { const p = inr(150000); return `${fmt(p)}/yr at 7.1% for 15 yrs → ${fmt(Math.round(p * 27.13333))}`; }, note: "New" },
      { title: "Lumpsum Calculator", desc: "What a one-time investment grows to, compounded monthly.", route: "/lumpsum-calculator", example: ({ inr, fmt }) => { const p = inr(100000); return `${fmt(p)} at 12% for 10 yrs → ${fmt(Math.round(p * 3.3))}`; }, note: "New" },
      { title: "Step-Up SIP Calculator", desc: "A SIP that increases every year, against a flat SIP.", route: "/step-up-sip-calculator", example: ({ inr, fmt }) => { const p = inr(5000); return `${fmt(p)}/mo, +10%/yr at 12% for 15 yrs → ${fmt(Math.round(p * 868))}`; }, note: "New" },
    ],
  },
  retirement: {
    calculators: [
      { title: "Retirement Calculator", desc: "The corpus a monthly investment builds by retirement.", route: "/retirement-calculator", example: ({ inr, fmt }) => { const p = inr(15000); return `${fmt(p)}/mo at 11% for 25 yrs → ${fmt(Math.round(p * 1593.33333))}`; } },
      { title: "FIRE Calculator", desc: "The number you need to retire early, at 25x expenses.", route: "/fire-calculator", example: ({ inr, fmt }) => { const p = inr(600000); return `${fmt(p)}/yr expenses → ${fmt(p * 25)} FIRE number`; }, note: "New" },
      { title: "Annual Retirement Income Calculator", desc: "Sustainable yearly income from a retirement corpus.", route: "/annual-retirement-income", example: ({ inr, fmt }) => { const p = inr(5000000); return `${fmt(p)} corpus at 4% → ${fmt(Math.round(p * 0.04))}/yr`; } },
      { title: "SWP Calculator", desc: "How long a lump sum lasts with a fixed monthly withdrawal.", route: "/swp-calculator", example: ({ inr, fmt }) => `${fmt(inr(5000000))} corpus, ${fmt(inr(35000))}/mo at 8% → 38 yrs 3 mo`, note: "New" },
      { title: "Retirement Investment Tracker", desc: "Track retirement investments year by year, in one place.", route: "/retirement-investment-tracker", example: "Tracks contributions, growth, and allocation" },
      { title: "Gratuity Calculator", desc: "Your gratuity entitlement from salary and years of service, India.", route: "/gratuity-calculator", example: ({ inr, fmt }) => { const p = inr(50000); return `${fmt(p)} salary, 8 yrs → ${fmt(Math.round(p * 4.6))}`; }, note: "New" },
    ],
  },
  wealth: {
    calculators: [
      { title: "Net Worth Calculator", desc: "Assets minus liabilities — your real net worth.", route: "/networth-calculator", example: ({ inr, fmt }) => { const assets = inr(8500000); const liabilities = inr(2200000); return `${fmt(assets)} assets − ${fmt(liabilities)} liabilities → ${fmt(assets - liabilities)}`; } },
      { title: "Retirement Corpus Planner", desc: "A savings plan for a target amount with variable allocation.", route: "/goal-planner", example: ({ inr, fmt }) => { const target = inr(5500000); return `${fmt(target)} goal in 12 yrs at 11% → ${fmt(Math.round(target * 0.00334545))}/mo`; } },
      { title: "Emergency Fund Calculator", desc: "The safety net you need for unexpected expenses.", route: "/emergency-fund-calculator", example: ({ inr, fmt }) => { const p = inr(40000); return `${fmt(p)}/mo expenses × 6 mo → ${fmt(p * 6)}`; }, note: "New" },
      { title: "Wealth Age Calculator", desc: "How your net worth and savings rate compare to your age.", route: "/wealth-age-calculator", example: "Compares real age to financial age", note: "New" },
      { title: "Global Net Worth Percentile", desc: "How your net worth compares to the whole world's adults.", route: "/net-worth-percentile", example: "$117,000 → top 10% globally", note: "New" },
      { title: "Global Income Percentile", desc: "How your annual income compares to the whole world's adults.", route: "/income-percentile", example: "$84,000/yr → top 10% globally", note: "New" },
    ],
  },
  tax: {
    calculators: [
      { title: "GST Calculator", desc: "GST on a purchase or invoice, India.", route: "/gst-calculator", example: ({ inr, fmt }) => { const p = inr(10000); return `${fmt(p)} at 18% → ${fmt(Math.round(p * 0.18))} GST`; } },
      { title: "HRA Calculator", desc: "Your tax-exempt HRA from basic salary, HRA and rent paid, India.", route: "/hra-calculator", example: ({ inr, fmt }) => { const basic = inr(40000); const rent = inr(18000); const exempt = Math.min(rent - 0.1 * basic, 0.5 * basic); return `${fmt(basic)} basic, ${fmt(rent)} rent, metro → ${fmt(Math.round(exempt))} exempt`; }, note: "New" },
    ],
  },
};

export const TOTAL_CALCULATORS = Object.values(CATEGORY_DATA).reduce(
  (sum, cat) => sum + cat.calculators.length,
  0
);

export const calculators = [
  {
    title: "SIP Calculator",
    description: "Start investing consistently with a disciplined monthly investment plan.",
    bestFor: "First-time Investors",
    outcome: "Estimate your future wealth",
    featured: true,
    category: "investment",
    icon: LineChart,
    iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    to: "/sip-calculator",
  },
  {
    title: "EMI Calculator",
    description: "Know your monthly loan payments before making a borrowing decision.",
    bestFor: "Home Buyers",
    outcome: "Estimate your monthly EMI",
    featured: true,
    category: "loan",
    icon: Home,
    iconTone: "bg-sky-50 text-sky-700 ring-sky-100",
    to: "/emi-calculator",
  },
  {
    title: "Retirement Planner",
    description: "Build a realistic retirement plan based on your financial goals.",
    bestFor: "Long-term Planning",
    outcome: "Estimate retirement corpus",
    featured: false,
    category: "retirement",
    icon: BriefcaseBusiness,
    iconTone: "bg-orange-50 text-orange-700 ring-orange-100",
    to: "/retirement-calculator",
  },
  {
    title: "FIRE Calculator",
    description: "Calculate when you can achieve financial independence and retire early.",
    bestFor: "Financial Independence",
    outcome: "Know your FIRE target",
    featured: false,
    category: "retirement",
    icon: Target,
    iconTone: "bg-violet-50 text-violet-700 ring-violet-100",
    to: "/fire-calculator",
  },
  {
    title: "FD Calculator",
    description: "Estimate guaranteed returns from your fixed deposit investment.",
    bestFor: "Safe Savings",
    outcome: "Estimate maturity value",
    featured: false,
    category: "loan",
    icon: PiggyBank,
    iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    to: "/fd-calculator",
  },
  {
    title: "GST Calculator",
    description: "Calculate GST quickly for invoices, products and services.",
    bestFor: "Businesses & Freelancers",
    outcome: "Calculate GST instantly",
    featured: false,
    category: "loan",
    icon: Calculator,
    iconTone: "bg-purple-50 text-purple-700 ring-purple-100",
    to: "/gst-calculator",
  },
];

export const toneStyles = {
  sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100", dot: "bg-sky-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100", dot: "bg-amber-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-100", dot: "bg-violet-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100", dot: "bg-rose-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-100", dot: "bg-purple-500" },
};
