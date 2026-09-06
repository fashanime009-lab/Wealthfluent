import { Link } from "react-router-dom";
import { ArrowRight, Check, Home, TrendingDown, Car } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

const SNAPSHOTS = [
  {
    category: "Housing",
    icon: Home,
    verdictDiff: 40000,
    tone: "go",
    a: { label: "Buying", value: 310000 },
    b: { label: "Renting & investing", value: 350000 },
    aShare: 41,
  },
  {
    category: "Debt",
    icon: TrendingDown,
    verdictDiff: 13000,
    tone: "go",
    a: { label: "Debt-first", value: 54000 },
    b: { label: "Invest-first", value: 41000 },
    aShare: 57,
  },
  {
    category: "Vehicles",
    icon: Car,
    verdict: "Close call — either is reasonable",
    tone: "caution",
    a: { label: "Buying", value: 19500 },
    b: { label: "Leasing & investing", value: 21000 },
    aShare: 48,
  },
];

const TONE_STYLE = {
  go: "bg-emerald-400/20 text-emerald-200",
  caution: "bg-amber-400/20 text-amber-200",
};
const BAR_TONE = {
  go: "bg-emerald-400",
  caution: "bg-amber-400",
};

export default function WorkspacePanel() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);

  return (
    <section className="mx-auto mt-8 grid max-w-[1660px] gap-7 rounded-[24px] bg-[radial-gradient(circle_at_82%_20%,rgba(16,185,129,.16),transparent_32%),linear-gradient(135deg,#052f24,#031b18)] p-7 text-white shadow-[0_24px_80px_rgba(2,44,34,.2)] lg:grid-cols-[.62fr_1.58fr] lg:p-9">
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-[-0.04em]">
            You don't need
            <br />
            a calculator.
            <br />
            You need a <span className="text-emerald-300">verdict.</span>
          </h2>
          <p className="mt-5 max-w-sm text-[14px] font-medium leading-7 text-emerald-50/90">
            Rent or buy. Pay off debt or invest. Most calculators hand you a number and leave you to figure out
            what it means — we run the real simulation and tell you which one wins.
          </p>
          <div className="mt-6 space-y-3.5 text-[13px] font-bold text-emerald-50">
            {["Real month-by-month simulation", "Shows the actual reasoning", "Free — no signup, ever"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check size={18} className="text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <Link to="/verdict" className="mt-8 inline-flex h-[52px] w-fit items-center gap-3 rounded-xl bg-white px-7 text-[13px] font-black text-emerald-950">
          Get Your Verdict <ArrowRight size={17} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SNAPSHOTS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.category}
              to="/verdict"
              className="flex flex-col justify-between rounded-2xl bg-white/7 p-6 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wide text-emerald-300">{s.category}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                    <Icon size={15} className="text-emerald-200" />
                  </span>
                </div>
                <p className="mt-4 text-[16px] font-black leading-snug">
                  {s.verdict || `${s.a.value < s.b.value ? s.b.label : s.a.label} wins by ${fmt(s.verdictDiff)}`}
                </p>

                {/* Real breakdown, not empty space */}
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${BAR_TONE[s.tone]}`} style={{ width: `${s.aShare}%` }} />
                </div>
                <div className="mt-3 space-y-2 text-[12px] font-bold">
                  <div className="flex items-center justify-between text-emerald-50/80">
                    <span>{s.a.label}</span>
                    <span className="font-mono tabular-nums">{fmt(s.a.value)}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-50/80">
                    <span>{s.b.label}</span>
                    <span className="font-mono tabular-nums">{fmt(s.b.value)}</span>
                  </div>
                </div>
              </div>
              <span className={`mt-6 inline-block w-fit rounded-full px-3 py-1 text-[11px] font-bold ${TONE_STYLE[s.tone]}`}>
                Example verdict
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
