import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function CAGRCalculatorPage() {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(50000);
  const [years, setYears] = useState(5);
  const [currency, setCurrency] = useState("$");

  const cagr =
    (
      (Math.pow(finalValue / initialValue, 1 / years) - 1) *
      100
    ).toFixed(2);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>CAGR Calculator – Investment Growth Rate</title>
        <meta
          name="description"
          content="Free CAGR Calculator to estimate annualized investment growth rate and long-term investment performance."
        />
        <meta
          name="keywords"
          content="CAGR calculator, compound annual growth rate, investment growth, mutual fund returns"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Investment Growth Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              CAGR Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate Compound Annual Growth Rate (CAGR) for investments,
              stocks, mutual funds, and business growth.
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
                Investment Details
              </h2>

              <div className="space-y-8">
                {/* Initial Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Initial Investment
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {currency}{formatCurrency(initialValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={initialValue}
                    onChange={(e) => setInitialValue(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}1,000</span>
<span>{currency}5,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={initialValue}
                    onChange={(e) =>
                      setInitialValue(Number(e.target.value) || 1000)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Final Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Final Value
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {currency}{formatCurrency(finalValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={finalValue}
                    onChange={(e) => setFinalValue(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}1,000</span>
<span>{currency}1,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={finalValue}
                    onChange={(e) =>
                      setFinalValue(Number(e.target.value) || 1000)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Years */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Investment Duration (Years)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {years} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) =>
                      setYears(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-slate-500">Compound Annual Growth Rate</p>
                <h2 className="text-5xl md:text-6xl font-bold text-blue-600 mt-1">
                  {cagr}%
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Initial Value */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Initial Value</span>
                    <span className="text-lg font-semibold text-slate-800">
                      ₹{formatCurrency(initialValue)}
                    </span>
                  </div>
                </div>

                {/* Final Value */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Final Value</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      ₹{formatCurrency(finalValue)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((finalValue - initialValue) / initialValue) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  CAGR calculations are based on the inputs provided and are for
                  illustrative purposes only. Past performance does not guarantee
                  future returns. Actual investment returns may vary.
                </p>
                <p>
                  CAGR does not account for volatility or risk. Please consult a
                  financial advisor for personalised investment advice.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            {/* What is CAGR */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is CAGR?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                CAGR (Compound Annual Growth Rate) measures the average
                annual growth rate of an investment over a specific time
                period. It helps investors understand long-term investment
                performance more accurately than simple returns, smoothing
                out volatility and providing a clear annualised figure.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of CAGR Analysis
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Compare Investments
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    CAGR helps compare investment performance across
                    stocks, mutual funds, businesses, and assets
                    on a consistent annualised basis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Long-Term Analysis
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Investors can evaluate long-term wealth growth
                    more effectively using annualized returns rather
                    than absolute returns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Goal Setting
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    CAGR helps set realistic return expectations and
                    plan future investment goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Performance Tracking
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Track investment performance over multiple years
                    to assess strategy effectiveness.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    What is a good CAGR?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A good CAGR depends on asset type, market conditions,
                    and investment risk levels. A good CAGR depends on the investment type, market conditions, and level of risk. Historically, stock markets have delivered strong long-term returns, while fixed-income investments generally provide lower but more stable returns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Why is CAGR important?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    CAGR provides a smoothed annual growth rate that removes
                    volatility, making it easier to compare investments with
                    different time horizons and evaluate long-term performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    What is the difference between CAGR and absolute return?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Absolute return measures total growth over the entire period,
                    while CAGR expresses it as an annualised rate, making
                    comparisons across different timeframes more meaningful.
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