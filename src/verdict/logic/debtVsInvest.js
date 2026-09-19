// Debt payoff vs Invest — net worth comparison.
// Both paths deploy the exact same cash every month: minPayment + extra.
// Scenario A sends all of it at the debt until it's gone, then invests the
// whole amount for the rest of the horizon. Scenario B sends only the
// minimum at the debt and invests everything else — including, once its
// debt is finally cleared, the minimum payment that's no longer needed.
// (An earlier version dropped that freed-up minimum in scenario B, so B
// quietly spent less than A each month after payoff and debt-first won
// even when the debt rate was far below the investment return.)
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
  const monthlyBudget = minPayment + extra;

  // One month of debt service: accrue interest, pay up to `cap`, return the
  // new balance and how much cash actually went to the lender.
  const serviceDebt = (balance, cap) => {
    if (balance <= 0) return { balance: 0, paid: 0 };
    const owed = balance * (1 + monthlyDebtRate);
    const paid = Math.min(cap, owed);
    return { balance: owed - paid, paid };
  };

  // Scenario A: debt-first
  let balanceA = debtBalance;
  let portfolioA = 0;
  let payoffMonth = null;
  const seriesA = [];
  for (let month = 1; month <= horizonMonths; month++) {
    const step = serviceDebt(balanceA, monthlyBudget);
    balanceA = step.balance;
    if (balanceA === 0 && payoffMonth === null) payoffMonth = month;
    portfolioA = portfolioA * (1 + monthlyInvestReturn) + (monthlyBudget - step.paid);
    if (month % 12 === 0) seriesA.push(portfolioA - balanceA);
  }

  // Scenario B: minimum only, invest everything else
  let balanceB = debtBalance;
  let portfolioB = 0;
  const seriesB = [];
  for (let month = 1; month <= horizonMonths; month++) {
    const step = serviceDebt(balanceB, minPayment);
    balanceB = step.balance;
    portfolioB = portfolioB * (1 + monthlyInvestReturn) + (monthlyBudget - step.paid);
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
