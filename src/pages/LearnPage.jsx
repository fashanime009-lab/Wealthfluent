import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { LESSONS, getTodaysLesson } from "@/data/lessons";
import { getCompletedSlugs, getStreak, getLessonsCompletedCount } from "@/services/learningEngine";

function LessonRow({ lesson, done }) {
  return (
    <Link
      to={`/learn/${lesson.slug}`}
      className="group grid grid-cols-1 gap-2 py-6 transition-opacity hover:opacity-70 sm:grid-cols-[1.3fr_1fr] sm:gap-8"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">{lesson.title}</h3>
          {done && (
            <span className="text-[12px] font-medium text-[#047857] dark:text-[#34d399]">Completed</span>
          )}
        </div>
        <p className="mt-1 max-w-[46ch] text-[13.5px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
          {lesson.summary}
        </p>
      </div>
      <div className="min-w-0 sm:text-right">
        <span className="text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">{lesson.category}</span>
        <p className="font-mono-tech mt-1 text-[13px] tabular-nums text-[#111814]/55 dark:text-[#eef1ec]/55">
          {lesson.readTime}
        </p>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  const [completed, setCompleted] = useState([]);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const todaysLesson = getTodaysLesson();
  const libraryRef = useRef(null);
  const previousCategory = useRef(activeCategory);

  useEffect(() => {
    const refresh = () => {
      setCompleted(getCompletedSlugs());
      setStreak(getStreak());
      setTotal(getLessonsCompletedCount());
    };
    refresh();
    window.addEventListener("finaiw:learning-updated", refresh);
    return () => window.removeEventListener("finaiw:learning-updated", refresh);
  }, []);

  const categories = [...new Set(LESSONS.map((l) => l.category))];

  const filteredLessons = useMemo(() => {
    if (activeCategory === "All") return LESSONS;
    return LESSONS.filter((l) => l.category === activeCategory);
  }, [activeCategory]);

  // Every lesson in the chosen category is rendered — no paging — so all 30
  // links are in the prerendered HTML for crawlers, not just the first page.
  useEffect(() => {
    // Only scroll when the user actually changes category, not on first
    // mount. Comparing against the previous value (rather than a
    // "first render" flag) also holds up under StrictMode's double effect run.
    if (previousCategory.current === activeCategory) return;
    previousCategory.current = activeCategory;
    libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCategory]);

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
        <Seo
          title="Learn — One Real Financial Lesson a Day"
          description="One real financial lesson a day — foundational personal finance concepts explained clearly, with a genuine streak to track your progress."
          path="/learn"
          keywords="financial education, personal finance lessons, money basics, investing basics"
          jsonLd={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Learn", path: "/learn" },
          ])}
        />

        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Learn</span>
        <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
          Learn something new every day
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Not another blog feed — short, real lessons on the concepts that actually change financial
          decisions. One featured lesson a day, and a full library whenever you want to go deeper.
        </p>

        {/* Real streak stats, not decoration */}
        <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-y border-[#111814]/10 py-6 dark:border-[#eef1ec]/10">
          <div>
            <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
              {streak}
            </span>
            <span className="ml-2 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">
              {streak === 1 ? "day streak" : "day streak"}
            </span>
          </div>
          <div>
            <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
              {total}/{LESSONS.length}
            </span>
            <span className="ml-2 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">lessons completed</span>
          </div>
          <div>
            <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
              {categories.length}
            </span>
            <span className="ml-2 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">categories</span>
          </div>
        </div>

        {/* Today's featured lesson — plain-bordered callout, not a gradient card */}
        <Link
          to={`/learn/${todaysLesson.slug}`}
          className="mt-10 flex flex-col justify-between gap-6 border border-[#111814]/12 bg-[#ffffff] p-7 transition-opacity hover:opacity-80 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:flex-row sm:items-center sm:p-8"
        >
          <div>
            <span className="text-[12.5px] font-semibold text-[#047857] dark:text-[#34d399]">Today's lesson</span>
            <h2 className="font-display mt-1.5 text-[22px] font-extrabold leading-snug text-[#111814] dark:text-[#eef1ec]">
              {todaysLesson.title}
            </h2>
            <p className="mt-2 max-w-lg text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
              {todaysLesson.summary}
            </p>
          </div>
          <span className="flex-shrink-0 text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25">
            {completed.includes(todaysLesson.slug) ? "Read again" : "Start today's lesson"}
          </span>
        </Link>

        {/* Full library */}
        <div ref={libraryRef} className="mt-14 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              All lessons
            </h2>
            <span className="font-mono-tech text-[12px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
              {filteredLessons.length} lesson{filteredLessons.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Category filter — plain text tabs, not pills */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`text-[14px] font-semibold transition ${
                activeCategory === "All"
                  ? "text-[#111814] dark:text-[#eef1ec]"
                  : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
              }`}
            >
              All ({LESSONS.length})
            </button>
            {categories.map((category) => {
              const count = LESSONS.filter((l) => l.category === category).length;
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`text-[14px] font-semibold transition ${
                    active
                      ? "text-[#111814] dark:text-[#eef1ec]"
                      : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {filteredLessons.length === 0 ? (
            <p className="mt-8 border border-[#111814]/10 p-6 text-center text-[13px] font-medium text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
              No lessons in this category yet.
            </p>
          ) : (
            <div className="divide-y divide-[#111814]/10 dark:divide-[#eef1ec]/10">
              {filteredLessons.map((lesson) => (
                <LessonRow key={lesson.slug} lesson={lesson} done={completed.includes(lesson.slug)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
