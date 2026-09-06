import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import {
  ArrowRight,
  ArrowUpRight,
  Home,
  Hourglass,
  TrendingUp,
  Landmark,
  PiggyBank,
  Receipt,
  LineChart,
  Target,
  TrendingDown,
  TreePalm,
  Flame,
  Wallet,
  ClipboardList,
  Briefcase,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  LayoutGrid,
  Gauge,
} from "lucide-react";
import { calculatorCategories, toneStyles } from "@/data/calculators";

const CATEGORY_DATA = {
  loan: {
    calculators: [
      { title: "EMI Calculator", desc: "Calculate monthly EMI payments for loans.", route: "/emi-calculator", icon: Home },
      { title: "Future Value Calculator", desc: "Calculate the future value with compound interest.", route: "/future-value-calculator", icon: Hourglass },
      { title: "Rate of Return Calculator", desc: "Find the annualized return on your investments.", route: "/rate-of-return-calculator", icon: TrendingUp },
      { title: "Bond Yield Calculator", desc: "Calculate current yield and yield to maturity.", route: "/bond-yield-calculator", icon: Landmark },
      { title: "Fixed Deposit Calculator", desc: "Estimate deposit maturity value and interest earned.", route: "/fd-calculator", icon: PiggyBank },
      { title: "GST Calculator", desc: "Calculate GST for purchases and business transactions (India).", route: "/gst-calculator", icon: Receipt },
    ],
  },
  investment: {
    calculators: [
      { title: "SIP Calculator", desc: "Estimate recurring investment growth over time.", route: "/sip-calculator", icon: LineChart, badge: "Popular" },
      { title: "Goal Investment Calculator", desc: "Find the monthly SIP needed to reach your goal.", route: "/goal-sip", icon: Target },
      { title: "Inflation Calculator", desc: "See how inflation impacts your purchasing power.", route: "/inflation-calculator", icon: TrendingDown },
      { title: "CAGR Calculator", desc: "Find the compound annual growth rate between two values.", route: "/cagr-calculator", icon: ArrowUpRight },
    ],
  },
  retirement: {
    calculators: [
      { title: "Retirement Calculator", desc: "Plan long-term retirement wealth goals.", route: "/retirement-calculator", icon: TreePalm },
      { title: "FIRE Calculator", desc: "Plan Financial Independence & Retire Early.", route: "/fire-calculator", icon: Flame, badge: "New" },
      { title: "Annual Retirement Income Calculator", desc: "Calculate your annual income during retirement.", route: "/annual-retirement-income", icon: Wallet },
      { title: "Retirement Investment Tracker", desc: "Track your retirement investments year by year.", route: "/retirement-investment-tracker", icon: ClipboardList },
    ],
  },
  wealth: {
    calculators: [
      { title: "Net Worth Calculator", desc: "Track your assets, liabilities, and net worth.", route: "/networth-calculator", icon: Briefcase },
      { title: "Goal Planner", desc: "Plan your retirement with variable asset allocation.", route: "/goal-planner", icon: Target },
      { title: "Emergency Fund Calculator", desc: "Plan your financial safety net for unexpected expenses.", route: "/emergency-fund-calculator", icon: ShieldAlert, badge: "New" },
      { title: "Wealth Age Calculator", desc: "See how your savings rate and net worth compare to your real age.", route: "/wealth-age-calculator", icon: Gauge, badge: "New" },
    ],
  },
};

const categories = calculatorCategories.map((cat) => ({
  ...cat,
  calculators: CATEGORY_DATA[cat.id].calculators,
}));

const totalCalculators = categories.reduce((sum, c) => sum + c.calculators.length, 0);

const whyCards = [
  { icon: TrendingUp, title: "Investment Planning", desc: "Investment, CAGR, and retirement calculators to grow your wealth.", tone: "emerald" },
  { icon: Landmark, title: "Loan Management", desc: "EMI calculators to plan home, car, and personal loans.", tone: "sky" },
  { icon: Receipt, title: "Tax & Savings", desc: "Tax and savings calculators for smarter financial planning.", tone: "violet" },
];

