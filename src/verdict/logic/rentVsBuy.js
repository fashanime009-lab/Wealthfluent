// Rent vs Buy — net worth comparison.
// Method: both buyer and renter start with the same capital (the down payment)
// and the same monthly budget. The buyer puts capital into the home and pays
// EMI + maintenance. The renter invests that same capital in the market, pays
// rent, and invests the monthly difference (EMI+maintenance minus rent) —
// simulated month by month since rent, home value, and the invested gap all
// change over time. At the end, we compare net worth: home equity vs portfolio.
export function calculateRentVsBuy({
  homePrice,
  downPaymentPct,
  loanRate, // annual %
  loanTenureYears,
  monthlyRent,
  rentGrowthPct, // annual %
  homeAppreciationPct, // annual %
  investReturnPct, // annual %
  maintenancePct, // annual % of home value
  years,
}) {
  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = loanRate / 12 / 100;
  const loanMonths = loanTenureYears * 12;

  const emi =
    monthlyRate === 0
      ? loanAmount / loanMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1);

  const totalMonths = years * 12;
  const monthlyInvestReturn = investReturnPct / 12 / 100;

  let portfolio = downPayment; // renter invests what would've been the down payment
  let homeValue = homePrice;
  let totalRentPaid = 0;
  let totalOwnerCashPaid = 0;
  const series = [];

  for (let month = 1; month <= totalMonths; month++) {
    const yearIndex = Math.floor((month - 1) / 12);

    if (month > 1 && (month - 1) % 12 === 0) {
      homeValue = homeValue * (1 + homeAppreciationPct / 100);
    }

    const rentThisMonth = monthlyRent * Math.pow(1 + rentGrowthPct / 100, yearIndex);
    const maintenanceThisMonth = (homeValue * (maintenancePct / 100)) / 12;
    const emiThisMonth = month <= loanMonths ? emi : 0;
    const ownerCostThisMonth = emiThisMonth + maintenanceThisMonth;

    totalRentPaid += rentThisMonth;
    totalOwnerCashPaid += ownerCostThisMonth;

    const diff = ownerCostThisMonth - rentThisMonth;
    portfolio = portfolio * (1 + monthlyInvestReturn) + diff;

    if (month % 12 === 0) {
      const elapsed = month;
      const remaining =
        elapsed >= loanMonths
          ? 0
          : monthlyRate === 0
          ? loanAmount - emi * elapsed
          : loanAmount * Math.pow(1 + monthlyRate, elapsed) -
            emi * ((Math.pow(1 + monthlyRate, elapsed) - 1) / monthlyRate);
      series.push({
        year: month / 12,
        buy: homeValue - Math.max(0, remaining),
        rent: portfolio,
      });
    }
  }

  // Remaining loan balance via standard amortization formula
  const monthsElapsed = Math.min(totalMonths, loanMonths);
  const remainingBalance =
    monthsElapsed >= loanMonths
      ? 0
      : monthlyRate === 0
      ? loanAmount - emi * monthsElapsed
      : loanAmount * Math.pow(1 + monthlyRate, monthsElapsed) -
        emi * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const buyerNetWorth = homeValue - Math.max(0, remainingBalance);
  const renterNetWorth = portfolio;
  const gap = buyerNetWorth - renterNetWorth;
  const gapPct = (Math.abs(gap) / Math.max(buyerNetWorth, renterNetWorth, 1)) * 100;

  let tone = "caution";
  if (gapPct >= 8) tone = "go";

  return {
    emi,
    downPayment,
    homeValueAtEnd: homeValue,
    remainingBalance: Math.max(0, remainingBalance),
    buyerNetWorth,
    renterNetWorth,
    totalRentPaid,
    totalOwnerCashPaid,
    gap,
    gapPct,
    winner: gap > 0 ? "buy" : "rent",
    tone,
    series,
  };
}
