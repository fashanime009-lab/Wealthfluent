// Chart data is computed from the same formulas the lesson prose already
// uses (monthly-compounding SIP, annual lump-sum compounding), not hand
// plotted — so a chart can't silently drift out of sync with the number
// quoted in the paragraph next to it.

// Monthly SIP future value, standard annuity-due formula. `delayYears` lets
// a lesson show "invest the same amount, just starting later" by leaving
// the series at 0 until the delay has passed.
export function sipSeries(monthly, annualRatePercent, years, { delayYears = 0 } = {}) {
  const r = annualRatePercent / 100 / 12;
  const points = [];
  for (let year = 0; year <= years; year++) {
    const investedMonths = Math.max(0, year - delayYears) * 12;
    const value = investedMonths === 0 ? 0 : monthly * ((Math.pow(1 + r, investedMonths) - 1) / r) * (1 + r);
    points.push({ x: year, y: value });
  }
  return points;
}

// Lump-sum compounding, annual — also reused for simple price inflation
// (principal = today's price, rate = inflation rate).
export function lumpsumSeries(principal, annualRatePercent, years) {
  const r = annualRatePercent / 100;
  const points = [];
  for (let year = 0; year <= years; year++) {
    points.push({ x: year, y: principal * Math.pow(1 + r, year) });
  }
  return points;
}

// Fixed annual contribution, compounded annually (PPF-style) — same
// annuity-due shape as sipSeries but one deposit a year instead of twelve.
export function annualSeries(annualAmount, annualRatePercent, years) {
  const r = annualRatePercent / 100;
  const points = [];
  for (let year = 0; year <= years; year++) {
    const value = year === 0 ? 0 : annualAmount * ((Math.pow(1 + r, year) - 1) / r) * (1 + r);
    points.push({ x: year, y: value });
  }
  return points;
}

export function generateSeries(gen) {
  switch (gen.kind) {
    case "sip":
      return sipSeries(gen.monthly, gen.rate, gen.years, { delayYears: gen.delayYears });
    case "lumpsum":
      return lumpsumSeries(gen.principal, gen.rate, gen.years);
    case "annual":
      return annualSeries(gen.annualAmount, gen.rate, gen.years);
    default:
      return [];
  }
}
