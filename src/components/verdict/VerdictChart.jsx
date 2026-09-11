// Renders two real trajectories against each other. No chart library —
// plain SVG driven directly by the simulation's yearly output.
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function VerdictChart({ data, keys, colors, labels }) {
  const { settings } = useSettings();
  const currency = settings.currency;

  if (!data || data.length === 0) return null;

  const width = 560;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const allValues = data.flatMap((d) => keys.map((k) => d[k]));
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues) * 1.08;

  const x = (i) => padding.left + (i / (data.length - 1 || 1)) * innerW;
  const y = (v) => padding.top + innerH - ((v - min) / (max - min || 1)) * innerH;

  const linePath = (key) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(" ");

  const zeroY = y(0);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {min < 0 && (
          <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke="#e2e8f0" strokeDasharray="4 4" />
        )}
        {keys.map((key, ki) => (
          <path key={key} d={linePath(key)} fill="none" stroke={colors[ki]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {keys.map((key, ki) => {
          const last = data[data.length - 1];
          return (
            <circle key={key} cx={x(data.length - 1)} cy={y(last[key])} r="4" fill={colors[ki]} />
          );
        })}
        <text x={padding.left} y={height - 6} fontSize="10" fill="#94a3b8">Year 1</text>
        <text x={width - padding.right} y={height - 6} fontSize="10" fill="#94a3b8" textAnchor="end">
          Year {data[data.length - 1].year}
        </text>
      </svg>
      <div className="mt-2 flex gap-5">
        {keys.map((key, ki) => (
          <div key={key} className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: colors[ki] }} />
            {labels[ki]}: <span className="tabular">{formatCurrency(data[data.length - 1][key], currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
