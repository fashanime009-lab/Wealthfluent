// Renders two real trajectories against each other. No chart library —
// plain SVG driven directly by the simulation's yearly output.
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function VerdictChart({ data, keys, colors, labels }) {
  const { settings } = useSettings();
  const currency = settings.currency;

  if (!data || data.length === 0) return null;

  const width = 560;
  const height = 200;
  const padding = { top: 16, right: 16, bottom: 26, left: 16 };
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
          <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke="currentColor" className="text-[#111814]/15 dark:text-[#eef1ec]/15" strokeDasharray="4 4" />
        )}
        {keys.map((key, ki) => (
          <path key={key} d={linePath(key)} fill="none" stroke={colors[ki]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {keys.map((key, ki) => {
          const last = data[data.length - 1];
          return (
            <circle key={key} cx={x(data.length - 1)} cy={y(last[key])} r="3.5" fill={colors[ki]} />
          );
        })}
        <text x={padding.left} y={height - 4} fontSize="10" fill="currentColor" className="text-[#111814]/60 dark:text-[#eef1ec]/50" fontFamily="IBM Plex Mono, monospace">Year 1</text>
        <text x={width - padding.right} y={height - 4} fontSize="10" fill="currentColor" className="text-[#111814]/60 dark:text-[#eef1ec]/50" fontFamily="IBM Plex Mono, monospace" textAnchor="end">
          Year {data[data.length - 1].year}
        </text>
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {keys.map((key, ki) => (
          <div key={key} className="flex items-center gap-2 text-[12px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors[ki] }} />
            {labels[ki]}: <span className="font-mono-tech tabular-nums">{formatCurrency(data[data.length - 1][key], currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
