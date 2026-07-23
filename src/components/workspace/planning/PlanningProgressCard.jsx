export default function PlanningProgressCard({
  goal,
  overview,
}) {
  if (!goal || !overview) return null;

  const progress = overview.progress ?? 0;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Savings Progress
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {progress}%
        </span>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Saved
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--text)]">
            ₹{goal.currentAmount?.toLocaleString() ?? 0}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Remaining
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--text)]">
            ₹{overview.remainingAmount?.toLocaleString() ?? 0}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Target
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--text)]">
            ₹{goal.targetAmount?.toLocaleString() ?? 0}
          </p>
        </div>

      </div>
    </div>
  );
}