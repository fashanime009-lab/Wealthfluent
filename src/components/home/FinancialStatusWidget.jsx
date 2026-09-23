import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFinancialProfile, computeFinancialHealth } from "@/engine/financialProfile";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import ProgressRing from "@/components/ui/ProgressRing";
import useAnimatedNumber from "@/hooks/useAnimatedNumber";

function scoreTone(score) {
  if (score >= 70) return { color: "#047857", label: "Strong" };
  if (score >= 40) return { color: "#9a3412", label: "Fair" };
  return { color: "#9a3412", label: "Needs attention" };
}

export default function FinancialStatusWidget() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency, settings.compactNumbers);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const refresh = () => setProfile(getFinancialProfile());
    refresh();
    window.addEventListener("finaiw:financial-profile-updated", refresh);
    return () => window.removeEventListener("finaiw:financial-profile-updated", refresh);
  }, []);

  const health = computeFinancialHealth(profile);
  const animatedScore = useAnimatedNumber(health?.score ?? 0);
  const animatedNetWorth = useAnimatedNumber(health?.netWorth ?? 0);

  if (!profile || !health) return <EmptyStatus />;

  const tone = scoreTone(health.score);

  const metrics = [
    { label: "Net worth", value: fmt(animatedNetWorth) },
    { label: "Savings rate", value: `${health.savingsRate.toFixed(0)}%` },
    { label: "Debt-to-income", value: `${health.debtToIncome.toFixed(0)}%` },
    { label: "Emergency fund", value: `${health.emergencyMonths.toFixed(1)} mo` },
  ];

  return (
    <div className="rounded-lg border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/55">Your financial status</span>
        <Link to="/financial-profile" className="text-[12px] font-semibold text-[#111814]/60 hover:text-[#047857] dark:text-[#eef1ec]/55 dark:hover:text-[#34d399]">
          Update
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <ProgressRing value={animatedScore} size={92} strokeWidth={7} color={tone.color}>
          <div className="text-center">
            <span className="font-mono-tech text-[22px] font-medium tabular-nums leading-none text-[#111814] dark:text-[#eef1ec]">
              {Math.round(animatedScore)}
            </span>
            <p className="text-[9px] text-[#111814]/60 dark:text-[#eef1ec]/50">/ 100</p>
          </div>
        </ProgressRing>
        <div>
          <span className="text-[13px] font-semibold" style={{ color: tone.color }}>{tone.label}</span>
          <p className="mt-1.5 text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
            Computed from your real income, expenses, assets and debt.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-y-4 border-t border-[#111814]/10 pt-5 dark:border-[#eef1ec]/10">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="font-mono-tech text-[15px] tabular-nums text-[#111814] dark:text-[#eef1ec]">{m.value}</p>
            <p className="text-[11.5px] text-[#111814]/60 dark:text-[#eef1ec]/50">{m.label}</p>
          </div>
        ))}
      </div>

      <Link
        to="/goals"
        className="mt-6 inline-flex h-11 items-center bg-[#047857] px-5 text-[13px] font-semibold text-white transition hover:bg-[#065f46]"
      >
        View your goals
      </Link>
    </div>
  );
}

// Honest empty state — no fake score, no fake numbers, just a real path in.
function EmptyStatus() {
  return (
    <div className="rounded-lg border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/55">Your financial status</span>
        <span className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">Not set up</span>
      </div>

      <div className="mt-7 py-2">
        <h3 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">See your real financial status</h3>
        <p className="mt-2 max-w-xs text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
          Five numbers — income, expenses, assets, debt, emergency fund — for a genuine health score, not a guess.
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
        <Link
          to="/financial-profile"
          className="inline-flex h-11 items-center bg-[#047857] px-5 text-[13px] font-semibold text-white transition hover:bg-[#065f46]"
        >
          Set it up
        </Link>
        <Link
          to="/goals"
          className="inline-flex h-11 items-center text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
        >
          My goals
        </Link>
      </div>
    </div>
  );
}
