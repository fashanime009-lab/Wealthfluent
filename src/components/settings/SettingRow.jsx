import { ChevronRight } from "lucide-react";

export default function SettingRow({
  icon,
  title,
  description,
  value,
  danger = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-8 py-6 transition hover:bg-slate-50 ${
        danger ? "hover:bg-red-50" : ""
      }`}
    >
      <div className="flex items-center gap-5">

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl ${
            danger
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {icon}
        </div>

        <div className="text-left">
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        {value && (
          <span className="text-sm font-semibold text-slate-500">
            {value}
          </span>
        )}

        <ChevronRight
          size={18}
          className="text-slate-400"
        />

      </div>
    </button>
  );
}