function CalcCard({ calc, tone }) {
  const Icon = calc.icon;
  const t = toneStyles[tone];
  return (
    <Link
      to={calc.route}
      className="group relative flex min-h-[190px] flex-col rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.10)]"
    >
      {calc.badge && (
        <span
          className={`absolute right-5 top-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
            calc.badge === "New" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Sparkles size={10} />
          {calc.badge}
        </span>
      )}
      <div
        className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${t.bg} ${t.text} ${t.ring}`}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-[16px] font-black text-slate-900 transition-colors group-hover:text-emerald-700">
        {calc.title}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-6 text-slate-500">{calc.desc}</p>
      <div className="mt-4 flex items-center gap-1.5 text-[13px] font-black text-emerald-700">
        Open
        <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

      <div className="min-h-screen bg-[#fbfdfc] text-slate-950">
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-5 pb-10 pt-14 text-center sm:px-8 lg:px-12 lg:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
            <LayoutGrid size={13} /> {totalCalculators} Smart Financial Tools
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-[38px] font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[52px]">
            Financial calculators for
            <span className="block text-emerald-700">smarter decisions.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-500 sm:text-[16px]">
            A curated collection of calculators and planners for investing, retirement,
            loans, inflation, bonds and wealth management — free, and built to be trusted.
          </p>
        </section>

        {/* Category filter tabs */}
        <section className="sticky top-[76px] z-30 mx-auto max-w-[1200px] px-5 py-3 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-[0_16px_40px_rgba(15,23,42,.06)] ring-1 ring-slate-200/80 backdrop-blur-xl">
            <button
              onClick={() => setCategory(null)}
              className={`rounded-xl px-4 py-2.5 text-[13px] font-black transition ${
                !activeCategory ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Tools
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-black transition ${
                    active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  {cat.name}
                  <span className={active ? "text-white/60" : "text-slate-400"}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Calculators by Category */}
        <section className="mx-auto max-w-[1200px] px-5 pb-6 pt-4 sm:px-8 lg:px-12">
          {filtered.map((category) => {
            const Icon = category.icon;
            const t = toneStyles[category.tone];
            return (
              <div key={category.id} className="mb-14 last:mb-0">
                <div className="flex items-center gap-3.5">
                  <span className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <h2 className="text-[22px] font-black tracking-[-0.02em] text-slate-950 sm:text-[24px]">
                      {category.name} Calculators
                    </h2>
                    <p className="text-[13.5px] font-semibold text-slate-500">{category.description}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.calculators.map((calc) => (
                    <CalcCard key={calc.route} calc={calc} tone={category.tone} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Stats strip */}
        <section className="mx-auto max-w-[1200px] px-5 pb-14 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center sm:grid-cols-4">
            {[
              { value: totalCalculators, label: "Financial Tools" },
              { value: categories.length, label: "Categories" },
              { value: "100%", label: "Free, No Signup" },
              { value: "Private", label: "Data Stays On Your Device", icon: CheckCircle2 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-center gap-1.5 text-[26px] font-black text-emerald-800 sm:text-[30px]">
                  {stat.icon && <stat.icon size={20} />}
                  {stat.value}
                </div>
                <div className="mt-1 text-[12.5px] font-bold text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why FINAIW */}
        <section className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Why FINAIW</span>
            <h2 className="mt-3 text-[28px] font-black tracking-[-0.02em] text-slate-950 sm:text-[34px]">
              Why use FINAIW calculators?
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600">
              Our calculators are designed to help you make smarter financial decisions with clarity and
              confidence. Whether you're planning investments, managing loans, or preparing for retirement,
              these tools give you data-driven insights at your fingertips.
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
              FINAIW is your trusted partner for financial literacy — offering intuitive tools that are both
              educational and practical for everyday use.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {whyCards.map((card) => {
                const Icon = card.icon;
                const t = toneStyles[card.tone];
                return (
                  <div key={card.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 text-[15px] font-black text-slate-900">{card.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-slate-500">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
              <p className="max-w-xl text-[12px] leading-5 text-slate-400">
                <span className="font-bold text-slate-500">Disclaimer:</span> These tools are for illustrative
                purposes only and do not constitute financial advice. Please consult a certified financial
                advisor for personalised guidance.
              </p>
              <Link
                to="/verdict"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Get Your Verdict <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
