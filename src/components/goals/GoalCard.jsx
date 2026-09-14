import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

export default function GoalCard({ goal, onAddMoney, onComplete, onDelete }) {
  const { settings } = useSettings();
  const currency = settings.currency;

  const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      <div className="flex items-start gap-5">
        <ProgressRing value={progress} size={72} strokeWidth={6} color={goal.completed ? "#047857" : "#047857"}>
          <span className="font-mono-tech text-[14px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">{progress}%</span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15.5px] font-bold text-[#111814] dark:text-[#eef1ec]">{goal.title}</h3>
          {goal.targetDate && (
            <p className="mt-1 text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">
              Target: {new Date(goal.targetDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            </p>
          )}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono-tech text-[16px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
              {formatCurrency(goal.currentAmount, currency, settings.compactNumbers)}
            </span>
            <span className="text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">
              of {formatCurrency(goal.targetAmount, currency, settings.compactNumbers)}
            </span>
          </div>
          {!goal.completed && remaining > 0 && (
            <p className="mt-0.5 text-[11.5px] text-[#111814]/45 dark:text-[#eef1ec]/45">
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
              className="col-span-1 flex items-center justify-center gap-1.5 bg-[#047857] py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#065f46]"
            >
              <Plus size={14} /> Add
            </button>
            <button
              onClick={() => onComplete(goal)}
              className="col-span-1 flex items-center justify-center gap-1.5 border border-[#111814]/15 py-2.5 text-[12px] font-semibold text-[#111814]/70 transition hover:bg-[#111814]/5 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/70 dark:hover:bg-[#eef1ec]/5"
            >
              <CheckCircle2 size={14} /> Done
            </button>
          </>
        ) : (
          <span className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[#047857] dark:text-[#34d399]">
            <CheckCircle2 size={14} /> Completed
          </span>
        )}
        <button
          onClick={() => onDelete(goal)}
          className="col-span-1 flex items-center justify-center gap-1.5 border border-[#9a3412]/30 py-2.5 text-[12px] font-semibold text-[#9a3412] transition hover:bg-[#9a3412]/10 dark:border-[#d9552e]/30 dark:text-[#d9552e] dark:hover:bg-[#d9552e]/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
