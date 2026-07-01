import { ArrowUpRight } from "lucide-react";
import Card from "../../ui/Card";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "blue",
}) {
  const accents = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      arrow: "text-blue-600",
    },

    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      arrow: "text-emerald-600",
    },

    violet: {
      bg: "bg-violet-50",
      icon: "text-violet-600",
      arrow: "text-violet-600",
    },

    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      arrow: "text-amber-600",
    },
  };

  const style = accents[accent] || accents.blue;

  return (
    <Card
      hover
      className="group relative overflow-hidden h-full"
    >
      {/* Background Glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-100 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">

        {/* Top */}

        <div className="flex items-center justify-between">

          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl ${style.bg}`}
          >
            {Icon && (
              <Icon
                size={28}
                className={style.icon}
              />
            )}
          </div>

          <ArrowUpRight
            size={18}
            className={`${style.arrow} opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100`}
          />

        </div>

        {/* Content */}

        <div className="mt-8">

          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            {description}
          </p>

        </div>

      </div>
    </Card>
  );
}