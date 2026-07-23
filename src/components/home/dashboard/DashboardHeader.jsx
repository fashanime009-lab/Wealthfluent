import { Sparkles } from "lucide-react";
import { useWorkspace } from "../../../context/WorkspaceContext";

export default function DashboardHeader() {
  const { workspace } = useWorkspace();

  const hasActivity =
    workspace.recentActivity.length > 0 ||
    workspace.goals.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
          {hasActivity
            ? "Welcome back 👋"
            : "Your Financial Workspace 👋"}
        </h2>

        <p className="mt-1.5 text-sm font-medium text-slate-500">
          {hasActivity
            ? "Your latest financial activity is ready."
            : "Start with any calculator to build your workspace."}
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 w-fit self-start rounded-xl bg-emerald-50 px-4 py-2.5 text-[11px] font-black text-emerald-800 ring-1 ring-emerald-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md"
      >
        <Sparkles size={16} />
        AI Assistant
      </button>
    </div>
  );
}