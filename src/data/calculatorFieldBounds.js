// Slider/typed-input bounds for every calculator field, mirrored into the
// real <CalcField> props on each page via boundsFor()/useFieldBounds() —
// this file IS the source of truth the UI reads, not a shadow copy, so it
// can never drift from what a visitor actually sees.
//
// Money fields get PER-CURRENCY bounds, same as DEFAULTS in
// calculatorDefaults.js — never derived from an exchange rate. Each
// currency's min/max/step is a clean, round number chosen to comfortably
// contain that currency's own hand-picked default (see calculatorDefaults.js)
// and land it exactly on a step.
//
// Rate and year/tenure fields (equity-return assumptions, inflation, loan
// tenure, bond coupon, ages, etc.) stay UNIVERSAL — one bound for every
// currency — since a percentage or a number of years means the same thing
// regardless of currency. Loan/mortgage interest rate and tenure are
// deliberately widened and unified across EMI and Home Affordability
// (0.5%-20% / up to 40 years) rather than each picking its own range.
//
// Shape of a FIELD_BOUNDS[calcKey][field] entry's `bounds`:
//   - a flat {min,max,step}                       -> universal (rate/year fields)
//   - {INR:{...}, USD:{...}, ..., FALLBACK:{...}}  -> per-currency (money fields)
//   - (currency, context) => {min,max,step}        -> depends on a sibling
//        field's own resolved value (Home Affordability's down payment is
//        capped by that currency's property-price default; Cost of
//        Delay's delay-years is capped by horizon - 1) — never on an
//        exchange rate.
//
// `source`/`assumptionKey` say where the matching VALUE comes from, for
// the validator: "defaults" reads DEFAULTS[calcKey][field], "assumption"
// reads assumptionsFor(currency)[assumptionKey].

// ---- Reusable per-currency money presets --------------------------------
// Each one was sized against the real DEFAULTS values it's used with (see
// scripts/validate-currency-defaults.mjs, which fails the build if any
// default ever falls outside its field's bounds or off-step).

const SMALL_MONTHLY = {
  INR: { min: 0, max: 500000, step: 500 },
  USD: { min: 0, max: 50000, step: 100 },
  GBP: { min: 0, max: 50000, step: 50 },
  EUR: { min: 0, max: 50000, step: 50 },
  JPY: { min: 0, max: 1000000, step: 5000 },
  AUD: { min: 0, max: 50000, step: 100 },
  CAD: { min: 0, max: 50000, step: 100 },
  FALLBACK: { min: 0, max: 50000, step: 100 },
};

const MEDIUM_MONTHLY_INCOME = {
  INR: { min: 0, max: 1000000, step: 10000 },
  USD: { min: 0, max: 100000, step: 1000 },
  GBP: { min: 0, max: 100000, step: 500 },
  EUR: { min: 0, max: 50000, step: 100 },
  JPY: { min: 0, max: 5000000, step: 50000 },
  AUD: { min: 0, max: 200000, step: 200 },
  CAD: { min: 0, max: 200000, step: 200 },
  FALLBACK: { min: 0, max: 100000, step: 500 },
};

const MEDIUM_MONTHLY_EXPENSE = {
  INR: { min: 0, max: 500000, step: 5000 },
  USD: { min: 0, max: 50000, step: 500 },
  GBP: { min: 0, max: 50000, step: 100 },
  EUR: { min: 0, max: 50000, step: 100 },
  JPY: { min: 0, max: 5000000, step: 20000 },
  AUD: { min: 0, max: 100000, step: 100 },
  CAD: { min: 0, max: 100000, step: 100 },
  FALLBACK: { min: 0, max: 50000, step: 100 },
};

const LUMPSUM_SCALE = {
  INR: { min: 0, max: 5000000, step: 100000 },
  USD: { min: 0, max: 500000, step: 10000 },
  GBP: { min: 0, max: 500000, step: 10000 },
  EUR: { min: 0, max: 500000, step: 10000 },
  JPY: { min: 0, max: 50000000, step: 500000 },
  AUD: { min: 0, max: 1000000, step: 2000 },
  CAD: { min: 0, max: 1000000, step: 2000 },
  FALLBACK: { min: 0, max: 500000, step: 10000 },
};

const ANNUAL_ADDITION = {
  INR: { min: 0, max: 1000000, step: 2000 },
  USD: { min: 0, max: 100000, step: 200 },
  GBP: { min: 0, max: 50000, step: 100 },
  EUR: { min: 0, max: 50000, step: 100 },
  JPY: { min: 0, max: 5000000, step: 100000 },
  AUD: { min: 0, max: 100000, step: 100 },
  CAD: { min: 0, max: 100000, step: 100 },
  FALLBACK: { min: 0, max: 50000, step: 500 },
};

