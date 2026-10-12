import { Link } from "react-router-dom";
import { MOST_POPULAR_TOOLS } from "@/data/mostPopularTools";

// Big, question-framed entry points right below the hero's working
// instruments — GA4 showed visitors browsing the homepage and hub pages
// (/, /calculators, /tools) without opening a calculator, so this section
// leads with the actual question a visitor has ("Should I rent or buy?"),
// not a tool name, before handing them to the tool that answers it.
export default function QuestionCards() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
      <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[22px]">
        What are you trying to figure out?
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOST_POPULAR_TOOLS.map((tool) => (
          <Link
            key={tool.route}
            to={tool.route}
            className="group flex flex-col justify-between gap-6 border border-[#111814]/12 bg-[#ffffff] p-6 transition hover:border-[#047857]/40 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] dark:hover:border-[#34d399]/40"
          >
            <p className="font-display text-[17px] font-bold leading-snug text-[#111814] dark:text-[#eef1ec]">
              {tool.question}
            </p>
            <span className="text-[13px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 transition group-hover:decoration-[#047857]/60 dark:text-[#34d399] dark:decoration-[#34d399]/30 dark:group-hover:decoration-[#34d399]/60">
              {tool.label} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
