import { useEffect, useId, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { monthsUntil, monthsToReach, compareStrategies } from "@/engine/goalOptimizerEngine";
import { TOOL_TONES } from "@/data/toolTones";
import { TONE_COLOR } from "@/components/verdict/palette";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { currencies } from "@/data/currencies";

const tone = TOOL_TONES.goalPlanner;
const STORAGE_KEY = "finaiw-goal-optimizer";

const RISK_LABELS = { conservative: "Conservative (5%)", moderate: "Moderate (9%)", aggressive: "Aggressive (13%)" };
const STRATEGY_META = {
  equal: { label: "Equal split", note: "Same amount to every goal, regardless of what it needs." },
  priority: { label: "Priority order", note: "Fully funds your single most important goal first, then the next." },
  optimized: { label: "Optimized", note: "Provably maximizes how much of your priorities get funded for this budget." },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function defaultDate(monthsAhead) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  return d.toISOString().slice(0, 10);
}

function emptyGoal() {
  return {
    id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    targetAmount: 500000,
    currentAmount: 0,
    targetDate: defaultDate(24),
    importance: 3,
    riskProfile: "moderate",
  };
}

export default function FinancialGoalPlannerPage() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const symbol = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  const [goals, setGoals] = useState(() => load()?.goals || []);
  const [budget, setBudget] = useState(() => load()?.budget ?? 30000);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goals, budget }));
  }, [goals, budget]);

  const goalsWithMonths = useMemo(
    () => goals.map((g) => ({ ...g, months: monthsUntil(g.targetDate) || 1 })),
    [goals]
  );

  const comparison = useMemo(
    () => (goalsWithMonths.length ? compareStrategies(goalsWithMonths, budget) : null),
    [goalsWithMonths, budget]
  );

  const addGoal = () => {
    const g = emptyGoal();
    setGoals((gs) => [...gs, g]);
    setEditingId(g.id);
  };

  const updateGoal = (id, patch) => setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  const removeGoal = (id) => setGoals((gs) => gs.filter((g) => g.id !== id));

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Financial Goal Planner — Multi-Goal Budget Optimizer"
        description="Build your own set of goals and a monthly budget, and see the provably-optimal way to split that budget across them — a real fractional-knapsack optimizer, compared against naive strategies."
        path="/financial-goal-planner"
        keywords="financial goal planner, goal optimizer, budget allocation tool, multi-goal planning"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Financial Goal Planner", path: "/financial-goal-planner" },
        ])}
      />

      <div className="mx-auto max-w-[920px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
          Tool, not a calculator
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
          Financial Goal Planner
        </h1>
        <p className="mt-4 max-w-[64ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Build your own goals here, set what you can actually put toward them each month, and this
          runs a real fractional-knapsack optimizer — the same allocation model used in resource
          planning — to find the split of your budget that gets you the most of what you said
          matters. It's compared against two naive strategies so you can see exactly how much better
          it does, not just told to trust it.
        </p>

        <BudgetInput budget={budget} setBudget={setBudget} symbol={symbol} />

        <GoalBuilder
          goals={goalsWithMonths}
          editingId={editingId}
          setEditingId={setEditingId}
          onAdd={addGoal}
          onUpdate={updateGoal}
          onRemove={removeGoal}
          fmt={fmt}
        />

        {comparison && (
          <>
            <StrategyComparison comparison={comparison} />
            <OptimizedBreakdown allocations={comparison.optimized.allocations} fmt={fmt} />
          </>
        )}

        <Methodology />
      </div>
    </div>
  );
}

