import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function FDCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const maturityAmount = Math.round(
    principal * Math.pow(1 + rate / 100, years)
  );

  const interestEarned = maturityAmount - principal;

  return (
    <>
      <Helmet>
        <title>
          FD Calculator India – Fixed Deposit Returns
        </title>

        <meta
          name="description"
          content="Free FD Calculator to estimate fixed deposit maturity amount, interest earned, and investment growth."
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
              FIXED DEPOSIT TOOL
            </p>

            <h1 className="text-6xl font-black">
              FD Calculator
            </h1>

            <p className="text-slate-400 text-lg mt-6 max-w-3xl">
              Estimate fixed deposit maturity value and interest earnings
              with different investment durations and interest rates.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-black mb-10">
                Deposit Details
              </h2>

              <div className="space-y-10">
                {/* Principal */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Deposit Amount
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      ₹{principal.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="5000000"
                    step="1000"
                    value={principal}
                    onChange={(e) =>
                      setPrincipal(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Rate */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Interest Rate
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      {rate}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.1"
                    value={rate}
                    onChange={(e) =>
                      setRate(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Years */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Duration
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      {years} Years
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="20"
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
                    Maturity Amount
                  </p>

                  <h2 className="text-5xl font-black text-cyan-400">
                    ₹{maturityAmount.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Interest Earned
                  </p>

                  <h2 className="text-4xl font-black text-emerald-400">
                    ₹{interestEarned.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Initial Deposit
                  </p>

                  <h2 className="text-4xl font-black">
                    ₹{principal.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* SEO Content */}
<div className="mt-24 space-y-10">
  {/* What is FD */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-6">
      What Is FD Calculator?
    </h2>

    <p className="text-slate-400 text-lg leading-relaxed">
      An FD Calculator helps investors estimate fixed deposit maturity
      value and total interest earnings based on investment amount,
      interest rate, and investment duration. Fixed Deposits are one
      of the most popular low-risk investment options offered by banks
      and financial institutions in India.
    </p>
  </div>

  {/* Benefits */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-8">
      Benefits Of Fixed Deposits
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Safe Investment
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Fixed deposits are considered one of the safest investment
          options with predictable returns and low financial risk.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Guaranteed Returns
        </h3>

        <p className="text-slate-400 leading-relaxed">
          FD returns are fixed at the time of investment and are not
          directly affected by stock market volatility.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Flexible Duration
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Investors can choose short-term or long-term deposit periods
          based on financial goals and liquidity needs.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Better Savings Planning
        </h3>

        <p className="text-slate-400 leading-relaxed">
          FD calculators help estimate future maturity value for
          retirement planning, emergency funds, and wealth preservation.
        </p>
      </div>
    </div>
  </div>

  {/* FAQ */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-8">
      Frequently Asked Questions
    </h2>

    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-3">
          How is FD maturity amount calculated?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          FD maturity amount depends on principal investment,
          interest rate, compounding frequency, and investment duration.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Are fixed deposits risk-free?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Fixed deposits are generally considered low-risk investments,
          especially when offered by regulated banks and institutions.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Which is better: FD or SIP?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          FDs provide stable fixed returns, while SIP investments
          offer potentially higher long-term market-linked growth.
        </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </>
  );
}