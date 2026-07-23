import {
  addGoal,
  updateGoal,
} from "../../../services/goalEngine";

export default function GoalReviewStep({
  goal,
  back,
  next,
  onComplete,
}) {
  const progress =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round((goal.currentAmount / goal.targetAmount) * 100)
        )
      : 0;

  const handleSaveGoal = () => {
   const goalData = {
  ...goal,

  progress,

  status:
    progress === 0
      ? "Ready"
      : progress >= 100
      ? "Completed"
      : progress >= 75
      ? "On Track"
      : "Growing",

  nextMilestone:
    progress >= 100
      ? "Goal Completed"
      : "Reach the next savings milestone",

  nextAction:
    progress >= 100
      ? "Celebrate your achievement!"
      : "Continue adding money toward this goal.",
};

if (goal.id) {
  updateGoal(goal.id, goalData);
} else {
  addGoal(goalData);
}

    onComplete?.();

    next();
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--text)]">
          Review Goal
        </h2>

        <p className="mt-2 text-[var(--text-secondary)]">
          Review everything before creating your financial journey.
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-[var(--border)] p-6">

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Goal</span>
          <strong>{goal.title}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Category</span>
          <strong>{goal.category}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Current Amount
          </span>
          <strong>
            ₹{goal.currentAmount.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Target Amount
          </span>
          <strong>
            ₹{goal.targetAmount.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Current Progress
          </span>
          <strong>{progress}%</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Target Date
          </span>
          <strong>
            {goal.targetDate || "Not specified"}
          </strong>
        </div>

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={back}
          className="rounded-xl border border-[var(--border)] px-6 py-3"
        >
          Back
        </button>

        <button
          onClick={handleSaveGoal}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          {goal.id ? "Save Changes" : "Create Goal"}
        </button>

      </div>
    </>
  );
}