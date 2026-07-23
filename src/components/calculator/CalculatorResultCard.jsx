import Card from "../ui/Card";

export default function CalculatorResultCard({
  label,
  value,
  color = "slate",
  progress,
  children,
}) {
  const colors = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    slate: "bg-slate-500",
  };

  return (
    <Card className="space-y-4" padding="lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span
          className={`text-2xl font-bold text-${color === "slate" ? "slate-900" : color + "-600"}`}
        >
          {value}
        </span>
      </div>

      {typeof progress === "number" && (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${colors[color] || colors.slate}`}
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
      )}

      {children}
    </Card>
  );
}