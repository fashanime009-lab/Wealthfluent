import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Users,
  Target,
} from "lucide-react";

export default function CalculatorCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className="group relative flex min-h-[220px] flex-col rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.10)]"
    >
     {item.featured && (
  <div className="absolute right-5 top-5">
    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
      <Sparkles size={11} />
      Recommended
    </div>
  </div>
)}

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`grid h-10 w-10 place-items-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${item.iconTone}`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-emerald-700">
          {item.title}
        </h3>
      </div>

      {/* Description */}
      <p className="mt-3 text-[14px] leading-6 text-slate-600">
        {item.description}
      </p>

      {/* Info */}
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-2">
  <Users
    size={16}
    className="mt-0.5 text-slate-400"
  />

  <div>
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
      Best For
    </p>

    <p className="mt-0.5 text-[15px] font-bold text-slate-800">
      {item.bestFor}
    </p>
  </div>
</div>

       <div className="flex items-start gap-2">
  <Target
    size={16}
    className="mt-0.5 text-slate-400"
  />

  <div>
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
      Outcome
    </p>

    <p className="mt-1 text-[15px] font-bold text-slate-800">
      {item.outcome}
    </p>
  </div>
</div>
      </div>

      {/* CTA */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-emerald-700 transition-all group-hover:translate-x-1">
          Open Calculator
        </span>

        <ArrowRight
    size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}