function BudgetInput({ budget, setBudget, symbol }) {
  const id = useId();
  return (
    <div className="mt-10 border-l-4 p-6" style={{ borderColor: tone.bright, backgroundColor: tone.panel }}>
      <label htmlFor={id} className="text-[12px] font-semibold" style={{ color: tone.bright }}>
        Monthly budget available for goals
      </label>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono-tech text-[22px] text-[#eef1ec]/50">{symbol}</span>
        <input
          id={id}
          type="number"
          min={0}
          step={500}
          value={budget}
          onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
          className="font-mono-tech w-full max-w-[220px] border-b border-[#eef1ec]/25 bg-transparent pb-1 text-[28px] font-medium tabular-nums text-[#eef1ec] outline-none focus:border-[#eef1ec]/60"
        />
      </div>
      <p className="mt-2 text-[12.5px] text-[#eef1ec]/50">
        Enter this directly — a fixed number you know you can commit every month, not pulled from
        anywhere else.
      </p>
    </div>
  );
}

function GoalBuilder({ goals, editingId, setEditingId, onAdd, onUpdate, onRemove, fmt }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">Your goals</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center px-4 text-[13px] font-semibold text-white transition"
          style={{ backgroundColor: tone.light }}
        >
          Add a goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="mt-5 border border-dashed border-[#111814]/20 px-5 py-8 text-center text-[13.5px] text-[#111814]/60 dark:border-[#eef1ec]/20 dark:text-[#eef1ec]/55">
          No goals yet — add one to see how the optimizer would split your budget.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {goals.map((goal) =>
            editingId === goal.id ? (
              <GoalEditor
                key={goal.id}
                goal={goal}
                onChange={(patch) => onUpdate(goal.id, patch)}
                onDone={() => setEditingId(null)}
                onRemove={() => {
                  onRemove(goal.id);
                  setEditingId(null);
                }}
              />
            ) : (
              <GoalSummaryRow key={goal.id} goal={goal} fmt={fmt} onEdit={() => setEditingId(goal.id)} />
            )
          )}
        </div>
      )}
    </div>
  );
}

function GoalSummaryRow({ goal, fmt, onEdit }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full flex-col gap-2 border border-[#111814]/15 p-4 text-left transition hover:border-[#111814]/30 dark:border-[#eef1ec]/15 dark:hover:border-[#eef1ec]/30 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="font-display text-[14.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
          {goal.name || "Untitled goal"}
        </p>
        <p className="mt-0.5 text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/55">
          {fmt(goal.currentAmount)} of {fmt(goal.targetAmount)} · {goal.months} mo · {RISK_LABELS[goal.riskProfile]}
        </p>
      </div>
      <ImportanceDots value={goal.importance} readOnly />
    </button>
  );
}

