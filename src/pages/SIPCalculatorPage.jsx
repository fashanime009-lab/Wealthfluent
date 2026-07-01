import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useFinance } from "../context/FinanceContext";
import { addGoal } from "../services/goalEngine";


export default function SIPCalculatorPage() {
  const { setSipData } = useFinance();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [currency, setCurrency] = useState("₹");

  // Calculations
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  const investedAmount = monthlyInvestment * months;
  const futureValue =
    annualReturn === 0
      ? investedAmount
      : Math.round(
          monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate)
        );
  const estimatedReturns = futureValue - investedAmount;

  // Update context
  useEffect(() => {
    setSipData({
      monthlyInvestment,
      annualReturn,
      years,
      futureValue,
    });
  }, [monthlyInvestment, annualReturn, years, futureValue, setSipData]);

  // Handlers for sliders
  const handleMonthlyInvestmentChange = (e) => {
    setMonthlyInvestment(Number(e.target.value));
  };
  const handleAnnualReturnChange = (e) => {
    setAnnualReturn(Number(e.target.value));
  };
  const handleYearsChange = (e) => {
    setYears(Number(e.target.value));
  };

  // Format currency
 const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
};
const handleSaveGoal = () => {
  addGoal({
    type: "retirement",

    title: "Retirement Planning",

    target: futureValue,

    current: investedAmount,

    monthlyContribution: monthlyInvestment,

    duration: years,

    expectedReturn: annualReturn,

    calculator: "SIP Calculator",

    lesson: "Retirement Planning",

    xp: 40,

    wealthScore: 8,
  });

  alert("✅ Retirement goal saved to your Workspace!");
};
  return (
    <>
      <Helmet>
        <title>SIP Calculator – Calculate Investment Growth</title>
        <meta
          name="description"
          content="Free SIP Calculator to estimate mutual fund investment returns with monthly SIP amount, expected returns, and investment duration."
        />
        <meta
          name="keywords"
          content="SIP calculator, mutual fund calculator, investment calculator, SIP return calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Calculators
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              SIP Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Find the future value of your monthly/quarterly SIP investment.
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
                {/* Monthly SIP Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      SIP Amount
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {currency}{formatCurrency(monthlyInvestment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={handleMonthlyInvestmentChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}500</span>
<span>{currency}100,000</span>
                  </div>
                  <input
                    type="number"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value) || 500)
                    }
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
                      {annualReturn}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={handleAnnualReturnChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-15%</span>
                    <span>30%</span>
                  </div>
                  <input
                    type="number"
                    min="-15"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) =>
                      setAnnualReturn(Number(e.target.value) || 0)
                    }
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
                      {years} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={years}
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
                <p className="text-sm text-slate-500">Future value of your investment:</p>
                <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                  {currency}{formatCurrency(futureValue)}
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Invested Amount */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Your Investment</span>
                    <span className="text-lg font-semibold text-slate-800">
                      {currency}{formatCurrency(investedAmount)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min((investedAmount / futureValue) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Estimated Returns */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Estimated Returns</span>
                    <span
                      className={`text-lg font-semibold ${
                        estimatedReturns >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                     {estimatedReturns >= 0 ? "+" : "-"}
{currency}
{formatCurrency(Math.abs(estimatedReturns))}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        estimatedReturns >= 0 ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.abs((estimatedReturns / investedAmount) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowInvestModal(true)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-blue-300/50 text-lg"
              >
                Start Investing Smarter
                
              </button>
<button
  onClick={handleSaveGoal}
  className="mt-4 w-full rounded-2xl border border-blue-200 bg-white py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
>
  Save as Retirement Goal
</button>
              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only
                  and do not represent actual returns.
                </p>
                <p>
                  Stock Market does not have a fixed rate of return and it is
                  not possible to predict the rate of return.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            {/* What is SIP Calculator */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is SIP Calculator?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                A SIP Calculator helps investors estimate future wealth creation
                through Systematic Investment Plans (SIP) using monthly investments,
                expected annual returns, and investment duration.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of SIP Investments
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Rupee Cost Averaging
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    SIP investments reduce market timing risks by investing
                    consistently over time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Long-Term Wealth Growth
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Compounding can significantly increase investment value
                    over long investment periods.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Flexible Investing
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Investors can start SIPs with small monthly amounts
                    based on financial goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Disciplined Saving
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    SIPs encourage consistent long-term investing habits.
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
                    What is a good SIP amount?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A good SIP amount depends on income, financial goals,
                    and investment horizon.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Is SIP better than FD?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    SIPs offer market-linked growth potential, while fixed
                    deposits provide stable fixed returns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Can SIP create long-term wealth?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Long-term SIP investing combined with compounding
                    can significantly grow wealth over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Modal */}
          {showInvestModal && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-600 text-2xl flex items-center justify-center"
                >
                  ×
                </button>

                <div>
                  <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                    Smart Wealth Plan
                  </p>
                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    Your SIP Could Grow To
                  </h2>
                  <h3 className="text-5xl font-black text-blue-600 mt-2">
                    {currency}{formatCurrency(futureValue)}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-slate-50 rounded-2xl p-4 text-center">
                      <p className="text-sm text-slate-500">Monthly SIP</p>
                      <p className="text-xl font-bold text-slate-800">
                        {currency}{formatCurrency(monthlyInvestment)}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 text-center">
                      <p className="text-sm text-slate-500">Expected Return</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {annualReturn}%
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 text-center">
                      <p className="text-sm text-slate-500">Investment Time</p>
                      <p className="text-xl font-bold text-purple-600">
                        {years} Years
                      </p>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-slate-700 mb-1">
                      AI Wealth Insight
                    </h4>
                    <p className="text-sm text-slate-600">
                      If you increase your monthly investment by just 2,000 units every year,
                      your long-term wealth potential could increase dramatically
                      through compound growth.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://groww.in/mutual-funds"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3.5 rounded-2xl text-center text-lg"
                    >
                      Start SIP Journey
                    </a>
                    <button
                      onClick={() => {
                        setShowInvestModal(false);
                        setTimeout(() => {
                          window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                          });
                        }, 200);
                      }}
                      className="flex-1 border border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition text-slate-700 font-semibold py-3.5 rounded-2xl text-lg"
                    >
                      Continue Exploring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        
      </div>
    </>
  );
}