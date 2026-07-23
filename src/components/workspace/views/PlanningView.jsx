import PlanningHealthCard from "../planning/PlanningHealthCard";
import PlanningForecastCard from "../planning/PlanningForecastCard";
import { useMemo, useState } from "react";
import { buildPlanning } from "@/engine/planningEngine";
import PlanningProgressCard from "../planning/PlanningProgressCard";
import PlanningMilestones from "../planning/PlanningMilestones";
export default function PlanningView({ workspace }) {

const goals = workspace?.goals ?? [];

const [selectedGoalId, setSelectedGoalId] = useState(
  goals[0]?.id ?? null
);

const selectedGoal =
  goals.find((goal) => goal.id === selectedGoalId) ??
  goals[0] ??
  null;

const planning = useMemo(
  () =>
    selectedGoal
      ? buildPlanning(selectedGoal)
      : null,
  [selectedGoal]
);
if (!goals.length) {
  return (
    <div className="h-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="text-2xl font-semibold">
        No Goals Found
      </h2>

      <p className="mt-3 text-[var(--text-secondary)]">
        Create your first goal to unlock the Planning workspace.
      </p>
    </div>
  );
}
  return (
    <div className="h-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h1 className="text-3xl font-bold">
  Planning
</h1>

<div className="mt-6">
  <label className="mb-2 block text-sm font-medium">
    Select Goal
  </label>

  <select
    value={selectedGoal?.id ?? ""}
    onChange={(e) => setSelectedGoalId(e.target.value)}
    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
  >
    {goals.map((goal) => (
      <option key={goal.id} value={goal.id}>
        {goal.title}
      </option>
    ))}
  </select>
</div>

<div className="mt-8 grid gap-6 lg:grid-cols-2">
  <PlanningHealthCard health={planning?.health} />

 <PlanningForecastCard
  forecast={planning?.forecast}
/>
</div>
<div className="mt-6">
  <PlanningProgressCard
    goal={selectedGoal}
    overview={planning?.overview}
  />
</div>
<div className="mt-6">
  <PlanningMilestones
    milestones={planning?.milestones}
  />
</div>
    </div>
  );
}