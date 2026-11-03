import { useEffect, useId, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { compareDebtStrategies } from "@/services/tools/debtPayoffStrategy";
import { TOOL_TONES } from "@/data/toolTones";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { currencies } from "@/data/currencies";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import CalcSection from "@/components/calculators/CalcSection";
import { Link } from "react-router-dom";

const tone = TOOL_TONES.debtStrategy;
const STORAGE_KEY = "finaiw-debt-payoff-planner";

const FAQ_ITEMS = [
  { q: "Why do snowball and avalanche sometimes take the same number of months?", a: "When your extra payment is large relative to your balances, both strategies clear everything at close to the same pace — the difference is mainly in total interest paid, and in which debt disappears first (a real psychological factor snowball is built around)." },
  { q: "Which is better, snowball or avalanche?", a: "Avalanche always pays the same or less total interest, because the most expensive debt shrinks first. Snowball can pay a little more interest but clears small debts sooner, and those early wins help many people keep going. If the interest difference is small, pick the one you'll actually stick to." },
  { q: "Should I invest or pay off debt first?", a: "Compare the loan's interest rate with what you can realistically earn after tax. Credit card debt at 36% a year beats almost any investment return, so clear it first. A home loan at 8 to 9% is a closer call. The debt vs invest verdict on FINAIW works through that decision with your own numbers." },
  { q: "Does the order I enter debts in matter?", a: "No — each strategy re-sorts your list internally: snowball by smallest balance first, avalanche by highest interest rate first, regardless of the order you typed them in." },
  { q: "What if my minimum payments don't even cover the interest?", a: "That's negative amortization — the balance would grow forever no matter which strategy you pick. If the tool can't find a payoff month within 50 years, it'll tell you rather than show a misleading number; the fix is almost always more extra payment, not a better strategy." },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function emptyDebt() {
  return {
    id: `d_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    balance: 100000,
    rate: 18,
    minPayment: 3000,
  };
}

function defaultDebts() {
  return [
    { id: "d_cc", name: "Credit Card", balance: 150000, rate: 36, minPayment: 5000 },
    { id: "d_personal", name: "Personal Loan", balance: 300000, rate: 14, minPayment: 8000 },
  ];
}

export default function DebtPayoffPlannerPage() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const symbol = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  const [debts, setDebts] = useState(() => load()?.debts || defaultDebts());
  const [extraMonthly, setExtraMonthly] = useState(() => load()?.extraMonthly ?? 10000);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ debts, extraMonthly }));
  }, [debts, extraMonthly]);

  const addDebt = () => {
    const d = emptyDebt();
    setDebts((ds) => [...ds, d]);
    setEditingId(d.id);
  };
  const updateDebt = (id, patch) => setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const removeDebt = (id) => setDebts((ds) => ds.filter((d) => d.id !== id));

  const result = useMemo(
    () => (debts.length ? compareDebtStrategies({ debts, extraMonthly }) : null),
    [debts, extraMonthly]
  );

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Debt Payoff Strategy Planner — Snowball vs Avalanche, Simulated"
        description="Enter every debt you're carrying and see snowball vs avalanche payoff simulated month by month — total interest, payoff timeline, and which one actually wins for your real numbers."
        path="/debt-payoff-planner"
        keywords="debt payoff calculator, debt snowball calculator, debt avalanche calculator, debt payoff strategy, pay off multiple debts"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Debt Payoff Strategy Planner", path: "/debt-payoff-planner" },
          ]),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <div className="mx-auto max-w-[920px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
          Tool, not a calculator
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
          Debt Payoff Strategy Planner
        </h1>
        <p className="mt-4 max-w-[64ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Enter every debt you're actually carrying — not one at a time. This runs a real month-by-month
          simulation of both snowball (smallest balance first) and avalanche (highest rate first), so you see
          the actual total interest and payoff timeline for each, not a rule of thumb.
        </p>

        <ExtraPaymentInput extraMonthly={extraMonthly} setExtraMonthly={setExtraMonthly} symbol={symbol} />

        <DebtBuilder
          debts={debts}
          editingId={editingId}
          setEditingId={setEditingId}
          onAdd={addDebt}
          onUpdate={updateDebt}
          onRemove={removeDebt}
          fmt={fmt}
        />

        {result && <StrategyComparison result={result} debts={debts} fmt={fmt} />}

        <Methodology />

        <DebtGuide />

        <VerdictFAQ items={FAQ_ITEMS} className="mt-14" />
      </div>
    </div>
  );
}

function ExtraPaymentInput({ extraMonthly, setExtraMonthly, symbol }) {
  const id = useId();
  return (
    <div className="mt-10 border-l-4 p-6" style={{ borderColor: tone.bright, backgroundColor: tone.panel }}>
      <label htmlFor={`${id}-number`} className="text-[12px] font-semibold" style={{ color: tone.bright }}>
        Extra monthly amount available, beyond everyone's minimum
      </label>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono-tech text-[22px] font-medium text-[#eef1ec]">{symbol}</span>
        <input
          id={`${id}-number`}
          type="number"
          value={extraMonthly}
          onChange={(e) => setExtraMonthly(Math.max(0, Number(e.target.value) || 0))}
          className="font-mono-tech w-40 border-b border-[#eef1ec]/25 bg-transparent text-[22px] font-medium tabular-nums text-[#eef1ec] outline-none"
        />
      </div>
      <input
        type="range"
        aria-label="Extra monthly amount, slider"
        min={0}
        max={100000}
        step={500}
        value={extraMonthly}
        onChange={(e) => setExtraMonthly(Number(e.target.value))}
        className="instrument-range-panel mt-4 w-full"
      />
    </div>
  );
}

function DebtBuilder({ debts, editingId, setEditingId, onAdd, onUpdate, onRemove, fmt }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">
          Your debts ({debts.length})
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-[13px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]"
          style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}
        >
          + Add a debt
        </button>
      </div>

      {debts.length === 0 && (
        <p className="mt-4 border border-[#111814]/12 p-6 text-center text-[13px] text-[#111814]/60 dark:border-[#eef1ec]/12 dark:text-[#eef1ec]/50">
          Add every loan, credit card, or line of credit you're paying off.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {debts.map((d) =>
          editingId === d.id ? (
            <DebtEditor key={d.id} debt={d} onUpdate={onUpdate} onDone={() => setEditingId(null)} onRemove={onRemove} />
          ) : (
            <button
              key={d.id}
              type="button"
              onClick={() => setEditingId(d.id)}
              className="flex w-full items-center justify-between gap-4 border border-[#111814]/12 p-4 text-left transition hover:border-[var(--tone)] dark:border-[#eef1ec]/12"
              style={{ "--tone": tone.light }}
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">
                  {d.name || "Untitled debt"}
                </p>
                <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                  {d.rate}% APR · min {fmt(d.minPayment)}/mo
                </p>
              </div>
              <span className="font-mono-tech flex-shrink-0 text-[15px] tabular-nums text-[#111814] dark:text-[#eef1ec]">
                {fmt(d.balance)}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

function DebtEditor({ debt, onUpdate, onDone, onRemove }) {
  return (
    <div className="border p-5" style={{ borderColor: tone.light }}>
      <input
        aria-label="Debt name"
        value={debt.name}
        onChange={(e) => onUpdate(debt.id, { name: e.target.value })}
        placeholder="e.g. Credit Card, Car Loan, Personal Loan"
        className="w-full border-b border-[#111814]/15 bg-transparent pb-2 text-[15px] font-semibold text-[#111814] outline-none dark:border-[#eef1ec]/15 dark:text-[#eef1ec]"
      />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <NumberField label="Balance" value={debt.balance} onChange={(v) => onUpdate(debt.id, { balance: v })} min={0} step={1000} />
        <NumberField label="Interest rate (% APR)" value={debt.rate} onChange={(v) => onUpdate(debt.id, { rate: v })} min={0} max={60} step={0.5} />
        <NumberField label="Minimum monthly payment" value={debt.minPayment} onChange={(v) => onUpdate(debt.id, { minPayment: v })} min={0} step={100} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onRemove(debt.id)}
          className="text-[12.5px] font-semibold text-red-600 dark:text-red-400"
        >
          Remove
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-9 items-center px-4 text-[13px] font-semibold text-white"
          style={{ backgroundColor: tone.light }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, step }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[12px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[var(--tone)] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]"
        style={{ "--tone": tone.light }}
      />
    </div>
  );
}

function StrategyComparison({ result, debts, fmt }) {
  const { snowball, avalanche, interestSaved, monthsSaved, totalBalance } = result;
  const nameById = Object.fromEntries(debts.map((d) => [d.id, d.name || "Untitled debt"]));

  // Strictly greater/less than zero, not >=/<= — a tie (interestSaved
  // === 0) should badge neither card as winning, or "Lower interest"
  // reads as a lie sitting right next to two identical numbers.
  const avalancheWins = interestSaved !== null && interestSaved > 0;
  const snowballWins = interestSaved !== null && interestSaved < 0;

  return (
    <div className="mt-12">
      <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">
        {fmt(totalBalance)} across {debts.length} debt{debts.length === 1 ? "" : "s"} — here's how each strategy plays out
      </h2>

      {(snowball.neverPaidOff || avalanche.neverPaidOff) && (
        <p className="mt-4 border border-amber-500/25 bg-amber-500/[0.06] p-4 text-[13.5px] text-amber-700 dark:border-amber-400/20 dark:text-amber-400">
          At this extra payment amount, at least one strategy doesn't pay off within 50 years — your minimum
          payments likely aren't covering the interest. Try increasing the extra monthly amount above.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StrategyCard
          title="Snowball"
          sub="Smallest balance first"
          strategy={snowball}
          nameById={nameById}
          fmt={fmt}
          highlight={snowballWins}
        />
        <StrategyCard
          title="Avalanche"
          sub="Highest interest rate first"
          strategy={avalanche}
          nameById={nameById}
          fmt={fmt}
          highlight={avalancheWins}
        />
      </div>

      {interestSaved !== null && (
        <p className="mt-6 text-[13.5px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
          {interestSaved === 0
            ? "Both strategies cost the same total interest for your numbers — pick whichever keeps you motivated."
            : `Avalanche saves ${fmt(Math.abs(interestSaved))} in total interest${
                monthsSaved > 0 ? ` and finishes ${monthsSaved} month${monthsSaved === 1 ? "" : "s"} sooner` : ""
              } compared to snowball. Snowball clears your first debt faster${
                snowball.months && avalanche.months ? "" : ""
              }, which is the whole point of it — real momentum, at a real (usually small) cost.`}
        </p>
      )}
    </div>
  );
}

function StrategyCard({ title, sub, strategy, nameById, fmt, highlight }) {
  return (
    <div
      className="border p-6"
      style={{ borderColor: highlight ? tone.light : "rgba(17,24,20,0.12)", backgroundColor: highlight ? tone.panel : "transparent" }}
    >
      <div className="flex items-baseline justify-between">
        <h3 className={`font-display text-[16px] font-bold ${highlight ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
          {title}
        </h3>
        {highlight && (
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: tone.bright }}>
            Lower interest
          </span>
        )}
      </div>
      <p className={`mt-1 text-[12.5px] ${highlight ? "text-[#eef1ec]/55" : "text-[#111814]/60 dark:text-[#eef1ec]/50"}`}>{sub}</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className={`font-mono-tech text-[20px] font-medium tabular-nums ${highlight ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
            {strategy.months ?? "50+ yrs"}
          </p>
          <p className={`text-[11.5px] ${highlight ? "text-[#eef1ec]/50" : "text-[#111814]/60 dark:text-[#eef1ec]/50"}`}>months to debt-free</p>
        </div>
        <div>
          <p className={`font-mono-tech text-[20px] font-medium tabular-nums ${highlight ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
            {fmt(strategy.totalInterest)}
          </p>
          <p className={`text-[11.5px] ${highlight ? "text-[#eef1ec]/50" : "text-[#111814]/60 dark:text-[#eef1ec]/50"}`}>total interest paid</p>
        </div>
      </div>

      <div className="mt-5 border-t pt-4" style={{ borderColor: highlight ? "rgba(238,241,236,0.12)" : "rgba(17,24,20,0.1)" }}>
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${highlight ? "text-[#eef1ec]/50" : "text-[#111814]/60 dark:text-[#eef1ec]/50"}`}>
          Payoff order
        </p>
        <ol className="mt-2 space-y-1">
          {strategy.payoffOrder.map((id, i) => (
            <li key={id} className={`text-[12.5px] ${highlight ? "text-[#eef1ec]/75" : "text-[#111814]/70 dark:text-[#eef1ec]/70"}`}>
              {i + 1}. {nameById[id]}
              {strategy.payoffMonth[id] ? ` — month ${strategy.payoffMonth[id]}` : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Methodology() {
  return (
    <div className="mt-14 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">How this is computed</h2>
      <p className="mt-2 max-w-[62ch] text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
        Both strategies simulate month by month: interest accrues on every balance, minimum payments go out to
        every debt, and your extra amount goes entirely to the highest-priority debt still standing — smallest
        balance for snowball, highest rate for avalanche. Once a debt is paid off, its minimum payment doesn't
        disappear — it rolls into the pool applied to the next debt, which is what makes payoff accelerate over
        time instead of staying flat. This is a planning model based on the numbers you enter, not personalized
        financial advice.
      </p>
    </div>
  );
}

// Worked example for the guide, run through the real simulation so the
// numbers always match the tool. The page's own default debts are a case
// where both strategies agree, so this uses one where they differ.
const EXAMPLE_EXTRA = 10000;
const EXAMPLE_DEBTS = [
  { id: "consumer", name: "Consumer loan", balance: 40000, rate: 16, minPayment: 3000 },
  { id: "card", name: "Credit card", balance: 150000, rate: 36, minPayment: 6000 },
  { id: "personal", name: "Personal loan", balance: 300000, rate: 14, minPayment: 8000 },
];
const EXAMPLE = compareDebtStrategies({ debts: EXAMPLE_DEBTS, extraMonthly: EXAMPLE_EXTRA });
const inr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

function DebtGuide() {
  const { snowball, avalanche } = EXAMPLE;

  return (
    <div className="mt-14 space-y-10">
      <CalcSection title="Snowball vs avalanche, in plain words">
        <p>
          Both strategies pay the minimum on every debt and put every extra rupee on one target
          debt. When that debt is gone, its minimum payment joins the extra amount and rolls onto
          the next target, so the payment you throw at debt keeps growing. The only difference is
          the order.
        </p>
        <p>
          <strong>Snowball</strong> targets the smallest balance first. You clear a whole debt
          sooner, which feels good and keeps many people motivated. <strong>Avalanche</strong>{" "}
          targets the highest interest rate first. It's the cheapest order mathematically, because
          the most expensive money is paid off first.
        </p>
      </CalcSection>

      <CalcSection title="A worked example">
        <p>
          Say you owe {inr(EXAMPLE_DEBTS[0].balance)} on a consumer loan at{" "}
          {EXAMPLE_DEBTS[0].rate}%, {inr(EXAMPLE_DEBTS[1].balance)} on a credit card at{" "}
          {EXAMPLE_DEBTS[1].rate}% and {inr(EXAMPLE_DEBTS[2].balance)} on a personal loan at{" "}
          {EXAMPLE_DEBTS[2].rate}%, with {inr(EXAMPLE.totalMinPayments)} of minimum payments and{" "}
          {inr(EXAMPLE_EXTRA)} extra each month.
        </p>
        <p>
          Snowball clears the consumer loan in month {snowball.payoffMonth.consumer}, an early win,
          and pays {inr(snowball.totalInterest)} in total interest. Avalanche goes after the credit
          card first and pays {inr(avalanche.totalInterest)}, saving {inr(EXAMPLE.interestSaved)}.
          Both are debt-free in {avalanche.months} months. Here the choice comes down to whether
          that early win is worth {inr(EXAMPLE.interestSaved)} to you.
        </p>
      </CalcSection>

      <CalcSection title="Getting out of debt faster">
        <p>
          The extra monthly amount matters far more than the strategy. Even a few thousand rupees
          more each month can cut months off the plan, so try changing it above and watch the
          payoff date move. Stop adding new debt while you pay down the old, especially on credit
          cards, and never pay only the card's minimum due: at 36% or more a year, the balance
          barely moves.
        </p>
        <p>
          Before prepaying a loan, check whether your lender charges a prepayment or foreclosure
          fee. If you're unsure whether to prepay or invest, the{" "}
          <Link to="/verdict/debt-vs-invest" className="font-semibold underline decoration-current/30 underline-offset-2">
            debt vs invest verdict
          </Link>{" "}
          compares both with your own numbers, and the{" "}
          <Link to="/emi-calculator" className="font-semibold underline decoration-current/30 underline-offset-2">
            EMI calculator
          </Link>{" "}
          shows what any loan really costs.
        </p>
        <p>
          To see what different loan sizes cost each month before you borrow again, read{" "}
          <Link to="/blog/emi-for-every-loan-amount" className="font-semibold underline decoration-current/30 underline-offset-2">
            EMI for every loan amount
          </Link>
          . If you're weighing a car loan, the{" "}
          <Link to="/verdict/lease-vs-buy-car" className="font-semibold underline decoration-current/30 underline-offset-2">
            lease vs buy verdict
          </Link>{" "}
          compares the real cost of each. And the{" "}
          <Link to="/financial-health-checkup" className="font-semibold underline decoration-current/30 underline-offset-2">
            financial health checkup
          </Link>{" "}
          shows how your debt load affects your overall financial health score.
        </p>
      </CalcSection>
    </div>
  );
}