// Down payment's own min/step per currency — max is dynamic (see
// homeAffordability.downPayment below): capped by that currency's own
// property-price default, never by an exchange rate.
const DOWN_PAYMENT_STEP = { INR: 50000, USD: 5000, GBP: 5000, EUR: 2000, JPY: 1000000, AUD: 5000, CAD: 5000, FALLBACK: 5000 };

const GOAL_TARGET = {
  INR: { min: 0, max: 20000000, step: 50000 },
  USD: { min: 0, max: 2000000, step: 5000 },
  GBP: { min: 0, max: 1000000, step: 5000 },
  EUR: { min: 0, max: 1000000, step: 5000 },
  JPY: { min: 0, max: 100000000, step: 500000 },
  AUD: { min: 0, max: 5000000, step: 5000 },
  CAD: { min: 0, max: 5000000, step: 5000 },
  FALLBACK: { min: 0, max: 1000000, step: 5000 },
};

const SWP_CORPUS = {
  INR: { min: 0, max: 100000000, step: 500000 },
  USD: { min: 0, max: 10000000, step: 50000 },
  GBP: { min: 0, max: 10000000, step: 50000 },
  EUR: { min: 0, max: 10000000, step: 50000 },
  JPY: { min: 0, max: 500000000, step: 5000000 },
  AUD: { min: 0, max: 20000000, step: 50000 },
  CAD: { min: 0, max: 20000000, step: 50000 },
  FALLBACK: { min: 0, max: 10000000, step: 50000 },
};

const SWP_WITHDRAWAL = {
  INR: { min: 0, max: 1000000, step: 5000 },
  USD: { min: 0, max: 50000, step: 500 },
  GBP: { min: 0, max: 50000, step: 500 },
  EUR: { min: 0, max: 50000, step: 500 },
  JPY: { min: 0, max: 5000000, step: 50000 },
  AUD: { min: 0, max: 100000, step: 500 },
  CAD: { min: 0, max: 100000, step: 500 },
  FALLBACK: { min: 0, max: 50000, step: 500 },
};

const SAVINGS_POOL_BIG = {
  INR: { min: 0, max: 20000000, step: 100000 },
  USD: { min: 0, max: 1000000, step: 5000 },
  GBP: { min: 0, max: 1000000, step: 2000 },
  EUR: { min: 0, max: 1000000, step: 2000 },
  JPY: { min: 0, max: 50000000, step: 1000000 },
  AUD: { min: 0, max: 2000000, step: 5000 },
  CAD: { min: 0, max: 2000000, step: 5000 },
  FALLBACK: { min: 0, max: 1000000, step: 2000 },
};

const SAVINGS_POOL_MEDIUM = {
  INR: { min: 0, max: 5000000, step: 10000 },
  USD: { min: 0, max: 500000, step: 1000 },
  GBP: { min: 0, max: 500000, step: 1000 },
  EUR: { min: 0, max: 500000, step: 1000 },
  JPY: { min: 0, max: 50000000, step: 100000 },
  AUD: { min: 0, max: 1000000, step: 2000 },
  CAD: { min: 0, max: 1000000, step: 2000 },
  FALLBACK: { min: 0, max: 500000, step: 1000 },
};

const DEBT_POOL = {
  INR: { min: 0, max: 10000000, step: 10000 },
  USD: { min: 0, max: 1000000, step: 1000 },
  GBP: { min: 0, max: 1000000, step: 1000 },
  EUR: { min: 0, max: 1000000, step: 500 },
  JPY: { min: 0, max: 50000000, step: 100000 },
  AUD: { min: 0, max: 2000000, step: 1000 },
  CAD: { min: 0, max: 2000000, step: 1000 },
  FALLBACK: { min: 0, max: 1000000, step: 1000 },
};

const BOND_PRICE = {
  INR: { min: 0, max: 10000, step: 50 },
  USD: { min: 0, max: 10000, step: 50 },
  GBP: { min: 0, max: 1000, step: 5 },
  EUR: { min: 0, max: 10000, step: 50 },
  JPY: { min: 0, max: 1000000, step: 5000 },
  AUD: { min: 0, max: 10000, step: 50 },
  CAD: { min: 0, max: 10000, step: 50 },
  FALLBACK: { min: 0, max: 10000, step: 50 },
};

