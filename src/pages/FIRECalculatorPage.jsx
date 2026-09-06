import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function FIRECalculatorPage() {
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;
  const [formData, setFormData] = useState({
    currentAge: 25,
    retirementAge: 45,
    monthlyExpenses: 50000,
    currentSavings: 300000,
    monthlyInvestment: 25000,
    expectedReturn: 12,
    inflationRate: 6,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const results = useMemo(() => {
    const years = formData.retirementAge - formData.currentAge;
    const monthlyRate = formData.expectedReturn / 100 / 12;
    const totalMonths = years * 12;

    const futureInvestments =
      formData.monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const futureSavings =
      formData.currentSavings *
      Math.pow(1 + formData.expectedReturn / 100, years);

    const totalWealth = futureInvestments + futureSavings;

    const futureExpenses =
      formData.monthlyExpenses *
      Math.pow(1 + formData.inflationRate / 100, years);

    const fireNumber = futureExpenses * 12 * 25;

    const freedomScore = Math.min(
      100,
      Math.round((totalWealth / fireNumber) * 100)
    );

    const chartData = [];
    for (let i = 0; i <= years; i++) {
      const yearlyInvestment =
        formData.currentSavings + formData.monthlyInvestment * 12 * i;
      const growth =
        yearlyInvestment * Math.pow(1 + formData.expectedReturn / 100, i);
      chartData.push({
        age: formData.currentAge + i,
        wealth: Math.round(growth),
      });
    }

    return {
      years,
      totalWealth,
      futureExpenses,
      fireNumber,
      freedomScore,
      chartData,
    };
  }, [formData]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Seo
        title="FIRE Calculator – Financial Independence & Retire Early Planning"
        description="Plan your financial independence with our FIRE Calculator. Estimate wealth, FIRE number, and retirement timeline with inflation-adjusted projections."
        path="/fire-calculator"
        keywords="FIRE calculator, financial independence, retire early, wealth planning, retirement calculator"
        jsonLd={calculatorSchema({
          name: "FIRE Calculator",
          description: "Plan your financial independence with our FIRE Calculator. Estimate wealth, FIRE number, and retirement timeline with inflation-adjusted projections.",
          path: "/fire-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Independence Planner
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              FIRE Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Discover how long it may take to achieve Financial Independence
              and Retire Early using wealth projections and inflation-adjusted
              planning.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid xl:grid-cols-[400px_1fr] gap-8">
            {/* Left Sidebar – Inputs */}
            <div className="xl:sticky xl:top-28 h-fit">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  Your Financial Details
                </h2>

                <div className="space-y-6">
                  {[
                    { label: "Current Age", name: "currentAge", min: 18, max: 80 },
                    { label: "Retirement Age", name: "retirementAge", min: 20, max: 80 },
                    { label: `Monthly Expenses (${currency})`, name: "monthlyExpenses", min: 1000, max: 500000 },
                    { label: `Current Savings (${currency})`, name: "currentSavings", min: 0, max: 10000000 },
                    { label: `Monthly Investment (${currency})`, name: "monthlyInvestment", min: 0, max: 500000 },
                    { label: "Expected Return (% p.a.)", name: "expectedReturn", min: 0, max: 30 },
                    { label: "Inflation Rate (% p.a.)", name: "inflationRate", min: 0, max: 15 },
                  ].map((field) => (
                    <div key={field.name}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-600">
                          {field.label}
                        </label>
                        <span className="text-sm font-semibold text-emerald-700">
                          {field.name.includes("Age")
                            ? formData[field.name]
                            : field.name.includes("Rate") || field.name.includes("Inflation")
                            ? `${formData[field.name]}%`
                            : `${currency}${formatCurrency(formData[field.name])}`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.name.includes("Age") ? 1 : field.name.includes("Rate") ? 0.5 : 1000}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                      />
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.name.includes("Age") ? 1 : field.name.includes("Rate") ? 0.5 : 1000}
                        value={formData[field.name]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.name]: Number(e.target.value) || field.min,
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                  <p className="text-sm text-slate-500 mb-1">Estimated Wealth</p>
                  <h3 className="text-2xl font-bold text-emerald-700">
                    {currency}{formatCurrency(results.totalWealth)}
                  </h3>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                  <p className="text-sm text-slate-500 mb-1">FIRE Number</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {currency}{formatCurrency(results.fireNumber)}
                  </h3>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                  <p className="text-sm text-slate-500 mb-1">Freedom Score</p>
                  <h3 className="text-3xl font-bold text-emerald-600">
                    {results.freedomScore}%
                  </h3>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Wealth Projection</h2>
                  <p className="text-sm text-slate-500">
                    Projected wealth growth over time based on your inputs.
                  </p>
                </div>
                <div className="w-full min-h-[300px] h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="age" stroke="#94a3b8" />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={(value) =>
  `${currency}${(value / 1000000).toFixed(1)}M`
}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `${currency}${new Intl.NumberFormat("en-US").format(value)}`
                        }
                        labelFormatter={(label) => `Age: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="wealth"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Financial Insights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-emerald-700 mb-2">Retirement Timeline</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Based on your current strategy, you could potentially achieve
                      financial freedom in{" "}
                      <span className="font-bold text-slate-800">{results.years} years</span>.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-emerald-700 mb-2">Inflation Impact</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Future monthly expenses after inflation may be approximately{" "}
                      <span className="font-bold text-slate-800">
                        {currency}{formatCurrency(results.futureExpenses)}
                      </span>.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-emerald-700 mb-2">Wealth Optimization</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Increasing your monthly investments by even 10–15% can significantly
                      accelerate your path to independence.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-emerald-700 mb-2">FIRE Readiness</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Your current trajectory gives a{" "}
                      <span className="font-bold text-slate-800">{results.freedomScore}%</span>{" "}
                      freedom score, indicating the progress toward your FIRE goal.
                    </p>
                  </div>
                </div>
              </div>

              <AdSlot slotId="fire_calc_mid" className="mt-6" />

              {/* Disclaimer */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                <p className="text-xs text-slate-400 space-y-1">
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  These projections are for illustrative purposes only and do not
                  guarantee actual returns. Market returns are subject to volatility
                  and past performance does not indicate future results. Please
                  consult a certified financial advisor for personalised advice.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  The FIRE number assumes the 4% withdrawal rule and is based on
                  inflation-adjusted expenses. Actual retirement needs may vary.
                </p>
              </div>

              {/* SEO Content */}
              <div className="mt-10 space-y-10">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    What Is a FIRE Calculator?
                  </h2>
                  <p className="text-slate-500 leading-relaxed">
                    FIRE stands for Financial Independence, Retire Early — a
                    movement centered on saving and investing aggressively enough
                    to cover your living expenses from investment returns alone,
                    independent of a traditional retirement age. This calculator
                    projects your investment growth against your target "FIRE
                    number" and shows a freedom score: how close your current
                    savings trajectory gets you to that number by your chosen age.
                  </p>
                  <p className="text-slate-500 leading-relaxed mt-4">
                    FIRE isn't only about retiring at 35 — for most people it's
                    really about optionality: reaching a savings rate and net
                    worth where working becomes a choice rather than a necessity,
                    whether or not you actually stop working at that point.
                  </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    How Is Your FIRE Number Calculated?
                  </h2>
                  <p className="text-slate-500 leading-relaxed">
                    Your FIRE number is based on the widely-used 4% rule — the idea
                    that withdrawing 4% of a well-diversified portfolio annually
                    has historically had a high probability of lasting 30+ years:
                  </p>
                  <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                    FIRE Number = Annual Expenses × 25
                  </p>
                  <p className="text-slate-500 leading-relaxed mt-4">
                    Multiplying by 25 is mathematically the same as dividing by 4%
                    — it's the portfolio size at which a 4% withdrawal covers a
                    full year of expenses. This calculator first inflates your
                    current monthly expenses forward to your target retirement age,
                    then multiplies the annualized result by 25 to get your FIRE
                    number, and separately projects your actual investment growth
                    (current savings plus ongoing monthly investments, compounded
                    at your expected return) to calculate your freedom score —
                    what percentage of that FIRE number your current plan reaches.
                  </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Key FIRE Concepts
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                        The 4% Rule
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        Based on historical U.S. market data (the "Trinity Study"),
                        a 4% initial withdrawal rate, adjusted for inflation each
                        year, has historically survived most 30-year periods —
                        though it's a guideline, not a guarantee, especially for
                        retirements longer than 30 years.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                        Savings Rate Over Income
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        Time to FIRE depends far more on what percentage of income
                        you save than on how much you earn — a high earner who
                        spends most of it reaches FIRE later than a moderate earner
                        saving 40-50% of income.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                        Lean, Fat, and Coast FIRE
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        Variants exist for different lifestyles: Lean FIRE targets
                        a minimal expense base, Fat FIRE targets a more comfortable
                        one, and Coast FIRE means you've saved enough that
                        compounding alone will reach your number without further
                        contributions — even if you keep working.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                        Sequence of Returns Risk
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        Retiring right before a market downturn is far riskier than
                        retiring right before an upturn, even with an identical
                        average return over time — a real risk this calculator's
                        straight-line projection doesn't capture.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        Is the 4% rule still valid today?
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        It remains a widely used starting point, though some
                        planners now suggest a more conservative 3.25-3.5% for
                        very long retirements (40+ years) given today's valuations
                        and lower expected bond returns compared to when the
                        original research was done.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        Does this account for taxes on withdrawals?
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        No — this is a pre-tax projection. Depending on which
                        account types your investments sit in, actual withdrawals
                        may be taxed, meaning your real-world FIRE number could
                        need to be somewhat higher than shown here.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        What if my freedom score is below 100%?
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        You have three levers: increase your monthly investment,
                        push back your target retirement age, or reduce your
                        target annual expenses (which also lowers your FIRE
                        number, since it's 25× annual expenses).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}