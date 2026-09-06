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
  loanTenure = Number(loanTenure) || 20;
  interestRate = Number(interestRate) || 8.5;

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

  if (loanAmount > 0) {
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

  let affordabilityScore = 0;
  let recommendation = "";

  if (emiRatio <= 30) {
    affordabilityScore = 90;
    recommendation = "Excellent";
  } else if (emiRatio <= 40) {
    affordabilityScore = 75;
    recommendation = "Good";
  } else if (emiRatio <= 50) {
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