// Shared by the Hero's live demo and the calculators spotlight cards, so
// every instrument-panel moment computes its numbers the same way.
export function sipFutureValue(monthly, years, annualRate = 12) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

// Standard reducing-balance EMI, plus the principal/interest split — the
// real data behind the Loan spotlight's proportion bar.
export function emiBreakdown(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}
