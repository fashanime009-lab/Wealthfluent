import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";


export default function GoalSIPCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [goalAmount, setGoalAmount] = useState(500000);
  const [investmentDuration, setInvestmentDuration] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [currency, setCurrency] = useState("$");

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = investmentDuration * 12;

    let monthlySIP = 0;
    let totalInvestment = 0;

    if (monthlyRate > 0 && months > 0) {
      // Formula: P = FV * r / [((1 + r)^n - 1) * (1 + r)]
      // where P = monthly SIP, FV = goal amount, r = monthly rate, n = number of months
      monthlySIP =
        (goalAmount * monthlyRate) /
        ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
      totalInvestment = monthlySIP * months;
    }

    return {
      monthlySIP: Math.round(monthlySIP * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
    };
  }, [goalAmount, investmentDuration, expectedReturn]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleGoalChange = (e) => {
    setGoalAmount(Number(e.target.value) || 0);
  };

  const handleDurationChange = (e) => {
    setInvestmentDuration(Number(e.target.value) || 1);
  };

  const handleReturnChange = (e) => {
    setExpectedReturn(Number(e.target.value) || 0);
  };

  return (
    <>
      <Helmet>
        <title>Goal Investment Calculator – Plan Your Financial Goals</title>
        <meta
          name="description"
          content="Calculate the monthly SIP investment needed to reach your financial goal. Plan your investments with our Goal SIP Calculator."
        />
        <meta
          name="keywords"
          content="goal SIP calculator, SIP planner, mutual fund goal planner, investment calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Goal Planning Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Goal SIP Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Determine the monthly SIP investments you need to make to reach a particular goal.
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
                {/* Goal Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Goal Amount
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {currency}{formatCurrency(goalAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="5000"
                    value={goalAmount}
                    onChange={handleGoalChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}10,000</span>
<span>{currency}10,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="10000"
                    max="10000000"
                    step="5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value) || 10000)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Investment Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Investment Duration (In Years)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {investmentDuration} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={investmentDuration}
                    onChange={handleDurationChange}
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
                    value={investmentDuration}
                    onChange={(e) => setInvestmentDuration(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Expected Return */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Expected Rate of Return (p.a.) %
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {expectedReturn}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={expectedReturn}
                    onChange={handleReturnChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Your Investment Plan
              </h2>

              <div className="flex-1 space-y-6">
                {/* Monthly SIP Amount */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-slate-500">Monthly SIP Amount</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {currency}{formatCurrency(results.monthlySIP)}
                  </p>
                </div>

                {/* Total Investment */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Your Total Investment</span>
                    <span className="text-2xl font-bold text-slate-800">
                      {currency}{formatCurrency(results.totalInvestment)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min((results.totalInvestment / goalAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {((results.totalInvestment / goalAmount) * 100).toFixed(1)}% of your goal amount
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-2 border border-slate-200/50">
                  <h3 className="font-semibold text-slate-700 text-sm">Plan Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Goal Amount</span>
                    <span className="font-medium">{currency}{formatCurrency(goalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Investment Duration</span>
                    <span className="font-medium">{investmentDuration} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Expected Return</span>
                    <span className="font-medium">{expectedReturn}% p.a.</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2 font-semibold">
                    <span>Monthly SIP Required</span>
                    <span className="text-blue-600">{currency}{formatCurrency(results.monthlySIP)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  window.open("https://www.investopedia.com/investing-4427685", "_blank");
                }}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-blue-300/50 text-lg"
              >
                Start Your SIP Journey
              </button>

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
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Goal SIP Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                A Goal SIP Calculator helps you determine the monthly Systematic Investment Plan (SIP)
                amount you need to invest to reach a specific financial goal. By entering your goal amount,
                investment duration, and expected rate of return, the calculator computes the required
                monthly investment to achieve your target.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your financial goal amount (e.g., 500,000 for a home down payment).</li>
                <li>Set your investment duration (number of years you can invest).</li>
                <li>Enter the expected annual rate of return from your investments.</li>
                <li>The calculator will show the monthly SIP amount required and total investment.</li>
                <li>Adjust the inputs to find a comfortable monthly investment amount.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Benefits of Goal-Based SIP Planning</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Goal Clarity</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Define specific financial goals and create a disciplined investment plan to achieve them.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Disciplined Investing</h3>
                  <p className="text-slate-500 leading-relaxed">
                    SIPs encourage regular investing and cost averaging, reducing market timing risk.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Power of Compounding</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Starting early and investing regularly allows your money to grow significantly over time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Flexible Planning</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Adjust your monthly SIP amount, duration, or expected returns to find a plan that fits your budget.
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