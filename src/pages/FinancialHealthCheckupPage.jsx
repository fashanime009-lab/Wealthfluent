import { useId, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { getFinancialProfile, saveFinancialProfile, computeFinancialHealth } from "@/engine/financialProfile";
import { TOOL_TONES } from "@/data/toolTones";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import CalcSection from "@/components/calculators/CalcSection";
import { Link } from "react-router-dom";

const tone = TOOL_TONES.healthCheckup;

const FAQ_ITEMS = [
  { q: "Where does the 0-100 score come from?", a: "Four categories, 25 points each: savings rate, emergency fund coverage, debt-to-income ratio, and net worth relative to your annual income. The exact rubric is published below — nothing about the scoring is hidden." },
  { q: "Is my data saved anywhere?", a: "Only in your browser, and only if you choose to save it. Typing numbers in here computes your score instantly on your device; nothing is sent anywhere unless you click \"Save to my Financial Profile,\" which stores it in your browser's local storage, not on a server." },
  { q: "What does debt-to-income mean in this score?", a: "Your total outstanding loans (home loan, car loan, personal loans, credit card balances) as a percentage of one year's income. Under 20% scores full marks, under 36% scores 18 of 25, under 50% scores 10, and 50% or more scores 0. A large home loan can push this up even when the EMI is affordable, so read it alongside your savings rate." },
  { q: "How often should I check my financial health?", a: "Once every few months is plenty, and after any big change such as a new job, a new loan or a large purchase. The score moves slowly, so the useful thing to watch is the direction of each of the four parts rather than the headline number." },
  { q: "Why does net worth need 3x income to score full marks?", a: "It's a common long-term benchmark, not a rule — being at 1x annual income in net worth by your mid-30s and 3x by retirement age are typical milestones cited in financial planning. Being below it isn't a failing grade, especially earlier in your career; it's one input among four, not the whole picture." },
];

function defaultProfile() {
  return {
    monthlyIncome: 80000,
    monthlyExpenses: 55000,
    totalAssets: 800000,
    totalLiabilities: 200000,
    emergencyFundAmount: 150000,
  };
}

const LEVEL_META = {
  excellent: { label: "Excellent", threshold: 80 },
  good: { label: "Good", threshold: 60 },
  fair: { label: "Needs Improvement", threshold: 40 },
  poor: { label: "Needs Immediate Attention", threshold: 0 },
};

function levelFor(score) {
  if (score >= 80) return LEVEL_META.excellent;
  if (score >= 60) return LEVEL_META.good;
  if (score >= 40) return LEVEL_META.fair;
  return LEVEL_META.poor;
}

export default function FinancialHealthCheckupPage() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);

  const [profile, setProfile] = useState(() => {
    const saved = getFinancialProfile();
    return saved
      ? {
          monthlyIncome: saved.monthlyIncome ?? 0,
          monthlyExpenses: saved.monthlyExpenses ?? 0,
          totalAssets: saved.totalAssets ?? 0,
          totalLiabilities: saved.totalLiabilities ?? 0,
          emergencyFundAmount: saved.emergencyFundAmount ?? 0,
        }
      : defaultProfile();
  });
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setProfile((p) => ({ ...p, [key]: Math.max(0, Number(value) || 0) }));
    setSaved(false);
  };

  const health = useMemo(() => computeFinancialHealth(profile), [profile]);
  const level = levelFor(health.score);

  const handleSave = () => {
    saveFinancialProfile(profile);
    setSaved(true);
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Financial Health Checkup: Your Score Out of 100"
        description="A real composite financial health score out of 100 — savings rate, emergency fund, debt-to-income, and net worth, with a published, auditable rubric."
        path="/financial-health-checkup"
        keywords="financial health score, financial checkup, financial wellness score, personal finance score calculator"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Financial Health Checkup", path: "/financial-health-checkup" },
          ]),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <div className="mx-auto max-w-[920px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
          Tool, not a calculator
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
          Financial Health Checkup
        </h1>
        <p className="mt-4 max-w-[64ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Five real numbers about your finances, reduced to one score out of 100 — and exactly which of the
          four things behind it is actually holding you back. Nothing vague, nothing hidden.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <Field label="Monthly income (take-home)" value={profile.monthlyIncome} onChange={(v) => update("monthlyIncome", v)} fmt={fmt} />
            <Field label="Monthly expenses" value={profile.monthlyExpenses} onChange={(v) => update("monthlyExpenses", v)} fmt={fmt} />
            <Field label="Total assets (savings, investments, property)" value={profile.totalAssets} onChange={(v) => update("totalAssets", v)} fmt={fmt} />
            <Field label="Total liabilities (all loans, all balances owed)" value={profile.totalLiabilities} onChange={(v) => update("totalLiabilities", v)} fmt={fmt} />
            <Field label="Emergency fund amount" value={profile.emergencyFundAmount} onChange={(v) => update("emergencyFundAmount", v)} fmt={fmt} />

            <button
              type="button"
              onClick={handleSave}
              className="w-full text-center text-[12.5px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]"
              style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}
            >
              {saved ? "Saved to your Financial Profile ✓" : "Save to my Financial Profile"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg p-7" style={{ backgroundColor: tone.panel }}>
              <p className="text-[13px] text-[#eef1ec]/55">Your score</p>
              <p className="font-mono-tech mt-1 text-[46px] font-medium leading-none tabular-nums" style={{ color: tone.bright }}>
                {health.score}
                <span className="text-[20px] text-[#eef1ec]/50">/100</span>
              </p>
              <p className="mt-3 text-[15px] font-semibold text-[#eef1ec]">{level.label}</p>
            </div>

            <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              {health.breakdown.map((row) => (
                <BreakdownRow key={row.label} row={row} netWorth={row.label === "Net Worth" ? fmt(health.netWorth) : null} />
              ))}
            </div>

            <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
              <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
              This score is an illustrative model based on common financial-planning benchmarks, not personalized
              financial advice.
            </p>
          </div>
        </div>

        <Methodology />

        <HealthGuide />

        <VerdictFAQ items={FAQ_ITEMS} className="mt-14" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, fmt }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`${id}-range`} className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">{label}</label>
        <span className="font-mono-tech text-[14px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
          {fmt(value)}
        </span>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        aria-valuetext={fmt(value)}
        min={0}
        max={label.includes("assets") ? 20000000 : label.includes("liabilities") ? 10000000 : 500000}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="instrument-range mt-3 w-full"
      />
      <input
        type="number"
        aria-label={`${label}, exact value`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[var(--tone)] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]"
        style={{ "--tone": tone.light }}
      />
    </div>
  );
}

