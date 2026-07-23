import WorkspaceCard from "../ui/WorkspaceCard";
import WorkspaceMetric from "../ui/WorkspaceMetric";

export default function GoalsSummary() {
  return (
    <WorkspaceCard>

      <div className="text-center">

        <p className="text-6xl font-bold">
          61%
        </p>

        <p className="mt-3 text-[var(--text-secondary)]">
          Overall Journey Progress
        </p>

      </div>

      <div className="mt-8 h-3 overflow-hidden rounded-full bg-[var(--bg-secondary)]">

        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: "61%" }}
        />

      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        <WorkspaceMetric
          label="Active Goals"
          value="4"
        />

        <WorkspaceMetric
          label="Completed"
          value="3"
        />

        <WorkspaceMetric
          label="Journey Status"
          value="Growing"
        />

        <WorkspaceMetric
          label="Next Milestone"
          value="Emergency Fund"
        />

      </div>

    </WorkspaceCard>
  );
}