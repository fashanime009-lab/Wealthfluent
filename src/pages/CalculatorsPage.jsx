import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { calculatorCategories } from "@/data/calculators";

const CATEGORY_DATA = {
  loan: {
    calculators: [
      { title: "EMI Calculator", desc: "Monthly payments for a home, car, or personal loan.", route: "/emi-calculator", example: "₹30L at 8.5% for 20 yrs → ₹26,035/mo" },
      { title: "Future Value Calculator", desc: "What a lump sum grows to with compound interest.", route: "/future-value-calculator", example: "₹1L at 10% for 10 yrs → ₹2.59L" },
      { title: "Rate of Return Calculator", desc: "The annualized return between two values.", route: "/rate-of-return-calculator", example: "₹1L → ₹2.5L in 8 yrs → 12.1%/yr" },
      { title: "Bond Yield Calculator", desc: "Current yield and yield to maturity on a bond.", route: "/bond-yield-calculator", example: "₹1,000 face, 8% coupon, ₹950 price → 8.4%" },
      { title: "Fixed Deposit Calculator", desc: "Maturity value and interest earned on an FD.", route: "/fd-calculator", example: "₹2L at 7% for 5 yrs → ₹2.83L" },
      { title: "GST Calculator", desc: "GST on a purchase or invoice, India.", route: "/gst-calculator", example: "₹10,000 at 18% → ₹1,800 GST" },
      { title: "Home Affordability Calculator", desc: "Check whether a property actually fits your income.", route: "/home-affordability-calculator", example: "₹50L home, ₹1L/mo income → Good fit", note: "New" },
    ],
  },
  investment: {
    calculators: [
      { title: "SIP Calculator", desc: "What a recurring monthly investment grows to.", route: "/sip-calculator", example: "₹5,000/mo at 12% for 15 yrs → ₹25.2L", note: "Most used" },
      { title: "Goal Investment Calculator", desc: "The monthly SIP needed to hit a target amount.", route: "/goal-sip", example: "₹10L in 5 yrs at 12% → ₹12,123/mo" },
      { title: "Inflation Calculator", desc: "What today's money will cost you later.", route: "/inflation-calculator", example: "₹100 today, 6% inflation, 10 yrs → ₹179" },
      { title: "CAGR Calculator", desc: "The compound annual growth rate between two values.", route: "/cagr-calculator", example: "₹1L → ₹2L in 5 yrs → 14.9% CAGR" },
    ],
  },
  retirement: {
    calculators: [
      { title: "Retirement Calculator", desc: "The corpus a monthly investment builds by retirement.", route: "/retirement-calculator", example: "₹15,000/mo at 11% for 25 yrs → ₹2.39Cr" },
      { title: "FIRE Calculator", desc: "The number you need to retire early, at 25x expenses.", route: "/fire-calculator", example: "₹6L/yr expenses → ₹1.5Cr FIRE number", note: "New" },
      { title: "Annual Retirement Income Calculator", desc: "Sustainable yearly income from a retirement corpus.", route: "/annual-retirement-income", example: "₹50L corpus at 4% → ₹2L/yr" },
      { title: "Retirement Investment Tracker", desc: "Track retirement investments year by year, in one place.", route: "/retirement-investment-tracker", example: "Tracks contributions, growth, and allocation" },
    ],
  },
  wealth: {
    calculators: [
      { title: "Net Worth Calculator", desc: "Assets minus liabilities — your real net worth.", route: "/networth-calculator", example: "₹85L assets − ₹22L liabilities → ₹63L" },
      { title: "Goal Planner", desc: "A savings plan for a target amount with variable allocation.", route: "/goal-planner", example: "₹55L goal in 12 yrs at 11% → ₹18,400/mo" },
      { title: "Emergency Fund Calculator", desc: "The safety net you need for unexpected expenses.", route: "/emergency-fund-calculator", example: "₹40,000/mo expenses × 6 mo → ₹2.4L", note: "New" },
      { title: "Wealth Age Calculator", desc: "How your net worth and savings rate compare to your age.", route: "/wealth-age-calculator", example: "Compares real age to financial age", note: "New" },
    ],
  },
};

const categories = calculatorCategories.map((cat) => ({
  ...cat,
  calculators: CATEGORY_DATA[cat.id].calculators,
}));

const totalCalculators = categories.reduce((sum, c) => sum + c.calculators.length, 0);

function CalcRow({ calc }) {
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
        <p className="mt-1 max-w-[46ch] text-[13.5px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
          {calc.desc}
        </p>
      </div>
      <div className="min-w-0 sm:text-right">
        <p className="font-mono-tech text-[13.5px] tabular-nums text-[#111814]/75 dark:text-[#eef1ec]/75">
          {calc.example}
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
        description="Explore 18+ free financial calculators for investments, loans, retirement planning, bond yields, net worth, inflation, and more. Make smarter financial decisions with FINAIW."
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

          {/* Category filter — plain text tabs, not pills */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
            <button
              onClick={() => setCategory(null)}
              className={`text-[14px] font-semibold transition ${
                !activeCategory
                  ? "text-[#111814] dark:text-[#eef1ec]"
                  : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
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
                      : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
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
                <h2 className="pt-8 text-[13px] font-semibold text-[#111814]/45 dark:text-[#eef1ec]/45">
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
                <span className="ml-2 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-md text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
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
