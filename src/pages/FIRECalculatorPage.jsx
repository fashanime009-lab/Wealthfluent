import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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
  const [currency, setCurrency] = useState("$");
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
      <Helmet>
        <title>FIRE Calculator – Financial Independence & Retire Early Planning</title>
        <meta
          name="description"
          content="Plan your financial independence with our FIRE Calculator. Estimate wealth, FIRE number, and retirement timeline with inflation-adjusted projections."
        />
        <meta
          name="keywords"
          content="FIRE calculator, financial independence, retire early, wealth planning, retirement calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
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
                        <span className="text-sm font-semibold text-blue-600">
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
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <h3 className="text-2xl font-bold text-blue-600">
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
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Retirement Timeline</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Based on your current strategy, you could potentially achieve
                      financial freedom in{" "}
                      <span className="font-bold text-slate-800">{results.years} years</span>.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Inflation Impact</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Future monthly expenses after inflation may be approximately{" "}
                      <span className="font-bold text-slate-800">
                        {currency}{formatCurrency(results.futureExpenses)}
                      </span>.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Wealth Optimization</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Increasing your monthly investments by even 10–15% can significantly
                      accelerate your path to independence.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">FIRE Readiness</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Your current trajectory gives a{" "}
                      <span className="font-bold text-slate-800">{results.freedomScore}%</span>{" "}
                      freedom score, indicating the progress toward your FIRE goal.
                    </p>
                  </div>
                </div>
              </div>

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
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}