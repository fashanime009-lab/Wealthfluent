export default function PlanningMilestones({ milestones }) {
  if (!milestones?.length) return null;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Milestones
        </h2>

        <span className="text-sm text-[var(--text-secondary)]">
          {milestones.length} Milestones
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="flex flex-1 flex-col items-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all
                ${
                  milestone.achieved
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
                }`}
              >
                {milestone.percent}%
              </div>

              <p className="mt-3 text-center text-sm font-medium text-[var(--text)]">
                ₹{milestone.targetAmount.toLocaleString()}
              </p>

              <p className="mt-1 text-center text-xs text-[var(--text-secondary)]">
                {milestone.remaining.toLocaleString()} remaining
              </p>

              {index !== milestones.length - 1 && (
                <div className="mt-4 h-px w-full bg-[var(--border)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}