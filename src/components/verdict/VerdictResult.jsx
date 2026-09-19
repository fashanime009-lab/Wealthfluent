import VerdictScale from "./VerdictScale";
import { TONE_COLOR, TONE_COPY } from "./palette";

/**
 * tone: "go" | "caution" | "stop" — how decisive the computed verdict is
 * headline: short answer sentence, e.g. "Buying wins by ₹4.2L"
 * reasoning: 1-2 sentence plain-English why
 * a / b: { label, value, note? } — the two sides being weighed
 * fmt: number formatter for a.value / b.value
 */
export default function VerdictResult({ tone = "caution", headline, reasoning, a, b, fmt, children }) {
  const color = TONE_COLOR[tone] ?? TONE_COLOR.caution;

  return (
    <div className="rounded-[2px] border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      <div className="flex items-center gap-2" style={{ "--tone-l": color.light, "--tone-d": color.dark }}>
        <span className="tone-bg h-1.5 w-1.5 rounded-full" />
        <span className="tone-text text-[12.5px] font-bold">{TONE_COPY[tone] ?? TONE_COPY.caution}</span>
      </div>

      <p className="mt-4 font-display text-[26px] font-extrabold leading-snug tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
        {headline}
      </p>
      {reasoning && (
        <p className="mt-2 max-w-[52ch] text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">{reasoning}</p>
      )}

      {a && b && fmt && (
        <div className="mt-6 border-t border-[#111814]/10 pt-6 dark:border-[#eef1ec]/10">
          <VerdictScale a={a} b={b} fmt={fmt} tone={tone} />
          {(a.note || b.note) && (
            <div className="mt-2 flex items-baseline justify-between gap-4 text-[12px] text-[#111814]/50 dark:text-[#eef1ec]/50">
              <span>{a.note}</span>
              <span className="text-right">{b.note}</span>
            </div>
          )}
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
