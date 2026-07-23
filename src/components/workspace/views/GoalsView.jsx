import WorkspaceHeader from "../ui/WorkspaceHeader";
import WorkspaceSection from "../ui/WorkspaceSection";

import GoalsSummary from "../sections/GoalsSummary";
import GoalsList from "../sections/GoalsList";

export default function GoalsView({
  workspace,
  onCreateGoal,
  onEditGoal,
}) {
  return (
    <div className="space-y-8">

      <WorkspaceHeader
        title="Goals"
        subtitle="Manage every financial journey."
        action={
          <button
            onClick={onCreateGoal}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700 active:scale-95"
          >
            + Create Goal
          </button>
        }
      />

      <WorkspaceSection
        title="Goals Overview"
        description="Your overall financial journey."
      >
        <GoalsSummary workspace={workspace} />
      </WorkspaceSection>

      <WorkspaceSection
        title="Active Goals"
        description="Continue working toward your financial milestones."
      >
        <GoalsList
  workspace={workspace}
  onEditGoal={onEditGoal}
/>
      </WorkspaceSection>

    </div>
  );
}