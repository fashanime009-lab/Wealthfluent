import { useId, useMemo } from "react";

// The site's recurring "alive" device — a real line chart of real
// computed data, drawn in with a one-shot animation (see .chart-draw-in
// in index.css). Used by the Hero's live demo and the calculators
// spotlight, so the instrument-panel + chart pairing reads as one
// signature repeated on purpose, not a one-off.
export default function GrowthChart({ series, height = 130, color = "#34d399" }) {
  const gradientId = useId();
  const width = 400;

  const linePath = useMemo(() => {
    const max = Math.max(...series, 1);
    const points = series.map((v, i) => ({
      x: (i / (series.length - 1 || 1)) * width,
      y: height - (v / max) * (height - 10),
    }));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  }, [series, height]);

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        key={linePath}
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        className="chart-draw-in"
      />
    </svg>
  );
}
