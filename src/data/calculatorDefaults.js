import { currencies } from "./currencies.js";

// Shared market assumptions, one block per currency, so every calculator
// reads the same rate for the same concept instead of each hand-picking its
// own. equityReturn/inflation/retirementReturn are the only three; loan,
// mortgage and bond rates stay calculator-specific (see DEFAULTS below)
// since those genuinely vary by product, not just by currency.
//
// JPY gets its own inflation (BOJ's 2% target) and retirementReturn: 2%,
// reasoned as a conservative retirement-phase mix (mostly JGBs at ~1%
// yield, plus a modest equity tranche) rather than reusing the 4.5% used
// for USD/GBP/EUR, since Japan's whole rate structure sits structurally
// lower. equityReturn stays 8% even for JPY — that's a global diversified
// equity assumption, not specific to the yen. Nishit should confirm this
// pairing before it goes live.
export const ASSUMPTIONS = {
  INR: { equityReturn: 12, inflation: 6, retirementReturn: 8 },
  USD: { equityReturn: 8, inflation: 3, retirementReturn: 4.5 },
  GBP: { equityReturn: 8, inflation: 3, retirementReturn: 4.5 },
  EUR: { equityReturn: 8, inflation: 2.5, retirementReturn: 4.5 },
  JPY: { equityReturn: 8, inflation: 2, retirementReturn: 2 },
  AUD: { equityReturn: 8, inflation: 3, retirementReturn: 4.5 },
  CAD: { equityReturn: 8, inflation: 3, retirementReturn: 4.5 },
  FALLBACK: { equityReturn: 8, inflation: 3, retirementReturn: 4.5 },
};

export function assumptionsFor(currency) {
  return ASSUMPTIONS[currency] ?? ASSUMPTIONS.FALLBACK;
}

