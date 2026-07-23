import { useMemo } from "react";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { buildTimeline } from "../../../services/timeline/timelineEngine";

export default function TimelineCard() {
  const { workspace } = useWorkspace();

  const timeline = useMemo(
    () => buildTimeline(workspace),
    [workspace]
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold text-slate-900">
          Financial Journey
        </h3>

        <span className="text-xs font-semibold text-slate-400">
          Latest Events
        </span>

      </div>

      {timeline.length === 0 ? (
        <div className="mt-8 text-center">

          <div className="text-4xl">
            📈
          </div>

          <p className="mt-4 font-semibold text-slate-700">
            Your journey starts here.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Use calculators to build your financial timeline.
          </p>

        </div>
      ) : (
        <div className="mt-6 space-y-5">

          {timeline.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
            />
          ))}

        </div>
      )}

    </div>
  );
}

function TimelineItem({ item }) {
  return (
    <div className="flex gap-4">

      <div className="flex flex-col items-center">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg">
          {item.icon}
        </div>

        <div className="mt-2 h-full w-px bg-slate-200" />

      </div>

      <div className="flex-1 pb-6">

        <div className="font-semibold text-slate-900">
          {item.title}
        </div>

        <div className="mt-1 text-sm text-slate-500">
          {item.description || "Financial activity recorded."}
        </div>

        <div className="mt-2 text-xs text-slate-400">
          {new Date(item.date).toLocaleDateString()}
        </div>

      </div>

    </div>
  );
}