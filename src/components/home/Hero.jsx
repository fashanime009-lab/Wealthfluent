import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import HeroLandscape from "./HeroLandscape";
import ProofStrip from "./ProofStrip";
export default function Hero() {

  return (
    <section className="relative overflow-hidden rounded-b-[34px] bg-gradient-to-br from-white via-[#fbfdfc] to-emerald-50/80 px-5 pb-20 pt-8 sm:px-8 lg:min-h-[730px] lg:px-10">
      <HeroLandscape />
      <div className="relative z-10 mx-auto grid max-w-[1580px] gap-10 lg:grid-cols-[.78fr_1.35fr] lg:items-start">
        <div className="pt-8 lg:pt-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
            <Sparkles size={14} />
            Your Personal Financial Operating System
            <Sparkles size={14} />
          </div>
          <h1 className="mt-7 max-w-[560px] font-serif text-[46px] font-black leading-[1.06] tracking-[-0.045em] text-slate-950 sm:text-[60px] lg:text-[66px]">
            Your Financial Life.
            <br />
            Smarter, <span className="text-emerald-700">Together.</span>
          </h1>
          <p className="mt-6 max-w-[500px] text-[15px] font-medium leading-7 text-slate-700">
            All the tools, insights and guidance you need to make confident financial decisions and build the life you want.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              to="/WorkspacePage"
              className="inline-flex h-14 items-center gap-3 rounded-xl bg-emerald-800 px-8 text-[14px] font-black text-white shadow-[0_16px_34px_rgba(4,120,87,.25)] transition hover:-translate-y-0.5"
            >
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link
              to="/tools"
              className="inline-flex h-14 items-center gap-3 rounded-xl bg-white px-7 text-[14px] font-black text-emerald-900 shadow-[0_16px_34px_rgba(15,23,42,.08)] ring-1 ring-slate-200 transition hover:-translate-y-0.5"
            >
              Explore Platform
              <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                <Play size={13} fill="currentColor" />
              </span>
            </Link>
          </div>
          <ProofStrip />
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}
