import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWorkspace } from "../../../context/WorkspaceContext";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Clock3,
  PiggyBank,
  ShieldCheck,
  Target,
  Wallet,
} from "lucide-react";

const activityRoutes = {
  sip: "/sip-calculator",
  emi: "/emi-calculator",
  fd: "/fd-calculator",
  fire: "/fire-calculator",
  retirement: "/retirement-calculator",
  netWorth: "/networth-calculator",
  emergencyFund: "/emergency-fund-calculator",
  goal: "/goal-planner",
};

function formatActivityDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function getActivityMeta(activity = {}) {
  const title = String(activity.title || activity.type || "").toLowerCase();
  const type = String(activity.type || "").toLowerCase();

  if (title.includes("net worth") || type.includes("networth")) {
    return {
      icon: Wallet,
      href: activityRoutes.netWorth,
      label: "Wealth",
      accent: "bg-sky-50 text-sky-700 ring-sky-100",
      dot: "bg-sky-500",
    };
  }

  if (title.includes("retirement") || type.includes("retirement")) {
    return {
      icon: PiggyBank,
      href: activityRoutes.retirement,
      label: "Planning",
      accent: "bg-violet-50 text-violet-700 ring-violet-100",
      dot: "bg-violet-500",
    };
  }

  if (title.includes("emergency") || type.includes("emergency")) {
    return {
      icon: ShieldCheck,
      href: activityRoutes.emergencyFund,
      label: "Safety",
      accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-500",
    };
  }

  if (title.includes("goal") || type.includes("goal")) {
    return {
      icon: Target,
      href: activityRoutes.goal,
      label: "Goal",
      accent: "bg-orange-50 text-orange-700 ring-orange-100",
      dot: "bg-orange-500",
    };
  }

  return {
    icon: Calculator,
    href: activityRoutes[type] || "/calculators",
    label: "Tool",
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
  };
}

function ActivityRow({ activity, featured = false }) {
  const meta = getActivityMeta(activity);
  const Icon = meta.icon;

  return (
    <Link
      to={meta.href}
      className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-slate-200/75 bg-white transition duration-300 hover:border-emerald-100 hover:bg-emerald-50/35 hover:shadow-[0_14px_34px_rgba(15,23,42,.06)] ${
        featured ? "px-4 py-4" : "px-3.5 py-3"
      }`}
    >
      <span className={`grid shrink-0 place-items-center rounded-2xl ring-1 ${meta.accent} ${featured ? "h-11 w-11" : "h-10 w-10"}`}>
        <Icon size={featured ? 19 : 17} strokeWidth={2} />
      </span>

      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          <span className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            {meta.label}
          </span>
        </span>
        <span className="mt-1.5 block truncate text-[13px] font-black text-slate-950">
          {activity.title || "Financial activity"}
        </span>
        <span className="mt-1 block truncate text-[13px] font-black text-emerald-700">
          {activity.value || "Updated"}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-2 text-[11px] font-semibold text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Clock3 size={12} />
          {formatActivityDate(activity.date)}
        </span>
        <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" size={15} />
      </span>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-6 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white text-emerald-700 ring-1 ring-emerald-100">
        <Calculator size={20} />
      </span>
      <h3 className="mt-4 text-sm font-black text-slate-950">No recent activity yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Use any calculator and your latest work will appear here.
      </p>
      <Link
        to="/calculators"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(4,120,87,.2)] transition hover:bg-emerald-800"
      >
        Explore Calculators
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function RecentActivity() {
  const [expanded, setExpanded] = useState(false);
  const { workspace } = useWorkspace();

  const activities = useMemo(() => {
    return [...(workspace?.recentActivity || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [workspace?.recentActivity]);

  const primaryActivities = activities.slice(0, 3);
  const expandedActivities = activities.slice(3, 9);
  const hasMore = activities.length > 3;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl bg-white/95 shadow-[0_14px_36px_rgba(15,23,42,.045)] ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50/35 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Clock3 size={18} />
          </span>
          <span>
            <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Activity timeline
            </span>
            <span className="mt-1 block text-sm font-black text-slate-950">
              Continue your latest work
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-slate-500 ring-1 ring-slate-200">
            {activities.length || 0} saved
          </span>
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-[11px] font-black text-white shadow-[0_12px_24px_rgba(15,23,42,.12)] transition hover:bg-emerald-800"
            >
              {expanded ? "Show Less" : "Show More"}
              <ChevronDown className={`transition ${expanded ? "rotate-180" : ""}`} size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {activities.length ? (
          <div className="grid gap-3">
            <div className="grid gap-3 xl:grid-cols-3">
              {primaryActivities.map((activity, index) => (
                <ActivityRow key={activity.id} activity={activity} featured={index === 0} />
              ))}
            </div>

            {expanded && expandedActivities.length > 0 && (
              <div className="grid gap-3 border-t border-slate-100 pt-3 md:grid-cols-2">
                {expandedActivities.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
