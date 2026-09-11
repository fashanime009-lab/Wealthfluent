export default function VerdictSlider({ label, value, onChange, min, max, step = 1, suffix = "", format }) {
  const display = format ? format(value) : `${value}${suffix}`;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-semibold text-slate-600">{label}</label>
        <span className="text-[15px] font-black text-slate-950">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-emerald-700"
      />
    </div>
  );
}
