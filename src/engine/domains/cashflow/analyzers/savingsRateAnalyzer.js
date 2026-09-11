export function calculateSavingsRate(monthlyIncome, monthlyExpenses) {
  if (monthlyIncome <= 0) {
    return {
      percentage: 0,
      status: "no-income",
    };
  }

  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const percentage = (monthlySurplus / monthlyIncome) * 100;

  let status = "poor";

  if (percentage >= 40) status = "excellent";
  else if (percentage >= 25) status = "good";
  else if (percentage >= 10) status = "average";

  return {
    percentage: Number(percentage.toFixed(1)),
    status,
  };
}