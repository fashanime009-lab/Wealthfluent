// Debt payoff vs Invest — net worth comparison.
// Both paths spend the exact same amount of cash each month (minimum + the
// extra amount in question). Scenario A puts all of it toward the debt until
// it's gone, then invests the freed-up cash for the rest of the horizon.
// Scenario B pays only the minimum and invests the extra the whole time.
// We compare net worth = investments minus any remaining debt, at the end.
export function calculateDebtVsInvest({
  debtBalance,
  debtRate, // annual %
  minPayment,
  extra,
  investReturnPct, // annual %
  years,
}) {
  const horizonMonths = years * 12;
  const monthlyDebtRate = debtRate / 12 / 100;
  const monthlyInvestReturn = investReturnPct / 12 / 100;

  // Scenario A: debt-first
  let balanceA = debtBalance;
  let portfolioA = 0;
  let payoffMonth = null;
  const seriesA = [];
  for (let month = 1; month <= horizonMonths; month++) {
    if (balanceA > 0) {
      const interest = balanceA * monthlyDebtRate;
      const payment = Math.min(minPayment + extra, balanceA + interest);
      const principalPaid = payment - interest;
      balanceA = Math.max(0, balanceA - principalPaid);
      if (balanceA === 0 && payoffMonth === null) payoffMonth = month;
    } else {
      portfolioA = portfolioA * (1 + monthlyInvestReturn) + (minPayment + extra);
    }
    if (month % 12 === 0) seriesA.push(portfolioA - balanceA);
  }

  // Scenario B: minimum only, invest the extra
  let balanceB = debtBalance;
  let portfolioB = 0;
  const seriesB = [];
  for (let month = 1; month <= horizonMonths; month++) {
    if (balanceB > 0) {
      const interest = balanceB * monthlyDebtRate;
      const payment = Math.min(minPayment, balanceB + interest);
      const principalPaid = payment - interest;
      balanceB = Math.max(0, balanceB - principalPaid);
    }
    portfolioB = portfolioB * (1 + monthlyInvestReturn) + extra;
    if (month % 12 === 0) seriesB.push(portfolioB - balanceB);
  }

  const series = seriesA.map((debtFirst, i) => ({
    year: i + 1,
    debtFirst,
    investFirst: seriesB[i],
  }));

  const netWorthA = portfolioA - balanceA;
  const netWorthB = portfolioB - balanceB;
  const gap = netWorthA - netWorthB;
  const gapPct = (Math.abs(gap) / Math.max(Math.abs(netWorthA), Math.abs(netWorthB), 1)) * 100;

  let tone = "caution";
  if (gapPct >= 8) tone = "go";

  return {
    payoffMonth,
    netWorthA,
    netWorthB,
    portfolioA,
    portfolioB,
    remainingDebtB: balanceB,
    gap,
    gapPct,
    winner: gap > 0 ? "debt" : "invest",
    tone,
    series,
  };
}
