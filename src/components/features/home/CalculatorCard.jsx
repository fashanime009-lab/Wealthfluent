import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../ui/Card";

export default function CalculatorCard({
  icon,
  title,
  description,
  href,
  badge,
}) {
  return (
    <Link to={href} className="group block h-full">
      <Card
        hover
        className="flex h-full flex-col justify-between"
      >
        <div>
          <div className="text-5xl">
            {icon}
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {badge}
          </span>

          <ArrowRight
            size={20}
            className="text-blue-600 transition-transform duration-300 group-hover:translate-x-2"
          />

        </div>
      </Card>
    </Link>
  );
}