import { Link } from "react-router-dom";
import { ArrowRight, LineChart, Home } from "lucide-react";

import CalculatorGrid from "./CalculatorGrid";
import SpotlightCard from "./SpotlightCard";
import CategoryNavCard from "./CategoryNavCard";

export default function CalculatorsSection() {
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1660px] px-5 sm:px-8 lg:px-12">
      <div className="rounded-[32px] bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,23,42,.07)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:bg-slate-900/95 dark:ring-white/10 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
              16 Free Tools
            </span>
            <h2 className="mt-3 text-[28px] font-black tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[32px]">
              Powerful tools for every financial decision
            </h2>
            <p className="mt-2 max-w-lg text-[14px] font-semibold leading-6 text-slate-500 dark:text-slate-400">
              Professional-grade calculators and planners to help you decide better — pick a flagship
              tool below or browse the full catalog by category.
            </p>
          </div>
          <Link
            to="/calculators"
            className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-full bg-slate-100 px-5 py-3 text-[13px] font-black text-slate-900 transition hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:self-auto"
          >
            View All Calculators <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bento row: spotlight calculators + category nav */}
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SpotlightCard
              to="/sip-calculator"
              icon={LineChart}
              eyebrow="Most used · Investing"
              title="SIP Calculator"
              description="See how a disciplined monthly investment compounds into real wealth over time."
              statLabel="₹5,000/mo for 15 yrs at 12% grows to"
              statValue="≈ ₹25.2L"
              tone="emerald"
              bars={[30, 42, 38, 55, 62, 78, 100]}
            />
          </div>
          <div className="lg:col-span-2">
            <SpotlightCard
              to="/emi-calculator"
              icon={Home}
              eyebrow="Popular · Home Buyers"
              title="EMI Calculator"
              description="Know your exact monthly repayment before you commit to a loan."
              statLabel="₹30L loan, 8.5% for 20 yrs ≈"
              statValue="₹26,038/mo"
              tone="slate"
              bars={[55, 55, 55, 55, 55, 55, 55]}
            />
          </div>
          <div className="lg:col-span-1">
            <CategoryNavCard />
          </div>
        </div>

        {/* Quick-access strip for the rest of the catalog */}
        <div className="mt-6">
          <p className="mb-3 text-[11.5px] font-black uppercase tracking-wide text-slate-400">
            Or jump straight to a tool
          </p>
          <CalculatorGrid />
        </div>
      </div>
    </section>
  );
}
