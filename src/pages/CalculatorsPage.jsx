import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { calculatorCategories, CATEGORY_DATA } from "@/data/calculators";
import MostPopularRow from "@/components/calculators/MostPopularRow";
import useExampleCurrency from "@/hooks/useExampleCurrency";

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
                  {cat.name} ({cat.calculators.length})
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
