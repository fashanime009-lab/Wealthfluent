import { useEffect, useRef, useState } from "react";

// A single-series line chart in plain SVG — axes, dashed grid, a smooth
// monotone curve and a hover/touch tooltip. It replaced recharts on the FIRE
// calculator, the only page that used it: the library and its dependencies
// (d3-*, redux toolkit, immer, decimal.js…) were ~340 KB of that page's code
// for one line on one chart. Sized to its container, like the recharts
// ResponsiveContainer it replaces.
//
// data:         [{ ...xKey, ...yKey }]
// formatAxis:   (value) => short label for the y axis
// formatValue:  (value) => text for the tooltip
// formatLabel:  (x) => tooltip heading, e.g. "Age: 45"

const FONT_SIZE = 12;
const PAD = { top: 12, right: 16, bottom: 28 };

// "Nice" round tick values from 0 to just past max (or min..max if negative).
function niceTicks(min, max, target = 5) {
  const span = max - min || 1;
  const rough = span / target;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? 10 * pow;
  const ticks = [];
  for (let v = Math.floor(min / step) * step; ; v += step) {
    ticks.push(v);
    if (v >= max) break;
  }
  return ticks;
}

// d3's curveMonotoneX: a cubic curve through every point that never
// overshoots between them, so a rising series can't dip below itself.
function monotonePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  const n = points.length;
  const dx = [];
  const slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1][0] - points[i][0]);
    slope.push((points[i + 1][1] - points[i][1]) / (dx[i] || 1));
  }
  const tangent = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    tangent.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  }
  tangent.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      tangent[i] = t * a * slope[i];
      tangent[i + 1] = t * b * slope[i];
    }
  }
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i] / 3;
    d += ` C ${(x0 + h).toFixed(1)} ${(y0 + tangent[i] * h).toFixed(1)}, ${(x1 - h).toFixed(1)} ${(y1 - tangent[i + 1] * h).toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

export default function GrowthChart({
  data,
  xKey,
  yKey,
  formatAxis = String,
  formatValue = String,
  formatLabel = String,
  color = "#047857",
  ariaLabel,
}) {
  const boxRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const values = data.map((d) => d[yKey]);
  const min = Math.min(0, ...values);
  const rawMax = Math.max(0, ...values);
  const ticks = niceTicks(min, rawMax);
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const tickLabels = ticks.map((t) => formatAxis(t));
  const left = Math.ceil(Math.max(...tickLabels.map((l) => l.length), 1) * FONT_SIZE * 0.6) + 14;
  const innerW = Math.max(0, w - left - PAD.right);
  const innerH = Math.max(0, h - PAD.top - PAD.bottom);

  const x = (i) => left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2);
  const y = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  // Label every point when there's room (~34px each). Otherwise label every
  // nth point — preferring an n that divides evenly so the last label isn't
  // stranded — and always keep the last one, dropping a neighbour that would
  // collide with it.
  const span = data.length - 1;
  const gap = span > 0 ? innerW / span : innerW;
  let every = Math.max(1, Math.ceil(34 / (gap || 1)));
  for (let e = every; e <= every * 2 && e <= span; e++) {
    if (span % e === 0) {
      every = e;
      break;
    }
  }
  const xLabelIdx = data.map((_, i) => i).filter((i) => i % every === 0 || i === span);
  if (xLabelIdx.length > 1 && x(xLabelIdx.at(-1)) - x(xLabelIdx.at(-2)) < 26) xLabelIdx.splice(-2, 1);

  const points = data.map((d, i) => [x(i), y(d[yKey])]);
  const muted = "text-[#111814]/60 dark:text-[#eef1ec]/50";
  const label = "text-[#111814]/60 dark:text-[#eef1ec]/60";

  const pick = (event) => {
    if (data.length === 0 || innerW === 0) return;
    // The hit area starts at the plot's left edge, so px is already plot-relative.
    const rect = event.currentTarget.getBoundingClientRect();
    const i = data.length > 1 ? Math.round(((event.clientX - rect.left) / rect.width) * (data.length - 1)) : 0;
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  };

  const activePoint = active !== null && data[active] ? { d: data[active], px: points[active][0], py: points[active][1] } : null;
  const tipOnLeft = activePoint ? activePoint.px > w * 0.6 : false;

  return (
    <div ref={boxRef} className="relative h-full w-full">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} role="img" aria-label={ariaLabel} className="block overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={left} x2={left + innerW} y1={y(t)} y2={y(t)} stroke="currentColor" strokeDasharray="3 3" className="text-[#111814]/10 dark:text-[#eef1ec]/10" />
              <text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={FONT_SIZE} fill="currentColor" className={label}>
                {formatAxis(t)}
              </text>
            </g>
          ))}
          {xLabelIdx.map((i) => (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={PAD.top} y2={PAD.top + innerH} stroke="currentColor" strokeDasharray="3 3" className="text-[#111814]/10 dark:text-[#eef1ec]/10" />
              <text x={x(i)} y={PAD.top + innerH + 18} textAnchor="middle" fontSize={FONT_SIZE} fill="currentColor" className={label}>
                {data[i][xKey]}
              </text>
            </g>
          ))}
          <line x1={left} x2={left + innerW} y1={PAD.top + innerH} y2={PAD.top + innerH} stroke="currentColor" className={muted} />
          <line x1={left} x2={left} y1={PAD.top} y2={PAD.top + innerH} stroke="currentColor" className={muted} />

          {data.length > 1 ? (
            <path d={monotonePath(points)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            data.length === 1 && <circle cx={points[0][0]} cy={points[0][1]} r="3.5" fill={color} />
          )}

          {activePoint && (
            <g pointerEvents="none">
              <line x1={activePoint.px} x2={activePoint.px} y1={PAD.top} y2={PAD.top + innerH} stroke="currentColor" className="text-[#111814]/25 dark:text-[#eef1ec]/25" />
              <circle cx={activePoint.px} cy={activePoint.py} r="4" fill={color} stroke="#ffffff" strokeWidth="2" />
            </g>
          )}

          <rect
            x={left}
            y={PAD.top}
            width={innerW}
            height={innerH}
            fill="transparent"
            style={{ touchAction: "pan-y" }}
            onPointerMove={pick}
            onPointerDown={pick}
            onPointerLeave={() => setActive(null)}
            onPointerCancel={() => setActive(null)}
          />
        </svg>
      )}

      {activePoint && (
        <div
          className="pointer-events-none absolute z-10 whitespace-nowrap border border-[#111814]/12 bg-[#ffffff] px-3 py-2 text-[12.5px] leading-5 text-[#111814] dark:border-[#eef1ec]/12 dark:bg-[#0b1210] dark:text-[#eef1ec]"
          style={{
            top: Math.max(0, activePoint.py - 52),
            [tipOnLeft ? "right" : "left"]: tipOnLeft ? w - activePoint.px + 12 : activePoint.px + 12,
          }}
        >
          <div className="font-semibold">{formatLabel(activePoint.d[xKey])}</div>
          <div style={{ color }}>{formatValue(activePoint.d[yKey])}</div>
        </div>
      )}
    </div>
  );
}
