// Lease vs Buy a Car — same logic shape as Rent vs Buy: whichever option
// costs less upfront/monthly, the difference gets invested. Net worth at
// the end = asset value (resale minus loan owed) vs invested portfolio.
export function calculateLeaseVsBuy({
  carPrice,
  downPaymentPct,
  loanRate,
  loanTenureYears,
  monthlyLease,
  dueAtSigning,
  depreciationPct, // annual %
  investReturnPct,
  years,
}) {
  const downPayment = carPrice * (downPaymentPct / 100);
  const loanAmount = carPrice - downPayment;
  const monthlyRate = loanRate / 12 / 100;
  const loanMonths = loanTenureYears * 12;

  const emi =
    monthlyRate === 0
      ? loanAmount / loanMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1);

  const totalMonths = years * 12;
  const monthlyInvestReturn = investReturnPct / 12 / 100;

  // Both start with the same capital, so whichever option needs less cash
  // upfront keeps the difference and invests it. If the lease's
  // due-at-signing is bigger than the buyer's down payment, it's the BUYER
  // who keeps the spare cash (an earlier version subtracted that gap from
  // the buyer instead, so a costlier lease made buying look worse).
  const upfrontGap = downPayment - dueAtSigning;
  let portfolio = Math.max(0, upfrontGap);
  const buyerSpareCash = Math.max(0, -upfrontGap);

  for (let month = 1; month <= totalMonths; month++) {
    const emiThisMonth = month <= loanMonths ? emi : 0;
    const diff = emiThisMonth - monthlyLease;
    portfolio = portfolio * (1 + monthlyInvestReturn) + diff;
  }

  const carResaleValue = carPrice * Math.pow(1 - depreciationPct / 100, years);

  const monthsElapsed = Math.min(totalMonths, loanMonths);
  const remainingBalance =
    monthsElapsed >= loanMonths
      ? 0
      : monthlyRate === 0
      ? loanAmount - emi * monthsElapsed
      : loanAmount * Math.pow(1 + monthlyRate, monthsElapsed) -
        emi * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const buyerSpareCashGrown = buyerSpareCash * Math.pow(1 + monthlyInvestReturn, totalMonths);
  const buyerNetWorth = carResaleValue - Math.max(0, remainingBalance) + buyerSpareCashGrown;
  const lesseeNetWorth = portfolio;
  const gap = buyerNetWorth - lesseeNetWorth;
  const gapPct = (Math.abs(gap) / Math.max(Math.abs(buyerNetWorth), Math.abs(lesseeNetWorth), 1)) * 100;

  let tone = "caution";
  if (gapPct >= 8) tone = "go";

  return {
    emi,
    downPayment,
    carResaleValue,
    remainingBalance: Math.max(0, remainingBalance),
    buyerNetWorth,
    lesseeNetWorth,
    gap,
    gapPct,
    winner: gap > 0 ? "buy" : "lease",
    tone,
  };
}
