import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { calculatorCategories } from "@/data/calculators";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { USD_CONVERSION_RATES } from "@/services/calculators/globalWealthPercentile";
import MostPopularRow from "@/components/calculators/MostPopularRow";

// Every `example` below was originally written in INR. Rather than a
// literal currency-symbol swap (which would leave a "₹30L loan" looking
// like a "$30,00,000 loan" — technically a number, but not a realistic
// loan size in dollars), `inr(rupees)` converts the original rupee amount
// through its real USD value into the viewer's selected currency's own
// scale, so a 30-lakh loan becomes a comparably realistic loan in
// whichever currency is selected. `fmt` compact-formats the result (lakh/
// crore for INR, K/M/B for everything else — see utils/currency.js).
function useExampleCurrency() {
  const { settings } = useSettings();
  const rate = USD_CONVERSION_RATES[settings.currency] ?? 1;
  const inr = (rupees) => Math.round((rupees * USD_CONVERSION_RATES.INR) / rate);
  const fmt = (v) => formatCurrency(v, settings.currency, true);
  return { inr, fmt };
}

// Each ratio below (output/input) was computed from this page's own
// previous, already-correct hardcoded INR example — e.g. the EMI on a
// ₹30L/8.5%/20yr loan really is ₹26,035/mo, so 26035/3000000 is the exact
// EMI-formula constant for that rate and tenure. Reapplying that same
// ratio to a rescaled principal keeps every example numerically correct
// (EMI, FV, FD, RD, SIP-style maturity formulas are all linear in the
// principal) without re-deriving each formula by hand in this file.
const CATEGORY_DATA = {
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

const categories = calculatorCategories.map((cat) => ({
  ...cat,
  calculators: CATEGORY_DATA[cat.id].calculators,
}));

const totalCalculators = categories.reduce((sum, c) => sum + c.calculators.length, 0);

function CalcRow({ calc }) {
  const currency = useExampleCurrency();
  const example = typeof calc.example === "function" ? calc.example(currency) : calc.example;

  return (
    <Link
      to={calc.route}
      className="group grid grid-cols-1 gap-2 py-6 transition-opacity hover:opacity-70 sm:grid-cols-[1.3fr_1fr] sm:gap-8"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">{calc.title}</h3>
          {calc.note && (
            <span className="text-[12px] font-medium text-[#047857] dark:text-[#34d399]">{calc.note}</span>
          )}
        </div>
        <p className="mt-1 max-w-[46ch] text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
          {calc.desc}
        </p>
      </div>
      <div className="min-w-0 sm:text-right">
        <p className="font-mono-tech text-[13.5px] tabular-nums text-[#111814]/75 dark:text-[#eef1ec]/75">
          {example}
        </p>
      </div>
    </Link>
  );
}

export default function CalculatorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const filtered = useMemo(
    () => (!activeCategory ? categories : categories.filter((c) => c.id === activeCategory)),
    [activeCategory]
  );

  const setCategory = (id) => {
    if (!id) {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
  };

  return (
    <>
      <Seo
        title="Financial Calculators – SIP, EMI, Retirement, FIRE & More"
        description="Explore 20+ free financial calculators for investments, loans, retirement planning, bond yields, net worth, inflation, and more. Make smarter financial decisions with FINAIW."
        path="/calculators"
        keywords="financial calculators, investment calculator, loan calculator, retirement calculator, bond yield calculator, net worth calculator, inflation calculator"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ])}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
          <h1 className="font-display max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            {totalCalculators} calculators. Every one shows real math.
          </h1>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Investing, loans, retirement, bonds, inflation and net worth — pick a category or scroll
            the full list. Each one is free and opens straight to the tool, no signup.
          </p>

          <MostPopularRow />

          {/* Category filter — plain text tabs, not pills */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
            <button
              onClick={() => setCategory(null)}
              className={`text-[14px] font-semibold transition ${
                !activeCategory
                  ? "text-[#111814] dark:text-[#eef1ec]"
                  : "text-[#111814]/60 hover:text-[#111814]/70 dark:text-[#eef1ec]/50 dark:hover:text-[#eef1ec]/70"
              }`}
            >
              All ({totalCalculators})
            </button>
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-[14px] font-semibold transition ${
                    active
                      ? "text-[#111814] dark:text-[#eef1ec]"
                      : "text-[#111814]/60 hover:text-[#111814]/70 dark:text-[#eef1ec]/50 dark:hover:text-[#eef1ec]/70"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Calculators by category — a dense list, not a card grid */}
          <div className="mt-4">
            {filtered.map((category) => (
              <div key={category.id} className="border-b border-[#111814]/10 last:border-b-0 dark:border-[#eef1ec]/10">
                <h2 className="pt-8 text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">
                  {category.name}
                </h2>
                <div className="divide-y divide-[#111814]/8 dark:divide-[#eef1ec]/8">
                  {category.calculators.map((calc) => (
                    <CalcRow key={calc.route} calc={calc} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Spec strip — the same numbers a real tool's spec sheet would show */}
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
            {[
              { value: totalCalculators, label: "calculators" },
              { value: categories.length, label: "categories" },
              { value: "100%", label: "free, no signup" },
              { value: "0", label: "data leaves your device" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
                  {stat.value}
                </span>
                <span className="ml-2 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-md text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
              These tools are for illustrative purposes and don't constitute financial advice. Consult
              a certified financial advisor for personalised guidance.
            </p>
            <Link
              to="/verdict"
              className="flex-shrink-0 text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              Need a decision, not just a number? Get a verdict
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
