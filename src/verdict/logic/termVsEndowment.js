// Term Insurance + Invest vs Endowment/ULIP — maturity value comparison.
// Both paths spend the exact same total premium budget each year. Term +
// Invest pays a cheap term premium for real cover and invests everything
// left over in the market. Endowment/ULIP puts the whole budget into the
// policy, which bundles a much smaller amount of cover with an investment
// return that's historically far lower than the market, after charges.
export function calculateTermVsEndowment({
  annualPremiumBudget,
  termPremium,
  years,
  investReturnPct, // annual %
  endowmentReturnPct, // annual %, net of charges
}) {
  const investable = Math.max(0, annualPremiumBudget - termPremium);

  let portfolioA = 0; // Term + Invest
  let portfolioB = 0; // Endowment / ULIP
  const series = [];

  for (let year = 1; year <= years; year++) {
    portfolioA = portfolioA * (1 + investReturnPct / 100) + investable;
    portfolioB = portfolioB * (1 + endowmentReturnPct / 100) + annualPremiumBudget;
    series.push({ year, termInvest: portfolioA, endowment: portfolioB });
  }

  const gap = portfolioA - portfolioB;
  const gapPct = (Math.abs(gap) / Math.max(portfolioA, portfolioB, 1)) * 100;

  let tone = "caution";
  if (gapPct >= 8) tone = "go";

  return {
    maturityTermInvest: portfolioA,
    maturityEndowment: portfolioB,
    totalPremiumsPaid: annualPremiumBudget * years,
    gap,
    gapPct,
    winner: gap > 0 ? "termInvest" : "endowment",
    tone,
    series,
  };
}