function BreakdownRow({ row, netWorth }) {
  const pct = (row.score / row.max) * 100;
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">{row.label}</span>
        <span className="font-mono-tech text-[13px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
          {netWorth ?? row.value}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-[3px] flex-1 rounded-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tone.light }} />
        </div>
        <span className="font-mono-tech text-[11px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
          {row.score}/{row.max}
        </span>
      </div>
    </div>
  );
}

function Methodology() {
  return (
    <div className="mt-14 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">How this is computed</h2>
      <p className="mt-2 max-w-[62ch] text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
        25 points each, published so it's auditable rather than a black box. Savings rate: 20%+ scores full
        marks, stepping down to 0 if you spend more than you earn. Emergency fund: scales linearly to full marks at 6 months of
        expenses covered. Debt-to-income: full marks under 20% of annual income, scaling down to 0 above 50%.
        Net worth: full marks at 3x annual income or more, 0 at or below zero net worth. The four scores sum to
        your total out of 100.
      </p>
    </div>
  );
}

// The starting numbers this page opens with, scored by the real engine so
// the worked example below always matches what the tool shows.
const EXAMPLE_PROFILE = defaultProfile();
const EXAMPLE_HEALTH = computeFinancialHealth(EXAMPLE_PROFILE);
const inr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

function HealthGuide() {
  const [savings, emergency, debt, netWorth] = EXAMPLE_HEALTH.breakdown;
  const level = levelFor(EXAMPLE_HEALTH.score);

  return (
    <div className="mt-14 space-y-10">
      <CalcSection title="What each part of the score tells you">
        <p>
          <strong>Savings rate</strong> is the share of your monthly income left after expenses.
          It's the engine behind everything else: a high savings rate builds your emergency fund,
          pays down debt and grows net worth. Saving 20% or more of what you earn scores full marks.
        </p>
        <p>
          <strong>Emergency fund</strong> is how many months of expenses you could cover with cash
          set aside for surprises such as a job loss or a hospital bill. Six months scores full
          marks. Below that, the score falls in proportion.
        </p>
        <p>
          <strong>Debt-to-income</strong> is your total outstanding loans as a percentage of a
          year's income. It shows how much of your future earnings are already spoken for.
        </p>
        <p>
          <strong>Net worth</strong> is everything you own minus everything you owe, compared with
          your annual income. Reaching three times your annual income scores full marks. Early in a
          career it's normal to be well below that.
        </p>
      </CalcSection>

      <CalcSection title="A worked example">
        <p>
          The checkup opens with an example: {inr(EXAMPLE_PROFILE.monthlyIncome)} monthly income,{" "}
          {inr(EXAMPLE_PROFILE.monthlyExpenses)} in expenses, {inr(EXAMPLE_PROFILE.emergencyFundAmount)}{" "}
          in an emergency fund, {inr(EXAMPLE_PROFILE.totalAssets)} in assets and{" "}
          {inr(EXAMPLE_PROFILE.totalLiabilities)} in loans. That person saves {savings.value} of
          their income ({savings.score}/25), has {EXAMPLE_HEALTH.emergencyMonths.toFixed(1)} months of
          expenses saved ({emergency.score}/25), owes {debt.value} of a year's income ({debt.score}/25) and gets{" "}
          {netWorth.score}/25 for net worth. The total is {EXAMPLE_HEALTH.score}/100: {level.label}.
        </p>
        <p>
          Their savings habit is already strong. The two quickest gains are topping up the
          emergency fund towards six months of expenses and letting that savings rate keep building
          net worth.
        </p>
      </CalcSection>

      <CalcSection title="How to raise your score">
        <p>
          Work on the lowest of the four parts first, since that's where each rupee moves the score
          most. If your emergency fund is short, park a fixed amount in a savings account or liquid
          fund every month until it covers six months; the{" "}
          <Link to="/emergency-fund-calculator" className="font-semibold underline decoration-current/30 underline-offset-2">
            emergency fund calculator
          </Link>{" "}
          gives you a target. If debt is high, clear the most expensive loans first with the{" "}
          <Link to="/debt-payoff-planner" className="font-semibold underline decoration-current/30 underline-offset-2">
            debt payoff planner
          </Link>
          . If your savings rate is low, look at your three biggest monthly expenses before cutting
          small ones.
        </p>
        <p>
          Net worth improves on its own once the other three are healthy. Track it every few months
          with the{" "}
          <Link to="/networth-calculator" className="font-semibold underline decoration-current/30 underline-offset-2">
            net worth calculator
          </Link>{" "}
          and see where you stand worldwide with the{" "}
          <Link to="/net-worth-percentile" className="font-semibold underline decoration-current/30 underline-offset-2">
            global net worth percentile
          </Link>
          . For the habits behind a high savings rate, read{" "}
          <Link to="/blog/build-wealth-on-an-average-salary" className="font-semibold underline decoration-current/30 underline-offset-2">
            the janitor who died with $8 million
          </Link>
          . Once your base is solid, the{" "}
          <Link to="/investment-risk-analyzer" className="font-semibold underline decoration-current/30 underline-offset-2">
            investment risk analyzer
          </Link>{" "}
          uses this same score to suggest how much investment risk you can afford.
        </p>
      </CalcSection>
    </div>
  );
}
