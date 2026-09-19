import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { compareDebtStrategies } from "@/services/tools/debtPayoffStrategy";
import { TOOL_TONES } from "@/data/toolTones";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { currencies } from "@/data/currencies";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const tone = TOOL_TONES.debtStrategy;
const STORAGE_KEY = "finaiw-debt-payoff-planner";

const FAQ_ITEMS = [
  { q: "Why do snowball and avalanche sometimes take the same number of months?", a: "When your extra payment is large relative to your balances, both strategies clear everything at close to the same pace — the difference is mainly in total interest paid, and in which debt disappears first (a real psychological factor snowball is built around)." },
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
        <span className="text-[13px] font-semibold" style={{ color: tone.light }}>
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

        <VerdictFAQ items={FAQ_ITEMS} className="mt-14" />
      </div>
    </div>
  );
}

function ExtraPaymentInput({ extraMonthly, setExtraMonthly, symbol }) {
  return (
    <div className="mt-10 border-l-4 p-6" style={{ borderColor: tone.bright, backgroundColor: tone.panel }}>
      <label className="text-[12px] font-semibold" style={{ color: tone.bright }}>
        Extra monthly amount available, beyond everyone's minimum
      </label>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono-tech text-[22px] font-medium text-[#eef1ec]">{symbol}</span>
        <input
          type="number"
          value={extraMonthly}
          onChange={(e) => setExtraMonthly(Math.max(0, Number(e.target.value) || 0))}
          className="font-mono-tech w-40 border-b border-[#eef1ec]/25 bg-transparent text-[22px] font-medium tabular-nums text-[#eef1ec] outline-none"
        />
      </div>
      <input
        type="range"
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
          className="text-[13px] font-semibold"
          style={{ color: tone.light }}
        >
          + Add a debt
        </button>
      </div>

      {debts.length === 0 && (
        <p className="mt-4 border border-[#111814]/12 p-6 text-center text-[13px] text-[#111814]/45 dark:border-[#eef1ec]/12 dark:text-[#eef1ec]/45">
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
                <p className="text-[12px] text-[#111814]/50 dark:text-[#eef1ec]/50">
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
  return (
    <div>
      <label className="text-[12px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">{label}</label>
      <input
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
      <p className={`mt-1 text-[12.5px] ${highlight ? "text-[#eef1ec]/55" : "text-[#111814]/50 dark:text-[#eef1ec]/50"}`}>{sub}</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className={`font-mono-tech text-[20px] font-medium tabular-nums ${highlight ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
            {strategy.months ?? "50+ yrs"}
          </p>
          <p className={`text-[11.5px] ${highlight ? "text-[#eef1ec]/50" : "text-[#111814]/45 dark:text-[#eef1ec]/45"}`}>months to debt-free</p>
        </div>
        <div>
          <p className={`font-mono-tech text-[20px] font-medium tabular-nums ${highlight ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
            {fmt(strategy.totalInterest)}
          </p>
          <p className={`text-[11.5px] ${highlight ? "text-[#eef1ec]/50" : "text-[#111814]/45 dark:text-[#eef1ec]/45"}`}>total interest paid</p>
        </div>
      </div>

      <div className="mt-5 border-t pt-4" style={{ borderColor: highlight ? "rgba(238,241,236,0.12)" : "rgba(17,24,20,0.1)" }}>
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${highlight ? "text-[#eef1ec]/45" : "text-[#111814]/40 dark:text-[#eef1ec]/40"}`}>
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
      <p className="mt-2 max-w-[62ch] text-[13px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
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
