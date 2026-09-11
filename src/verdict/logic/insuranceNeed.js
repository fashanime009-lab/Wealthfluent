// How much term life insurance do you need? — Needs-based method (the
// standard approach used by insurers and fee-only advisors): replace lost
// income for a set number of years, add outstanding debts and future goals,
// then subtract what you already have (savings + existing cover).
export function calculateInsuranceNeed({
  annualIncome,
  incomeReplacementYears,
  outstandingLoans,
  futureGoalsCost,
  existingSavings,
  existingCover,
}) {
  const incomeReplacement = annualIncome * incomeReplacementYears;
  const totalNeed = incomeReplacement + outstandingLoans + futureGoalsCost;
  const totalHave = existingSavings + existingCover;
  const gap = totalNeed - totalHave;
  const additionalCoverNeeded = Math.max(0, gap);

  let tone = "go";
  if (additionalCoverNeeded > annualIncome * 3) tone = "stop";
  else if (additionalCoverNeeded > 0) tone = "caution";

  return {
    incomeReplacement,
    totalNeed,
    totalHave,
    additionalCoverNeeded,
    isAdequate: gap <= 0,
    tone,
  };
}
