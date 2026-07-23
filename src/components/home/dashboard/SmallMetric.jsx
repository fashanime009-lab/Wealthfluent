import { ArrowRight } from "lucide-react";

export default function SmallMetric({
  label,
  value,
  change,
  icon,
  accent = "emerald",
  action,
  empty = false,
  subtitle,
  progress,
}) {
 const theme = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    cta: "group-hover:text-emerald-600",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700",
    text: "text-blue-600",
    bar: "bg-blue-500",
    cta: "group-hover:text-blue-600",
  },
  purple: {
    badge: "bg-violet-50 text-violet-700",
    text: "text-violet-600",
    bar: "bg-violet-500",
    cta: "group-hover:text-violet-600",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700",
    text: "text-orange-600",
    bar: "bg-orange-500",
    cta: "group-hover:text-orange-600",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700",
    text: "text-slate-600",
    bar: "bg-slate-500",
    cta: "group-hover:text-slate-700",
  },
}[accent];

  return (
    <div className="group flex min-h-[165px] flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      {/* Header */}

      <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200 transition-all duration-300 group-hover:scale-105">
    {icon}
  </div>

  <h3 className="flex-1 text-[14px] font-semibold leading-tight text-slate-800">
    {label}
  </h3>

</div>

      

      </div>

      {/* Value */}

      <div className="mt-5">

        <div className="text-[24px] font-extrabold leading-none tracking-[-0.03em] text-slate-950">

          {typeof value === "string"
            ? value.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))
            : value}

        </div>

        {subtitle && (
          <p className="mt-2 text-[13px] leading-5 text-slate-500">
            {subtitle}
          </p>
        )}

        {change && (
          <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${theme.text}`}>
  <span className={`h-2 w-2 rounded-full ${theme.bar}`} />
            <span>{change}</span>
          </div>
        )}

      </div>

      {/* Progress */}

      {typeof progress === "number" && (

        <div className="mt-3">

          <div className="mb-1 flex items-center justify-between text-[11px]">

            <span className="text-slate-500">
              Progress
            </span>

            <span className={`font-bold ${theme.text}`}>
              {progress}%
            </span>

          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className={`h-full rounded-full transition-all duration-700 ${theme.bar}`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      )}

      {/* CTA */}

      {action && (

        <button
          className={`mt-auto inline-flex items-center gap-2 text-[15px] font-semibold text-slate-600 transition-all duration-300 group-hover:gap-2.5 ${theme.cta}`}
        >
          {action}
          <ArrowRight size={15} />
        </button>

      )}

    </div>
  );
}