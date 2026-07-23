import PlanningView from "./views/PlanningView";
import OverviewView from "./views/OverviewView";
import GoalsView from "./views/GoalsView";

export default function WorkspaceContent({
  activeView,
  workspace,
  onCreateGoal,
  onEditGoal,
}) {
  switch (activeView) {
    case "overview":
      return <OverviewView workspace={workspace} />;

    case "goals":
      return (
       <GoalsView
  workspace={workspace}
  onCreateGoal={onCreateGoal}
  onEditGoal={onEditGoal}
/>
      );

   case "planning":
  return <PlanningView workspace={workspace} />;

    case "learning":
      return (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          Learning Module (Coming Soon)
        </div>
      );

    case "insights":
      return (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          Insights Module (Coming Soon)
        </div>
      );

    case "documents":
      return (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          Documents Module (Coming Soon)
        </div>
      );

    case "settings":
      return (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          Settings Module (Coming Soon)
        </div>
      );

    default:
      return (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          Page Not Found
        </div>
      );
  }
}