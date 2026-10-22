import { USD_CONVERSION_RATES } from "../services/calculators/globalWealthPercentile.js";

// Replicates WealthAgeCalculatorPage's own inr() helper so the validator
// can compute the same currency-converted slider bounds that page renders
// — see the comment on FIELD_BOUNDS.wealthAge below for why those bounds
// (unlike every other calculator's) are a function of currency at all.
function inrConvert(rupees, currency) {
  const rate = USD_CONVERSION_RATES[currency] ?? 1;
  return Math.round((rupees * USD_CONVERSION_RATES.INR) / rate);
}

// Mirrors the literal min/max/step props passed to <CalcField> (or, for
// FIRE, the FIELDS config array) on each of the 19 calculator pages wired
// to calculatorDefaults.js. This table exists only for
// scripts/validate-currency-defaults.mjs to check a hand-picked default
// against the slider it actually appears on — it is not imported by any
// page. If a page's min/max/step literals change, update the matching
// entry here too, or the check will silently validate against a stale
// bound.
//
// Each field's `source` says where its value comes from: "defaults" reads
// DEFAULTS[calcKey][field] (see calculatorDefaults.js), "assumption" reads
// assumptionsFor(currency)[assumptionKey]. `bounds` is either a static
// {min,max,step} or a function (currency, resolvedFields) => {...} for the
// few fields whose range depends on currency (WealthAge) or on a sibling
// field's own resolved value (Home Affordability's down payment is capped
// by that currency's property-price default; Cost of Delay's delay-years
// is capped by horizon - 1).
export const FIELD_BOUNDS = {
  sip: {
    monthly: { source: "defaults", bounds: { min: 500, max: 100000, step: 500 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  emi: {
    loan: { source: "defaults", bounds: { min: 10000, max: 10000000, step: 10000 } },
    rate: { source: "defaults", bounds: { min: 1, max: 30, step: 0.1 } },
    years: { source: "defaults", bounds: { min: 1, max: 30, step: 1 } },
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
    principal: { source: "defaults", bounds: { min: 1000, max: 50000000, step: 1000 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  stepUpSip: {
    monthly: { source: "defaults", bounds: { min: 500, max: 100000, step: 500 } },
    stepUpPercent: { source: "defaults", bounds: { min: 0, max: 50, step: 1 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  goalSip: {
    target: { source: "defaults", bounds: { min: 10000, max: 10000000, step: 5000 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    expectedReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 30, step: 0.5 } },
  },
  retirement: {
    monthly: { source: "defaults", bounds: { min: 500, max: 1000000, step: 500 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    annualReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: -15, max: 30, step: 0.5 } },
  },
  swp: {
    corpus: { source: "defaults", bounds: { min: 100000, max: 50000000, step: 100000 } },
    withdrawal: { source: "defaults", bounds: { min: 1000, max: 500000, step: 1000 } },
    rate: { source: "assumption", assumptionKey: "retirementReturn", bounds: { min: 1, max: 15, step: 0.5 } },
  },
  inflation: {
    cost: { source: "defaults", bounds: { min: 100, max: 1000000, step: 100 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    inflationRate: { source: "assumption", assumptionKey: "inflation", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  futureValue: {
    principal: { source: "defaults", bounds: { min: 0, max: 10000000, step: 1000 } },
    annualAddition: { source: "defaults", bounds: { min: 0, max: 1000000, step: 500 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    growthRate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
  },
  bondYield: {
    price: { source: "defaults", bounds: { min: 100, max: 10000, step: 5 } },
    faceValue: { source: "defaults", bounds: { min: 100, max: 10000, step: 100 } },
    coupon: { source: "defaults", bounds: { min: 0, max: 20, step: 0.5 } },
    years: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
  },
  powerOfCompounding: {
    principal: { source: "defaults", bounds: { min: 1000, max: 10000000, step: 1000 } },
    years: { source: "defaults", bounds: { min: 1, max: 40, step: 1 } },
    rate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  costOfDelay: {
    monthly: { source: "defaults", bounds: { min: 500, max: 200000, step: 500 } },
    horizon: { source: "defaults", bounds: { min: 5, max: 40, step: 1 } },
    delay: {
      source: "defaults",
      bounds: (currency, resolved) => ({ min: 0, max: resolved.horizon - 1, step: 1 }),
    },
    rate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 1, max: 20, step: 0.5 } },
  },
  annualRetirementIncome: {
    principal: { source: "defaults", bounds: { min: 0, max: 10000000, step: 1000 } },
    annualAddition: { source: "defaults", bounds: { min: 0, max: 1000000, step: 500 } },
    yearsToGrow: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    yearsToPayOut: { source: "defaults", bounds: { min: 1, max: 50, step: 1 } },
    preRetGrowthRate: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
    postRetGrowthRate: { source: "assumption", assumptionKey: "retirementReturn", bounds: { min: 0, max: 15, step: 0.5 } },
  },
  homeAffordability: {
    propertyPrice: { source: "defaults", bounds: { min: 500000, max: 30000000, step: 100000 } },
    downPayment: {
      source: "defaults",
      bounds: (currency, resolved) => ({ min: 0, max: resolved.propertyPrice, step: 50000 }),
    },
    monthlyIncome: { source: "defaults", bounds: { min: 10000, max: 1000000, step: 1000 } },
    monthlyExpenses: { source: "defaults", bounds: { min: 0, max: 500000, step: 1000 } },
    existingEMI: { source: "defaults", bounds: { min: 0, max: 200000, step: 500 } },
    loanTenure: { source: "defaults", bounds: { min: 5, max: 30, step: 1 } },
    interestRate: { source: "defaults", bounds: { min: 6, max: 15, step: 0.1 } },
  },
  emergencyFund: {
    monthlyExpenses: { source: "defaults", bounds: { min: 1000, max: 500000, step: 1000 } },
    recommendedMonths: { source: "defaults", bounds: { min: 1, max: 24, step: 1 } },
    currentSavings: { source: "defaults", bounds: { min: 0, max: 5000000, step: 1000 } },
    additionalIncome: { source: "defaults", bounds: { min: 0, max: 500000, step: 1000 } },
  },
  fire: {
    currentAge: { source: "defaults", bounds: { min: 18, max: 80, step: 1 } },
    retirementAge: { source: "defaults", bounds: { min: 20, max: 80, step: 1 } },
    monthlyExpenses: { source: "defaults", bounds: { min: 1000, max: 500000, step: 1000 } },
    currentSavings: { source: "defaults", bounds: { min: 0, max: 10000000, step: 1000 } },
    monthlyInvestment: { source: "defaults", bounds: { min: 0, max: 500000, step: 1000 } },
    expectedReturn: { source: "assumption", assumptionKey: "equityReturn", bounds: { min: 0, max: 30, step: 0.5 } },
    inflationRate: { source: "assumption", assumptionKey: "inflation", bounds: { min: 0, max: 15, step: 0.5 } },
  },
  // Unlike every other calculator, these bounds are themselves a function
  // of currency — WealthAgeCalculatorPage FX-converts the original rupee
  // slider bounds via inr(). The hand-picked DEFAULTS.wealthAge values
  // (deliberately NOT FX-converted, same reasoning as JPY elsewhere) can
  // therefore still legitimately fall outside an FX-converted bound even
  // though both sides look "reasonable" on their own — that mismatch is
  // exactly what this check surfaces.
  wealthAge: {
    age: { source: "defaults", bounds: { min: 18, max: 70, step: 1 } },
    monthlyIncome: {
      source: "defaults",
      bounds: (currency) => ({
        min: inrConvert(5000, currency),
        max: inrConvert(1000000, currency),
        step: Math.max(1, inrConvert(1000, currency)),
      }),
    },
    monthlySavings: {
      source: "defaults",
      bounds: (currency) => ({
        min: 0,
        max: inrConvert(500000, currency),
        step: Math.max(1, inrConvert(500, currency)),
      }),
    },
    investments: {
      source: "defaults",
      bounds: (currency) => ({
        min: 0,
        max: inrConvert(10000000, currency),
        step: Math.max(1, inrConvert(5000, currency)),
      }),
    },
    debt: {
      source: "defaults",
      bounds: (currency) => ({
        min: 0,
        max: inrConvert(10000000, currency),
        step: Math.max(1, inrConvert(5000, currency)),
      }),
    },
    monthlyExpenses: {
      source: "defaults",
      bounds: (currency) => ({
        min: 0,
        max: inrConvert(500000, currency),
        step: Math.max(1, inrConvert(500, currency)),
      }),
    },
  },
};
