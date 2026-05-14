import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CAGRCalculatorPage() {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(50000);
  const [years, setYears] = useState(5);

  const cagr =
    (
      (Math.pow(finalValue / initialValue, 1 / years) - 1) *
      100
    ).toFixed(2);

  return (
    <>
      <Helmet>
        <title>
          CAGR Calculator India – Investment Growth Rate
        </title>

        <meta
          name="description"
          content="Free CAGR Calculator to estimate annualized investment growth rate and long-term investment performance."
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
              INVESTMENT GROWTH TOOL
            </p>

            <h1 className="text-6xl font-black">
              CAGR Calculator
            </h1>

            <p className="text-slate-400 text-lg mt-6 max-w-3xl">
              Calculate Compound Annual Growth Rate (CAGR) for
              investments, stocks, mutual funds, and business growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-black mb-10">
                Investment Details
              </h2>

              <div className="space-y-10">
                {/* Initial */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Initial Investment
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      ₹{initialValue.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={initialValue}
                    onChange={(e) =>
                      setInitialValue(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Final */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Final Value
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      ₹{finalValue.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={finalValue}
                    onChange={(e) =>
                      setFinalValue(Number(e.target.value))
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
                    max="30"
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
              <div className="bg-[#0d1a2b] rounded-3xl p-8 border border-white/10">
                <p className="text-slate-400 mb-4">
                  Compound Annual Growth Rate
                </p>

                <h2 className="text-6xl font-black text-cyan-400">
                  {cagr}%
                </h2>
              </div>

              <div className="grid gap-6 mt-8">
                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-2">
                    Initial Value
                  </p>

                  <h3 className="text-3xl font-black">
                    ₹{initialValue.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-2">
                    Final Value
                  </p>

                  <h3 className="text-3xl font-black text-emerald-400">
                    ₹{finalValue.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-24 space-y-10">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-6">
                What Is CAGR?
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                CAGR (Compound Annual Growth Rate) measures the average
                annual growth rate of an investment over a specific time
                period. It helps investors understand long-term investment
                performance more accurately than simple returns.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-8">
                Benefits Of CAGR Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Compare Investments
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    CAGR helps compare investment performance across
                    stocks, mutual funds, businesses, and assets.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Long-Term Analysis
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Investors can evaluate long-term wealth growth
                    more effectively using annualized returns.
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
                    What is a good CAGR?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    A good CAGR depends on asset type, market conditions,
                    and investment risk levels.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    Why is CAGR important?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    CAGR provides a smoother annual growth rate for
                    evaluating long-term investment performance.
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