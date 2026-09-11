const TONE = {
  go: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "ring-emerald-100",
    label: "Do it",
  },
  caution: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-100",
    label: "It depends",
  },
  stop: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-100",
    label: "Reconsider",
  },
};

/**
 * tone: "go" | "caution" | "stop" — the computed verdict
 * headline: short answer sentence, e.g. "Buying wins by ₹4.2L"
 * reasoning: 1-2 sentence plain-English why
 */
export default function VerdictResult({ tone = "caution", headline, reasoning, children }) {
  const t = TONE[tone] ?? TONE.caution;
  return (
    <div className={`rounded-3xl p-7 ring-1 ${t.bg} ${t.ring}`}>
      <span className={`inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${t.text}`}>
        {t.label}
      </span>
      <p className={`mt-4 text-[26px] font-black leading-snug ${t.text}`}>
        {headline}
      </p>
      {reasoning && (
        <p className="mt-2 text-[14px] leading-6 text-slate-600">{reasoning}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
