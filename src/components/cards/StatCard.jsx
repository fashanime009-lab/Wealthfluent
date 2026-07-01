import { ArrowUpRight } from "lucide-react";
import Card from "../ui/Card";
import { cn } from "../../utils/cn";

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend = "up",
  className = "",
}) {
  return (
    <Card
      hover
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50">
          {Icon && (
            <Icon
              size={22}
              className="text-blue-600"
            />
          )}
        </div>

        {trend === "up" && (
          <ArrowUpRight
            size={18}
            className="text-emerald-500"
          />
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {value}
        </h3>

        {subtitle && (
          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}