function GoalEditor({ goal, onChange, onDone, onRemove }) {
  const id = useId();
  const inputClass =
    "mt-1.5 w-full border border-[#111814]/15 bg-transparent px-3 py-2.5 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
  const labelClass = "text-[12px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/60";

  return (
    <div className="border p-5" style={{ borderColor: tone.light }}>
      <div>
        <label htmlFor={`${id}-name`} className={labelClass}>Goal name</label>
        <input
          id={`${id}-name`}
          type="text"
          value={goal.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Down payment for a house"
          className="mt-1.5 w-full border border-[#111814]/15 bg-transparent px-3 py-2.5 text-[14px] text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-target`} className={labelClass}>Target amount</label>
          <input
            id={`${id}-target`}
            type="number"
            min={0}
            value={goal.targetAmount}
            onChange={(e) => onChange({ targetAmount: Number(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-saved`} className={labelClass}>Already saved</label>
          <input
            id={`${id}-saved`}
            type="number"
            min={0}
            value={goal.currentAmount}
            onChange={(e) => onChange({ currentAmount: Number(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-date`} className={labelClass}>Target date</label>
          <input
            id={`${id}-date`}
            type="date"
            value={goal.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-growth`} className={labelClass}>Assumed growth</label>
          <select
            id={`${id}-growth`}
            value={goal.riskProfile}
            onChange={(e) => onChange({ riskProfile: e.target.value })}
            className={inputClass}
          >
            {Object.entries(RISK_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>How much does this matter to you?</label>
        <div className="mt-2">
          <ImportanceDots value={goal.importance} onChange={(v) => onChange({ importance: v })} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#111814]/10 pt-4 dark:border-[#eef1ec]/10">
        <button type="button" onClick={onRemove} className="text-[12.5px] font-semibold text-[#9a3412] dark:text-[#d9552e]">
          Remove goal
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-9 items-center px-4 text-[12.5px] font-semibold text-white"
          style={{ backgroundColor: tone.light }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function ImportanceDots({ value, onChange, readOnly }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(n);
          }}
          aria-label={`Importance ${n} of 5`}
          className={`h-3 w-3 rounded-full border-[1.5px] transition ${
            n <= value ? "" : "border-[#111814]/30 dark:border-[#eef1ec]/30"
          }`}
          style={
            n <= value
              ? { backgroundColor: tone.light, borderColor: tone.light, cursor: readOnly ? "default" : "pointer" }
              : { cursor: readOnly ? "default" : "pointer" }
          }
        />
      ))}
    </div>
  );
}

function StrategyComparison({ comparison }) {
  const order = ["equal", "priority", "optimized"];
  return (
    <div className="mt-14">
      <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">
        Three ways to split your budget
      </h2>
      <p className="mt-1.5 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
        Same goals, same money — scored by how much of what you said matters actually gets funded.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {order.map((key) => {
          const strat = comparison[key];
          const meta = STRATEGY_META[key];
          const fundedCount = strat.allocations.filter((g) => g.allocated >= g.requiredMonthly - 0.5).length;
          const isBest = key === "optimized";
          return (
            <div
              key={key}
              className="p-5"
              style={isBest ? { border: `1.5px solid ${tone.light}` } : { border: "1px solid rgba(17,24,20,0.15)" }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: isBest ? tone.light : undefined }}
                >
                  {meta.label}
                </span>
                <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                  {strat.score}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-[#111814]/10 dark:bg-[#eef1ec]/10">
                <div
                  className="h-full"
                  style={{ width: `${strat.score}%`, backgroundColor: isBest ? tone.light : "#111814" }}
                />
              </div>
              <p className="mt-3 text-[12.5px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">{meta.note}</p>
              <p className="mt-2 text-[12px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/50">
                {fundedCount} of {strat.allocations.length} goals fully funded
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptimizedBreakdown({ allocations, fmt }) {
  return (
    <div className="mt-14">
      <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">
        Your optimized plan, per goal
      </h2>
      <div className="mt-5 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {allocations.map((g) => (
          <GoalPlanRow key={g.id} goal={g} fmt={fmt} />
        ))}
      </div>
    </div>
  );
}

function GoalPlanRow({ goal, fmt }) {
  const funded = goal.allocated >= goal.requiredMonthly - 0.5;
  const statusTone = funded ? TONE_COLOR.go : TONE_COLOR.caution;
  const reachMonths = monthsToReach(goal.currentAmount, goal.targetAmount, goal.allocated, goal.rate);
  const reachLabel =
    reachMonths === Infinity ? "not reachable at this pace" : reachMonths <= goal.months ? `on track, ~${reachMonths} mo` : `~${reachMonths} mo (later than planned)`;

  return (
    <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8">
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">
          {goal.name || "Untitled goal"}
        </h3>
        <p className="mt-1 text-[12.5px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">
          {fmt(goal.currentAmount)} of {fmt(goal.targetAmount)} · needs {fmt(goal.requiredMonthly)}/mo to hit its {goal.months}-mo target
        </p>
      </div>
      <div className="min-w-0 sm:text-right">
        <p className="font-mono-tech text-[15px] tabular-nums text-[#111814] dark:text-[#eef1ec]">
          {fmt(goal.allocated)}<span className="text-[#111814]/60 dark:text-[#eef1ec]/50">/mo allocated</span>
        </p>
        <p className="tone-text mt-1 text-[12.5px] font-semibold" style={{ "--tone-l": statusTone.light, "--tone-d": statusTone.dark }}>
          {reachLabel}
        </p>
      </div>
    </div>
  );
}

function Methodology() {
  return (
    <div className="mt-14 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">How this is computed</h2>
      <p className="mt-2 max-w-[64ch] text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
        Each goal's required monthly contribution is solved from its remaining amount, time left,
        and assumed growth rate (5% conservative, 9% moderate, 13% aggressive). The optimized
        strategy is a fractional-knapsack allocation: goals are ranked by "density" — importance x
        urgency, divided by what they actually cost to fund per month — and funded completely in
        that order until the budget runs out. This is a provably-optimal split for the stated
        budget: no other way to divide the same money across the same goals scores higher on
        weighted satisfaction. This is a planning model based on the numbers you enter, not
        personalized financial advice.
      </p>
    </div>
  );
}
