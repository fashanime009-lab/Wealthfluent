import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TONES = {
  emerald: {
    wrap: "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700",
    chip: "bg-white/12 text-emerald-100 ring-white/15",
    bar: "bg-emerald-400/70",
    barActive: "bg-emerald-300",
    cta: "bg-white text-emerald-900 hover:bg-emerald-50",
  },
  slate: {
    wrap: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700",
    chip: "bg-white/12 text-sky-100 ring-white/15",
    bar: "bg-sky-400/70",
    barActive: "bg-sky-300",
    cta: "bg-white text-slate-900 hover:bg-slate-50",
  },
};

export default function SpotlightCard({
  to,
  eyebrow,
  title,
  description,
  statValue,
  statLabel,
  bars = [38, 55, 46, 70, 60, 88, 100],
  tone = "emerald",
  icon: Icon,
}) {
  const palette = TONES[tone] || TONES.emerald;

  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-6 text-white shadow-[0_28px_70px_rgba(4,20,15,.28)] transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${palette.wrap}`}
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10">
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black ring-1 ${palette.chip}`}>
          {Icon && <Icon size={13} />}
          {eyebrow}
        </div>
        <h3 className="mt-5 max-w-sm text-[26px] font-black leading-tight tracking-[-0.02em] sm:text-[28px]">
          {title}
        </h3>
        <p className="mt-3 max-w-sm text-[13.5px] font-medium leading-6 text-white/70">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-white/50">{statLabel}</p>
          <p className="mt-1 text-[22px] font-black tracking-tight sm:text-[30px]">{statValue}</p>
        </div>

        {/* decorative bar chart — purely visual, so it's hidden on the
            smallest screens instead of fighting the stat number for space
            (which is what was causing the clipped/cut-off look on narrow
            phones: the row needed ~310px but only ~224px was available
            once card padding was accounted for, and overflow-hidden on the
            card silently clipped the excess rather than showing it). */}
        <div className="hidden h-16 flex-shrink-0 items-end gap-1.5 sm:flex">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`w-2.5 rounded-full transition-all duration-500 ${
                i === bars.length - 1 ? palette.barActive : palette.bar
              } group-hover:opacity-100`}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative z-10 mt-7 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-black transition ${palette.cta}`}
      >
        Try it now
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
