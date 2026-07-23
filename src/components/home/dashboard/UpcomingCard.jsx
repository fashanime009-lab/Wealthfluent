import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { getInsights } from "../../../services/insights/insightEngine";

export default function UpcomingCard() {
  const { workspace } = useWorkspace();

  const insight = getInsights(workspace)[0];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <h3 className="text-[11px] font-black text-slate-900">
          Today's Focus
        </h3>

        <Sparkles
          size={15}
          className="text-emerald-600"
        />

      </div>

      {insight ? (
        <>
          <div className="mt-5">

            <div className="text-sm font-bold text-slate-900">
              {insight.title}
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {insight.message}
            </p>

          </div>

          <Link
            to={insight.action}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            {insight.button}
            <ArrowRight size={14} />
          </Link>
        </>
      ) : (
        <div className="mt-6">

          <div className="text-sm font-semibold text-slate-700">
            Everything looks good 🎉
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Your financial workspace doesn't need any immediate attention.
          </p>

        </div>
      )}

    </div>
  );
}