import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RateOfReturnCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [presentValue, setPresentValue] = useState(10000);
  const [futureValue, setFutureValue] = useState(50000);
  const [yearsToGrow, setYearsToGrow] = useState(5);

  // ─── Calculations ──────────────────────────────────────────────
  const rateOfReturn = useMemo(() => {
    if (presentValue <= 0 || futureValue <= 0 || yearsToGrow <= 0) return 0;
    const rate = (Math.pow(futureValue / presentValue, 1 / yearsToGrow) - 1) * 100;
    return rate;
  }, [presentValue, futureValue, yearsToGrow]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ─── Format percentage ──────────────────────────────────────────
  const formatPercentage = (value) => {
    return value.toFixed(2);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePresentValueChange = (e) => {
    setPresentValue(Number(e.target.value) || 0);
  };

  const handleFutureValueChange = (e) => {
    setFutureValue(Number(e.target.value) || 0);
  };

  const handleYearsChange = (e) => {
    setYearsToGrow(Number(e.target.value) || 1);
  };

  // ─── Calculate gain ──────────────────────────────────────────
  const totalGain = futureValue - presentValue;
  const totalGainPercentage = presentValue > 0 ? (totalGain / presentValue) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>Rate of Return Calculator – CAGR Calculator</title>
        <meta
          name="description"
          content="Calculate the annualized rate of return (CAGR) for your investments. Find out how much your money has grown over time."
        />
        <meta
          name="keywords"
          content="rate of return calculator, CAGR calculator, investment returns, annualized return"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <Navbar />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Investment Calculator
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Rate of Return Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate the annualized rate of return (CAGR) based on present value, future value, and time period.
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
                {/* Present Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Present Value
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formatCurrency(presentValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000000"
                    step="100"
                    value={presentValue}
                    onChange={handlePresentValueChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹1,00,00,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="10000000"
                    step="100"
                    value={presentValue}
                    onChange={(e) => setPresentValue(Number(e.target.value) || 100)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Future Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Future Value
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formatCurrency(futureValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="100000000"
                    step="100"
                    value={futureValue}
                    onChange={handleFutureValueChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹10,00,00,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="100000000"
                    step="100"
                    value={futureValue}
                    onChange={(e) => setFutureValue(Number(e.target.value) || 100)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Years to Grow */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Years to Grow
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
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
                    value={yearsToGrow}
                    onChange={(e) => setYearsToGrow(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                {/* Rate of Return */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-slate-500">Rate of Return (CAGR)</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {formatPercentage(rateOfReturn)}%
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                    <p className="text-xs text-slate-500">Present Value</p>
                    <p className="text-lg font-bold text-slate-800">
                      ₹{formatCurrency(presentValue)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                    <p className="text-xs text-slate-500">Future Value</p>
                    <p className="text-lg font-bold text-slate-800">
                      ₹{formatCurrency(futureValue)}
                    </p>
                  </div>
                </div>

                {/* Gain Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Investment Growth</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Gain</span>
                    <span className={`font-medium ${totalGain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      ₹{formatCurrency(totalGain)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Gain Percentage</span>
                    <span className={`font-medium ${totalGainPercentage >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {totalGainPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Time Period</span>
                    <span className="font-medium">{yearsToGrow} Years</span>
                  </div>
                </div>

                {/* Visual progress */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Present Value</span>
                    <span>Future Value</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min((presentValue / futureValue) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>₹{formatCurrency(presentValue)}</span>
                    <span>₹{formatCurrency(futureValue)}</span>
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
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Rate of Return Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                A Rate of Return Calculator helps you determine the annualized return (CAGR) of your investments. By entering the present value, future value, and time period, you can understand how well your investments have performed over time.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter the present value (initial investment amount).</li>
                <li>Enter the future value (final investment amount).</li>
                <li>Set the number of years the investment has grown.</li>
                <li>The calculator will show the annualized rate of return (CAGR).</li>
                <li>Use the results to compare different investment opportunities.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding Rate of Return</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">CAGR (Compound Annual Growth Rate)</h3>
                  <p className="text-slate-500 leading-relaxed">
                    CAGR measures the average annual growth rate of an investment over a specific period. It smooths out volatility to show a consistent annual return.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Absolute vs. Annualized Returns</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Absolute return is the total percentage gain over the entire period. Annualized return (CAGR) shows the average annual gain, making it easier to compare investments with different time horizons.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Risk and Return</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Higher returns generally come with higher risk. Understanding your rate of return helps you assess whether the risk you're taking is justified.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Inflation-Adjusted Returns</h3>
                  <p className="text-slate-500 leading-relaxed">
                    To calculate real returns, subtract the inflation rate from your rate of return. This shows the actual increase in purchasing power.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is a good rate of return?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Historically, Indian equity markets have delivered 12-15% CAGR over long periods. Debt instruments typically offer 6-9% returns. The ideal return depends on your risk tolerance and investment goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How is rate of return different from simple interest?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Rate of return (CAGR) accounts for compound growth, while simple interest is calculated only on the principal. CAGR provides a more accurate picture of investment performance over time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Can the rate of return be negative?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Yes, if the future value is less than the present value, the rate of return will be negative, indicating a loss on the investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}