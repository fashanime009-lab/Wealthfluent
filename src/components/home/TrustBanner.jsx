import { Link } from "react-router-dom";
import { ArrowRight, Calculator, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  { icon: Calculator, label: "18+ free calculators" },
  { icon: ShieldCheck, label: "No signup required to calculate" },
  { icon: Sparkles, label: "Built and updated actively" },
];

export default function TrustBanner() {
  return (
    <section className="mx-auto mt-8 grid max-w-[1660px] gap-6 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12">
      <div className="grid gap-6 rounded-2xl bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,.05)] ring-1 ring-slate-200/80 md:grid-cols-[.7fr_1fr] md:items-center">
        <div>
          <h2 className="text-[20px] font-black leading-tight text-emerald-900">Built for<br />clarity, not clutter</h2>
          <p className="mt-3 max-w-xs text-[13px] font-semibold leading-6 text-slate-600">
            Every calculator on FINAIW is free, ad-supported, and open the moment you click — no account required.
          </p>
        </div>
        <div className="space-y-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon size={16} />
                </span>
                <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,.05)] ring-1 ring-slate-200/80">
        <div className="relative z-10 max-w-sm">
          <h2 className="text-[22px] font-black leading-tight tracking-[-0.03em] text-slate-950">Your financial freedom<br />starts with one step.</h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-slate-600">
            Start your journey today and take control of your financial future.
          </p>
          <Link to="/verdict" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-emerald-800 px-7 py-4 text-[14px] font-black text-white">
            Get Your Verdict <ArrowRight size={17} />
          </Link>
        </div>
        <div className="absolute bottom-0 right-8 text-[92px] leading-none">🪴</div>
      </div>
    </section>
  );
}
