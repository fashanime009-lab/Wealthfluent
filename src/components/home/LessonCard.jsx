import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LessonCard({ lesson }) {
  const Icon = lesson.icon;
  return (
    <Link to="/blogs" className={`rounded-2xl bg-gradient-to-br ${lesson.tone} p-5 shadow-[0_14px_36px_rgba(15,23,42,.045)] ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,.075)]`}>
      <div className="flex items-center justify-between">
        <span className="rounded-lg bg-white/80 px-3 py-1.5 text-[10px] font-black text-emerald-700">{lesson.tag}</span>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-emerald-800 ring-1 ring-slate-200/70">
          <Icon size={24} />
        </span>
      </div>
      <h3 className="mt-6 text-[16px] font-black leading-tight text-slate-950">{lesson.title}</h3>
      <p className="mt-3 min-h-[54px] text-[13px] font-semibold leading-6 text-slate-600">{lesson.text}</p>
      <div className="mt-6 flex items-center justify-between text-[12px] font-black text-slate-700">
        <span className="rounded-lg bg-white/70 px-3 py-1.5 text-emerald-700">Read</span>
        <span>Open <ArrowRight size={13} className="ml-1 inline" /></span>
      </div>
    </Link>
  );
}