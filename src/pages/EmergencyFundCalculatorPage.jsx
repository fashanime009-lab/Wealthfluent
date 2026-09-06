import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";

export default function EmergencyFundCalculatorPage() {
  const { settings } = useSettings();

  const currency = settings.currency;

  // ─── State ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useState({
    monthlyExpenses: 30000,
    recommendedMonths: 6,
    currentSavings: 100000,
    additionalIncome: 0,
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const { monthlyExpenses, recommendedMonths, currentSavings, additionalIncome } = inputs;

    const target = monthlyExpenses * recommendedMonths;
    const netSavings = currentSavings + additionalIncome;
    const shortfall = Math.max(0, target - netSavings);
    const monthsCovered = netSavings > 0 ? netSavings / monthlyExpenses : 0;

    return {
      target: Math.round(target),
      netSavings: Math.round(netSavings),
      shortfall: Math.round(shortfall),
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      isFullyFunded: netSavings >= target,
    };
  }, [inputs]);

  return (
    <>
      <Seo
        title="Emergency Fund Calculator – FINAIW"
        description="Calculate how much you need in your emergency fund based on your monthly expenses and savings. Plan for financial security."
        path="/emergency-fund-calculator"
        keywords="emergency fund calculator, rainy day fund, savings goal, financial security"
        jsonLd={calculatorSchema({
          name: "Emergency Fund Calculator",
          description: "Calculate how much you need in your emergency fund based on your monthly expenses and savings. Plan for financial security.",
          path: "/emergency-fund-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Security Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Emergency Fund Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Plan your financial safety net. Calculate how much you need to set aside for unexpected expenses, job loss, or emergencies.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Your Financial Details</h2>

              <div className="space-y-6">
                {/* Monthly Expenses */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Monthly Living Expenses
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(inputs.monthlyExpenses, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={inputs.monthlyExpenses}
                    onChange={(e) => handleChange("monthlyExpenses", e.target.value)}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{formatCurrency(1000, currency)}</span>
                    <span>{formatCurrency(500000, currency)}</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={inputs.monthlyExpenses}
                    onChange={(e) => handleChange("monthlyExpenses", e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Recommended Months */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Months of Expenses to Cover
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {inputs.recommendedMonths} months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={inputs.recommendedMonths}
                    onChange={(e) => handleChange("recommendedMonths", e.target.value)}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 month</span>
                    <span>24 months</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Financial experts recommend 3–6 months of expenses for most people, or up to 12 months for higher-risk situations.
                  </p>
                </div>

                {/* Current Savings */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Current Savings
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(inputs.currentSavings, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="1000"
                    value={inputs.currentSavings}
                    onChange={(e) => handleChange("currentSavings", e.target.value)}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{formatCurrency(0, currency)}</span>
                    <span>{formatCurrency(5000000, currency)}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="5000000"
                    step="1000"
                    value={inputs.currentSavings}
                    onChange={(e) => handleChange("currentSavings", e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Additional Income (optional) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Additional Income Source
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(inputs.additionalIncome, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="1000"
                    value={inputs.additionalIncome}
                    onChange={(e) => handleChange("additionalIncome", e.target.value)}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{formatCurrency(0, currency)}</span>
                    <span>{formatCurrency(500000, currency)}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="500000"
                    step="1000"
                    value={inputs.additionalIncome}
                    onChange={(e) => handleChange("additionalIncome", e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-400 mt-1">Optional: Include rental income, freelance earnings, or any additional monthly income.</p>
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Your Emergency Fund</h2>

              <div className="flex-1 space-y-6">
                {/* Target Amount */}
                <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-2xl p-5 border border-emerald-100">
                  <p className="text-sm text-slate-500">Recommended Emergency Fund</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-1">
                    {formatCurrency(results.target, currency)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on {inputs.recommendedMonths} months of expenses
                  </p>
                </div>

                {/* Current Status */}
                <div className={`rounded-2xl p-5 border ${results.isFullyFunded ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
                  <p className="text-sm text-slate-500">Current Status</p>
                  {results.isFullyFunded ? (
                    <>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">✓ Fully Funded!</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Your savings cover <strong>{results.monthsCovered} months</strong> of expenses.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-amber-600 mt-1">Need to Save More</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Your savings cover <strong>{results.monthsCovered} months</strong> of expenses.
                      </p>
                      <p className="text-sm text-slate-600">
                        Shortfall: <span className="font-bold text-amber-600">{formatCurrency(results.shortfall, currency)}</span>
                      </p>
                    </>
                  )}
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-200/50">
                  <h3 className="font-semibold text-slate-700 text-sm">Breakdown</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly Expenses</span>
                    <span className="font-medium">{formatCurrency(inputs.monthlyExpenses, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Months to Cover</span>
                    <span className="font-medium">{inputs.recommendedMonths} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Savings</span>
                    <span className="font-medium">{formatCurrency(inputs.currentSavings, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Additional Income</span>
                    <span className="font-medium">{formatCurrency(inputs.additionalIncome, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2 font-bold">
                    <span>Total Available</span>
                    <span>{formatCurrency(results.netSavings, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  This calculator is for illustrative purposes only. Your actual emergency fund needs may vary based on your personal situation.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="emergencyfund_calc_mid" />
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is an Emergency Fund?</h2>
              <p className="text-slate-500 leading-relaxed">
                An emergency fund is a dedicated savings account designed to cover unexpected expenses — such as medical bills, car repairs, or job loss. Financial experts recommend saving 3 to 6 months' worth of living expenses to protect against life's uncertainties.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter your average monthly living expenses (rent, food, utilities, etc.).</li>
                <li>Select how many months you'd like to cover (usually 3–12).</li>
                <li>Add your current savings and any additional income sources.</li>
                <li>See your target emergency fund and whether you're on track.</li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Why an Emergency Fund Matters
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Avoids High-Interest Debt
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Without savings set aside, an unexpected expense often gets
                    funded with a credit card or personal loan, turning a one-time
                    cost into an ongoing interest expense.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Protects Your Investments
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A cash buffer means you're never forced to sell mutual funds or
                    stocks at a loss just because a downturn coincided with a job
                    loss or emergency — exactly the scenario a cash buffer prevents.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Reduces Financial Stress
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Knowing a few months of expenses are covered changes how you
                    approach job changes, negotiations, and other decisions —
                    you're choosing from a position of stability, not desperation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    A Foundation for Everything Else
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Most financial planning frameworks put an emergency fund before
                    investing, insurance optimization, or debt payoff — it's the
                    base the rest of a plan is built on.
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
                    How many months of expenses should I save?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    3 months is a common starting point for stable, dual-income
                    households; 6–9 months is safer for freelancers, single-income
                    households, or anyone with variable income.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Where should I keep my emergency fund?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Somewhere accessible within a day or two without penalty or
                    market risk — a high-yield savings account or a liquid mutual
                    fund, not equity and not a long-tenure fixed deposit.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Should I invest my emergency fund for better returns?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    No — the purpose of this money is reliability, not growth.
                    Investing it defeats the point: if a downturn coincides with
                    your emergency (a common pattern, since layoffs often spike
                    during downturns), you'd be forced to sell at a loss.
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