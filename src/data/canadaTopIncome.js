// Canada's high-income thresholds, total income before tax, 2023 tax year.
//
// Source: Statistics Canada, "High-income tax filers in Canada, 2023",
// The Daily, 31 October 2025 (Tables 1 and 2; table 11-10-0055-01).
// https://www150.statcan.gc.ca/n1/daily-quotidien/251031/dq251031b-eng.htm
//
// "Total income" includes employment and self-employment income, investment
// income, pensions, support payments, other taxable income and government
// transfers. Update all four together when StatCan publishes a new year,
// and change TAX_YEAR to match.
export const CANADA_TOP_INCOME = {
  TAX_YEAR: 2023,
  averageFiler: 59_900,
  top1Cutoff: 293_800,
  top01Cutoff: 930_100,
  top001Cutoff: 3_487_600,
};

/**
 * Where a yearly income (CAD) sits against the thresholds above. Returns
 * null for an empty, zero, negative or non-numeric income. Below the top 1%
 * we only report the comparison with the average filer and the gap to the
 * cutoff: StatCan's release doesn't give the percentiles in between, so we
 * don't invent one.
 */
export function canadaTopIncomeResult(income) {
  if (!Number.isFinite(income) || income <= 0) return null;
  const { averageFiler, top1Cutoff, top01Cutoff, top001Cutoff } = CANADA_TOP_INCOME;

  let bracket = "below";
  if (income >= top001Cutoff) bracket = "top0.01";
  else if (income >= top01Cutoff) bracket = "top0.1";
  else if (income >= top1Cutoff) bracket = "top1";

  return {
    bracket,
    timesAverage: income / averageFiler,
    gapToTop1: bracket === "below" ? top1Cutoff - income : 0,
  };
}
