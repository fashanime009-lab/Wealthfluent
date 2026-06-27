import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";


export default function GoalPlannerPage() {
  // ─── State for all input fields ──────────────────────────────────
  const [currency, setCurrency] = useState("$");
  const [inputs, setInputs] = useState({
    // Expenses
    monthlyExpenses: 25000,
    annualExpenses: 25000,
    // Inflation & Age
    inflationBeforeRetirement: 8,
    currentAge: 35,
    retirementAge: 60,
    lifeExpectancy: 80,
    inflationDuringRetirement: 8,
    // Returns
    postTaxReturnCorpus: 8,
    postTaxReturnEquity: 14,
    postTaxReturnTaxableFixed: 6,
    postTaxReturnTaxFreeFixed: 8,
    // Current Investments
    currentEquityInvestments: 100000,
    currentTaxableFixedIncome: 300000,
    currentTaxFreeFixedIncome: 300000,
    lumpSumBenefitsAtRetirement: 500000,
    // EPF / NPS
    monthlyEPFContribution: 8000,
    annualEPFIncrease: 5,
    epfReturnRate: 8,
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const {
      monthlyExpenses,
      annualExpenses,
      inflationBeforeRetirement,
      currentAge,
      retirementAge,
      lifeExpectancy,
      inflationDuringRetirement,
      postTaxReturnCorpus,
      postTaxReturnEquity,
      postTaxReturnTaxableFixed,
      postTaxReturnTaxFreeFixed,
      currentEquityInvestments,
      currentTaxableFixedIncome,
      currentTaxFreeFixedIncome,
      lumpSumBenefitsAtRetirement,
      monthlyEPFContribution,
      annualEPFIncrease,
      epfReturnRate,
    } = inputs;

    // Step 3: Total average monthly expenses (annual/12)
    const totalMonthlyExpenses = monthlyExpenses + annualExpenses / 12;

    // Step 7: Years to retirement
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);

    // Step 8: Monthly expenses in first year of retirement
    const monthlyExpensesFirstRetirement =
      totalMonthlyExpenses * Math.pow(1 + inflationBeforeRetirement / 100, yearsToRetirement);

    // Step 9: Years in retirement
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

    // Step 12: Total Corpus required (PV of annuity)
    const monthlyReturnCorpus = postTaxReturnCorpus / 100 / 12;
    const totalMonthsRetirement = yearsInRetirement * 12;

    let totalCorpusRequired = 0;
    if (monthlyReturnCorpus > 0 && totalMonthsRetirement > 0) {
      // PV of growing annuity (inflation-adjusted expenses)
      const monthlyInflationRetirement = inflationDuringRetirement / 100 / 12;
      const growthRate = (1 + monthlyReturnCorpus) / (1 + monthlyInflationRetirement) - 1;
      
      if (Math.abs(growthRate) < 0.0001) {
        totalCorpusRequired = monthlyExpensesFirstRetirement * totalMonthsRetirement;
      } else {
        totalCorpusRequired =
          monthlyExpensesFirstRetirement *
          (1 - Math.pow(1 + growthRate, -totalMonthsRetirement)) /
          growthRate;
      }
    }

    // Step 13: Post-tax return (used for current and future investments)
    // Weighted average return based on allocation
    // Assume equity: 50%, taxable fixed: 30%, tax-free fixed: 20%
    const weightedReturn =
      (postTaxReturnEquity * 0.5) +
      (postTaxReturnTaxableFixed * 0.3) +
      (postTaxReturnTaxFreeFixed * 0.2);

    // Future value of current investments
    const monthlyReturnInvest = weightedReturn / 100 / 12;
    const totalMonthsInvest = yearsToRetirement * 12;

    const fvCurrentEquity =
      currentEquityInvestments * Math.pow(1 + postTaxReturnEquity / 100, yearsToRetirement);
    const fvCurrentTaxableFixed =
      currentTaxableFixedIncome * Math.pow(1 + postTaxReturnTaxableFixed / 100, yearsToRetirement);
    const fvCurrentTaxFreeFixed =
      currentTaxFreeFixedIncome * Math.pow(1 + postTaxReturnTaxFreeFixed / 100, yearsToRetirement);

    const fvCurrentInvestments =
      fvCurrentEquity + fvCurrentTaxableFixed + fvCurrentTaxFreeFixed;

    // Future value of lump sum benefits
    const fvLumpSumBenefits =
      lumpSumBenefitsAtRetirement * Math.pow(1 + weightedReturn / 100, yearsToRetirement);

    // Future value of EPF contributions (growing annuity)
    let fvEPF = 0;
    const monthlyEPFReturn = epfReturnRate / 100 / 12;
    const monthlyEPFIncrease = annualEPFIncrease / 100 / 12;

    if (monthlyEPFReturn > 0 && yearsToRetirement > 0) {
      const totalMonths = yearsToRetirement * 12;
      let currentContribution = monthlyEPFContribution;
      for (let i = 0; i < totalMonths; i++) {
        fvEPF = (fvEPF + currentContribution) * (1 + monthlyEPFReturn);
        currentContribution *= (1 + monthlyEPFIncrease);
      }
    }

    // Total accumulated corpus at retirement
    const totalAccumulated = fvCurrentInvestments + fvLumpSumBenefits + fvEPF;

    // Net corpus to be accumulated (if shortfall)
    const netCorpusToAccumulate = Math.max(0, totalCorpusRequired - totalAccumulated);

    return {
      totalMonthlyExpenses: Math.round(totalMonthlyExpenses),
      yearsToRetirement,
      monthlyExpensesFirstRetirement: Math.round(monthlyExpensesFirstRetirement),
      yearsInRetirement,
      totalCorpusRequired: Math.round(totalCorpusRequired),
      weightedReturn: weightedReturn.toFixed(2),
      fvCurrentInvestments: Math.round(fvCurrentInvestments),
      fvLumpSumBenefits: Math.round(fvLumpSumBenefits),
      fvEPF: Math.round(fvEPF),
      totalAccumulated: Math.round(totalAccumulated),
      netCorpusToAccumulate: Math.round(netCorpusToAccumulate),
    };
  }, [inputs]);

  // ─── Format currency ─────────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Financial Goal Planner – Retirement Planning Tool</title>
        <meta
          name="description"
          content="Plan your retirement with our Financial Goal Planner. Calculate required corpus with variable asset allocation and inflation-adjusted expenses."
        />
        <meta
          name="keywords"
          content="goal planner, retirement planning, corpus calculator, financial planning, asset allocation"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Planning Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Financial Goal Planner
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Plan your retirement with variable asset allocation, inflation-adjusted expenses, and retirement contributions.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            <div className="mb-6">
  <label className="block text-sm font-medium text-slate-600 mb-2">
    Currency
  </label>

  <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
  >
    <option value="$">USD ($)</option>
    <option value="€">EUR (€)</option>
    <option value="£">GBP (£)</option>
    <option value="₹">INR (₹)</option>
    <option value="¥">JPY (¥)</option>
    <option value="A$">AUD (A$)</option>
    <option value="C$">CAD (C$)</option>
  </select>
