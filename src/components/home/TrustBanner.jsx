import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export default function TrustBanner() {
  return (
    <section className="mx-auto mt-8 grid max-w-[1660px] gap-6 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12">
      <div className="grid gap-6 rounded-2xl bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,.05)] ring-1 ring-slate-200/80 md:grid-cols-[.7fr_1fr] md:items-center">
        <div>
          <h2 className="text-[20px] font-black leading-tight text-emerald-900">Trusted by<br />smart people</h2>
          <p className="mt-3 max-w-xs text-[13px] font-semibold leading-6 text-slate-600">
            Join people building a more confident financial future with FINAIW.
          </p>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3">
              {["👨🏽", "👩🏻", "🧑🏽", "👨🏻", "👩🏽", "🧑🏻"].map((face, index) => (
                <span key={`${face}-${index}`} className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-slate-800 text-lg ring-4 ring-white">
                  {face}
                </span>
              ))}
            </div>
            <div>
              <div className="text-[16px] font-black text-slate-950">50K+ Happy Users</div>
              <div className="mt-2 flex items-center gap-2 text-[12px] font-black text-slate-600">
                <span className="flex text-emerald-600">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}</span>
                4.9/5 from 2,500+ reviews
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,.05)] ring-1 ring-slate-200/80">
        <div className="relative z-10 max-w-sm">
          <h2 className="text-[22px] font-black leading-tight tracking-[-0.03em] text-slate-950">Your financial freedom<br />starts with one step.</h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-slate-600">
            Start your journey today and take control of your financial future.
          </p>
          <Link to="/WorkspacePage" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-emerald-800 px-7 py-4 text-[14px] font-black text-white">
            Start Your Journey <ArrowRight size={17} />
          </Link>
        </div>
        <div className="absolute bottom-0 right-8 text-[92px] leading-none">🪴</div>
        <span className="absolute right-24 top-7 grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-[14px] font-black text-amber-700 ring-1 ring-amber-200">7</span>
      </div>
    </section>
  );
}