const BOND_FACE = {
  INR: { min: 0, max: 10000, step: 100 },
  USD: { min: 0, max: 10000, step: 100 },
  GBP: { min: 0, max: 1000, step: 10 },
  EUR: { min: 0, max: 10000, step: 100 },
  JPY: { min: 0, max: 1000000, step: 10000 },
  AUD: { min: 0, max: 10000, step: 100 },
  CAD: { min: 0, max: 10000, step: 100 },
  FALLBACK: { min: 0, max: 10000, step: 100 },
};

const INFLATION_COST = {
  INR: { min: 0, max: 1000000, step: 1000 },
  USD: { min: 0, max: 100000, step: 100 },
  GBP: { min: 0, max: 100000, step: 100 },
  EUR: { min: 0, max: 100000, step: 100 },
  JPY: { min: 0, max: 10000000, step: 10000 },
  AUD: { min: 0, max: 200000, step: 100 },
  CAD: { min: 0, max: 200000, step: 100 },
  FALLBACK: { min: 0, max: 100000, step: 100 },
};

const EMI_LOAN = {
  INR: { min: 0, max: 50000000, step: 100000 },
  USD: { min: 0, max: 2000000, step: 10000 },
  GBP: { min: 0, max: 2000000, step: 10000 },
  EUR: { min: 0, max: 2000000, step: 10000 },
  JPY: { min: 0, max: 200000000, step: 1000000 },
  AUD: { min: 0, max: 5000000, step: 10000 },
  CAD: { min: 0, max: 5000000, step: 10000 },
  FALLBACK: { min: 0, max: 2000000, step: 10000 },
};

const PROPERTY_PRICE = {
  INR: { min: 0, max: 50000000, step: 100000 },
  USD: { min: 0, max: 2000000, step: 10000 },
  GBP: { min: 0, max: 2000000, step: 10000 },
  EUR: { min: 0, max: 2000000, step: 10000 },
  JPY: { min: 0, max: 200000000, step: 1000000 },
  AUD: { min: 0, max: 5000000, step: 10000 },
  CAD: { min: 0, max: 5000000, step: 10000 },
  FALLBACK: { min: 0, max: 2000000, step: 10000 },
};

// Universal (not currency-dependent) rate/tenure bounds.
const LOAN_RATE_BOUNDS = { min: 0.5, max: 20, step: 0.1 };
const LOAN_TENURE_EMI = { min: 1, max: 40, step: 1 };
const LOAN_TENURE_HOME = { min: 5, max: 40, step: 1 };

