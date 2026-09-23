import { Link } from "react-router-dom";
import { LESSONS } from "../../data/lessons";

export default function LearningSection() {
  const featured = LESSONS.slice(0, 5);

  return (
    // Full-bleed pale gold room — the last distinct space before the
    // page closes out on the neutral field again.
    <section className="bg-[#faf4e4] py-14 dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[22px]">
          Learn the concepts behind the numbers
        </h2>
        <Link
          to="/learn"
          className="flex-shrink-0 text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
        >
          All lessons
        </Link>
      </div>

      <div className="mt-8 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {featured.map((lesson) => (
          <Link
            key={lesson.slug}
            to={`/learn/${lesson.slug}`}
            className="grid grid-cols-1 gap-2 py-5 transition-opacity hover:opacity-70 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
          >
            <div className="min-w-0">
              <h3 className="font-display text-[16px] font-bold text-[#111814] dark:text-[#eef1ec]">{lesson.title}</h3>
              <p className="mt-1 max-w-[52ch] text-[13px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">{lesson.summary}</p>
            </div>
            <span className="flex-shrink-0 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">{lesson.readTime}</span>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
