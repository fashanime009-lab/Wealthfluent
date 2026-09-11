export function buildCashflowScore({
  savingsRate,
  monthlySurplus,
}) {
  let score = 0;

  if (monthlySurplus > 0) score += 40;

  if (savingsRate >= 40) score += 60;
  else if (savingsRate >= 25) score += 45;
  else if (savingsRate >= 10) score += 30;
  else score += 10;

  return {
    value: Math.min(score, 100),
    level:
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "average"
        : "poor",
  };
}