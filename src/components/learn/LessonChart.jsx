import { generateSeries } from "@/utils/chartMath";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";
import { USD_CONVERSION_RATES } from "@/services/calculators/globalWealthPercentile";

const WIDTH = 640;
const HEIGHT = 240;
const PAD = { top: 16, right: 16, bottom: 32, left: 54 };

function formatValue(value, unit, currency) {
  if (unit === "years") return `${Math.round(value)}y`;
  return formatCurrency(value, currency, true);
}

// Every lesson chart's underlying numbers (gen.principal, bar.value, etc.)
// were written in INR, same as the lesson prose right next to it. `inr()`
// converts each one through its real USD value into the viewer's selected
// currency before the chart is generated/rendered, the same approach used
// for calculator worked examples (see useExampleCurrency) — otherwise the
// chart kept showing ₹ regardless of the currency picked in Settings.
function useChartCurrency() {
  const { settings } = useSettings();
  const rate = USD_CONVERSION_RATES[settings.currency] ?? 1;
  const inr = (rupees) => Math.round((rupees * USD_CONVERSION_RATES.INR) / rate);
  return { currency: settings.currency, inr };
}

function GrowthChart({ chart }) {
  const { currency, inr } = useChartCurrency();
  const convertGen = (gen) => {
    if (chart.unit !== "INR") return gen;
    const converted = { ...gen };
    if (converted.monthly != null) converted.monthly = inr(converted.monthly);
    if (converted.principal != null) converted.principal = inr(converted.principal);
    if (converted.annualAmount != null) converted.annualAmount = inr(converted.annualAmount);
    return converted;
  };
  const series = chart.series.map((s) => ({ ...s, points: generateSeries(convertGen(s.gen)) }));
  const allPoints = series.flatMap((s) => s.points);
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const maxY = Math.max(...allPoints.map((p) => p.y)) * 1.08;

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const sx = (x) => PAD.left + (x / maxX) * innerW;
  const sy = (y) => PAD.top + innerH - (y / maxY) * innerH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);
  const xTicks = [0, Math.round(maxX / 2), maxX];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={chart.title}>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={sy(t)}
            y2={sy(t)}
            className="stroke-[#111814]/8 dark:stroke-[#eef1ec]/10"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 8}
            y={sy(t)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-[#111814]/45 dark:fill-[#eef1ec]/40"
            fontSize="10.5"
            fontFamily="var(--font-mono-tech, monospace)"
          >
            {formatValue(t, chart.unit, currency)}
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <text
          key={i}
          x={sx(t)}
          y={HEIGHT - 10}
          textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
          className="fill-[#111814]/45 dark:fill-[#eef1ec]/40"
          fontSize="10.5"
          fontFamily="var(--font-mono-tech, monospace)"
        >
          Year {t}
        </text>
      ))}
      {series.map((s, i) => {
        const d = s.points.map((p, j) => `${j === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`).join(" ");
        return (
          <path
            key={i}
            d={d}
            fill="none"
            className={s.tone === "muted" ? "stroke-[#b45309] dark:stroke-[#f59e0b]" : "stroke-[#047857] dark:stroke-[#34d399]"}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function BarChart({ chart }) {
  const { currency, inr } = useChartCurrency();
  const bars = chart.unit === "INR" ? chart.bars.map((b) => ({ ...b, value: inr(b.value) })) : chart.bars;
  const maxY = Math.max(...bars.map((b) => b.value)) * 1.15;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const gap = innerW / chart.bars.length;
  const barW = Math.min(64, gap * 0.5);
  const sy = (y) => PAD.top + innerH - (y / maxY) * innerH;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={chart.title}>
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={sy(0)}
        y2={sy(0)}
        className="stroke-[#111814]/15 dark:stroke-[#eef1ec]/15"
        strokeWidth="1"
      />
      {bars.map((b, i) => {
        const cx = PAD.left + gap * i + gap / 2;
        const top = sy(b.value);
        return (
          <g key={i}>
            <rect
              x={cx - barW / 2}
              y={top}
              width={barW}
              height={sy(0) - top}
              rx="2"
              className="fill-[#047857] dark:fill-[#34d399]"
              opacity={i === 0 ? 1 : 0.55 + (0.45 * (bars.length - 1 - i)) / Math.max(1, bars.length - 1)}
            />
            <text
              x={cx}
              y={top - 8}
              textAnchor="middle"
              className="fill-[#111814]/80 dark:fill-[#eef1ec]/80"
              fontSize="11.5"
              fontWeight="600"
              fontFamily="var(--font-mono-tech, monospace)"
            >
              {formatValue(b.value, chart.unit, currency)}
            </text>
            <text
              x={cx}
              y={HEIGHT - 10}
              textAnchor="middle"
              className="fill-[#111814]/55 dark:fill-[#eef1ec]/50"
              fontSize="11"
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LessonChart({ chart }) {
  if (!chart) return null;
  return (
    <div className="mt-8 border border-[#111814]/12 bg-[#ffffff] p-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:p-6">
      <p className="text-[13px] font-semibold text-[#111814]/75 dark:text-[#eef1ec]/70">{chart.title}</p>
      <div className="mt-4">
        {chart.type === "bar" ? <BarChart chart={chart} /> : <GrowthChart chart={chart} />}
      </div>
      {chart.series && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {chart.series.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#111814]/60 dark:text-[#eef1ec]/55">
              <span
                className={`h-2 w-2 rounded-full ${s.tone === "muted" ? "bg-[#b45309] dark:bg-[#f59e0b]" : "bg-[#047857] dark:bg-[#34d399]"}`}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
