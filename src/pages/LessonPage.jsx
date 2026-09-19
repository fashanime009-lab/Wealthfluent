import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { LESSONS, getLessonBySlug } from "@/data/lessons";
import { isLessonComplete, markLessonComplete } from "@/services/learningEngine";
import Seo from "@/components/seo/Seo";
import { articleSchema, breadcrumbSchema } from "@/components/seo/schema";

// Outer component just re-keys the real content by slug, so navigating
// between lessons (via the "Next" link) gets a genuine fresh mount instead
// of stale state syncing through an effect.
export default function LessonPage() {
  const { slug } = useParams();
  return <LessonContent key={slug} slug={slug} />;
}

function LessonContent({ slug }) {
  const lesson = getLessonBySlug(slug);
  const [done, setDone] = useState(() => (lesson ? isLessonComplete(lesson.slug) : false));

  if (!lesson) return <Navigate to="/learn" replace />;

  const index = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const next = LESSONS[(index + 1) % LESSONS.length];

  const handleComplete = () => {
    markLessonComplete(lesson.slug);
    setDone(true);
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[680px] px-5 py-16 sm:px-8">
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
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Learn", path: "/learn" },
              { name: lesson.title, path: `/learn/${lesson.slug}` },
            ]),
          ]}
        />

        <Link
          to="/learn"
          className="text-[13px] font-semibold text-[#111814]/55 underline decoration-[#111814]/25 underline-offset-4 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:decoration-[#eef1ec]/25 dark:hover:text-[#eef1ec]"
        >
          All lessons
        </Link>

        <span className="mt-8 block text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">
          {lesson.category}
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[38px]">
          {lesson.title}
        </h1>
        <p className="font-mono-tech mt-2 text-[12.5px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
          {lesson.readTime} read
        </p>

        <div className="mt-9 space-y-5 text-[15px] leading-7 text-[#111814]/75 dark:text-[#eef1ec]/75">
          {lesson.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {lesson.relatedTool && (
          <Link
            to={lesson.relatedTool.to}
            className="mt-10 flex items-center justify-between gap-4 border border-[#111814]/12 bg-[#ffffff] px-6 py-5 transition-opacity hover:opacity-80 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]"
          >
            <span className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">
              {lesson.relatedTool.label}
            </span>
            <span className="flex-shrink-0 text-[13px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30">
              Open
            </span>
          </Link>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
          <button
            onClick={handleComplete}
            disabled={done}
            className={`inline-flex items-center gap-2 border px-6 py-3 text-[13px] font-semibold transition ${
              done
                ? "border-[#047857]/30 text-[#047857] dark:border-[#34d399]/30 dark:text-[#34d399]"
                : "border-[#111814] text-[#111814] hover:bg-[#111814] hover:text-[#eef1ec] dark:border-[#eef1ec] dark:text-[#eef1ec] dark:hover:bg-[#eef1ec] dark:hover:text-[#0b1210]"
            }`}
          >
            <CheckCircle2 size={16} />
            {done ? "Completed" : "Mark as complete"}
          </button>

          <Link
            to={`/learn/${next.slug}`}
            className="text-[13px] font-semibold text-[#111814]/70 underline decoration-[#111814]/25 underline-offset-4 hover:text-[#111814] dark:text-[#eef1ec]/70 dark:decoration-[#eef1ec]/25 dark:hover:text-[#eef1ec]"
          >
            Next: {next.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
