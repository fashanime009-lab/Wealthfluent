import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pencil, PiggyBank, Scale, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { getFinancialProfile, computeFinancialHealth } from "@/engine/financialProfile";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import ProgressRing from "@/components/ui/ProgressRing";
import useAnimatedNumber from "@/hooks/useAnimatedNumber";

function scoreTone(score) {
  if (score >= 70) return { color: "#047857", label: "Strong", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (score >= 40) return { color: "#d97706", label: "Fair", bg: "bg-amber-50", text: "text-amber-700" };
  return { color: "#e11d48", label: "Needs attention", bg: "bg-rose-50", text: "text-rose-600" };
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
    { icon: Wallet, label: "Net Worth", value: fmt(animatedNetWorth) },
    { icon: PiggyBank, label: "Savings Rate", value: `${health.savingsRate.toFixed(0)}%` },
    { icon: Scale, label: "Debt-to-Income", value: `${health.debtToIncome.toFixed(0)}%` },
    { icon: ShieldCheck, label: "Emergency Fund", value: `${health.emergencyMonths.toFixed(1)} mo` },
  ];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white bg-white/95 p-6 shadow-[0_30px_90px_rgba(15,23,42,.14)] backdrop-blur-xl sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Your Financial Status
        </span>
        <Link to="/financial-profile" className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-emerald-700">
          <Pencil size={11} /> Update
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <ProgressRing value={animatedScore} size={104} strokeWidth={9} color={tone.color}>
          <div className="text-center">
            <span className="font-mono text-[26px] font-black tabular-nums leading-none text-slate-950">
              {Math.round(animatedScore)}
            </span>
            <p className="text-[9px] font-bold text-slate-400">/ 100</p>
          </div>
        </ProgressRing>
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black ${tone.bg} ${tone.text}`}>
            {tone.label}
          </span>
          <p className="mt-2 text-[13px] leading-6 text-slate-500">
            Your overall financial health score, computed from your real income, expenses, assets and debt.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl bg-slate-50 p-4">
            <m.icon size={15} className="text-emerald-700" />
            <p className="mt-2 font-mono text-[16px] font-black tabular-nums text-slate-950">{m.value}</p>
            <p className="text-[11px] font-bold text-slate-400">{m.label}</p>
          </div>
        ))}
      </div>

      <Link
        to="/goals"
        className="mt-5 flex h-13 items-center justify-between rounded-2xl bg-emerald-800 px-5 py-4 text-[13px] font-black text-white shadow-[0_16px_35px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
      >
        <span>View your goals</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// Honest empty state — no fake score, no fake numbers, just a real path in.
function EmptyStatus() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white bg-white/95 p-6 shadow-[0_30px_90px_rgba(15,23,42,.14)] backdrop-blur-xl sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Your Financial Status
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
          Not set up
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center py-4 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
          <Wallet className="text-emerald-700" size={26} />
        </div>
        <h3 className="mt-5 text-[19px] font-black text-slate-950">See your real financial status</h3>
        <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
          Five numbers — income, expenses, assets, debt, emergency fund — and you get a genuine overall health
          score, not a guess.
        </p>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Link
          to="/financial-profile"
          className="flex items-center justify-between rounded-xl bg-emerald-800 px-4 py-3.5 text-[13px] font-black text-white transition hover:bg-emerald-900"
        >
          Set It Up <Sparkles size={15} />
        </Link>
        <Link
          to="/goals"
          className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 text-[13px] font-black text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          My Goals <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
