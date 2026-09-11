// Financial Profile — a one-time (editable) snapshot of real numbers the
// person enters about their actual finances: income, expenses, assets,
// liabilities, emergency fund. This is what "overall financial status"
// is computed from — not an aggregation of goals or calculator outputs.
const STORAGE_KEY = "finaiw-financial-profile";

export function getFinancialProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveFinancialProfile(profile) {
  const payload = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("finaiw:financial-profile-updated"));
  return payload;
}

export function clearFinancialProfile() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("finaiw:financial-profile-updated"));
}

/**
 * Real derived metrics from the profile — every number here is computed
 * directly from what the person entered, nothing invented.
 *
 * Scoring rubric (0-100, 25 points per category), documented so it's
 * auditable rather than a black box:
 *  - Savings rate:      20%+ = 25, 15-20% = 20, 10-15% = 15, 5-10% = 10, 0-5% = 5, negative = 0
 *  - Emergency fund:    6+ months = 25, scaled down to 0 at 0 months
 *  - Debt-to-income:    <20% = 25, 20-36% = 18, 36-50% = 10, >50% = 0
 *  - Net worth/income:  3x+ annual income = 25, scaled down, negative net worth = 0
 */
export function computeFinancialHealth(profile) {
  if (!profile) return null;

  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    totalAssets = 0,
    totalLiabilities = 0,
    emergencyFundAmount = 0,
  } = profile;

  const netWorth = totalAssets - totalLiabilities;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const debtToIncome = monthlyIncome > 0 ? (totalLiabilities / (monthlyIncome * 12)) * 100 : 0;
  const emergencyMonths = monthlyExpenses > 0 ? emergencyFundAmount / monthlyExpenses : 0;
  const annualIncome = monthlyIncome * 12;
  const netWorthToIncome = annualIncome > 0 ? netWorth / annualIncome : 0;

  const savingsScore =
    savingsRate >= 20 ? 25 : savingsRate >= 15 ? 20 : savingsRate >= 10 ? 15 : savingsRate >= 5 ? 10 : savingsRate >= 0 ? 5 : 0;

  const emergencyScore = Math.max(0, Math.min(25, (emergencyMonths / 6) * 25));

  const debtScore = debtToIncome < 20 ? 25 : debtToIncome < 36 ? 18 : debtToIncome < 50 ? 10 : 0;

  const netWorthScore = netWorthToIncome <= 0 ? 0 : Math.max(0, Math.min(25, (netWorthToIncome / 3) * 25));

  const score = Math.round(savingsScore + emergencyScore + debtScore + netWorthScore);

  return {
    netWorth,
    monthlySavings,
    savingsRate,
    debtToIncome,
    emergencyMonths,
    score,
    breakdown: [
      { label: "Savings Rate", value: `${savingsRate.toFixed(0)}%`, score: savingsScore, max: 25 },
      { label: "Emergency Fund", value: `${emergencyMonths.toFixed(1)} mo`, score: Math.round(emergencyScore), max: 25 },
      { label: "Debt-to-Income", value: `${debtToIncome.toFixed(0)}%`, score: debtScore, max: 25 },
      { label: "Net Worth", value: null, score: Math.round(netWorthScore), max: 25 },
    ],
  };
}
