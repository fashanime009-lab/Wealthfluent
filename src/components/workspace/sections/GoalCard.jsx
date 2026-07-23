import { ArrowRight, Flag, Target, TrendingUp } from "lucide-react";
import { buildJourney } from "../../../engine";
import ActionMenu from "../ui/ActionMenu";
import { deleteGoal } from "../../../services/goalEngine";

export default function GoalCard({
  goal,
  onEditGoal,
}) {
  const {
    title = "Untitled Goal",
    progress = 0,
    currentAmount = 0,
    targetAmount = 0,
    nextMilestone = "First Milestone",
    nextAction = "Review your plan",
  } = goal;

  const remaining = Math.max(targetAmount - currentAmount, 0);
  const journey = buildJourney(goal);
const { health } = journey;

 

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10">
            <Target className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              {title}
            </h3>

            <p className="text-sm text-[var(--text-secondary)]">
              Financial Journey
            </p>
          </div>

        </div>

       <ActionMenu
  items={[
    {
      label: "Continue Journey",
      onClick: () => {
        console.log("Continue Journey", goal.id);
      },
    },
   {
  label: "Edit Goal",
  onClick: () => {
    onEditGoal?.(goal);
  },
},
    {
      label: "Pause Goal",
      onClick: () => {
        console.log("Pause Goal", goal.id);
      },
    },
    {
      label: "Archive Goal",
      onClick: () => {
        console.log("Archive Goal", goal.id);
      },
    },
 {
  label: "Delete Goal",
  danger: true,
  onClick: () => {
    const confirmed = window.confirm(
      `Delete "${goal.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    deleteGoal(goal.id);
  },
}
  ]}
/>

      </div>

      {/* Progress */}
      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-[var(--text-secondary)]">
            Progress
          </span>

          <span className="font-semibold text-[var(--text)]">
            {progress}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-5">

        <div className="rounded-2xl bg-[var(--bg-secondary)] p-4">

          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <TrendingUp size={16} />
            Saved
          </div>

          <p className="mt-2 text-xl font-bold text-[var(--text)]">
            ₹{currentAmount.toLocaleString()}
          </p>

        </div>

        <div className="rounded-2xl bg-[var(--bg-secondary)] p-4">

          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Target size={16} />
            Target
          </div>

          <p className="mt-2 text-xl font-bold text-[var(--text)]">
            ₹{targetAmount.toLocaleString()}
          </p>

        </div>

      </div>

      {/* Remaining */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] p-4">

        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Flag size={16} />
          Remaining
        </div>

        <p className="mt-2 text-lg font-semibold text-[var(--text)]">
          ₹{remaining.toLocaleString()}
        </p>

      </div>

      {/* Next Milestone */}
      <div className="mt-6 rounded-2xl bg-blue-600/10 p-4">

        <p className="text-xs uppercase tracking-wider text-blue-600">
          NEXT MILESTONE
        </p>

        <p className="mt-2 font-semibold text-[var(--text)]">
          {nextMilestone}
        </p>

      </div>

{/* Financial Health */}
<div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
  <div className="flex items-center justify-between">
    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
      FINANCIAL HEALTH
    </p>

    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
      {health.score}/100
    </span>
  </div>

  <h4 className="mt-3 text-lg font-semibold text-[var(--text)]">
    {health.status}
  </h4>

  <p className="mt-2 text-sm text-[var(--text-secondary)]">
    {health.reason}
  </p>

  <p className="mt-4 text-sm font-medium text-emerald-600">
    Next: {health.nextAction}
  </p>
</div>

      {/* AI Recommendation */}
      <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          AI NEXT ACTION
        </p>

        <p className="mt-2 text-sm text-[var(--text)]">
          {nextAction}
        </p>

      </div>

      {/* Footer */}
      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-medium text-white transition hover:opacity-90">
        Continue Journey
        <ArrowRight size={18} />
      </button>

    </div>
  );
}