import { Link } from "react-router-dom";
import { MOST_POPULAR_TOOLS } from "@/data/mostPopularTools";

// Shared between /calculators and /tools — GA4 showed visitors browsing
// these hub pages without opening a tool, so both lead with the same six
// most-used tools up top instead of making a visitor scroll a full list
// (or a category filter) to find them.
export default function MostPopularRow() {
  return (
    <div className="mt-8">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#111814]/50 dark:text-[#eef1ec]/45">
        Most popular
      </p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {MOST_POPULAR_TOOLS.map((tool) => (
          <Link
            key={tool.route}
            to={tool.route}
            className="flex-shrink-0 border border-[#111814]/15 px-4 py-2.5 text-[13px] font-semibold text-[#111814] transition hover:border-[#047857]/50 hover:text-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:hover:border-[#34d399]/50 dark:hover:text-[#34d399]"
          >
            {tool.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
