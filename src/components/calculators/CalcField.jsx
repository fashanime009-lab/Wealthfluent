import { useId } from "react";

// Dual slider + direct-entry number control used on every calculator page.
// The slider is for quick exploration; the number input is for a precise
// value someone already knows (their actual loan amount, income, etc.).
export default function CalcField({ label, value, onChange, min, max, step = 1, suffix = "", format }) {
  const id = useId();
  const display = format ? format(value) : `${value}${suffix}`;

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
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-3 w-full border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
      />
    </div>
  );
}
