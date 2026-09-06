import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
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

      <Link to="/learn" className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft size={15} /> All lessons
      </Link>

      <span className="mt-6 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">
        {lesson.category}
      </span>
      <h1 className="mt-4 text-4xl font-black text-slate-950">{lesson.title}</h1>
      <p className="mt-2 text-[13px] font-bold text-slate-400">{lesson.readTime} read</p>

      <div className="mt-8 space-y-5 text-[15px] leading-7 text-slate-700">
        {lesson.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {lesson.relatedTool && (
        <Link
          to={lesson.relatedTool.to}
          className="mt-8 flex items-center justify-between rounded-2xl bg-emerald-50 px-6 py-4 text-[13px] font-black text-emerald-800 ring-1 ring-emerald-100"
        >
          {lesson.relatedTool.label}
          <ArrowRight size={16} />
        </Link>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-8">
        <button
          onClick={handleComplete}
          disabled={done}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[13px] font-black transition ${
            done ? "bg-emerald-100 text-emerald-700" : "bg-emerald-800 text-white hover:bg-emerald-900"
          }`}
        >
          <CheckCircle2 size={16} />
          {done ? "Completed" : "Mark as complete"}
        </button>

        <Link
          to={`/learn/${next.slug}`}
          className="inline-flex items-center gap-2 text-[13px] font-black text-slate-600 hover:text-emerald-700"
        >
          Next: {next.title} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
