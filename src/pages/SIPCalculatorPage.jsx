import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useFinance } from "../context/FinanceContext";
import { useEffect } from "react";

export default function SIPCalculatorPage() {
  const { setSipData } = useFinance();
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(20);
  const [showInvestModal, setShowInvestModal] = useState(false);

  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  const investedAmount = monthlyInvestment * months;

  const futureValue =
  annualReturn === 0
    ? investedAmount
    : Math.round(
        monthlyInvestment *
          (
            (
              Math.pow(1 + monthlyRate, months) - 1
            ) /
            monthlyRate
          ) *
          (1 + monthlyRate)
      );

  const estimatedReturns = futureValue - investedAmount;
useEffect(() => {
  setSipData({
    monthlyInvestment,
    annualReturn,
    years,
    futureValue,
  });
}, [
  monthlyInvestment,
  annualReturn,
  years,
  futureValue,
  setSipData,
]);
  return (
    <>
  <Helmet>
    <title>
      SIP Calculator India – Calculate Mutual Fund Returns
    </title>

    <meta
      name="description"
      content="Free SIP Calculator to estimate mutual fund investment returns with monthly SIP amount, expected returns, and investment duration."
    />

    <meta
      name="keywords"
      content="SIP calculator, mutual fund calculator, investment calculator, SIP return calculator"
    />
  </Helmet>
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Navbar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#07111f]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-black tracking-tight">
              Wealth<span className="text-cyan-400">Fluent</span>
            </h1>
          </Link>

          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back To Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-cyan-400 font-semibold mb-3">
            FINANCE CALCULATOR
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            SIP Calculator
          </h1>

          <p className="text-slate-400 text-lg mt-6 max-w-3xl leading-relaxed">
            Calculate your future mutual fund SIP returns with monthly
            investments, expected annual returns, and investment duration.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Inputs */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-black mb-10">
              Investment Details
            </h2>

            <div className="space-y-10">
              {/* SIP */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold">
                    Monthly Investment
                  </label>

                  <span className="text-cyan-400 font-black text-2xl">
                    ₹{monthlyInvestment.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
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

                  <span className="text-cyan-400 font-black text-2xl">
                    {annualReturn}%
                  </span>
                </div>

                <input
  type="range"
  min="-15"
  max="30"
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

                  <span className="text-cyan-400 font-black text-2xl">
                    {years} Years
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Right Results */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-slate-400 mb-2">
                  Estimated Future Value
                </p>

                <h2 className="text-5xl md:text-6xl font-black text-cyan-400">
                  ₹{futureValue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-2xl font-semibold">
                {years} Years
              </div>
            </div>

            <div className="space-y-8">
              {/* Invested */}
              <div className="bg-[#0d1a2b] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400">
                    Total Invested Amount
                  </p>

                  <h3 className="text-2xl font-black">
                    ₹{investedAmount.toLocaleString()}
                  </h3>
                </div>

                <div className="h-4 rounded-full bg-[#112038] overflow-hidden">
                  <div className="h-full w-[45%] bg-cyan-500 rounded-full" />
                </div>
              </div>

              {/* Returns */}
              <div className="bg-[#0d1a2b] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400">
                    Estimated Returns
                  </p>

                  <h3
  className={`text-2xl font-black ${
    estimatedReturns >= 0
      ? "text-emerald-400"
      : "text-red-400"
  }`}
>
  {estimatedReturns >= 0 ? "+" : "-"}₹
  {Math.abs(estimatedReturns).toLocaleString()}
</h3>
                </div>

                <div className="h-4 rounded-full bg-[#112038] overflow-hidden">
                  <div
  className={`h-full rounded-full ${
    estimatedReturns >= 0
      ? "bg-emerald-400"
      : "bg-red-400"
  }`}
  style={{
    width: `${Math.min(
      Math.abs(
        (estimatedReturns / investedAmount) * 100
      ),
      100
    )}%`,
  }}
/>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
  onClick={() => setShowInvestModal(true)}
  className="w-full bg-cyan-500 hover:bg-cyan-400 transition py-4 rounded-2xl text-black font-black text-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02]"
>
  Start Investing Smarter
</button>
            </div>
          </div>
        </div>

 {/* SEO Content */}
<div className="mt-24 space-y-10">
  {/* What is SIP */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-6">
      What Is SIP Calculator?
    </h2>

    <p className="text-slate-400 text-lg leading-relaxed">
      A SIP Calculator helps investors estimate future wealth creation
      through Systematic Investment Plans (SIP) using monthly investments,
      expected annual returns, and investment duration.
    </p>
  </div>

  {/* Benefits */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-8">
      Benefits Of SIP Investments
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Rupee Cost Averaging
        </h3>

        <p className="text-slate-400 leading-relaxed">
          SIP investments reduce market timing risks by investing
          consistently over time.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Long-Term Wealth Growth
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Compounding can significantly increase investment value
          over long investment periods.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Flexible Investing
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Investors can start SIPs with small monthly amounts
          based on financial goals.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Disciplined Saving
        </h3>

        <p className="text-slate-400 leading-relaxed">
          SIPs encourage consistent long-term investing habits.
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
          What is a good SIP amount?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          A good SIP amount depends on income, financial goals,
          and investment horizon.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Is SIP better than FD?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          SIPs offer market-linked growth potential, while fixed
          deposits provide stable fixed returns.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Can SIP create long-term wealth?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Long-term SIP investing combined with compounding
          can significantly grow wealth over time.
        </p>
      </div>
    </div>
  </div>
</div>
{/* Investment Modal */}
{showInvestModal && (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
    
    <div className="w-full max-w-2xl bg-[#0b1628] border border-cyan-500/20 rounded-[36px] p-8 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Close */}
      <button
        onClick={() => setShowInvestModal(false)}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-2xl hover:bg-white/10 transition"
      >
        ×
      </button>

      <div className="relative z-10">
        <p className="text-cyan-400 font-bold uppercase tracking-wider mb-4">
          Smart Wealth Plan
        </p>

        <h2 className="text-5xl font-black leading-tight mb-6">
          Your SIP Could Grow To
        </h2>

        <h3 className="text-3xl md:text-6xl font-black text-cyan-400 mb-8 break-words">
          ₹{futureValue.toLocaleString()}
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 min-h-[170px] flex flex-col justify-between">
            <p className="text-slate-400">
              Monthly SIP
            </p>

            <h4 className="text-3xl font-black text-cyan-300">
              ₹{monthlyInvestment.toLocaleString()}
            </h4>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 min-h-[170px] flex flex-col justify-between">
            <p className="text-slate-400">
              Expected Return
            </p>

            <h4 className="text-3xl font-black text-emerald-400">
              {annualReturn}%
            </h4>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 min-h-[170px] flex flex-col justify-between">
            <p className="text-slate-400">
              Investment Time
            </p>

            <h4 className="text-3xl font-black text-purple-400">
              {years} Years
            </h4>
          </div>

        </div>

        {/* Suggestion */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-3xl p-6 mb-8">
          
          <h4 className="text-2xl font-black mb-4">
            AI Wealth Insight
          </h4>

          <p className="text-slate-300 leading-relaxed text-lg">
            If you increase your SIP by just ₹2,000 every year,
            your long-term wealth potential could increase dramatically
            through compound growth.
          </p>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4">

          <a
  href="https://groww.in/mutual-funds"
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 bg-cyan-500 hover:bg-cyan-400 transition py-4 rounded-2xl text-black font-black text-lg text-center hover:scale-[1.02]"
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
  className="flex-1 border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition py-4 rounded-2xl font-bold text-lg"
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