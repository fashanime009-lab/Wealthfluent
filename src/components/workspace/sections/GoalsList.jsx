import GoalCard from "./GoalCard";


export default function GoalsList({
  workspace,
  onEditGoal,
}) {
  const goals = workspace?.goals ?? [];

  if (!goals.length) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border)] p-12 text-center">
      <h3 className="text-xl font-semibold text-[var(--text)]">
        No goals yet
      </h3>

      <p className="mt-3 text-[var(--text-secondary)]">
        Create your first financial goal to begin your journey.
      </p>
    </div>
  );
}

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {goals.map((goal) => (
       <GoalCard
  key={goal.id}
  goal={goal}
  onEditGoal={onEditGoal}
/>
      ))}
    </div>
  );
}