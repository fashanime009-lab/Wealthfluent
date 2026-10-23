import { useId } from "react";

// Dual slider + direct-entry number control used on every calculator page.
// The slider is for quick exploration; the number input is for a precise
// value someone already knows (their actual loan amount, income, etc.),
// which can legitimately sit above the slider's own max (a large net worth
// or loan) — the slider just clamps visually in that case, same as any
// native range input whose value exceeds its max. The number input only
// enforces `min` (still blocking nonsense like a negative loan amount) and
// a generous typedMax well beyond the slider's range, not the slider's own
// max, so a real-world value never gets silently capped to the slider's
// exploratory range.
export default function CalcField({ label, value, onChange, min, max, step = 1, suffix = "", format, typedMax, hint }) {
  const id = useId();
  const display = format ? format(value) : `${value}${suffix}`;
  const effectiveTypedMax = typedMax ?? max * 100;

  const handleTypedChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(min);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.min(Math.max(parsed, min), effectiveTypedMax));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`${id}-range`} className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">{label}</label>
        <span className="font-mono-tech text-[14px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
          {display}
        </span>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        aria-valuetext={display}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="instrument-range mt-3 w-full"
      />
      <input
        id={`${id}-number`}
        type="number"
        aria-label={`${label}, exact value`}
        min={min}
        max={effectiveTypedMax}
        step={step}
        value={value}
        onChange={handleTypedChange}
        className="mt-3 w-full border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
      />
      {hint && <p className="mt-1.5 text-[11.5px] text-[#111814]/50 dark:text-[#eef1ec]/45">{hint}</p>}
    </div>
  );
}
