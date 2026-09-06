import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, TrendingUp, Target } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { INSIGHT_CARDS } from "@/data/insights";
import { getPersonalGoals } from "@/services/personalGoals";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

// Real personalized insights computed from the user's actual saved goals —
// not fabricated. Returns null (renders nothing) if there's no real data
// to derive an insight from, rather than showing a fake placeholder.
function buildPersonalInsights(goals, fmt) {
  const active = goals.filter((g) => !g.completed);
  if (active.length === 0) return [];

  const insights = [];
  const totalTarget = active.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  const totalCurrent = active.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  const avgProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  insights.push({
    id: "goal-summary",
    stat: `${active.length}`,
    headline: `You have ${active.length} active goal${active.length === 1 ? "" : "s"} worth ${fmt(totalTarget)} combined`,
    detail: `Across everything you've saved, you're currently ${avgProgress}% of the way to your combined targets — ${fmt(totalCurrent)} of ${fmt(totalTarget)}.`,
    tool: { label: "View your goals", to: "/goals" },
  });

  const weakest = [...active].sort((a, b) => {
    const pa = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 1;
    const pb = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 1;
    return pa - pb;
  })[0];

  if (weakest && weakest.targetAmount > 0) {
    const pct = Math.round((weakest.currentAmount / weakest.targetAmount) * 100);
    insights.push({
      id: "weakest-goal",
      stat: `${pct}%`,
      headline: `"${weakest.title}" is your least-funded goal at ${pct}%`,
      detail: `${fmt(weakest.currentAmount)} of ${fmt(weakest.targetAmount)} — worth adding to next.`,
      tool: { label: "Revisit this goal", to: "/goals" },
    });
  }

  return insights;
}

export default function InsightsPage() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const [personal, setPersonal] = useState([]);

  useEffect(() => {
    const refresh = () => setPersonal(buildPersonalInsights(getPersonalGoals(), fmt));
    refresh();
    window.addEventListener("finaiw:personal-goals-updated", refresh);
    return () => window.removeEventListener("finaiw:personal-goals-updated", refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.currency]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="Financial Insights — Data-Backed, Not Headlines"
        description="Real, computed financial insights and data-backed observations about how money actually behaves, plus a personal snapshot from your own saved goals."
        path="/insights"
        keywords="financial insights, personal finance data, money observations, savings insights"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ])}
      />

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Insights</span>
      <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Insights, not headlines</h1>
      <p className="mt-3 max-w-xl text-slate-500">
        Not a news feed — real, computed observations about how money actually behaves, plus a live snapshot of
        your own numbers where you've got some saved.
      </p>

      {personal.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-emerald-700" />
            <h2 className="text-[13px] font-black uppercase tracking-wide text-emerald-700">Based on your goals</h2>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {personal.map((card) => (
              <InsightCard key={card.id} card={card} tone="personal" fmt={fmt} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-slate-400" />
          <h2 className="text-[13px] font-black uppercase tracking-wide text-slate-400">General insights</h2>
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {INSIGHT_CARDS.map((card) => (
            <InsightCard key={card.id} card={card} tone="general" fmt={fmt} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ card, tone, fmt }) {
  const resolve = (value) => (typeof value === "function" ? value(fmt) : value);

  return (
    <div
      className={`rounded-3xl p-6 ring-1 ${
        tone === "personal" ? "bg-emerald-50/70 ring-emerald-100" : "bg-white ring-slate-200/70 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2">
        <TrendingUp size={15} className="text-emerald-700" />
        <span className="font-mono text-[13px] font-black tabular-nums text-emerald-700">{resolve(card.stat)}</span>
      </div>
      <h3 className="mt-3 text-[17px] font-black leading-snug text-slate-950">{resolve(card.headline)}</h3>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">{resolve(card.detail)}</p>
      {card.tool && (
        <Link
          to={card.tool.to}
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-black text-emerald-700 hover:underline"
        >
          {card.tool.label} <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}
