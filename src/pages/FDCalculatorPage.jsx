import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FDCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const maturityAmount = Math.round(
    principal * Math.pow(1 + rate / 100, years)
  );
  const interestEarned = maturityAmount - principal;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>FD Calculator India – Fixed Deposit Returns</title>
        <meta
          name="description"
          content="Free FD Calculator to estimate fixed deposit maturity amount, interest earned, and investment growth with different rates and tenures."
        />
        <meta
          name="keywords"
          content="FD calculator, fixed deposit calculator, FD returns, investment calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <Navbar />

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Calculators
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              FD Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Estimate fixed deposit maturity value and interest earnings
              with different investment durations and interest rates.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Deposit Details
              </h2>

              <div className="space-y-8">
                {/* Deposit Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Deposit Amount
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formatCurrency(principal)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹1,000</span>
                    <span>₹50,00,000</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={principal}
                    onChange={(e) =>
                      setPrincipal(Number(e.target.value) || 1000)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Interest Rate (p.a.) %
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {rate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span>
                    <span>12%</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    step="0.1"
                    value={rate}
                    onChange={(e) =>
                      setRate(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Duration (Years)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {years} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>20 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="20"
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
                <p className="text-sm text-slate-500">Maturity Amount</p>
                <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                  ₹{formatCurrency(maturityAmount)}
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Interest Earned */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Interest Earned</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      ₹{formatCurrency(interestEarned)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min((interestEarned / maturityAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Initial Deposit */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Initial Deposit</span>
                    <span className="text-lg font-semibold text-slate-800">
                      ₹{formatCurrency(principal)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min((principal / maturityAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only
                  and do not represent actual returns.
                </p>
                <p>
                  Interest rates may vary across banks and financial institutions,
                  and actual returns depend on applicable rates and compounding frequency.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            {/* What is FD Calculator */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is FD Calculator?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                An FD Calculator helps investors estimate fixed deposit maturity
                value and total interest earnings based on investment amount,
                interest rate, and investment duration. Fixed Deposits are one
                of the most popular low-risk investment options offered by banks
                and financial institutions in India.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of Fixed Deposits
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Safe Investment
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Fixed deposits are considered one of the safest investment
                    options with predictable returns and low financial risk.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Guaranteed Returns
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    FD returns are fixed at the time of investment and are not
                    directly affected by stock market volatility.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Flexible Duration
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Investors can choose short-term or long-term deposit periods
                    based on financial goals and liquidity needs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Better Savings Planning
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    FD calculators help estimate future maturity value for
                    retirement planning, emergency funds, and wealth preservation.
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
                    How is FD maturity amount calculated?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    FD maturity amount depends on principal investment,
                    interest rate, compounding frequency, and investment duration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Are fixed deposits risk-free?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Fixed deposits are generally considered low-risk investments,
                    especially when offered by regulated banks and institutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Which is better: FD or SIP?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    FDs provide stable fixed returns, while SIP investments
                    offer potentially higher long-term market-linked growth.
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