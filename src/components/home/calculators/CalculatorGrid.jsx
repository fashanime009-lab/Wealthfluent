import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { calculators } from "@/data/calculators";

// Secondary quick-access strip — the two flagship calculators (SIP & EMI)
// already get full spotlight treatment above, so this row surfaces the
// rest of the catalog as simple, compact chips. (No ad slot here anymore:
// AdSense's responsive "auto" format reserves unpredictable placeholder
// height, which was blowing this row up to thousands of pixels tall.)
export default function CalculatorGrid() {
  const rest = calculators.filter((item) => !item.featured);

  return (
    <div className="flex flex-wrap gap-2.5">
      {rest.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            to={item.to}
            className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2.5 pl-2.5 pr-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_12px_28px_rgba(15,23,42,.08)] dark:border-white/10 dark:bg-slate-900"
          >
            <span className={`grid h-7 w-7 place-items-center rounded-full ring-1 ${item.iconTone}`}>
              <Icon size={13} strokeWidth={2.2} />
            </span>
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
            <ArrowUpRight
              size={13}
              className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600 dark:text-slate-600"
            />
          </Link>
        );
      })}
    </div>
  );
}
