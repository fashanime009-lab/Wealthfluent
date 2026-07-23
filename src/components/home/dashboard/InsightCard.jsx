import { useMemo } from "react";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { getInsights } from "../../../services/insights/insightEngine";

const ICONS = {
  success: "✅",
  warning: "⚠️",
  info: "💡",
};

const COLORS = {
  success: "border-emerald-200 bg-emerald-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-sky-200 bg-sky-50",
};

export default function InsightCard() {
  const { workspace } = useWorkspace();

  const insights = useMemo(
    () => getInsights(workspace),
    [workspace]
  );

  const insight = insights[0];

  if (!insight) return null;

  return (
    <div className="rounded-2xl border p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-900">
          Today's Insight
        </h3>

        <span className="text-xl">
          {ICONS[insight.type]}
        </span>
      </div>

      <div
        className={`mt-4 rounded-xl border p-4 ${COLORS[insight.type]}`}
      >
        <p className="font-bold text-slate-800">
          {insight.title}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {insight.message}
        </p>
      </div>
    </div>
  );
}