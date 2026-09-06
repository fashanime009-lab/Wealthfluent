import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import {
  Target,
  TrendingUp,
  LineChart,
  TrendingDown,
  Map,
  BookOpen,
  Sparkles,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { toneStyles } from "@/data/calculators";

const tools = [
  {
    title: "Financial Goal Planner",
    desc: "Plan future savings and investment goals.",
    icon: Target,
    tone: "emerald",
  },
  {
    title: "Investment Risk Analyzer",
    desc: "Understand your investment risk profile.",
    icon: TrendingUp,
    tone: "violet",
  },
  {
    title: "Portfolio Management",
    desc: "Track investments and monitor portfolio performance.",
    icon: LineChart,
    tone: "sky",
    popular: true,
  },
  {
    title: "Inflation Insights",
    desc: "Estimate purchasing power impact over time.",
    icon: TrendingDown,
    tone: "amber",
  },
  {
    title: "Wealth Roadmap",
    desc: "Visualize your long-term financial growth journey.",
    icon: Map,
    tone: "rose",
  },
  {
    title: "Finance Glossary",
    desc: "Learn essential finance terminology easily.",
    icon: BookOpen,
    tone: "purple",
  },
];

const highlights = [
  { icon: Target, title: "Goal Setting", desc: "Define and track your financial goals with precision.", tone: "emerald" },
  { icon: TrendingUp, title: "Risk Assessment", desc: "Understand your risk tolerance and investment comfort.", tone: "violet" },
  { icon: BookOpen, title: "Financial Literacy", desc: "Learn key finance terms and concepts easily.", tone: "sky" },
];

function ToolCard({ tool }) {
  const Icon = tool.icon;
  const t = toneStyles[tool.tone];
  return (
    <div className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.08)]">
      {tool.popular && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100">
          <Sparkles size={10} /> Popular
        </span>
      )}
      <div className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${t.bg} ${t.text} ${t.ring}`}>
        <Icon size={26} strokeWidth={2} />
      </div>
      <h2 className="mt-5 text-[19px] font-black text-slate-900">{tool.title}</h2>
      <p className="mt-2 flex-1 text-[13.5px] leading-6 text-slate-500">{tool.desc}</p>
      {tool.path ? (
        <Link
          to={tool.path}
          className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-800 py-3 text-[13px] font-black text-white transition hover:bg-emerald-900"
        >
          Open Tool <ArrowRight size={14} />
        </Link>
      ) : (
        <button
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-xl border border-dashed border-slate-200 bg-slate-50 py-3 text-[13px] font-black text-slate-400"
        >
          Coming Soon
        </button>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <>
      <Seo
        title="Smart Finance Tools — Planning & Portfolio Utilities"
        description="Explore smart finance planning tools, investment utilities, financial learning resources, and wealth planning systems."
        path="/tools"
        keywords="finance tools, goal planner, risk analyzer, portfolio tracker, inflation calculator, wealth roadmap"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
        ])}
      />

      <div className="min-h-screen bg-[#fbfdfc]">
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-5 pb-10 pt-14 text-center sm:px-8 lg:px-12 lg:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
            <Sparkles size={13} /> Smart Financial Utilities
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-[38px] font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[52px]">
            Advanced finance
            <span className="block text-emerald-700">planning tools.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-500 sm:text-[16px]">
            Upcoming financial research tools, portfolio management utilities, investment analysis
            resources, and educational finance systems — built for the way you actually plan.
          </p>
        </section>

        {/* Tools grid */}
        <section className="mx-auto max-w-[1200px] px-5 pb-6 sm:px-8 lg:px-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto max-w-[1200px] px-5 pb-14 sm:px-8 lg:px-12">
          <div className="grid grid-cols-3 gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <div>
              <div className="text-[26px] font-black text-emerald-800 sm:text-[30px]">{tools.length}</div>
              <div className="mt-1 text-[12.5px] font-bold text-slate-500">Upcoming Tools</div>
            </div>
            <div>
              <div className="text-[26px] font-black text-emerald-800 sm:text-[30px]">100%</div>
              <div className="mt-1 text-[12.5px] font-bold text-slate-500">Free to Use</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[26px] font-black text-emerald-800 sm:text-[30px]">
                <Rocket size={22} />
              </div>
              <div className="mt-1 text-[12.5px] font-bold text-slate-500">Launching Soon</div>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Resources</span>
            <h2 className="mt-3 text-[28px] font-black tracking-[-0.02em] text-slate-950 sm:text-[34px]">
              Smart financial planning resources
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600">
              Financial planning tools help investors, beginners, and wealth builders make smarter
              money decisions using data-driven insights and calculators.
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
              FINAIW combines finance education, investment planning systems, and wealth tools to
              improve long-term financial understanding.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {highlights.map((card) => {
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
                <span className="font-bold text-slate-500">Disclaimer:</span> These tools are for
                educational and illustrative purposes only. Always consult a certified financial
                advisor for personalised advice.
              </p>
              <Link
                to="/calculators"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Explore Calculators <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
