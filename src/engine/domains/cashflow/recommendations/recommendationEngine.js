export function buildCashflowRecommendations({
  savingsRate,
  monthlySurplus,
}) {
  const recommendations = [];

  if (monthlySurplus < 0) {
    recommendations.push({
      priority: "high",
      title: "Reduce Monthly Spending",
      description:
        "Your monthly expenses exceed your income.",
    });
  }

  if (savingsRate < 20) {
    recommendations.push({
      priority: "medium",
      title: "Increase Savings Rate",
      description:
        "Aim to save at least 20% of your monthly income.",
    });
  }

  if (savingsRate >= 40) {
    recommendations.push({
      priority: "low",
      title: "Maintain Your Momentum",
      description:
        "Your savings rate is excellent. Stay consistent.",
    });
  }

  return recommendations;
}