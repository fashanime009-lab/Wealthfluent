import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function WealthDashboardPage() {
  const [income, setIncome] = useState(50000);
  const [savings, setSavings] = useState(10000);
  const [investments, setInvestments] = useState(250000);
  const [age, setAge] = useState(25);
  const [showUpgrade, setShowUpgrade] = useState(false);
const [showSimulation, setShowSimulation] = useState(false);

const [extraInvestment, setExtraInvestment] = useState(5000);

  const savingsRate = Math.round((savings / income) * 100);

  const wealthScore = Math.min(
    100,
    Math.round(
      savingsRate * 0.6 +
      investments / 10000 +
      (35 - age)
    )
  );

  const futureWealth = Math.round(
    investments *
      Math.pow(1.12, 60 - age) +
      savings * 12 * (60 - age)
  );

  const fireProgress = Math.min(
    100,
    Math.round((futureWealth / 50000000) * 100)
  );

const emergencyFundMonths = Math.round(
  investments / (income * 0.7)
);

const financialDNA =
  savingsRate >= 40
    ? "FIRE Chaser"
    : savingsRate >= 30
    ? "Aggressive Investor"
    : savingsRate >= 20
    ? "Growth Builder"
    : "Budget Explorer";

const aiInsight =
  savingsRate >= 35
    ? "Your current savings behavior places you ahead of most long-term investors."
    : savingsRate >= 20
    ? "Your wealth growth potential is improving steadily with disciplined saving."
    : "Increasing your savings ratio can dramatically accelerate long-term wealth growth.";

const nextAction =
  savingsRate >= 35
    ? "Consider diversifying into long-term equity and passive income assets."
    : "Increasing your monthly investments by even 10% could significantly improve future wealth.";

const milestone1 = Math.round(futureWealth * 0.2);
const milestone2 = Math.round(futureWealth * 0.45);
const milestone3 = Math.round(futureWealth * 0.75);

const streakDays = Math.min(
  365,
  Math.round(savingsRate * 4 + age)
);

const level =
  wealthScore >= 90
    ? "Financial Titan"
    : wealthScore >= 75
    ? "Wealth Architect"
    : wealthScore >= 60
    ? "Growth Investor"
    : wealthScore >= 40
    ? "Smart Saver"
    : wealthScore >= 20
    ? "Budget Apprentice"
    : "Debt Survivor";

  return (
    <>
      <Helmet>
        <title>
          Wealth Dashboard – WealthFluent
        </title>

        <meta
          name="description"
          content="Track your wealth growth, savings progress, FIRE goals, and financial health using WealthFluent dashboard."
        />
      </Helmet>

      <div className="min-h-screen bg-[#050b16] text-white overflow-hidden relative">

        {/* Glow */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[160px] rounded-full" />

        <div className="absolute bottom-[-300px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full" />

        <div className="relative z-10">

          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

              <Link to="/">
                <h1 className="text-3xl font-black">
                  Wealth<span className="text-cyan-400">Fluent</span>
                </h1>
              </Link>

              <div className="flex items-center gap-6">
                <Link
                  to="/calculators"
                  className="text-slate-300 hover:text-white transition"
                >
                  Calculators
                </Link>

                <Link
                  to="/blog"
                  className="text-slate-300 hover:text-white transition"
                >
                  Articles
                </Link>

                <Link
                  to="/"
                  className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-bold"
                >
                  Home
                </Link>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="max-w-7xl mx-auto px-6 py-24">

            <div className="text-center mb-20">
              <p className="text-cyan-400 font-semibold mb-6">
                AI-POWERED FINANCIAL EVOLUTION
              </p>

              <h1 className="text-7xl md:text-8xl font-black leading-[0.95] tracking-[-4px] mb-8">
                Track Your
                <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Wealth Journey
                </span>
              </h1>

              <p className="text-slate-300 text-2xl max-w-3xl mx-auto leading-relaxed">
                Analyze your financial growth, savings behavior,
                investment progress, and future wealth potential.
              </p>
            </div>

            {/* Dashboard */}
            <div className="grid lg:grid-cols-[420px_1fr] gap-10">

              {/* Controls */}
              <div className="bg-white/[0.04] border border-white/10 rounded-[40px] p-8 backdrop-blur-2xl">

                <h2 className="text-4xl font-black mb-10">
                  Financial Inputs
                </h2>

                <div className="space-y-10">

                  {/* Income */}
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="font-semibold">
                        Monthly Income
                      </label>

                      <span className="text-cyan-400 text-2xl font-black">
                        ₹{income.toLocaleString()}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={income}
                      onChange={(e) =>
                        setIncome(Number(e.target.value))
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Savings */}
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="font-semibold">
                        Monthly Savings
                      </label>

                      <span className="text-cyan-400 text-2xl font-black">
                        ₹{savings.toLocaleString()}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1000"
                      max="200000"
                      step="1000"
                      value={savings}
                      onChange={(e) =>
                        setSavings(Number(e.target.value))
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Investments */}
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="font-semibold">
                        Current Investments
                      </label>

                      <span className="text-cyan-400 text-2xl font-black">
                        ₹{investments.toLocaleString()}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="50000"
                      value={investments}
                      onChange={(e) =>
                        setInvestments(Number(e.target.value))
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="font-semibold">
                        Age
                      </label>

                      <span className="text-cyan-400 text-2xl font-black">
                        {age}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="18"
                      max="60"
                      step="1"
                      value={age}
                      onChange={(e) =>
                        setAge(Number(e.target.value))
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">

                {/* Score */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-10">

                  <p className="text-cyan-400 font-semibold mb-4">
                    WEALTH SCORE
                  </p>

                  <div className="flex items-end gap-4 mb-6">
                    <h2 className="text-8xl font-black">
                      {wealthScore}
                    </h2>

                    <span className="text-3xl text-slate-400 mb-3">
                      /100
                    </span>
                  </div>

                  <div className="w-full h-5 rounded-full bg-white/10 overflow-hidden mb-8">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                      style={{ width: `${wealthScore}%` }}
                    />
                  </div>

                  <div className="inline-flex bg-cyan-500/10 border border-cyan-400/20 px-5 py-3 rounded-2xl text-cyan-300 font-bold">
                    {level}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-2 gap-8">

                  <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8">
                    <p className="text-slate-400 mb-4">
                      Savings Ratio
                    </p>

                    <h3 className="text-6xl font-black text-cyan-400">
                      {savingsRate}%
                    </h3>
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8">
                    <p className="text-slate-400 mb-4">
                      FIRE Progress
                    </p>

                    <h3 className="text-6xl font-black text-emerald-400">
                      {fireProgress}%
                    </h3>
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8 md:col-span-2">
                    <p className="text-slate-400 mb-4">
                      Projected Future Wealth
                    </p>

                    <h3 className="text-7xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      ₹{futureWealth.toLocaleString()}
                    </h3>
                  </div>
                </div>

{/* Wealth DNA */}
<div className="grid lg:grid-cols-2 gap-8">

  {/* DNA */}
  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-10 overflow-hidden relative">

    <div className="absolute top-[-80px] right-[-80px] w-52 h-52 rounded-full bg-cyan-400/10 blur-3xl" />

    <p className="text-cyan-400 font-semibold mb-4">
      FINANCIAL DNA
    </p>

    <h2 className="text-5xl font-black mb-6">
      {financialDNA}
    </h2>

    <p className="text-slate-300 text-lg leading-relaxed">
      Your financial behavior indicates a strong preference
      toward long-term wealth growth and financial evolution.
    </p>

  </div>

  {/* Streak */}
  <div className="bg-white/[0.04] border border-white/10 rounded-[40px] p-10">

    <p className="text-cyan-400 font-semibold mb-4">
      WEALTH STREAK
    </p>

    <div className="flex items-end gap-4 mb-6">
      <h2 className="text-7xl font-black text-cyan-400">
        {streakDays}
      </h2>

      <span className="text-2xl text-slate-400 mb-3">
        Days
      </span>
    </div>

    <p className="text-slate-300 text-lg leading-relaxed">
      Consistent wealth-building habits compound massively over time.
    </p>

  </div>

</div>

{/* AI Insight */}
<div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-10 overflow-hidden relative">

  <div className="absolute top-[-100px] right-[-100px] w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

  <div className="flex items-center gap-5 mb-8">

    <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-4xl">
      🤖
    </div>

    <div>
      <p className="text-cyan-400 font-semibold mb-2">
        WEALTHFLUENT AI
      </p>

      <h2 className="text-5xl font-black">
        Financial Analysis
      </h2>
    </div>

  </div>

  <p className="text-2xl text-slate-200 leading-relaxed">
    {aiInsight}
  </p>

</div>

{/* Wealth Timeline */}
<div className="bg-white/[0.04] border border-white/10 rounded-[40px] p-10">

  <div className="flex items-center justify-between mb-12 flex-wrap gap-5">

    <div>
      <p className="text-cyan-400 font-semibold mb-3">
        FUTURE WEALTH TIMELINE
      </p>

      <h2 className="text-5xl font-black">
        Financial Milestones
      </h2>
    </div>

    <div className="bg-cyan-500/10 border border-cyan-400/20 px-5 py-3 rounded-2xl text-cyan-300 font-bold">
      AI Projection
    </div>

  </div>

  <div className="space-y-10">

    {/* Timeline Item */}
    <div className="flex gap-6">

      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-cyan-400" />
        <div className="w-1 flex-1 bg-cyan-400/20 mt-3" />
      </div>

      <div className="pb-10">
        <p className="text-cyan-400 font-bold mb-2">
          Age {age + 5}
        </p>

        <h3 className="text-4xl font-black mb-4">
          ₹{milestone1.toLocaleString()}
        </h3>

        <p className="text-slate-400 text-lg">
          Potential early wealth acceleration phase.
        </p>
      </div>

    </div>

    {/* Timeline Item */}
    <div className="flex gap-6">

      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-cyan-400" />
        <div className="w-1 flex-1 bg-cyan-400/20 mt-3" />
      </div>

      <div className="pb-10">
        <p className="text-cyan-400 font-bold mb-2">
          Age {age + 10}
        </p>

        <h3 className="text-4xl font-black mb-4">
          ₹{milestone2.toLocaleString()}
        </h3>

        <p className="text-slate-400 text-lg">
          Strong compounding growth period projection.
        </p>
      </div>

    </div>

    {/* Timeline Item */}
    <div className="flex gap-6">

      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-emerald-400" />
      </div>

      <div>
        <p className="text-emerald-400 font-bold mb-2">
          Age {age + 20}
        </p>

        <h3 className="text-5xl font-black mb-4 text-emerald-400">
          ₹{milestone3.toLocaleString()}
        </h3>

        <p className="text-slate-400 text-lg">
          Potential financial independence milestone.
        </p>
      </div>

    </div>

  </div>

</div>

{/* Next Action */}
<div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/10 rounded-[40px] p-10">

  <p className="text-emerald-400 font-semibold mb-4">
    BEST NEXT MOVE
  </p>

  <h2 className="text-5xl font-black mb-8">
    AI Wealth Recommendation
  </h2>

  <p className="text-2xl text-slate-200 leading-relaxed mb-10">
    {nextAction}
  </p>

  <div className="flex flex-wrap gap-4">

    <button
  onClick={() => setShowUpgrade(true)}
  className="bg-emerald-400 hover:bg-emerald-300 transition px-6 py-4 rounded-2xl text-black font-black"
>
  Improve Wealth Score
</button>

    <button
  onClick={() => setShowSimulation(true)}
  className="border border-white/10 bg-white/5 hover:border-cyan-400/20 transition px-6 py-4 rounded-2xl font-semibold"
>
  Simulate Future Growth
</button>

  </div>

</div>

                {/* Suggestions */}
                <div className="bg-white/[0.04] border border-white/10 rounded-[40px] p-10">

                  <h2 className="text-4xl font-black mb-10">
                    Smart Wealth Suggestions
                  </h2>

                  <div className="space-y-6">

                    <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
                      Increase monthly SIP contributions gradually every year.
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
                      Maintain emergency savings for 6 months of expenses.
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
                      Diversify investments for long-term wealth stability.
                    </div>

                  </div>
                </div>

              </div>
            </div>
            {/* Improve Wealth Score Modal */}
{showUpgrade && (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6">

    <div className="w-full max-w-3xl bg-[#07111f] border border-cyan-400/10 rounded-[40px] p-10 relative overflow-hidden">

      <div className="absolute top-[-120px] right-[-120px] w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <button
        onClick={() => setShowUpgrade(false)}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition"
      >
        ✕
      </button>

      <p className="text-cyan-400 font-semibold mb-4">
        AI WEALTH OPTIMIZATION
      </p>

      <h2 className="text-5xl font-black mb-10">
        Improve Your Wealth Score
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-10">

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 min-h-[220px] flex flex-col justify-between">
          <p className="text-slate-400 mb-3">
            Current Wealth Score
          </p>

          <h3 className="text-7xl font-black text-cyan-400">
            {wealthScore}
          </h3>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/10 rounded-3xl p-8">
          <p className="text-slate-400 mb-3">
            Optimized Projection
          </p>

          <h3 className="text-7xl font-black text-emerald-400">
            {Math.min(100, wealthScore + 14)}
          </h3>
        </div>

      </div>

      <div className="space-y-6">

        <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
          Increase monthly investments by ₹{extraInvestment.toLocaleString()}
        </div>

        <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
          Maintain emergency savings for at least 12 months
        </div>

        <div className="bg-cyan-500/10 border border-cyan-400/10 rounded-3xl p-6">
          Improve savings consistency and reduce unnecessary expenses
        </div>

      </div>

    </div>

  </div>
)}

{/* Future Simulation Modal */}
{showSimulation && (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6">

    <div className="w-full max-w-4xl bg-[#07111f] border border-cyan-400/10 rounded-[40px] p-10 relative overflow-hidden">

      <div className="absolute bottom-[-120px] left-[-120px] w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <button
        onClick={() => setShowSimulation(false)}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition"
      >
        ✕
      </button>

      <p className="text-cyan-400 font-semibold mb-4">
        FUTURE WEALTH ENGINE
      </p>

      <h2 className="text-5xl font-black mb-10">
        Simulate Future Growth
      </h2>

      <div className="mb-12">

        <div className="flex justify-between mb-4">
          <p className="font-semibold">
            Additional Monthly Investment
          </p>

          <span className="text-cyan-400 text-3xl font-black">
            ₹{extraInvestment.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={extraInvestment}
          onChange={(e) =>
            setExtraInvestment(Number(e.target.value))
          }
          className="w-full accent-cyan-400"
        />

      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 min-h-[220px] flex flex-col justify-between">
          <p className="text-slate-400 mb-4">
            New Wealth Projection
          </p>

          <h3 className="text-3xl md:text-5xl font-black text-cyan-400 break-words leading-tight">
            ₹{(
  (
    futureWealth +
    extraInvestment * 12 * (60 - age)
  ) / 10000000
).toFixed(2)}Cr
          </h3>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 min-h-[220px] flex flex-col justify-between">
          <p className="text-slate-400 mb-4">
            FIRE Improvement
          </p>

          <h3 className="text-5xl font-black text-emerald-400">
            +{Math.round(extraInvestment / 1000)}%
          </h3>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-3xl p-8">
          <p className="text-slate-400 mb-4">
            Estimated Time Saved
          </p>

          <h3 className="text-5xl font-black text-cyan-300">
            {Math.max(1, Math.round(extraInvestment / 5000))} yrs
          </h3>
        </div>

      </div>

    </div>

  </div>
)}
          </section>
        </div>
      </div>
    </>
  );
}