import { Check, Lock } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function ProgressNode({
  title,
  completed = false,
  current = false,
  locked = false,
}) {
  return (
    <div className="flex flex-col items-center min-w-[120px]">

      {/* Circle */}

      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300",

          completed &&
            "border-emerald-500 bg-emerald-500 text-white",

          current &&
            "border-blue-600 bg-blue-600 text-white ring-8 ring-blue-100",

          locked &&
            "border-slate-300 bg-slate-100 text-slate-400",

          !completed &&
            !current &&
            !locked &&
            "border-slate-300 bg-white"
        )}
      >
        {completed ? (
          <Check size={22} />
        ) : locked ? (
          <Lock size={18} />
        ) : (
          <span className="font-bold">
            •
          </span>
        )}
      </div>

      {/* Label */}

      <p
        className={cn(
          "mt-4 text-center text-sm font-semibold",

          completed && "text-emerald-600",

          current && "text-blue-700",

          locked && "text-slate-400",

          !completed &&
            !current &&
            !locked &&
            "text-slate-700"
        )}
      >
        {title}
      </p>
    </div>
  );
}