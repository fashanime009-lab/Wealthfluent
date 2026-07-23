import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { Link } from "react-router-dom";
import { getGoalSummary } from "../../../services/goalEngine";

export default function GoalRing() {
  const { workspace } = useWorkspace();
  const [showBreakdown, setShowBreakdown] = useState(false);

const summary = useMemo(
  () => getGoalSummary(workspace.goals),
  [workspace.goals]
);

  

  if (summary.total === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
<h3 className="text-[11px] font-black text-slate-900">
  Goal Progress
</h3>

        <div className="mt-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-slate-300 text-2xl">
            🎯
          </div>

          <h4 className="mt-4 text-lg font-bold text-slate-800">
            No Goals Yet
          </h4>

          <p className="mt-2 mx-auto max-w-xs text-sm leading-6 text-slate-500">
            Create your first financial goal to start tracking your progress.
          </p>

          <Link
            to="/goal-planner"
            className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Create First Goal
          </Link>
        </div>
      </div>
    );
  }

  const progress = summary.averageProgress;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
     <div className="flex items-center justify-between">
  <h3 className="text-xs font-black text-slate-900">
    Goal Progress
  </h3>

  <div
    className="relative"
    onMouseEnter={() => setShowBreakdown(true)}
    onMouseLeave={() => setShowBreakdown(false)}
  >
    <button className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
      <Info className="h-4 w-4" />
    </button>

    {showBreakdown && (
      <div className="absolute right-0 top-7 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        <h4 className="text-base font-bold text-slate-900">
          Goal Breakdown
        </h4>

        <div className="mt-4 space-y-4">
         {workspace.goals.map((goal) => {
  const progress =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round(
            (goal.currentAmount / goal.targetAmount) * 100
          )
        )
      : 0;

  return (
    <div key={goal.id}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {goal.title}
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {progress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
})}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            {workspace.goals.length} goal
            {workspace.goals.length !== 1 ? "s" : ""} being tracked
          </p>
        </div>
      </div>
    )}
  </div>
</div>

      <div className="mt-5 flex flex-col items-center">
        <div
  className="relative grid h-[86px] w-[86px] place-items-center rounded-full transition-all duration-700"
          style={{
            background: `conic-gradient(
  #059669 0 ${Math.min(progress, 70)}%,
  #f59e0b ${Math.min(progress, 85)}%,
  #d946ef ${progress}%,
  #e2e8f0 ${progress}% 100%
)`,
          }}
        >
          <div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-white text-[22px] font-black text-slate-900">
            {progress}%
          </div>
        </div>



      </div>
      <div className="mt-5 w-full text-center">
  <h4 className="text-base font-bold text-slate-900">
  {summary.total} Active Goal{summary.total !== 1 ? "s" : ""}
</h4>

  <p className="mt-1 text-sm text-slate-500">
  Average Progress Across All Goals
</p>

  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <div
      className="h-full rounded-full bg-emerald-600 transition-all duration-700"
      style={{
        width: `${progress}%`,
      }}
    />
 <div className="mt-4 space-y-2">
  {workspace.goals.map((goal) => {
    const progress =
      goal.targetAmount > 0
        ? Math.min(
            100,
            Math.round(
              (goal.currentAmount / goal.targetAmount) * 100
            )
          )
        : 0;

    return (
      <div
        key={goal.id}
        className="flex items-center justify-between text-xs"
      >
        <span className="text-slate-600">
          {goal.title}
        </span>

        <span className="font-semibold text-slate-900">
          {progress}%
        </span>
      </div>
    );
  })}
</div>
  </div>

  <div className="mt-4 flex items-center justify-between text-xs font-semibold">
    <span className="text-slate-500">
      Goals Completed
    </span>

    <span className="text-slate-900">
      {summary.completed} / {summary.total}
    </span>
  </div>

  <div className="mt-2 flex items-center justify-between text-xs font-semibold">
    <span className="text-slate-500">
      Status
    </span>

    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
      {progress >= 75
  ? "Excellent"
  : progress >= 50
  ? "On Track"
  : progress >= 25
  ? "Needs Attention"
  : "Just Started"}
    </span>
  </div>
</div>
    </div>
  );
}