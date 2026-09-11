import { Link } from "react-router-dom";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { calculatorCategories, toneStyles } from "@/data/calculators";

export default function CategoryNavCard() {
  const total = calculatorCategories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            <LayoutGrid size={16} />
          </span>
          <div>
            <p className="text-[13.5px] font-black text-slate-950">Browse by category</p>
            <p className="text-[11.5px] font-semibold text-slate-400">{total} tools · 4 categories</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-2">
        {calculatorCategories.map((cat) => {
          const Icon = cat.icon;
          const tone = toneStyles[cat.tone];
          return (
            <Link
              key={cat.id}
              to={`/calculators?category=${cat.id}`}
              className="group flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-slate-50"
            >
              <span
                className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}
              >
                <Icon size={17} strokeWidth={2.1} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-bold text-slate-900">{cat.name}</span>
                <span className="block text-[11.5px] font-semibold text-slate-400">{cat.count} tools</span>
              </span>
              <ChevronRight
                size={16}
                className="flex-shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
              />
            </Link>
          );
        })}
      </div>

      <Link
        to="/calculators"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-[13px] font-black text-white transition hover:bg-slate-800"
      >
        View all calculators
      </Link>
    </div>
  );
}
