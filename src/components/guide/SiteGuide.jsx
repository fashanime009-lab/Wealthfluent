import { Link } from "react-router-dom";
import {
  Calculator,
  BriefcaseBusiness,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Settings as SettingsIcon,
  ArrowRight,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

// A real, structured walkthrough of the site — not a chatbot. Every
// section here is a clickable answer to "what is this and where do I go",
// not a text box waiting for a question it might not understand.
const SECTIONS = [
  {
    icon: Calculator,
    title: "Calculators",
    to: "/calculators",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    desc: "18+ free tools — SIP, EMI, FD, retirement, FIRE and more. Enter your numbers, get an instant answer.",
    cta: "Browse calculators",
  },
  {
    icon: BriefcaseBusiness,
    title: "Verdict",
    to: "/verdict",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    desc: "Stuck on a big decision — rent vs buy, pay off debt vs invest? This runs the real math and tells you which one wins.",
    cta: "Get a verdict",
  },
  {
    icon: ShieldCheck,
    title: "Goals",
    to: "/goals",
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
    desc: "Set a real savings goal — a trip, an emergency fund, a down payment — and log what you save toward it over time.",
    cta: "Set a goal",
  },
  {
    icon: BookOpen,
    title: "Learn",
    to: "/learn",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    desc: "Short, plain-English lessons on money basics — compound interest, investing, debt — one a day if you want a streak.",
    cta: "Start learning",
  },
  {
    icon: Sparkles,
    title: "Insights",
    to: "/insights",
    tone: "bg-rose-50 text-rose-700 ring-rose-100",
    desc: "Real, computed observations about how money behaves — not news headlines.",
    cta: "See insights",
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    to: "/settings",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
    desc: "Set your currency once — every calculator and result across the whole site will use it automatically.",
    cta: "Open settings",
  },
];

const STEPS = [
  { n: "1", text: "Pick a calculator, or go to Verdict for a specific decision." },
  { n: "2", text: "Type in your own numbers — results update instantly as you go." },
  { n: "3", text: "Nothing is saved or sent anywhere unless you choose to save a goal." },
];

export default function SiteGuide({ onNavigate }) {
  return (
    <div className="max-h-[80vh] overflow-y-auto rounded-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,.18)] ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white px-6 py-5 dark:border-white/10 dark:from-emerald-500/10 dark:to-transparent">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-emerald-800 text-white">
            <HelpCircle size={22} />
          </span>
          <div>
            <h2 className="text-[17px] font-black text-slate-950 dark:text-white">How FINAIW works</h2>
            <p className="text-[12.5px] font-semibold text-slate-500 dark:text-slate-400">
              A free personal finance toolkit — here's what's here and where to go.
            </p>
          </div>
        </div>
      </div>

      {/* Quick start steps */}
      <div className="border-b border-slate-100 px-6 py-5 dark:border-white/10">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Quick start</p>
        <div className="mt-3 space-y-2.5">
          {STEPS.map((step) => (
            <div key={step.n} className="flex items-start gap-3">
              <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-800 text-[11px] font-black text-white">
                {step.n}
              </span>
              <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section directory */}
      <div className="px-6 py-5">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Where to go</p>
        <div className="mt-3 space-y-2.5">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                to={s.to}
                onClick={onNavigate}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-3.5 transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(15,23,42,.06)] dark:border-white/10"
              >
                <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl ring-1 ${s.tone}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-black text-slate-900 dark:text-white">{s.title}</span>
                    <span className="inline-flex flex-shrink-0 items-center gap-1 text-[11.5px] font-bold text-emerald-700 opacity-0 transition group-hover:opacity-100 dark:text-emerald-400">
                      {s.cta} <ArrowRight size={11} />
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] leading-5 text-slate-500 dark:text-slate-400">{s.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Still stuck footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Still not sure where to start?</p>
        <div className="flex flex-shrink-0 gap-2">
          <Link
            to="/help"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-white/10"
          >
            <HelpCircle size={13} /> Help
          </Link>
          <Link
            to="/contact"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-2 text-[12px] font-bold text-white transition hover:bg-emerald-900"
          >
            <MessageCircle size={13} /> Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
