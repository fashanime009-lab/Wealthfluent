import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

// Every tool listed here is live — nothing under construction. A "coming
// soon" placeholder is exactly the kind of thing an AdSense content
// review flags as an unfinished/under-construction page, and this page
// is publicly indexed (see public/sitemap.xml), so it's worth keeping
// this list honest rather than aspirational.
const tools = [
  {
    title: "Financial Goal Planner",
    desc: "Checks every real goal you've set against your real monthly surplus at once — not one goal at a time.",
    path: "/financial-goal-planner",
    popular: true,
  },
  {
    title: "Investment Risk Analyzer",
    desc: "A real risk-profiling quiz, reconciled against what your actual finances can afford — not just how you feel.",
    path: "/investment-risk-analyzer",
  },
  {
    title: "Financial Health Checkup",
    desc: "Five real numbers, reduced to one score out of 100 — and exactly which of four factors is actually holding it back.",
    path: "/financial-health-checkup",
  },
  {
    title: "Debt Payoff Strategy Planner",
    desc: "Every debt you're carrying, simulated month by month under snowball vs avalanche — real numbers, not a rule of thumb.",
    path: "/debt-payoff-planner",
  },
];

const highlights = [
  { title: "Goal setting", desc: "Define and track your financial goals with precision." },
  { title: "Risk assessment", desc: "Understand your risk tolerance and investment comfort." },
  { title: "Health scoring", desc: "One composite score, with exactly what's dragging it down." },
  { title: "Debt strategy", desc: "Compare real payoff strategies for everything you owe." },
];

function ToolRow({ tool }) {
  const content = (
    <>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h2 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">{tool.title}</h2>
          {tool.popular && (
            <span className="text-[12px] font-medium text-[#047857] dark:text-[#34d399]">Popular</span>
          )}
        </div>
        <p className="mt-1 max-w-[46ch] text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
          {tool.desc}
        </p>
      </div>
      <div className="min-w-0 sm:text-right">
        <span className="font-mono-tech text-[12.5px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
          {tool.path ? "Open tool" : "Coming soon"}
        </span>
      </div>
    </>
  );

  return tool.path ? (
    <Link
      to={tool.path}
      className="group grid grid-cols-1 gap-2 py-6 transition-opacity hover:opacity-70 sm:grid-cols-[1.3fr_1fr] sm:gap-8"
    >
      {content}
    </Link>
  ) : (
    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[1.3fr_1fr] sm:gap-8">{content}</div>
  );
}

export default function ToolsPage() {
  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
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

      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Tools</span>
        <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
          Advanced finance planning tools
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Deeper than a calculator — real financial research tools, portfolio management
          utilities, and analysis systems built for the way you actually plan, not one formula at
          a time.
        </p>

        {/* Tools list — plain rows, not a grid of icon cards */}
        <div className="mt-10 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
          {tools.map((tool) => (
            <ToolRow key={tool.title} tool={tool} />
          ))}
        </div>

        {/* Spec strip */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-b border-[#111814]/10 pb-8 dark:border-[#eef1ec]/10">
          {[
            { value: tools.length, label: "live tools" },
            { value: "100%", label: "free to use" },
            { value: "0", label: "signups required" },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
                {stat.value}
              </span>
              <span className="ml-2 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="mt-12">
          <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Resources</span>
          <h2 className="font-display mt-2 text-[26px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
            Smart financial planning resources
          </h2>
          <p className="mt-4 max-w-[68ch] text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Financial planning tools help investors, beginners, and wealth builders make smarter
            money decisions using data-driven insights and calculators.
          </p>
          <p className="mt-4 max-w-[68ch] text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            FINAIW combines finance education, investment planning systems, and wealth tools to
            improve long-term financial understanding.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {highlights.map((card) => (
              <div key={card.title}>
                <h3 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">{card.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10 sm:flex-row sm:items-center">
            <p className="max-w-md text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
              These tools are for educational and illustrative purposes only. Always consult a
              certified financial advisor for personalised advice.
            </p>
            <Link
              to="/calculators"
              className="flex-shrink-0 text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              Explore calculators
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
