import { USD_CONVERSION_RATES } from "./globalWealthPercentile";

// Where an annual income figure ranks among the world's adults.
//
// Like globalWealthPercentile.js, there is no live per-person global income
// register — nothing can give an exact rank. This uses the same kind of
// smooth statistical model (log-normal, the standard model for right-skewed
// income data) but calibrated differently, because the source data differs:
// the World Inequality Report 2026 (World Inequality Lab, wid.world) publishes
// income SHARES held by population bands, not dollar thresholds directly.
//
//   - "The poorest half of the world's adults (~2.8 billion people) receive
//      about 8% of global income; the richest 10% (~560 million people)
//      receive about 53%." https://wid.world/world-inequality-report-2026/
//
// For a log-normal distribution the Lorenz curve has a closed form:
// L(F) = Φ(Φ⁻¹(F) − σ), where F is a population fraction and L(F) is the
// share of total income held by that bottom fraction. At F = 0.5,
// Φ⁻¹(0.5) = 0, so L(0.5) = Φ(−σ) = 0.08 ⟺ σ = −Φ⁻¹(0.08) ≈ 1.405 — the
// one shape parameter this model needs, fitted directly to the report's
// headline bottom-50% figure. (Checked against the report's other headline
// figure — the top 1% earning about 2.5× the entire bottom half, i.e. ~20%
// of global income — this fitted curve implies ~17.9%: in the right range,
// not exact, which is expected of any single smooth curve fitted to a
// real, lumpier distribution.)
//
// A log-normal's shape alone doesn't fix its dollar scale — that needs one
// more anchor. World GDP (PPP) is the standard, independently-checkable
// stand-in for aggregate income: the IMF's October 2025 World Economic
// Outlook puts 2025 world GDP at roughly $209 trillion in PPP terms. Divided
// by the same ~5.6 billion world adult population used in
// globalWealthPercentile.js, that's a mean income of roughly $37,300 per
// adult per year — GDP isn't identical to the report's own national-income
// measure, but it's the closest broadly-published, verifiable proxy for it.
const WORLD_GDP_PPP_USD = 209_000_000_000_000;
const WORLD_ADULT_POPULATION = 5_600_000_000;
const MEAN_INCOME_USD = WORLD_GDP_PPP_USD / WORLD_ADULT_POPULATION;

// Φ⁻¹(0.92), equivalently −Φ⁻¹(0.08) — see derivation above.
const SIGMA = 1.405;

// For a log-normal, mean = exp(μ + σ²/2), so μ = ln(mean) − σ²/2.
const MU = Math.log(MEAN_INCOME_USD) - (SIGMA * SIGMA) / 2;

// The fitted curve's own 50th percentile — derived, not assumed. ≈ $13,900.
export const MEDIAN_INCOME_USD = Math.exp(MU);

// Same fixed, approximate USD conversion table as the net worth percentile
// calculator — see globalWealthPercentile.js for its sourcing note. Shared
// here rather than duplicated so the two pages never drift apart.
export { USD_CONVERSION_RATES };

// Abramowitz & Stegun 7.1.26 — accurate to ~1.5e-7, plenty for this.
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function percentileFromIncome(incomeUSD) {
  if (incomeUSD <= 0) return null;
  const z = (Math.log(incomeUSD) - MU) / SIGMA;
  return Math.min(99.99, Math.max(0.01, normalCdf(z) * 100));
}

// Reference thresholds shown on the page — the reverse question ("what
// income reaches the top 10%?"), using the same calibrated curve.
const REFERENCE_POINTS = [
  { label: "Top 50%", z: 0 },
  { label: "Top 25%", z: 0.6745 },
  { label: "Top 10%", z: 1.2816 },
  { label: "Top 5%", z: 1.6449 },
  { label: "Top 1%", z: 2.3263 },
  { label: "Top 0.1%", z: 3.0902 },
];

export function getIncomeReferenceThresholdsUSD() {
  return REFERENCE_POINTS.map(({ label, z }) => ({
    label,
    incomeUSD: Math.exp(MU + SIGMA * z),
  }));
}

function bucketFor(percentile) {
  if (percentile >= 99.9) return "the top 0.1% of the world's adults by income";
  if (percentile >= 99) return "the top 1% of the world's adults by income";
  if (percentile >= 95) return "the top 5% of the world's adults by income";
  if (percentile >= 90) return "the top 10% of the world's adults by income";
  if (percentile >= 75) return "the top 25% of the world's adults by income";
  if (percentile >= 50) return "the higher-earning half of the world's adults";
  return "the lower-earning half of the world's adults";
}

export function calculateGlobalIncomePercentile({ income, currencyCode }) {
  const rate = USD_CONVERSION_RATES[currencyCode] ?? 1;
  const incomeUSD = (Number(income) || 0) * rate;
  const rawPercentile = percentileFromIncome(incomeUSD);

  if (rawPercentile === null) {
    return {
      incomeUSD,
      percentile: null,
      topPercent: null,
      bucket: null,
      timesMedian: incomeUSD / MEDIAN_INCOME_USD,
    };
  }

  // Round once, then derive the bucket label from that same rounded number
  // — see globalWealthPercentile.js for why (avoids a float-hair mismatch
  // between the displayed percentile and the bucket shown next to it).
  const percentile = Math.round(rawPercentile * 10) / 10;

  return {
    incomeUSD,
    percentile,
    topPercent: Math.max(0.01, Math.round((100 - percentile) * 100) / 100),
    bucket: bucketFor(percentile),
    timesMedian: incomeUSD / MEDIAN_INCOME_USD,
  };
}
