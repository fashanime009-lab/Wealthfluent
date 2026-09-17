// Where a net worth figure ranks among the world's adults.
//
// There is no live, per-person global wealth register — no tool anywhere
// can give you an exact rank. What follows is a smooth statistical model
// calibrated against the two most widely-cited reference points from
// global wealth-distribution research (UBS/Credit Suisse Global Wealth
// Report-style figures, repeated across financial media for years):
//   - the median adult net worth worldwide is roughly $8,500
//   - roughly $1,000,000 in net worth places someone in the world's
//     wealthiest ~1% of adults
// Global wealth is famously right-skewed — a small share of people hold
// a large share of total wealth — which a log-normal distribution
// approximates well and is the standard textbook model for this kind of
// data. This is a genuine estimate, not a precise ranking, and both
// reference points move slowly year to year — see the page's own
// disclaimer before treating the output as more precise than it is.
const MEDIAN_NET_WORTH_USD = 8500;
const TOP_1_PCT_THRESHOLD_USD = 1000000;

const Z_99TH_PERCENTILE = 2.326;
const MU = Math.log(MEDIAN_NET_WORTH_USD);
const SIGMA = (Math.log(TOP_1_PCT_THRESHOLD_USD) - MU) / Z_99TH_PERCENTILE;

// Approximate, fixed conversion to USD — NOT a live exchange rate. Good
// enough to place a figure on a global curve; not precise enough for
// anything that needs today's actual rate.
export const USD_CONVERSION_RATES = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  JPY: 0.0067,
  AUD: 0.65,
  CAD: 0.73,
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