// Every calculator's starting input values, hand-picked per currency —
// never converted at runtime from one currency to another. JPY in
// particular is grounded in real Japanese income/cost-of-living figures
// (MHLW average monthly wage ~¥336k, household spending ~¥305-330k/mo,
// typical NISA contribution ~¥30-38k/mo), not FX-converted from the USD
// column — a straight conversion would put "monthly income" far above
// what a real salary looks like, which is exactly the bug this avoids.
export const DEFAULTS = {
  sip: {
    monthly: { INR: 5000, USD: 500, GBP: 300, EUR: 300, JPY: 30000, AUD: 700, CAD: 700, FALLBACK: 300 },
    years: { INR: 15, USD: 15, GBP: 15, EUR: 15, JPY: 15, AUD: 15, CAD: 15, FALLBACK: 15 },
  },
  emi: {
    // Mortgage-scale in every currency, including INR — the page copy and
    // FAQ don't commit to one loan type, so "same loan type everywhere"
    // means matching scale across the board rather than INR staying a
    // smaller personal-loan-style example.
    loan: { INR: 5000000, USD: 350000, GBP: 250000, EUR: 250000, JPY: 35000000, AUD: 490000, CAD: 490000, FALLBACK: 300000 },
    rate: { INR: 8.5, USD: 7, GBP: 6, EUR: 4, JPY: 1.5, AUD: 6, CAD: 5.5, FALLBACK: 7 },
    years: { INR: 20, USD: 30, GBP: 25, EUR: 25, JPY: 35, AUD: 30, CAD: 25, FALLBACK: 25 },
  },
  cagr: {
    // Scale-invariant — same round figures everywhere, including INR.
    // 10,000 -> 20,000 over 5 years is ~14.9% CAGR, not the ~38% the old
    // 10,000 -> 50,000 example implied.
    start: { INR: 10000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 10000, AUD: 10000, CAD: 10000, FALLBACK: 10000 },
    end: { INR: 20000, USD: 20000, GBP: 20000, EUR: 20000, JPY: 20000, AUD: 20000, CAD: 20000, FALLBACK: 20000 },
    years: { INR: 5, USD: 5, GBP: 5, EUR: 5, JPY: 5, AUD: 5, CAD: 5, FALLBACK: 5 },
  },
  rateOfReturn: {
    present: { INR: 10000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 10000, AUD: 10000, CAD: 10000, FALLBACK: 10000 },
    future: { INR: 20000, USD: 20000, GBP: 20000, EUR: 20000, JPY: 20000, AUD: 20000, CAD: 20000, FALLBACK: 20000 },
    years: { INR: 5, USD: 5, GBP: 5, EUR: 5, JPY: 5, AUD: 5, CAD: 5, FALLBACK: 5 },
  },
  lumpsum: {
    principal: { INR: 100000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 500000, AUD: 14000, CAD: 14000, FALLBACK: 10000 },
    years: { INR: 10, USD: 10, GBP: 10, EUR: 10, JPY: 10, AUD: 10, CAD: 10, FALLBACK: 10 },
  },
  stepUpSip: {
    monthly: { INR: 5000, USD: 500, GBP: 300, EUR: 300, JPY: 30000, AUD: 700, CAD: 700, FALLBACK: 300 },
    stepUpPercent: { INR: 10, USD: 10, GBP: 10, EUR: 10, JPY: 10, AUD: 10, CAD: 10, FALLBACK: 10 },
    years: { INR: 15, USD: 15, GBP: 15, EUR: 15, JPY: 15, AUD: 15, CAD: 15, FALLBACK: 15 },
  },
  goalSip: {
    target: { INR: 500000, USD: 50000, GBP: 30000, EUR: 30000, JPY: 3000000, AUD: 70000, CAD: 70000, FALLBACK: 30000 },
    years: { INR: 15, USD: 15, GBP: 15, EUR: 15, JPY: 15, AUD: 15, CAD: 15, FALLBACK: 15 },
  },
  retirement: {
    monthly: { INR: 15000, USD: 1000, GBP: 600, EUR: 600, JPY: 50000, AUD: 1400, CAD: 1400, FALLBACK: 600 },
    years: { INR: 25, USD: 25, GBP: 25, EUR: 25, JPY: 25, AUD: 25, CAD: 25, FALLBACK: 25 },
  },
  swp: {
    corpus: { INR: 5000000, USD: 500000, GBP: 350000, EUR: 350000, JPY: 30000000, AUD: 700000, CAD: 700000, FALLBACK: 350000 },
    withdrawal: { INR: 35000, USD: 2500, GBP: 1500, EUR: 1500, JPY: 150000, AUD: 3500, CAD: 3500, FALLBACK: 1500 },
  },
  inflation: {
    // A generic illustrative "cost of something today" — magnitude isn't
    // meant to track real income/living-cost scale the way SIP/EMI/etc
    // are, since the point is the % growth, not the item.
    cost: { INR: 10000, USD: 1000, GBP: 1000, EUR: 1000, JPY: 150000, AUD: 1400, CAD: 1400, FALLBACK: 1000 },
    years: { INR: 30, USD: 30, GBP: 30, EUR: 30, JPY: 30, AUD: 30, CAD: 30, FALLBACK: 30 },
  },
  futureValue: {
    principal: { INR: 100000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 500000, AUD: 14000, CAD: 14000, FALLBACK: 10000 },
    annualAddition: { INR: 12000, USD: 1200, GBP: 700, EUR: 700, JPY: 100000, AUD: 1700, CAD: 1700, FALLBACK: 1000 },
    years: { INR: 20, USD: 20, GBP: 20, EUR: 20, JPY: 20, AUD: 20, CAD: 20, FALLBACK: 20 },
  },
  bondYield: {
    // Face value is a round, real denomination per market, never a
    // converted number — UK gilts quote per £100 nominal; everywhere else
    // here uses 1,000 in its own currency, including the ones that would
    // otherwise be FX-converted (JPY 100,000 is Japan's own common corporate
    // bond face value, not a converted figure either).
    price: { INR: 950, USD: 950, GBP: 95, EUR: 950, JPY: 95000, AUD: 950, CAD: 950, FALLBACK: 950 },
    faceValue: { INR: 1000, USD: 1000, GBP: 100, EUR: 1000, JPY: 100000, AUD: 1000, CAD: 1000, FALLBACK: 1000 },
    coupon: { INR: 8, USD: 5, GBP: 4.5, EUR: 3, JPY: 1, AUD: 4.5, CAD: 4, FALLBACK: 5 },
    years: { INR: 10, USD: 10, GBP: 10, EUR: 10, JPY: 10, AUD: 10, CAD: 10, FALLBACK: 10 },
  },
  powerOfCompounding: {
    principal: { INR: 100000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 500000, AUD: 14000, CAD: 14000, FALLBACK: 10000 },
    years: { INR: 20, USD: 20, GBP: 20, EUR: 20, JPY: 20, AUD: 20, CAD: 20, FALLBACK: 20 },
  },
  costOfDelay: {
    monthly: { INR: 10000, USD: 1000, GBP: 600, EUR: 600, JPY: 30000, AUD: 1400, CAD: 1400, FALLBACK: 600 },
    horizon: { INR: 25, USD: 25, GBP: 25, EUR: 25, JPY: 25, AUD: 25, CAD: 25, FALLBACK: 25 },
    delay: { INR: 5, USD: 5, GBP: 5, EUR: 5, JPY: 5, AUD: 5, CAD: 5, FALLBACK: 5 },
  },
  annualRetirementIncome: {
    principal: { INR: 100000, USD: 10000, GBP: 10000, EUR: 10000, JPY: 500000, AUD: 14000, CAD: 14000, FALLBACK: 10000 },
    annualAddition: { INR: 12000, USD: 1200, GBP: 700, EUR: 700, JPY: 100000, AUD: 1700, CAD: 1700, FALLBACK: 1000 },
    yearsToGrow: { INR: 20, USD: 20, GBP: 20, EUR: 20, JPY: 20, AUD: 20, CAD: 20, FALLBACK: 20 },
    yearsToPayOut: { INR: 25, USD: 25, GBP: 25, EUR: 25, JPY: 25, AUD: 25, CAD: 25, FALLBACK: 25 },
  },
  homeAffordability: {
    propertyPrice: { INR: 6000000, USD: 400000, GBP: 300000, EUR: 280000, JPY: 40000000, AUD: 560000, CAD: 560000, FALLBACK: 300000 },
    downPayment: { INR: 1200000, USD: 80000, GBP: 60000, EUR: 56000, JPY: 8000000, AUD: 110000, CAD: 110000, FALLBACK: 60000 },
    monthlyIncome: { INR: 100000, USD: 8000, GBP: 5500, EUR: 5000, JPY: 350000, AUD: 11000, CAD: 11000, FALLBACK: 6000 },
    monthlyExpenses: { INR: 30000, USD: 2500, GBP: 1800, EUR: 1600, JPY: 280000, AUD: 3500, CAD: 3500, FALLBACK: 2000 },
    existingEMI: { INR: 0, USD: 0, GBP: 0, EUR: 0, JPY: 0, AUD: 0, CAD: 0, FALLBACK: 0 },
    loanTenure: { INR: 20, USD: 30, GBP: 25, EUR: 25, JPY: 35, AUD: 30, CAD: 25, FALLBACK: 25 },
    interestRate: { INR: 8.5, USD: 7, GBP: 6, EUR: 4, JPY: 1.5, AUD: 6, CAD: 5.5, FALLBACK: 7 },
  },
  emergencyFund: {
    monthlyExpenses: { INR: 30000, USD: 3000, GBP: 2000, EUR: 1800, JPY: 280000, AUD: 4200, CAD: 4200, FALLBACK: 2500 },
    recommendedMonths: { INR: 6, USD: 6, GBP: 6, EUR: 6, JPY: 6, AUD: 6, CAD: 6, FALLBACK: 6 },
    currentSavings: { INR: 100000, USD: 10000, GBP: 7000, EUR: 6000, JPY: 500000, AUD: 14000, CAD: 14000, FALLBACK: 8000 },
    additionalIncome: { INR: 0, USD: 0, GBP: 0, EUR: 0, JPY: 0, AUD: 0, CAD: 0, FALLBACK: 0 },
  },
  fire: {
    currentAge: { INR: 25, USD: 25, GBP: 25, EUR: 25, JPY: 25, AUD: 25, CAD: 25, FALLBACK: 25 },
    retirementAge: { INR: 45, USD: 45, GBP: 45, EUR: 45, JPY: 45, AUD: 45, CAD: 45, FALLBACK: 45 },
    monthlyExpenses: { INR: 50000, USD: 4000, GBP: 2500, EUR: 2300, JPY: 280000, AUD: 5600, CAD: 5600, FALLBACK: 2500 },
    currentSavings: { INR: 300000, USD: 25000, GBP: 18000, EUR: 16000, JPY: 1000000, AUD: 35000, CAD: 35000, FALLBACK: 18000 },
    monthlyInvestment: { INR: 25000, USD: 2000, GBP: 1200, EUR: 1100, JPY: 50000, AUD: 2800, CAD: 2800, FALLBACK: 1200 },
  },
  wealthAge: {
    age: { INR: 25, USD: 25, GBP: 25, EUR: 25, JPY: 25, AUD: 25, CAD: 25, FALLBACK: 25 },
    monthlyIncome: { INR: 50000, USD: 4000, GBP: 2500, EUR: 2300, JPY: 350000, AUD: 5600, CAD: 5600, FALLBACK: 2500 },
    monthlySavings: { INR: 15000, USD: 1200, GBP: 700, EUR: 650, JPY: 50000, AUD: 1700, CAD: 1700, FALLBACK: 800 },
    investments: { INR: 300000, USD: 25000, GBP: 18000, EUR: 16000, JPY: 1000000, AUD: 35000, CAD: 35000, FALLBACK: 18000 },
    debt: { INR: 100000, USD: 8000, GBP: 6000, EUR: 5500, JPY: 500000, AUD: 11000, CAD: 11000, FALLBACK: 6000 },
    monthlyExpenses: { INR: 25000, USD: 2000, GBP: 1200, EUR: 1100, JPY: 280000, AUD: 2800, CAD: 2800, FALLBACK: 1200 },
  },
};