</div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Goal Planner Inputs</h2>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {/* Section: Expenses */}
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Current Expenses</h3>
                  <div className="space-y-3">
                    {[
                      { key: "monthlyExpenses", label: `Current Monthly Expenses (${currency})` },
                      { key: "annualExpenses", label: `Annual Expenses (${currency})` },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-slate-600 w-1/2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={inputs[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Retirement Details */}
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Retirement Details</h3>
                  <div className="space-y-3">
                    {[
                      { key: "inflationBeforeRetirement", label: "Inflation Before Retirement (%)", step: 0.5 },
                      { key: "currentAge", label: "Current Age" },
                      { key: "retirementAge", label: "Age You Wish to Retire" },
                      { key: "lifeExpectancy", label: "Years You Expect to Live" },
                      { key: "inflationDuringRetirement", label: "Inflation During Retirement (%)", step: 0.5 },
                      { key: "postTaxReturnCorpus", label: "Post-Tax Return from Retirement Corpus (%)", step: 0.5 },
                    ].map(({ key, label, step = 1 }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-slate-600 w-1/2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          step={step}
                          value={inputs[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Asset Allocation Returns */}
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Asset Allocation Returns</h3>
                  <div className="space-y-3">
                    {[
                      { key: "postTaxReturnEquity", label: "Equity Return (%)", step: 0.5 },
                      { key: "postTaxReturnTaxableFixed", label: "Taxable Fixed Income Return (%)", step: 0.5 },
                      { key: "postTaxReturnTaxFreeFixed", label: "Tax-Free Fixed Income Return (%)", step: 0.5 },
                    ].map(({ key, label, step = 0.5 }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-slate-600 w-1/2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          step={step}
                          value={inputs[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Current Investments */}
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Current Investments</h3>
                  <div className="space-y-3">
                    {[
                      { key: "currentEquityInvestments", label:`Equity Investments (${currency})` },
                      { key: "currentTaxableFixedIncome", label: `Fixed Income Investments (${currency})` },
                      { key: "currentTaxFreeFixedIncome", label: `Tax-Advantaged Investments (${currency})` },
                      { key: "lumpSumBenefitsAtRetirement", label: `Retirement Benefits (${currency})` },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-slate-600 w-1/2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={inputs[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: EPF / NPS */}
                <div className="pb-2">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Retirement Contributions</h3>
                  <div className="space-y-3">
                    {[
                      { key: "monthlyEPFContribution", label: `Monthly Retirement Contribution (${currency})` },
                      { key: "annualEPFIncrease", label: "Annual Increase in Contribution (%)", step: 0.5 },
                      { key: "epfReturnRate", label: "Expected Return on Retirement Contributions (%)", step: 0.5 },
                    ].map(({ key, label, step = 1 }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="text-sm text-slate-600 w-1/2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          step={step}
                          value={inputs[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Results</h2>

              <div className="space-y-6">
                {/* Key Results */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <p className="text-sm text-slate-500">Total Corpus Required</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {currency}{formatCurrency(results.totalCorpusRequired)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                  <p className="text-sm text-slate-500">Net Corpus to be Accumulated</p>
                  <p className={`text-3xl font-bold ${results.netCorpusToAccumulate > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {currency}{formatCurrency(results.netCorpusToAccumulate)}
                  </p>
                  {results.netCorpusToAccumulate === 0 && (
                    <p className="text-sm text-emerald-600 mt-1">✓ You're on track!</p>
                  )}
                </div>

                {/* Detailed breakdown */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-slate-700">Retirement Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Years to Retirement</span>
                    <span className="font-medium">{results.yearsToRetirement} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Years in Retirement</span>
                    <span className="font-medium">{results.yearsInRetirement} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly Expenses in First Year of Retirement</span>
                    <span className="font-medium">{currency}{formatCurrency(results.monthlyExpensesFirstRetirement)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Weighted Average Return</span>
                    <span className="font-medium">{results.weightedReturn}%</span>
                  </div>
                </div>

                {/* Accumulated Corpus Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-slate-700">Accumulated Corpus at Retirement</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Investments (FV)</span>
                    <span className="font-medium">{currency}{formatCurrency(results.fvCurrentInvestments)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lump Sum Benefits (FV)</span>
                    <span className="font-medium">{currency}{formatCurrency(results.fvLumpSumBenefits)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Retirement Contributions (FV)</span>
                    <span className="font-medium">{currency}{formatCurrency(results.fvEPF)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                    <span>Total Accumulated</span>
                    <span>{currency}{formatCurrency(results.totalAccumulated)}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only and do not represent actual returns.
                  Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is Financial Goal Planning?</h2>
              <p className="text-slate-500 leading-relaxed">
                Financial goal planning helps you determine how much you need to save and invest to achieve
                your life goals — like a comfortable retirement. This calculator factors in your current expenses,
                inflation, expected returns, and existing investments to estimate the corpus required and the
                additional savings needed.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your current monthly and annual expenses.</li>
                <li>Set your retirement age, current age, and life expectancy.</li>
                <li>Provide expected inflation rates and post-tax returns for different asset classes.</li>
                <li>Add your current investments and retirement contributions.</li>
                <li>The calculator will show your required corpus and how much more you need to save.</li>
              </ol>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Key Assumptions</h2>
              <ul className="list-disc list-inside text-slate-500 space-y-2">
                <li>Expenses grow with inflation until retirement.</li>
                <li>During retirement, expenses grow with retirement inflation.</li>
                <li>Asset allocation: 50% equity, 30% taxable fixed, 20% tax-free fixed (adjustable).</li>
                <li>Retirement contributions grow annually at the specified rate.</li>
              </ul>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}