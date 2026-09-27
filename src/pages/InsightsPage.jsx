import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function InsightRow({ card, fmt }) {
  const resolve = (value) => (typeof value === "function" ? value(fmt) : value);

  return (
    <div className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-[110px_1fr] sm:gap-8">
      <div>
        <span className="font-mono-tech text-[15px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
          {resolve(card.stat)}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[17px] font-bold leading-snug text-[#111814] dark:text-[#eef1ec]">
          {resolve(card.headline)}
        </h3>
        <p className="mt-2 max-w-[64ch] text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
          {resolve(card.detail)}
        </p>
        {card.tool && (
          <Link
            to={card.tool.to}
            className="mt-3 inline-block text-[12.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
          >
            {card.tool.label}
          </Link>
        )}
      </div>
    </div>
  );
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
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
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

        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Insights</span>
        <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
          Insights, not headlines
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Not a news feed — real, computed observations about how money actually behaves, plus a
          live snapshot of your own numbers where you've got some saved.
        </p>

        {personal.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Based on your goals</h2>
            <div className="mt-2 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
              {personal.map((card) => (
                <InsightRow key={card.id} card={card} fmt={fmt} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">General insights</h2>
          <div className="mt-2 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
            {INSIGHT_CARDS.map((card) => (
              <InsightRow key={card.id} card={card} fmt={fmt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
