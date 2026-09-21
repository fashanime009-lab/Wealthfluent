import { useId } from "react";

export default function VerdictSlider({ label, value, onChange, min, max, step = 1, suffix = "", format }) {
  const id = useId();
  const display = format ? format(value) : `${value}${suffix}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="min-w-0 text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">{label}</label>
        <span className="font-mono-tech text-[14px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        aria-valuetext={display}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="instrument-range mt-3 w-full"
      />
    </div>
  );
}
