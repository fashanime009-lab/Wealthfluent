export function analyzeEmergencyFund(currentFund, monthlyExpenses) {
  const requiredFund = monthlyExpenses * 6;

  const monthsCovered =
    monthlyExpenses > 0
      ? currentFund / monthlyExpenses
      : 0;

  let level = "poor";

  if (monthsCovered >= 6) level = "excellent";
  else if (monthsCovered >= 3) level = "good";
  else if (monthsCovered >= 1) level = "average";

  return {
    requiredFund,
    monthsCovered,
    level,
  };
}