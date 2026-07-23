import WorkspaceHeader from "../ui/WorkspaceHeader";

export default function OverviewView() {
  return (
    <div className="space-y-8">
      <WorkspaceHeader
        title="Workspace"
        subtitle="Your financial command center."
      />

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Welcome to FINAIW
        </h2>

        <p className="mt-3 text-[var(--text-secondary)]">
          Your Workspace is ready. Start by creating your first financial goal.
        </p>
      </div>
    </div>
  );
}