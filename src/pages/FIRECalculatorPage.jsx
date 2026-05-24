import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

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

    const years =
      formData.retirementAge - formData.currentAge;

    const monthlyRate =
      formData.expectedReturn / 100 / 12;

    const totalMonths = years * 12;

    const futureInvestments =
      formData.monthlyInvestment *
      (
        (
          Math.pow(1 + monthlyRate, totalMonths) - 1
        ) / monthlyRate
      ) *
      (1 + monthlyRate);

    const futureSavings =
      formData.currentSavings *
      Math.pow(
        1 + formData.expectedReturn / 100,
        years
      );

    const totalWealth =
      futureInvestments + futureSavings;

    const futureExpenses =
      formData.monthlyExpenses *
      Math.pow(
        1 + formData.inflationRate / 100,
        years
      );

    const fireNumber =
      futureExpenses * 12 * 25;

    const freedomScore = Math.min(
      100,
      Math.round(
        (totalWealth / fireNumber) * 100
      )
    );

    const chartData = [];

    for (let i = 0; i <= years; i++) {

      const yearlyInvestment =
        formData.currentSavings +
        formData.monthlyInvestment * 12 * i;

      const growth =
        yearlyInvestment *
        Math.pow(
          1 + formData.expectedReturn / 100,
          i
        );

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

  return (

    <div className="min-h-screen bg-[#07111f] text-white overflow-hidden">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">

          <Link to="/">
            <h1 className="text-2xl md:text-3xl font-black">
              Wealth
              <span className="text-cyan-400">
                Fluent
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-3 md:gap-5">

            <Link
              to="/calculators"
              className="text-slate-300 hover:text-white transition text-sm md:text-base"
            >
              Calculators
            </Link>

            <Link
              to="/"
              className="bg-cyan-500 hover:bg-cyan-400 transition px-5 md:px-6 py-3 rounded-2xl text-black font-bold text-sm md:text-base"
            >
              Home
            </Link>

          </div>

        </div>

      </header>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

        <div className="text-center mb-14 md:mb-20">

          <p className="text-cyan-400 font-semibold tracking-[4px] uppercase mb-5 text-sm">
            Financial Freedom Planner
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">

            FIRE Calculator

            <span className="block text-cyan-400">
              Retire Early Smarter
            </span>

          </h1>

          <p className="text-slate-400 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover how long it may take to achieve
            Financial Independence and Retire Early
            using advanced wealth projections and
            inflation-adjusted planning.
          </p>

        </div>

        {/* MAIN GRID */}

        <div className="grid xl:grid-cols-[380px_1fr] gap-8 lg:gap-10">

          {/* LEFT SIDEBAR */}

          <div className="xl:sticky xl:top-28 h-fit">

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl">

              <div className="mb-8">

                <p className="text-cyan-400 text-sm font-semibold tracking-[3px] uppercase mb-3">
                  User Inputs
                </p>

                <h2 className="text-3xl font-black">
                  Financial Details
                </h2>

              </div>

              <div className="space-y-6">

                {[
                  {
                    label: "Current Age",
                    name: "currentAge",
                  },
                  {
                    label: "Retirement Age",
                    name: "retirementAge",
                  },
                  {
                    label: "Monthly Expenses",
                    name: "monthlyExpenses",
                  },
                  {
                    label: "Current Savings",
                    name: "currentSavings",
                  },
                  {
                    label: "Monthly Investment",
                    name: "monthlyInvestment",
                  },
                  {
                    label: "Expected Return %",
                    name: "expectedReturn",
                  },
                  {
                    label: "Inflation Rate %",
                    name: "inflationRate",
                  },
                ].map((field, index) => (

                  <div key={index}>

                    <div className="flex items-center justify-between mb-3">

                      <label className="text-slate-300 font-medium">
                        {field.label}
                      </label>

                      <span className="text-cyan-400 font-bold">
                        {formData[field.name]}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="1"
                      max="100"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full accent-cyan-400"
                    />

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT CONTENT */}

          <div className="space-y-8">

            {/* TOP CARDS */}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

              <div className="rounded-[32px] p-7 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-400/20">

                <p className="text-slate-300 mb-3">
                  Estimated Wealth
                </p>

                <h2 className="text-3xl md:text-4xl font-black break-words">
                  ₹{Math.round(results.totalWealth).toLocaleString()}
                </h2>

              </div>

              <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

                <p className="text-slate-300 mb-3">
                  FIRE Number
                </p>

                <h2 className="text-3xl md:text-4xl font-black break-words">
                  ₹{Math.round(results.fireNumber).toLocaleString()}
                </h2>

              </div>

              <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

                <p className="text-slate-300 mb-3">
                  Freedom Score
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-cyan-400">
                  {results.freedomScore}%
                </h2>

              </div>

            </div>

            {/* CHART */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 md:p-8">

              <div className="mb-10">

                <p className="text-cyan-400 text-sm font-semibold tracking-[3px] uppercase mb-3">
                  Wealth Growth
                </p>

                <h2 className="text-3xl md:text-4xl font-black mb-3">
                  Wealth Projection
                </h2>

                <p className="text-slate-400">
                  Long-term compounding projection based on your investment strategy.
                </p>

              </div>

              <div className="w-full h-[300px] md:h-[420px]">

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart data={results.chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                    />

                    <XAxis
                      dataKey="age"
                      stroke="#94a3b8"
                    />

                    <YAxis
                      stroke="#94a3b8"
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="wealth"
                      stroke="#22d3ee"
                      strokeWidth={4}
                      dot={false}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* INSIGHTS */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10">

              <div className="mb-10">

                <p className="text-cyan-400 text-sm font-semibold tracking-[3px] uppercase mb-3">
                  AI Insights
                </p>

                <h2 className="text-3xl md:text-4xl font-black">
                  Financial Intelligence
                </h2>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">

                  <h3 className="text-cyan-400 text-xl font-bold mb-4">
                    Retirement Timeline
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Based on your current investing strategy,
                    you could potentially achieve financial
                    freedom in{" "}
                    <span className="text-white font-bold">
                      {results.years} years
                    </span>.
                  </p>

                </div>

                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">

                  <h3 className="text-cyan-400 text-xl font-bold mb-4">
                    Inflation Impact
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Future monthly expenses after inflation
                    may become approximately{" "}
                    <span className="text-white font-bold">
                      ₹{Math.round(results.futureExpenses).toLocaleString()}
                    </span>.
                  </p>

                </div>

                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">

                  <h3 className="text-cyan-400 text-xl font-bold mb-4">
                    Wealth Optimization
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Increasing your monthly investments by
                    even 10–15% can significantly accelerate
                    your path toward financial independence.
                  </p>

                </div>

                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">

                  <h3 className="text-cyan-400 text-xl font-bold mb-4">
                    FIRE Readiness
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Your current wealth trajectory generates a{" "}
                    <span className="text-white font-bold">
                      {results.freedomScore}%
                    </span>{" "}
                    financial freedom readiness score.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}