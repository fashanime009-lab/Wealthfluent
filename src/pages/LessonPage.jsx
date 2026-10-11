import { useEffect, useRef, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { CheckCircle2, Flame } from "lucide-react";
import { LESSONS, getLessonBySlug } from "@/data/lessons";
import { getLessonRelated } from "@/data/recommendations/lessonRecommendations";
import { isLessonComplete, markLessonComplete, getStreak, getLessonsCompletedCount } from "@/services/learningEngine";
import { highlightText, extractKeyNumbers } from "@/utils/highlightNumbers";
import LessonChart from "@/components/learn/LessonChart";
import Seo from "@/components/seo/Seo";
import { articleSchema, breadcrumbSchema } from "@/components/seo/schema";

// Outer component just re-keys the real content by slug, so navigating
// between lessons (via the "Next" link) gets a genuine fresh mount instead
// of stale state syncing through an effect.
export default function LessonPage() {
  const { slug } = useParams();
  return <LessonContent key={slug} slug={slug} />;
}

// A matched figure (₹10,000, 12%, ...) gets its own color and weight so a
// paragraph is scannable at a glance instead of being uniform gray text —
// the actual numbers a reader came for stand out from the sentences
// carrying them.
function Highlighted({ text }) {
  return highlightText(text).map((part, i) =>
    typeof part === "string" ? (
      <span key={i}>{part}</span>
    ) : (
      <strong key={part.key} className="font-mono-tech font-semibold text-[#047857] dark:text-[#34d399]">
        {part.value}
      </strong>
    ),
  );
}

function LessonContent({ slug }) {
  const lesson = getLessonBySlug(slug);
  const [done, setDone] = useState(() => (lesson ? isLessonComplete(lesson.slug) : false));
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    const refresh = () => {
      setStreak(getStreak());
      setCompletedCount(getLessonsCompletedCount());
    };
    refresh();
    window.addEventListener("finaiw:learning-updated", refresh);
    return () => window.removeEventListener("finaiw:learning-updated", refresh);
  }, []);

  // How far through the lesson the reader actually is, not just whether
  // they've clicked a button — a thin bar that fills as you scroll, so
  // there's visible momentum before you ever hit "Mark as complete".
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = articleRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight * 0.5;
        const scrolled = window.scrollY - el.offsetTop + window.innerHeight * 0.5;
        setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slug]);

  if (!lesson) return <Navigate to="/learn" replace />;

  const index = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const next = LESSONS[(index + 1) % LESSONS.length];
  const related = getLessonRelated(lesson.slug);
  const keyNumbers = extractKeyNumbers(lesson.body);
  const newCompletedCount = completedCount + (done ? 0 : 1);

  const handleComplete = () => {
    markLessonComplete(lesson.slug);
    setDone(true);
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      {/* Reading progress — sticky right under the site header (which is
          itself sticky at 72px tall), fills left to right as you scroll. */}
      <div className="sticky top-[72px] z-30 h-[3px] bg-[#111814]/8 dark:bg-[#eef1ec]/10">
        <div
          className="h-full bg-[#047857] transition-[width] duration-150 ease-out dark:bg-[#34d399]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-[680px] px-5 py-16 sm:px-8" ref={articleRef}>
        <Seo
          title={`${lesson.title} — Learn`}
          description={lesson.summary}
          path={`/learn/${lesson.slug}`}
          type="article"
          keywords={`${lesson.title}, personal finance, ${lesson.category}, financial literacy`}
          jsonLd={[
            articleSchema({
              title: lesson.title,
              description: lesson.summary,
              path: `/learn/${lesson.slug}`,
              // All 30 lessons shipped together in one batch (see
              // src/data/lessons.js's git history) rather than being
              // authored on individual dates, so one real shared date is
              // more honest here than inventing 30 distinct ones.
              publishedTime: "2026-09-11",
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Learn", path: "/learn" },
              { name: lesson.title, path: `/learn/${lesson.slug}` },
            ]),
          ]}
        />

        <div className="flex items-center justify-between gap-4">
          <Link
            to="/learn"
            className="text-[13px] font-semibold text-[#111814]/60 underline decoration-[#111814]/25 underline-offset-4 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:decoration-[#eef1ec]/25 dark:hover:text-[#eef1ec]"
          >
            All lessons
          </Link>
          {streak > 0 && (
            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111814]/55 dark:text-[#eef1ec]/50">
              <Flame size={14} className="text-[#047857] dark:text-[#34d399]" />
              {streak}-day streak
            </span>
          )}
        </div>

        <span className="mt-8 block text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">
          {lesson.category}
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[38px]">
          {lesson.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <p className="font-mono-tech text-[12.5px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
            {lesson.readTime} read
          </p>
          <span className="text-[#111814]/25 dark:text-[#eef1ec]/25">·</span>
          <p className="font-mono-tech text-[12.5px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
            Lesson {index + 1} of {LESSONS.length}
          </p>
        </div>

        <div className="mt-9 space-y-5 text-[15px] leading-7 text-[#111814]/75 dark:text-[#eef1ec]/75">
          {lesson.body.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[17px] leading-8 text-[#111814]/85 dark:text-[#eef1ec]/85"
                  : undefined
              }
            >
              <Highlighted text={para} />
            </p>
          ))}
        </div>

        <LessonChart chart={lesson.chart} />

        {keyNumbers.length > 0 && (
          <div className="mt-10 border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#111814]/50 dark:text-[#eef1ec]/45">
              Numbers worth remembering
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {keyNumbers.map((n) => (
                <span key={n} className="font-mono-tech text-[18px] font-semibold text-[#047857] dark:text-[#34d399]">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {lesson.relatedTool && (
          <Link
            to={lesson.relatedTool.to}
            className="mt-6 flex items-center justify-between gap-4 border border-[#111814]/12 bg-[#ffffff] px-6 py-5 transition-opacity hover:opacity-80 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]"
          >
            <span className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">
              {lesson.relatedTool.label}
            </span>
            <span className="flex-shrink-0 text-[13px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30">
              Open
            </span>
          </Link>
        )}

        {related.length > 0 && (
          <section aria-labelledby="keep-learning" className="mt-12">
            <h2 id="keep-learning" className="font-display text-[20px] font-extrabold text-[#111814] dark:text-[#eef1ec]">
              Keep learning
            </h2>
            <ul className="mt-5 space-y-4">
              {related.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
                  >
                    {item.label}
                  </Link>
                  <span className="text-[14px] text-[#111814]/60 dark:text-[#eef1ec]/55"> — {item.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
          <button
            onClick={handleComplete}
            disabled={done}
            className={`flex w-full items-center justify-center gap-2.5 border px-6 py-4 text-[14.5px] font-semibold transition ${
              done
                ? "border-[#047857]/30 bg-[#047857]/5 text-[#047857] dark:border-[#34d399]/30 dark:bg-[#34d399]/5 dark:text-[#34d399]"
                : "border-[#111814] text-[#111814] hover:bg-[#111814] hover:text-[#eef1ec] dark:border-[#eef1ec] dark:text-[#eef1ec] dark:hover:bg-[#eef1ec] dark:hover:text-[#0b1210]"
            }`}
          >
            <CheckCircle2 size={18} />
            {done ? `Completed — ${completedCount} of ${LESSONS.length} lessons done` : "Mark as complete"}
          </button>
          {!done && (
            <p className="mt-3 text-center text-[12.5px] text-[#111814]/50 dark:text-[#eef1ec]/45">
              That'll make {newCompletedCount} of {LESSONS.length} lessons.
            </p>
          )}

          <div className="mt-6 text-center">
            <Link
              to={`/learn/${next.slug}`}
              className="text-[13px] font-semibold text-[#111814]/70 underline decoration-[#111814]/25 underline-offset-4 hover:text-[#111814] dark:text-[#eef1ec]/70 dark:decoration-[#eef1ec]/25 dark:hover:text-[#eef1ec]"
            >
              Next: {next.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
