// Where a net worth figure ranks among the world's adults.
//
// There is no live, per-person global wealth register — no tool anywhere
// can give you an exact rank. What follows is a smooth statistical model
// (a log-normal distribution, the standard textbook model for right-skewed
// wealth data) calibrated against two figures from the UBS Global Wealth
// Report 2026 (covering 2025 data):
//
//   - "The proportion of adults in the lowest wealth band, i.e. below
//      USD 10,000, dropped from almost 75% in 2000 to just over 41% in
//      2025." — modeled here as exactly 41%.
//      https://www.ubs.com/global/en/media/display-page-ndp/en-20260630-gwr-2026.html
//   - The world's ~57.5 million USD millionaires are, against a world
//     adult population of roughly 5.6 billion, almost exactly 1% of all
//     adults — so $1,000,000 is kept as the top-1% threshold rather than
//     moved, since this data doesn't actually contradict it.
//
// Unlike the previous version of this file, the median is NOT an input —
// it's the output of fitting the curve to those two points (41% of
// adults are below $10,000, i.e. below the 50th percentile, so the real
// median must sit above $10,000; the fit below puts it at roughly
// $15,000). Recalibrating shifted every percentile noticeably: someone
// with $45,000, for example, moves from "richer than ~79% of adults" to
// "~73%" — genuinely less impressive than before, which is the point of
// using the real distribution rather than a stale anchor.
//
// Both reference points move slowly (annually, with each new report) —
// see the page's own disclaimer before treating the output as more
// precise than it is.
const WORLD_BAND_THRESHOLD_USD = 10000;
const TOP_1_PCT_THRESHOLD_USD = 1000000;

// Standard-normal quantiles at those two reference probabilities — 41%
// (Φ⁻¹(0.41)) and 99% (Φ⁻¹(0.99)) — computed once against the same
// erf-based normalCdf this file already uses below, so the fit is
// internally consistent rather than mixing in an independently-sourced
// approximation.
const Z_BAND = -0.2275; // Φ⁻¹(0.41)
const Z_99TH_PERCENTILE = 2.3263;

const SIGMA = (Math.log(TOP_1_PCT_THRESHOLD_USD) - Math.log(WORLD_BAND_THRESHOLD_USD)) / (Z_99TH_PERCENTILE - Z_BAND);
const MU = Math.log(WORLD_BAND_THRESHOLD_USD) - SIGMA * Z_BAND;

// The fitted curve's own 50th percentile — derived, not assumed. ≈ $15,072.
export const MEDIAN_NET_WORTH_USD = Math.exp(MU);

// Approximate, fixed conversion to USD — NOT a live exchange rate, but a
// real one: Federal Reserve H.10 noon buying rates, 18 Sep 2026. Good
// enough to place a figure on a global curve; not precise enough for
// anything that needs today's actual rate. (The previous table's INR
// rate — ~83/$ — was stale enough by ~15% to move someone's result by a
// meaningful number of percentile points; update this table periodically
// rather than treating it as permanent.)
export const USD_CONVERSION_RATES = {
  USD: 1,
  EUR: 1.15,
  GBP: 1.34,
  INR: 0.0104,
  JPY: 0.0064,
  AUD: 0.71,
  CAD: 0.714,
};

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

function percentileFromNetWorth(netWorthUSD) {
  if (netWorthUSD <= 0) return null;
  const z = (Math.log(netWorthUSD) - MU) / SIGMA;
  return Math.min(99.99, Math.max(0.01, normalCdf(z) * 100));
}

// Reference thresholds shown on the page — the reverse question ("what
// net worth reaches the top 10%?"), using the same calibrated curve.
const REFERENCE_POINTS = [
  { label: "Top 50%", z: 0 },
  { label: "Top 25%", z: 0.6745 },
  { label: "Top 10%", z: 1.2816 },
  { label: "Top 5%", z: 1.6449 },
  { label: "Top 1%", z: Z_99TH_PERCENTILE },
  { label: "Top 0.1%", z: 3.0902 },
];

export function getReferenceThresholdsUSD() {
  return REFERENCE_POINTS.map(({ label, z }) => ({
    label,
    netWorthUSD: Math.exp(MU + SIGMA * z),
  }));
}

function bucketFor(percentile) {
  if (percentile >= 99.9) return "the top 0.1% of the world's adults";
  if (percentile >= 99) return "the top 1% of the world's adults";
  if (percentile >= 95) return "the top 5% of the world's adults";
  if (percentile >= 90) return "the top 10% of the world's adults";
  if (percentile >= 75) return "the top 25% of the world's adults";
  if (percentile >= 50) return "the wealthier half of the world's adults";
  return "the less wealthy half of the world's adults";
}

export function calculateGlobalWealthPercentile({ netWorth, currencyCode }) {
  const rate = USD_CONVERSION_RATES[currencyCode] ?? 1;
  const netWorthUSD = (Number(netWorth) || 0) * rate;
  const rawPercentile = percentileFromNetWorth(netWorthUSD);

  if (rawPercentile === null) {
    return {
      netWorthUSD,
      percentile: null,
      topPercent: null,
      bucket: null,
      timesMedian: netWorthUSD / MEDIAN_NET_WORTH_USD,
    };
  }

  // Round once, then derive the bucket label from that same rounded
  // number — otherwise a value that displays as "99.0th percentile" can
  // fail a ">= 99" bucket check by a float hair and show "top 5%" right
  // next to it, which reads as a bug even though the underlying estimate
  // is fine.
  const percentile = Math.round(rawPercentile * 10) / 10;

  return {
    netWorthUSD,
    percentile,
    topPercent: Math.max(0.01, Math.round((100 - percentile) * 100) / 100),
    bucket: bucketFor(percentile),
    timesMedian: netWorthUSD / MEDIAN_NET_WORTH_USD,
  };
}
