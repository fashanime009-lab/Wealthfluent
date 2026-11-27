export function calculateHomeAffordability({
  propertyPrice,
  downPayment,
  monthlyIncome,
  monthlyExpenses,
  existingEMI,
  loanTenure,
  interestRate,
}) {
  propertyPrice = Number(propertyPrice) || 0;
  downPayment = Number(downPayment) || 0;
  monthlyIncome = Number(monthlyIncome) || 0;
  monthlyExpenses = Number(monthlyExpenses) || 0;
  existingEMI = Number(existingEMI) || 0;
  // `|| default` treats a legitimate 0 as "missing": a 0% rate silently
  // became 8.5%. Only fall back when the value isn't a usable number.
  loanTenure = Number(loanTenure) > 0 ? Number(loanTenure) : 20;
  interestRate = Number.isFinite(Number(interestRate)) && Number(interestRate) >= 0 ? Number(interestRate) : 8.5;

  const loanAmount = Math.max(
    propertyPrice - downPayment,
    0
  );

  const availableCashFlow =
    monthlyIncome -
    monthlyExpenses -
    existingEMI;

  const monthlyInterest =
    interestRate / 12 / 100;

  const totalMonths =
    loanTenure * 12;

  let estimatedEMI = 0;

  if (loanAmount > 0 && monthlyInterest === 0) {
    estimatedEMI = loanAmount / totalMonths;
  } else if (loanAmount > 0) {
    estimatedEMI =
      (
        loanAmount *
        monthlyInterest *
        Math.pow(
          1 + monthlyInterest,
          totalMonths
        )
      ) /
      (
        Math.pow(
          1 + monthlyInterest,
          totalMonths
        ) - 1
      );
  }

  const monthlyCashAfterEMI =
    availableCashFlow -
    estimatedEMI;

  const emiRatio =
    monthlyIncome > 0
      ? (estimatedEMI / monthlyIncome) * 100
      : 0;

  const debtToIncomeRatio =
    monthlyIncome > 0
      ? (
          (existingEMI + estimatedEMI) /
          monthlyIncome
        ) * 100
      : 0;

  let affordabilityScore;
  let recommendation;

  // Rated on ALL EMIs (the new one plus existing loans), not the new EMI
  // alone: a new EMI at 30% of income on top of existing EMIs at 30% used
  // to rate "Excellent" with 60% of income already going to loans. And a
  // home that leaves less than nothing each month is High Risk whatever
  // the ratio says.
  if (monthlyCashAfterEMI < 0) {
    affordabilityScore = 30;
    recommendation = "High Risk";
  } else if (debtToIncomeRatio <= 30) {
    affordabilityScore = 90;
    recommendation = "Excellent";
  } else if (debtToIncomeRatio <= 40) {
    affordabilityScore = 75;
    recommendation = "Good";
  } else if (debtToIncomeRatio <= 50) {
    affordabilityScore = 55;
    recommendation = "Caution";
  } else {
    affordabilityScore = 30;
    recommendation = "High Risk";
  }

  return {
    loanAmount,
    availableCashFlow,
    estimatedEMI,
    monthlyCashAfterEMI,
    emiRatio,
    debtToIncomeRatio,
    affordabilityScore,
    recommendation,
  };
}