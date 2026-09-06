import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";

export default function FutureValueCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useState(100000);
  const [annualAddition, setAnnualAddition] = useState(12000);
  const [yearsToGrow, setYearsToGrow] = useState(20);
  const [growthRate, setGrowthRate] = useState(12);
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const rate = growthRate / 100;
    let futureValue = currentPrincipal * Math.pow(1 + rate, yearsToGrow);

    // If there are annual additions, calculate their future value
    if (annualAddition > 0 && rate > 0) {
      // Future value of growing annuity (annual additions at the end of each year)
      const fvAdditions = annualAddition * ((Math.pow(1 + rate, yearsToGrow) - 1) / rate);
      futureValue += fvAdditions;
    } else if (annualAddition > 0) {
      // If rate is 0, just add the total additions
      futureValue += annualAddition * yearsToGrow;
    }

    const totalInvested = currentPrincipal + annualAddition * yearsToGrow;
    const totalReturns = futureValue - totalInvested;

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
    };
  }, [currentPrincipal, annualAddition, yearsToGrow, growthRate]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePrincipalChange = (e) => {
    setCurrentPrincipal(Number(e.target.value) || 0);
  };

  const handleAdditionChange = (e) => {
    setAnnualAddition(Number(e.target.value) || 0);
  };

  const handleYearsChange = (e) => {
    setYearsToGrow(Number(e.target.value) || 1);
  };

  const handleGrowthRateChange = (e) => {
    setGrowthRate(Number(e.target.value) || 0);
  };

  // ─── Calculate return percentage ─────────────────────────────
  const returnPercentage = useMemo(() => {
    if (results.totalInvested > 0) {
      return ((results.futureValue - results.totalInvested) / results.totalInvested) * 100;
    }
    return 0;
  }, [results]);

  return (
    <>
      <Seo
        title="Future Value Calculator – Compound Interest Growth"
        description="Calculate the future value of your investments with compound interest. See how your money grows with annual additions and compounding."
        path="/future-value-calculator"
        keywords="future value calculator, compound interest, investment growth, wealth calculator"
        jsonLd={calculatorSchema({
          name: "Future Value Calculator",
          description: "Calculate the future value of your investments with compound interest. See how your money grows with annual additions and compounding.",
          path: "/future-value-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Investment Calculator
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Future Value (Compound Interest) Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate the future value of your investments with compound interest and annual additions.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Investment Details
              </h2>

              <div className="space-y-8">
                {/* Current Principal */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Current Principal
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {currency}{formatCurrency(currentPrincipal)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="1000"
                    value={currentPrincipal}
                    onChange={handlePrincipalChange}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
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
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Annual Addition */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Annual Addition
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {currency}{formatCurrency(annualAddition)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="500"
                    value={annualAddition}
                    onChange={handleAdditionChange}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
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
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Years to Grow */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Years to Grow
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {yearsToGrow} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={yearsToGrow}
                    onChange={handleYearsChange}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>50 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={yearsToGrow}
                    onChange={(e) => setYearsToGrow(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Growth Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Growth Rate (%)
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {growthRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={growthRate}
                    onChange={handleGrowthRateChange}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value) || 0)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Results
              </h2>

              <div className="flex-1 space-y-6">
                {/* Future Value */}
                <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-2xl p-6 border border-emerald-100">
                  <p className="text-sm text-slate-500">Future Value</p>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-700 mt-1">
                    {currency}{formatCurrency(results.futureValue)}
                  </p>
                </div>

                {/* Growth Rate */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Growth Rate</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {growthRate}%
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Investment Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Invested</span>
                    <span className="font-medium">{currency}{formatCurrency(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Returns</span>
                    <span className={`font-medium ${results.totalReturns >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {currency}{formatCurrency(results.totalReturns)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Return Percentage</span>
                    <span className={`font-bold ${returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {returnPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Visual progress */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Principal</span>
                    <span>Future Value</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min((results.futureValue / (results.futureValue + results.totalReturns)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>{currency}{formatCurrency(results.totalInvested)}</span>
                    <span>{currency}{formatCurrency(results.futureValue)}</span>
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
                  Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="futurevalue_calc_mid" />
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Future Value (Compound Interest) Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                A Future Value Calculator helps you estimate the value of your investments at a future date, accounting for compound interest and annual additions. It shows how your money grows over time, helping you plan for long-term financial goals like retirement, education, or wealth building.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How Is Future Value Calculated?</h2>
              <p className="text-slate-500 leading-relaxed">
                For a lump sum with no further additions:
              </p>
              <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                FV = P × (1 + r)^N
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                Where <strong>P</strong> is the principal, <strong>r</strong> is the
                annual growth rate, and <strong>N</strong> is the number of years. If
                you also add a fixed amount every year, this calculator adds the
                future value of those contributions as a growing annuity on top of
                the lump-sum result — which is why increasing your annual
                contribution has a compounding effect of its own, not just a linear
                one, over a long enough horizon.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your current principal amount (initial investment).</li>
                <li>Add any annual contributions you plan to make.</li>
                <li>Set the number of years you want your money to grow.</li>
                <li>Enter the expected annual growth rate (rate of return).</li>
                <li>The calculator will show your future value and investment summary.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding Compound Interest</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">Power of Compounding</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Compound interest earns returns on both your principal and previously earned returns. This creates exponential growth over time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">Regular Contributions</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Adding to your investments regularly (annual additions) significantly accelerates wealth accumulation through the power of compounding.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">Time Horizon</h3>
                  <p className="text-slate-500 leading-relaxed">
                    The longer your investment horizon, the more time your money has to compound and grow. Starting early is one of the most effective wealth-building strategies.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">Rate of Return</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Higher returns lead to faster growth, but they come with higher risk. Find a balance that matches your risk tolerance and financial goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is the difference between simple and compound interest?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest, leading to exponential growth.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How often does compound interest compound?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    In this calculator, we assume annual compounding. Real-world investments may compound daily, monthly, quarterly, or annually. More frequent compounding results in slightly higher returns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is a good rate of return for long-term investments?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Historically, stock markets have provided positive long-term returns, while bonds and fixed-income investments generally offer lower but more stable returns. Actual results vary by country, market conditions, and investment type. Your ideal rate depends on your risk tolerance and investment goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Does this account for inflation?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    No — the future value shown is in nominal terms. To see what
                    that amount is worth in today's purchasing power, discount it
                    by your assumed inflation rate separately, or use the Inflation
                    Calculator alongside this one.
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