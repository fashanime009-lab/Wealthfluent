import { cn } from "../../utils/cn";

export default function Progress({
  value = 0,
  size = "md",
  color = "blue",
  showLabel = false,
  className = "",
}) {
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colors = {
    blue: "bg-gradient-to-r from-blue-600 to-blue-500",
    green: "bg-gradient-to-r from-emerald-500 to-green-600",
    orange: "bg-gradient-to-r from-amber-500 to-orange-500",
    red: "bg-gradient-to-r from-red-500 to-rose-600",
    purple: "bg-gradient-to-r from-violet-500 to-indigo-600",
  };

  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-700">
            {percentage}%
          </span>
        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-200",
          sizes[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colors[color]
          )}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}