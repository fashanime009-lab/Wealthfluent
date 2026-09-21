import { Link } from "react-router-dom";
import { X } from "lucide-react";

// A real, structured walkthrough of the site — not a chatbot. Every
// section here is a clickable answer to "what is this and where do I go",
// not a text box waiting for a question it might not understand. No icon
// badges, per the brand constraint — each row is identified by a plain
// mono-tech index, the same convention as the homepage's "How it works".
const SECTIONS = [
  {
    n: "01",
    title: "Calculators",
    to: "/calculators",
    desc: "20+ free tools — SIP, EMI, FD, retirement, FIRE and more. Enter your numbers, get an instant answer.",
  },
  {
    n: "02",
    title: "Verdict",
    to: "/verdict",
    desc: "Stuck on a big decision — rent vs buy, pay off debt vs invest? This runs the real math and tells you which one wins.",
  },
  {
    n: "03",
    title: "Goals",
    to: "/goals",
    desc: "Set a real savings goal — a trip, an emergency fund, a down payment — and log what you save toward it over time.",
  },
  {
    n: "04",
    title: "Learn",
    to: "/learn",
    desc: "Short, plain-English lessons on money basics — compound interest, investing, debt — one a day if you want a streak.",
  },
  {
    n: "05",
    title: "Insights",
    to: "/insights",
    desc: "Real, computed observations about how money behaves — not news headlines.",
  },
  {
    n: "06",
    title: "Settings",
    to: "/settings",
    desc: "Set your currency once — every calculator and result across the whole site will use it automatically.",
  },
];

const STEPS = [
  "Pick a calculator, or go to Verdict for a specific decision.",
  "Type in your own numbers — results update instantly as you go.",
  "Nothing is saved or sent anywhere unless you choose to save a goal.",
];

export default function SiteGuide({ onNavigate, onClose }) {
  return (
    <div className="flex max-h-[80vh] flex-col border border-[#111814]/12 bg-[#eef1ec] dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      {/* Header */}
      <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-[#111814]/10 bg-[#0e1512] px-5 py-4 dark:border-[#eef1ec]/10">
        <div>
          <h2 className="font-display text-[16px] font-bold text-[#eef1ec]">How FINAIW works</h2>
          <p className="mt-0.5 text-[12.5px] text-[#eef1ec]/55">
            A free personal finance toolkit — here's what's here and where to go.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="flex-shrink-0 text-[#eef1ec]/50 transition hover:text-[#eef1ec]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="overflow-y-auto">
        {/* Quick start steps */}
        <div className="border-b border-[#111814]/10 px-5 py-4 dark:border-[#eef1ec]/10">
          <p className="text-[11px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Quick start</p>
          <ol className="mt-2.5 space-y-2">
            {STEPS.map((text, i) => (
              <li key={text} className="flex items-baseline gap-2.5">
                <span className="font-mono-tech flex-shrink-0 text-[12px] text-[#047857] dark:text-[#34d399]">
                  {i + 1}.
                </span>
                <p className="text-[13px] leading-5 text-[#111814]/70 dark:text-[#eef1ec]/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Section directory */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Where to go</p>
          <div className="mt-2 divide-y divide-[#111814]/10 dark:divide-[#eef1ec]/10">
            {SECTIONS.map((s) => (
              <Link
                key={s.title}
                to={s.to}
                onClick={onNavigate}
                className="group flex items-start gap-3 py-3 transition-opacity hover:opacity-70"
              >
                <span className="font-mono-tech mt-0.5 flex-shrink-0 text-[12px] text-[#111814]/35 dark:text-[#eef1ec]/35">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-display text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                    {s.title}
                  </span>
                  <p className="mt-0.5 text-[12.5px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Still stuck footer */}
      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-[#111814]/10 px-5 py-3.5 dark:border-[#eef1ec]/10">
        <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/55">Still not sure where to start?</p>
        <div className="flex flex-shrink-0 gap-4">
          <Link
            to="/help"
            onClick={onNavigate}
            className="text-[12px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
          >
            Help
          </Link>
          <Link
            to="/contact"
            onClick={onNavigate}
            className="text-[12px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
