import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";


export default function AnnualRetirementIncomePage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useState(100000);
  const [annualAddition, setAnnualAddition] = useState(12000);
  const [yearsToGrow, setYearsToGrow] = useState(20);
  const [preRetGrowthRate, setPreRetGrowthRate] = useState(12);
  const [yearsToPayOut, setYearsToPayOut] = useState(25);
  const [postRetGrowthRate, setPostRetGrowthRate] = useState(8);
  const [currency, setCurrency] = useState("$");

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const r1 = preRetGrowthRate / 100;
    const r2 = postRetGrowthRate / 100;
    const n1 = yearsToGrow;
    const n2 = yearsToPayOut;

    // Pre-retirement accumulation
    // Future value of current principal
    const fvPrincipal = currentPrincipal * Math.pow(1 + r1, n1);

    // Future value of annual additions (ordinary annuity)
    let fvAdditions = 0;
    if (annualAddition > 0) {
      if (r1 === 0) {
        fvAdditions = annualAddition * n1;
      } else {
        fvAdditions = annualAddition * ((Math.pow(1 + r1, n1) - 1) / r1);
      }
    }

    const corpusAtRetirement = fvPrincipal + fvAdditions;

    // Post-retirement payout: compute annual income (annuity)
    let annualIncome = 0;
    if (n2 > 0 && corpusAtRetirement > 0) {
      if (r2 === 0) {
        annualIncome = corpusAtRetirement / n2;
      } else {
        // PMT = PV * r / (1 - (1+r)^-n)
        annualIncome = corpusAtRetirement * r2 / (1 - Math.pow(1 + r2, -n2));
      }
    }

    return {
      corpusAtRetirement: Math.round(corpusAtRetirement),
      annualIncome: Math.round(annualIncome),
      totalInvested: currentPrincipal + annualAddition * n1,
    };
  }, [currentPrincipal, annualAddition, yearsToGrow, preRetGrowthRate, yearsToPayOut, postRetGrowthRate]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleChange = (setter) => (e) => {
    setter(Number(e.target.value) || 0);
  };

  return (
    <>
      <Helmet>
        <title>Annual Retirement Income Calculator – Plan Your Retirement</title>
        <meta
          name="description"
          content="Calculate your retirement corpus and annual retirement income based on your pre-retirement savings and post-retirement payout period."
        />
        <meta
          name="keywords"
          content="retirement income calculator, annual retirement income, retirement planning, corpus calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Retirement Planning Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Annual Retirement Income Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Estimate your retirement corpus and the annual income you can expect during retirement.
            </p>
          </div>

          {/* Calculator Grid */}
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
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Retirement Details
              </h2>

              <div className="space-y-8">
                {/* Section: Pre-Retirement */}
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-sm font-semibold text-blue-600 mb-4">PRE‑RETIREMENT</h3>
                  <div className="space-y-6">
                    {/* Current Principal */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        
                        <label className="text-sm font-medium text-slate-600">Current Principal</label>
                        
                        <span className="text-sm font-semibold text-blue-600">{currency}{formatCurrency(currentPrincipal)}</span>
                        
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="1000"
                        value={currentPrincipal}
                        onChange={handleChange(setCurrentPrincipal)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
  <span>{currency}0</span>
  <span>{currency}10,000,000</span>
</div>
                      <input
                        type="number"
                        min="0"
                        max="10000000"
                        step="1000"
                        value={currentPrincipal}
                        onChange={(e) => setCurrentPrincipal(Number(e.target.value) || 0)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Annual Addition */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">Annual Addition</label>
                        <span className="text-sm font-semibold text-blue-600">{currency}{formatCurrency(annualAddition)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="500"
                        value={annualAddition}
                        onChange={handleChange(setAnnualAddition)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
  <span>{currency}0</span>
  <span>{currency}1,000,000</span>
</div>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="500"
                        value={annualAddition}
                        onChange={(e) => setAnnualAddition(Number(e.target.value) || 0)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Years to Grow */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">Years to Grow</label>
                        <span className="text-sm font-semibold text-blue-600">{yearsToGrow} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={yearsToGrow}
                        onChange={handleChange(setYearsToGrow)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <input
                        type="number"
                        min="1"
                        max="50"
                        step="1"
                        value={yearsToGrow}
                        onChange={(e) => setYearsToGrow(Number(e.target.value) || 1)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Growth Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">Growth Rate (%)</label>
                        <span className="text-sm font-semibold text-blue-600">{preRetGrowthRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.5"
                        value={preRetGrowthRate}
                        onChange={handleChange(setPreRetGrowthRate)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        value={preRetGrowthRate}
                        onChange={(e) => setPreRetGrowthRate(Number(e.target.value) || 0)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: In Retirement */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 mb-4">IN RETIREMENT</h3>
                  <div className="space-y-6">
                    {/* Years to Pay Out */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">Years to Pay Out</label>
                        <span className="text-sm font-semibold text-blue-600">{yearsToPayOut} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={yearsToPayOut}
                        onChange={handleChange(setYearsToPayOut)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <input
                        type="number"
                        min="1"
                        max="50"
                        step="1"
                        value={yearsToPayOut}
                        onChange={(e) => setYearsToPayOut(Number(e.target.value) || 1)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Growth Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">Growth Rate (%)</label>
                        <span className="text-sm font-semibold text-blue-600">{postRetGrowthRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.5"
                        value={postRetGrowthRate}
                        onChange={handleChange(setPostRetGrowthRate)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="15"
                        step="0.5"
                        value={postRetGrowthRate}
                        onChange={(e) => setPostRetGrowthRate(Number(e.target.value) || 0)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculate Button (optional) */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-2xl shadow-lg shadow-blue-200 text-lg"
                  onClick={() => {}}
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Results</h2>

              <div className="flex-1 space-y-6">
                {/* Annual Retirement Income */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-slate-500">Annual Retirement Income</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {currency}{formatCurrency(results.annualIncome)}
                  </p>
                </div>

                {/* Corpus at Retirement */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <p className="text-sm text-slate-500">Corpus at Retirement</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {currency}{formatCurrency(results.corpusAtRetirement)}
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Investment Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Invested (Pre-Retirement)</span>
                    <span className="font-medium">{currency}{formatCurrency(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pre-Retirement Growth Rate</span>
                    <span className="font-medium">{preRetGrowthRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Years to Grow</span>
                    <span className="font-medium">{yearsToGrow} Years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Post-Retirement Growth Rate</span>
                    <span className="font-medium">{postRetGrowthRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Payout Period</span>
                    <span className="font-medium">{yearsToPayOut} Years</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only and do not represent actual returns.
                </p>
                <p>
                  Investment returns are not guaranteed. Actual retirement income depends on investment performance, inflation, taxes, fees, and future market conditions.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is an Annual Retirement Income Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                This calculator helps you estimate how much annual income you can expect during retirement based on your current savings, regular contributions, and expected returns. It projects your corpus at retirement and then calculates a sustainable annual withdrawal over your retirement years.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your current principal (savings earmarked for retirement).</li>
                <li>Enter your annual addition (how much you'll add each year until retirement).</li>
                <li>Set the years to grow (remaining working years).</li>
                <li>Choose a pre-retirement growth rate (expected return on investments).</li>
                <li>Specify the years to pay out (your expected retirement duration).</li>
                <li>Choose a post-retirement growth rate (return on remaining corpus).</li>
                <li>The calculator will show your annual retirement income and corpus.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding the Results</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Corpus at Retirement</h3>
                  <p className="text-slate-500 leading-relaxed">
                    This is the total amount you'll have saved by the time you retire, considering your current savings, annual additions, and investment growth.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Annual Retirement Income</h3>
                  <p className="text-slate-500 leading-relaxed">
                    This is the amount you can withdraw each year during retirement, assuming the remaining corpus continues to earn the post-retirement growth rate.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is a realistic pre-retirement growth rate?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Expected long-term investment returns vary depending on your portfolio, asset allocation, and market conditions. Stocks have historically delivered higher long-term returns than bonds or cash, but they also involve greater risk. Choose assumptions that match your investment strategy. Choose based on your asset allocation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What should I enter for "Years to Pay Out"?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Estimate your life expectancy minus your retirement age. A common approach is to plan for 25-30 years post-retirement.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Can I withdraw more than the calculated amount?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Withdrawing more may deplete your corpus sooner. The calculator provides a sustainable annual income assuming the corpus earns the given rate and lasts the specified years. Adjust the parameters to see different scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}