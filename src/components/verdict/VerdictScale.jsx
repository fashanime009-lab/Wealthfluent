import { TONE_COLOR } from "./palette";

// The site's one signature comparison device: a physical scale that tips
// toward whichever side wins, reused identically on every verdict page and
// on the homepage summary. Position shows which side wins and by how
// much; color (from `tone`) shows how decisive that win is.
//
// `onDark`: set when the scale sits on a surface that's always dark
// regardless of site theme (the homepage's emerald room) — forces light
// text/track colors instead of following the light/dark `.dark` class.
export default function VerdictScale({ a, b, fmt, tone = "caution", onDark = false }) {
  const av = Math.max(0, Number(a.value) || 0);
  const bv = Math.max(0, Number(b.value) || 0);
  const total = av + bv || 1;
  const rawShare = (av / total) * 100;
  const aShare = Math.min(94, Math.max(6, rawShare));
  const aWins = av >= bv;
  const color = TONE_COLOR[tone] ?? TONE_COLOR.caution;
  const toneVars = onDark
    ? { "--tone-l": color.dark, "--tone-d": color.dark }
    : { "--tone-l": color.light, "--tone-d": color.dark };

  const mutedClass = onDark ? "text-[#eef1ec]/50" : "text-[#111814]/50 dark:text-[#eef1ec]/45";
  const trackClass = onDark ? "bg-[#eef1ec]/15" : "bg-[#111814]/10 dark:bg-[#eef1ec]/15";
  const dividerClass = onDark ? "bg-[#eef1ec]/20" : "bg-[#111814]/15 dark:bg-[#eef1ec]/20";
  const ringClass = onDark ? "ring-[#052e22]" : "ring-[#eef1ec] dark:ring-[#0b1210]";
  const valueClass = onDark ? "text-[#eef1ec]" : "text-[#111814] dark:text-[#eef1ec]";

  return (
    <div style={toneVars}>
      <div className="flex items-start justify-between gap-4">
        <span className={`min-w-0 text-[13.5px] font-bold ${aWins ? "tone-text" : mutedClass}`}>{a.label}</span>
        <span className={`min-w-0 text-right text-[13.5px] font-bold ${!aWins ? "tone-text" : mutedClass}`}>{b.label}</span>
      </div>

      <div className={`relative mt-3 h-[3px] rounded-full ${trackClass}`}>
        <div className={`absolute inset-y-0 left-1/2 w-px ${dividerClass}`} />
        <div
          className={`tone-bg absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full ring-4 transition-[left] duration-500 ease-out ${ringClass}`}
          style={{ left: `${aShare}%` }}
        />
      </div>

      <div className={`mt-3 flex items-baseline justify-between gap-4 font-mono-tech text-[15px] tabular-nums ${valueClass}`}>
        <span>{fmt(a.value)}</span>
        <span>{fmt(b.value)}</span>
      </div>
    </div>
  );
}
