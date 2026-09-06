import { PiggyBank, CreditCard, TrendingUp, ShoppingBag, Sparkles, Plus, CheckCircle2, Trash2 } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

const CATEGORY_ICON = {
  savings: PiggyBank,
  debt: CreditCard,
  investment: TrendingUp,
  purchase: ShoppingBag,
  other: Sparkles,
};

export default function GoalCard({ goal, onAddMoney, onComplete, onDelete }) {
  const { settings } = useSettings();
  const currency = settings.currency;
  const Icon = CATEGORY_ICON[goal.category] || Sparkles;

  const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-5">
        <ProgressRing value={progress} size={76} strokeWidth={7} color={goal.completed ? "#047857" : "#059669"}>
          <span className="font-mono text-[15px] font-black tabular-nums text-slate-950">{progress}%</span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <Icon size={13} />
            </span>
            <h3 className="truncate text-[16px] font-black text-slate-950">{goal.title}</h3>
          </div>
          {goal.targetDate && (
            <p className="mt-1 text-[12px] font-semibold text-slate-400">
              Target: {new Date(goal.targetDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            </p>
          )}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-[17px] font-black tabular-nums text-slate-950">
              {formatCurrency(goal.currentAmount, currency, settings.compactNumbers)}
            </span>
            <span className="text-[12px] font-bold text-slate-400">of {formatCurrency(goal.targetAmount, currency, settings.compactNumbers)}</span>
          </div>
          {!goal.completed && remaining > 0 && (
            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
              {formatCurrency(remaining, currency)} to go
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {!goal.completed ? (
          <>
            <button
              onClick={() => onAddMoney(goal)}
              className="col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 py-2.5 text-[12px] font-black text-white transition hover:bg-emerald-900"
            >
              <Plus size={14} /> Add
            </button>
            <button
              onClick={() => onComplete(goal)}
              className="col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-[12px] font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              <CheckCircle2 size={14} /> Done
            </button>
          </>
        ) : (
          <span className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-[12px] font-black text-emerald-700">
            <CheckCircle2 size={14} /> Completed
          </span>
        )}
        <button
          onClick={() => onDelete(goal)}
          className="col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2.5 text-[12px] font-black text-rose-600 transition hover:bg-rose-100"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
