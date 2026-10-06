// A single breakdown row (e.g. "Principal" / "Total interest") with an
// optional proportion bar showing its share of the whole.
const TONE = {
  signal: { l: "#047857", d: "#34d399" },
  neutral: { l: "#111814", d: "#eef1ec" },
};

export default function CalcStat({ label, value, share, tone = "neutral" }) {
  const color = TONE[tone] ?? TONE.neutral;
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">{label}</span>
        <span className="font-mono-tech text-[15px] tabular-nums text-[#111814] dark:text-[#eef1ec]">{value}</span>
      </div>
      {typeof share === "number" && (
        <div className="mt-2 h-[3px] rounded-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
          <div
            className="tone-bg h-full rounded-full opacity-70 dark:opacity-80"
            style={{ width: `${Math.min(100, Math.max(0, share))}%`, "--tone-l": color.l, "--tone-d": color.d }}
          />
        </div>
      )}
    </div>
  );
}
