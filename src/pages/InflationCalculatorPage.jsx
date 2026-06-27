import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";


export default function InflationCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentExpenses, setCurrentExpenses] = useState(10000);
  const [inflationRate, setInflationRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(30);
  const [currency, setCurrency] = useState("$");

  // ─── Calculations ──────────────────────────────────────────────
  const futureCost = useMemo(() => {
    return Math.round(
      currentExpenses * Math.pow(1 + inflationRate / 100, timePeriod)
    );
  }, [currentExpenses, inflationRate, timePeriod]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleExpensesChange = (e) => {
    setCurrentExpenses(Number(e.target.value) || 0);
  };

  const handleInflationChange = (e) => {
    setInflationRate(Number(e.target.value) || 0);
  };

  const handleTimeChange = (e) => {
    setTimePeriod(Number(e.target.value) || 1);
  };

  // Calculate purchasing power loss
  const purchasingPowerLoss = useMemo(() => {
    if (futureCost > 0 && currentExpenses > 0) {
      return Math.round(((futureCost - currentExpenses) / futureCost) * 100);
    }
    return 0;
  }, [futureCost, currentExpenses]);

  return (
    <>
      <Helmet>
        <title>Inflation Calculator – Understand the Impact of Inflation</title>
        <meta
          name="description"
          content="Calculate the impact of inflation on your money. Find out how much you will need in the future to meet your current expenses whilst keeping up with inflation."
        />
        <meta
          name="keywords"
          content="inflation calculator, purchasing power, future cost, inflation impact, financial planning"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Calculator
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Inflation Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate the impact of inflation on your money. Find out how much you will need in the future to meet your current expenses whilst keeping up with inflation.
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
                Inflation Details
              </h2>

              <div className="space-y-8">
                {/* Current Expenses */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Current Expense Amount
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {currency}{formatCurrency(currentExpenses)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000000"
                    step="100"
                    value={currentExpenses}
                    onChange={handleExpensesChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}100</span>
<span>{currency}1,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    step="100"
                    value={currentExpenses}
                    onChange={(e) => setCurrentExpenses(Number(e.target.value) || 100)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Inflation Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Annual Inflation Rate (%)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {inflationRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={inflationRate}
                    onChange={handleInflationChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Time Period */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Time Period (In Years)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {timePeriod} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={timePeriod}
                    onChange={handleTimeChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Future Value
              </h2>

              <div className="flex-1 space-y-6">
                {/* Future Cost */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-slate-500">Future Cost</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {currency}{formatCurrency(futureCost)}
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                    <p className="text-xs text-slate-500">Current Expenses</p>
                    <p className="text-lg font-bold text-slate-800">
                      {currency}{formatCurrency(currentExpenses)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                    <p className="text-xs text-slate-500">Time Period</p>
                    <p className="text-lg font-bold text-slate-800">
                      {timePeriod} Years
                    </p>
                  </div>
                </div>

                {/* Inflation Impact Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                  <h3 className="font-semibold text-slate-700 text-sm mb-3">Inflation Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Increase in Cost</span>
                      <span className="font-medium text-amber-600">
                        +{currency}{formatCurrency(futureCost - currentExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Purchasing Power Lost</span>
                      <span className="font-medium text-red-500">
                        {purchasingPowerLoss}%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.min(purchasingPowerLoss, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {purchasingPowerLoss}% of your money's purchasing power will be eroded by inflation
                    </p>
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is an Inflation Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                An Inflation Calculator helps you understand how inflation erodes the purchasing power of your money over time. It calculates the future cost of today's expenses based on the expected annual inflation rate and time period, helping you plan your finances more effectively.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your current monthly or annual expenses.</li>
                <li>Set the expected annual inflation rate (historical inflation rates vary by country and economic conditions).</li>
                <li>Choose the time period (years) for which you want to calculate the future cost.</li>
                <li>The calculator will show the future cost and the impact of inflation on your purchasing power.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Inflation Planning Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Retirement Planning</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Inflation significantly impacts retirement savings. What seems adequate today may not be sufficient in 20-30 years.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Goal-Based Investing</h3>
                  <p className="text-slate-500 leading-relaxed">
                    When saving for long-term goals like children's education or buying a home, always account for inflation to avoid shortfalls.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Investment Strategy</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Understanding inflation helps you choose investments that can beat inflation and grow your real wealth.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Budgeting</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Regular expense reviews and inflation adjustments help maintain your standard of living over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is a typical inflation rate?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Inflation rates vary by country and over time. Many developed economies have historically targeted around 2%, while emerging economies may experience higher inflation rates. However, inflation can vary significantly based on economic conditions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How does inflation affect my savings?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Inflation reduces the purchasing power of your savings. If your savings earn a return lower than inflation, your real wealth decreases over time. This is why it's important to invest in assets that beat inflation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Which investments beat inflation?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Historically, equities (stocks), real estate, and gold have beaten inflation over the long term. Fixed deposits and bonds typically offer returns that may or may not beat inflation depending on the interest rate environment.
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