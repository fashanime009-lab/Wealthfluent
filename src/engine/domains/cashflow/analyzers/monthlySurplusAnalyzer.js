export function calculateMonthlySurplus(monthlyIncome, monthlyExpenses) {
  const surplus = monthlyIncome - monthlyExpenses;

  return {
    amount: surplus,
    isPositive: surplus >= 0,
  };
}