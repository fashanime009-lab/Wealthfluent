import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, BookOpen, CheckCircle2, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { LESSONS, getTodaysLesson } from "@/data/lessons";
import { getCompletedSlugs, getStreak, getLessonsCompletedCount } from "@/services/learningEngine";

const LESSONS_PER_PAGE = 9; // 3x3 grid on desktop

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
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
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

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Learn</span>
      <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Learn something new every day</h1>
      <p className="mt-3 max-w-xl text-slate-500">
        Not another blog feed — short, real lessons on the concepts that actually change financial decisions.
        One featured lesson a day, and a full library whenever you want to go deeper.
      </p>

      {/* Real streak stats, not decoration */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600">
            <Flame size={18} />
            <span className="text-[11px] font-black uppercase tracking-wide">Current streak</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{streak} {streak === 1 ? "day" : "days"}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <span className="text-[11px] font-black uppercase tracking-wide">Lessons completed</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{total} / {LESSONS.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen size={18} />
            <span className="text-[11px] font-black uppercase tracking-wide">Categories</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{categories.length}</p>
        </div>
      </div>

      {/* Today's featured lesson */}
      <Link
        to={`/learn/${todaysLesson.slug}`}
        className="mt-8 flex flex-col justify-between gap-6 rounded-3xl bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,.18),transparent_35%),linear-gradient(135deg,#052f24,#031b18)] p-8 text-white shadow-[0_24px_70px_rgba(2,44,34,.22)] sm:flex-row sm:items-center"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-200">
            <Sparkles size={12} /> Today's Lesson
          </span>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl">{todaysLesson.title}</h2>
          <p className="mt-2 max-w-lg text-[14px] leading-6 text-emerald-50/85">{todaysLesson.summary}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[13px] font-black text-emerald-950">
          {completed.includes(todaysLesson.slug) ? "Read again" : "Start today's lesson"} <ArrowRight size={16} />
        </span>
      </Link>

      {/* Full library */}
      <div ref={libraryRef} className="mt-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-950">All lessons</h2>
          {totalPages > 1 && (
            <span className="text-[12px] font-bold text-slate-400">
              Page {currentPage} of {totalPages} · {filteredLessons.length} lesson{filteredLessons.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {/* Category filter — was purely decorative before (a badge per
            card with no way to filter by it); these pills actually narrow
            the grid below. */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect("All")}
            className={`rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-wide transition ${
              activeCategory === "All"
                ? "bg-emerald-700 text-white"
                : "border border-slate-200/70 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
            }`}
          >
            All <span className="ml-1 opacity-70">({LESSONS.length})</span>
          </button>
          {categories.map((category) => {
            const count = LESSONS.filter((l) => l.category === category).length;
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-wide transition ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-200/70 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                {category} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {pagedLessons.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-slate-200/70 bg-white p-6 text-center text-[13px] font-bold text-slate-400">
            No lessons in this category yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagedLessons.map((lesson) => {
              const done = completed.includes(lesson.slug);
              return (
                <Link
                  key={lesson.slug}
                  to={`/learn/${lesson.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                        {lesson.category}
                      </span>
                      {done && <CheckCircle2 size={18} className="text-emerald-600" />}
                    </div>
                    <h3 className="mt-4 text-lg font-black text-slate-950">{lesson.title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-slate-500">{lesson.summary}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[12px] font-bold">
                    <span className="text-slate-400">{lesson.readTime} read</span>
                    <span className="text-emerald-700 group-hover:underline">{done ? "Read again" : "Read"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-[12px] font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`h-9 w-9 rounded-xl text-[12px] font-black transition ${
                  num === currentPage
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                aria-current={num === currentPage ? "page" : undefined}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-[12px] font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
