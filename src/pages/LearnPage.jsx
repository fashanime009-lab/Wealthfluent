import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { LESSONS, getTodaysLesson } from "@/data/lessons";
import { getCompletedSlugs, getStreak, getLessonsCompletedCount } from "@/services/learningEngine";

const LESSONS_PER_PAGE = 9;

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
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const todaysLesson = getTodaysLesson();
  const libraryRef = useRef(null);
  const isFirstRender = useRef(true);

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

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / LESSONS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedLessons = useMemo(() => {
    const start = (currentPage - 1) * LESSONS_PER_PAGE;
    return filteredLessons.slice(start, start + LESSONS_PER_PAGE);
  }, [currentPage, filteredLessons]);

  useEffect(() => {
    // Don't scroll on first mount, only on page changes made by the user.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setPage(1); // a new filter is a fresh list — start from page 1
  };

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
            {totalPages > 1 && (
              <span className="font-mono-tech text-[12px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
                Page {currentPage} of {totalPages} — {filteredLessons.length} lesson{filteredLessons.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Category filter — plain text tabs, not pills */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
            <button
              type="button"
              onClick={() => handleCategorySelect("All")}
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
                  onClick={() => handleCategorySelect(category)}
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

          {pagedLessons.length === 0 ? (
            <p className="mt-8 border border-[#111814]/10 p-6 text-center text-[13px] font-medium text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
              No lessons in this category yet.
            </p>
          ) : (
            <div className="divide-y divide-[#111814]/10 dark:divide-[#eef1ec]/10">
              {pagedLessons.map((lesson) => (
                <LessonRow key={lesson.slug} lesson={lesson} done={completed.includes(lesson.slug)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 disabled:cursor-not-allowed disabled:text-[#111814]/30 disabled:no-underline dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25 dark:disabled:text-[#eef1ec]/30"
                aria-label="Previous page"
              >
                Prev
              </button>

              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    aria-current={num === currentPage ? "page" : undefined}
                    className={`font-mono-tech text-[13px] tabular-nums transition ${
                      num === currentPage
                        ? "font-semibold text-[#047857] dark:text-[#34d399]"
                        : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 disabled:cursor-not-allowed disabled:text-[#111814]/30 disabled:no-underline dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25 dark:disabled:text-[#eef1ec]/30"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
