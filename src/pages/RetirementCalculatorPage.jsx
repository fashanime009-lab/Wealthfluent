import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function RetirementCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(25);

  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  const futureValue = Math.round(
    monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate))
  );

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = futureValue - investedAmount;

  return (
    <>
      <Helmet>
        <title>
          Retirement Calculator India – Retirement Planning Tool
        </title>

        <meta
          name="description"
          content="Free Retirement Calculator to estimate retirement corpus, future savings growth, and long-term investment planning."
        />
      </Helmet>

      <div className="min-h-screen bg-[#07111f] text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-black">
                Wealth<span className="text-cyan-400">Fluent</span>
              </h1>
            </Link>

            <Link
              to="/"
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← Back To Home
            </Link>
          </div>
        </header>

        {/* Main */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-14">
            <p className="text-cyan-400 font-semibold mb-3">
              RETIREMENT PLANNING TOOL
            </p>

            <h1 className="text-6xl font-black">
              Retirement Calculator
            </h1>

            <p className="text-slate-400 text-lg mt-6 max-w-3xl">
              Estimate retirement corpus growth and future wealth
              accumulation through long-term investments and compounding.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-black mb-10">
                Retirement Planning
              </h2>

              <div className="space-y-10">
                {/* Monthly Investment */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Monthly Investment
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      ₹{monthlyInvestment.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Return */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Expected Annual Return
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      {annualReturn}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={annualReturn}
                    onChange={(e) =>
                      setAnnualReturn(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Years */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Investment Duration
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      {years} Years
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={years}
                    onChange={(e) =>
                      setYears(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[32px] p-8">
              <div className="space-y-8">
                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Estimated Retirement Corpus
                  </p>

                  <h2 className="text-5xl font-black text-cyan-400">
                    ₹{futureValue.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Total Investment
                  </p>

                  <h2 className="text-4xl font-black">
                    ₹{investedAmount.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Estimated Returns
                  </p>

                  <h2 className="text-4xl font-black text-emerald-400">
                    ₹{estimatedReturns.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-24 space-y-10">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-6">
                What Is Retirement Planning?
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Retirement planning helps individuals estimate future
                financial needs and build long-term investment strategies
                for financial independence after retirement.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-8">
                Benefits Of Retirement Planning
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Financial Independence
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Retirement planning helps create sustainable
                    long-term financial security and stability.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Wealth Growth
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Long-term compounding can significantly increase
                    retirement savings over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    When should I start retirement planning?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Starting early allows investments more time to grow
                    through the power of compounding.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    How much retirement corpus is enough?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Retirement corpus depends on lifestyle goals,
                    inflation, expenses, and expected retirement age.
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