export function defaultFor(calculatorKey, field, currency) {
  const entry = DEFAULTS[calculatorKey]?.[field];
  if (!entry) {
    throw new Error(`No defaults registered for ${calculatorKey}.${field}`);
  }
  return entry[currency] ?? entry.FALLBACK;
}

// Build-time guard: every currency Settings actually offers must have an
// entry everywhere above, so a newly added currency can't silently fall
// back to FALLBACK without anyone noticing. See scripts/validate-currency-defaults.mjs,
// which imports this and runs as part of `npm run build`.
export function validateCurrencyCoverage() {
  const codes = currencies.map((c) => c.code);
  const problems = [];

  for (const code of codes) {
    if (!ASSUMPTIONS[code]) problems.push(`ASSUMPTIONS is missing "${code}"`);
  }

  for (const [calcKey, fields] of Object.entries(DEFAULTS)) {
    for (const [fieldKey, byCurrency] of Object.entries(fields)) {
      if (!("FALLBACK" in byCurrency)) {
        problems.push(`DEFAULTS.${calcKey}.${fieldKey} has no FALLBACK`);
      }
      for (const code of codes) {
        if (!(code in byCurrency)) {
          problems.push(`DEFAULTS.${calcKey}.${fieldKey} is missing "${code}" (would silently use FALLBACK)`);
        }
      }
    }
  }

  return problems;
}