export const FIELD_BOUNDS = {
  sip: {
    monthly: { source: "defaults", bounds: SMALL_MONTHLY },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  emi: {
    loan: { source: "defaults", bounds: EMI_LOAN },
    rate: { source: "defaults", bounds: LOAN_RATE_BOUNDS },
    years: { source: "defaults", bounds: LOAN_TENURE_EMI },
  },
  cagr: {
    start: { source: "defaults", bounds: { min: 1000, max: 1000000, step: 1000 } },
    end: { source: "defaults", bounds: { min: 1000, max: 5000000, step: 1000 } },
    years: { source: "defaults", bounds: { min: 1, max: 30, step: 1 } },
  },
  rateOfReturn: {
    present: { source: "defaults", bounds: { min: 100, max: 10000000, step: 100 } },
    future: { source: "defaults", bounds: { min: 100, max: 100000000, step: 100 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
  },
  lumpsum: {
    principal: { source: "defaults", bounds: LUMPSUM_SCALE },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  stepUpSip: {
    monthly: { source: "defaults", bounds: SMALL_MONTHLY },
    stepUpPercent: { source: "defaults", bounds: { min: 0, max: 50, step: 1 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  goalSip: {
    target: { source: "defaults", bounds: GOAL_TARGET },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    expectedReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 30, step: 0.5 } },
  },
  retirement: {
    monthly: { source: "defaults", bounds: SMALL_MONTHLY },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  swp: {
    corpus: { source: "defaults", bounds: SWP_CORPUS },
    withdrawal: { source: "defaults", bounds: SWP_WITHDRAWAL },
    rate: { source: "assumption", assumptionKey: "retirementReturn", bounds: { min: 1, max: 15, step: 0.5 } },
  },
  inflation: {
    cost: { source: "defaults", bounds: INFLATION_COST },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    inflationRate: { source: "assumption", assumptionKey: "inflation", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  futureValue: {
    principal: { source: "defaults", bounds: LUMPSUM_SCALE },
    annualAddition: { source: "defaults", bounds: ANNUAL_ADDITION },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    growthRate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
  },
  bondYield: {
    price: { source: "defaults", bounds: BOND_PRICE },
    faceValue: { source: "defaults", bounds: BOND_FACE },
    coupon: { source: "defaults", bounds: { min: 0, max: 20, step: 0.5 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
  },
  powerOfCompounding: {
    principal: { source: "defaults", bounds: LUMPSUM_SCALE },
    years: { source: "defaults", bounds: { min: 1, max: 40, step: 1 } },
    rate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  costOfDelay: {
    monthly: { source: "defaults", bounds: SMALL_MONTHLY },
    horizon: { source: "defaults", bounds: { min: 5, max: 40, step: 1 } },
    delay: {
      source: "defaults",
      bounds: (currency, resolved) => ({ min: 0, max: resolved.horizon - 1, step: 1 }),
    },
    rate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  annualRetirementIncome: {
    principal: { source: "defaults", bounds: LUMPSUM_SCALE },
    annualAddition: { source: "defaults", bounds: ANNUAL_ADDITION },
    yearsToGrow: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    yearsToPayOut: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    preRetGrowthRate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
    postRetGrowthRate: { source: "assumption", assumptionKey: "retirementReturn", bounds: { min: 0, max: 15, step: 0.5 } },
  },
  homeAffordability: {
    propertyPrice: { source: "defaults", bounds: PROPERTY_PRICE },
    downPayment: {
      source: "defaults",
      bounds: (currency, resolved) => ({
        min: 0,
        max: resolved.propertyPrice,
        step: DOWN_PAYMENT_STEP[currency] ?? DOWN_PAYMENT_STEP.FALLBACK,
      }),
    },
    monthlyIncome: { source: "defaults", bounds: MEDIUM_MONTHLY_INCOME },
    monthlyExpenses: { source: "defaults", bounds: MEDIUM_MONTHLY_EXPENSE },
    existingEMI: { source: "defaults", bounds: SMALL_MONTHLY },
    loanTenure: { source: "defaults", bounds: LOAN_TENURE_HOME },
    interestRate: { source: "defaults", bounds: LOAN_RATE_BOUNDS },
  },
  emergencyFund: {
    monthlyExpenses: { source: "defaults", bounds: MEDIUM_MONTHLY_EXPENSE },
    recommendedMonths: { source: "defaults", bounds: { min: 1, max: 24, step: 1 } },
    currentSavings: { source: "defaults", bounds: SAVINGS_POOL_MEDIUM },
    additionalIncome: { source: "defaults", bounds: MEDIUM_MONTHLY_INCOME },
  },
  fire: {
    currentAge: { source: "defaults", bounds: { min: 18, max: 80, step: 1 } },
    retirementAge: { source: "defaults", bounds: { min: 20, max: 80, step: 1 } },
    monthlyExpenses: { source: "defaults", bounds: MEDIUM_MONTHLY_EXPENSE },
    currentSavings: { source: "defaults", bounds: SAVINGS_POOL_BIG },
    monthlyInvestment: { source: "defaults", bounds: SMALL_MONTHLY },
    expectedReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
    inflationRate: { source: "assumption", assumptionKey: "inflation", bounds: { min: 0, max: 15, step: 0.5 } },
  },
  wealthAge: {
    age: { source: "defaults", bounds: { min: 18, max: 70, step: 1 } },
    monthlyIncome: { source: "defaults", bounds: MEDIUM_MONTHLY_INCOME },
    monthlySavings: { source: "defaults", bounds: SMALL_MONTHLY },
    investments: { source: "defaults", bounds: SAVINGS_POOL_BIG },
    debt: { source: "defaults", bounds: DEBT_POOL },
    monthlyExpenses: { source: "defaults", bounds: MEDIUM_MONTHLY_EXPENSE },
  },
};

// Resolves one field's {min,max,step}. `context` carries already-resolved
// sibling field values for the two fields whose range depends on one
// (Home Affordability's down payment, Cost of Delay's delay-years) —
// never on an exchange rate.
export function boundsFor(calculatorKey, field, currency, context = {}) {
  const entry = FIELD_BOUNDS[calculatorKey]?.[field];
  if (!entry) {
    throw new Error(`No bounds registered for ${calculatorKey}.${field}`);
  }
  const { bounds } = entry;
  if (typeof bounds === "function") return bounds(currency, context);
  if ("min" in bounds) return bounds; // flat/universal
  return bounds[currency] ?? bounds.FALLBACK; // per-currency
}
