import { CheckCircle2 } from "lucide-react";

export default function GoalSuccessStep({
  goal,
  onClose,
}) {
  return (
    <div className="py-12 text-center">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <h2 className="mt-8 text-3xl font-bold text-[var(--text)]">
        Goal Created Successfully!
      </h2>

      <p className="mt-4 text-[var(--text-secondary)]">
        <strong>{goal.title}</strong> has been added to your financial journey.
      </p>

      <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">

        <div className="flex justify-between py-2">
          <span className="text-[var(--text-secondary)]">Goal</span>
          <strong>{goal.title}</strong>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-[var(--text-secondary)]">Current Amount</span>
          <strong>₹{goal.currentAmount.toLocaleString()}</strong>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-[var(--text-secondary)]">Target Amount</span>
          <strong>₹{goal.targetAmount.toLocaleString()}</strong>
        </div>

      </div>

      <button
        onClick={onClose}
        className="mt-10 rounded-2xl bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Go to Workspace
      </button>

    </div>
  );
}