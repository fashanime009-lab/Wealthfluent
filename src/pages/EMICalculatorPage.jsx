import { useState } from "react";
import { Link } from "react-router-dom";

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanYears, setLoanYears] = useState(5);

  const monthlyRate = interestRate / 12 / 100;
  const months = loanYears * 12;

  const emi = Math.round(
    (loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Navbar */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-black">
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
            LOAN CALCULATOR
          </p>

          <h1 className="text-5xl md:text-7xl font-black">
            EMI Calculator
          </h1>

          <p className="text-slate-400 text-lg mt-6 max-w-3xl leading-relaxed">
            Calculate monthly EMI payments for home loans, personal loans,
            car loans, and other financing options instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h2 className="text-3xl font-black mb-10">
              Loan Details
            </h2>

            <div className="space-y-10">
              {/* Loan Amount */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold">
                    Loan Amount
                  </label>

                  <span className="text-cyan-400 text-2xl font-black">
                    ₹{loanAmount.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(Number(e.target.value))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Interest */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold">
                    Interest Rate
                  </label>

                  <span className="text-cyan-400 text-2xl font-black">
                    {interestRate}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Years */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold">
                    Loan Duration
                  </label>

                  <span className="text-cyan-400 text-2xl font-black">
                    {loanYears} Years
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={loanYears}
                  onChange={(e) =>
                    setLoanYears(Number(e.target.value))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[32px] p-8">
            <div className="mb-10">
              <p className="text-slate-400 mb-3">
                Monthly EMI
              </p>

              <h2 className="text-5xl md:text-6xl font-black text-cyan-400">
                ₹{emi.toLocaleString()}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Principal */}
              <div className="bg-[#0d1a2b] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400">
                    Principal Amount
                  </p>

                  <h3 className="text-2xl font-black">
                    ₹{loanAmount.toLocaleString()}
                  </h3>
                </div>

                <div className="h-4 rounded-full bg-[#112038] overflow-hidden">
                  <div className="h-full w-[55%] bg-cyan-500 rounded-full" />
                </div>
              </div>

              {/* Interest */}
              <div className="bg-[#0d1a2b] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400">
                    Total Interest
                  </p>

                  <h3 className="text-2xl font-black text-emerald-400">
                    ₹{Math.round(totalInterest).toLocaleString()}
                  </h3>
                </div>

                <div className="h-4 rounded-full bg-[#112038] overflow-hidden">
                  <div className="h-full w-[70%] bg-emerald-400 rounded-full" />
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#0d1a2b] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400">
                    Total Payment
                  </p>

                  <h3 className="text-2xl font-black">
                    ₹{Math.round(totalPayment).toLocaleString()}
                  </h3>
                </div>

                <div className="h-4 rounded-full bg-[#112038] overflow-hidden">
                  <div className="h-full w-[90%] bg-blue-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* SEO Content */}
<div className="mt-24 space-y-10">
  {/* What is EMI */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-6">
      What Is EMI Calculator?
    </h2>

    <p className="text-slate-400 text-lg leading-relaxed">
      An EMI Calculator helps borrowers estimate monthly loan repayments
      based on loan amount, interest rate, and repayment duration.
      It is commonly used for home loans, personal loans, education loans,
      and vehicle financing.
    </p>
  </div>

  {/* Benefits */}
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
    <h2 className="text-4xl font-black mb-8">
      Benefits Of EMI Calculation
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Better Budget Planning
        </h3>

        <p className="text-slate-400 leading-relaxed">
          EMI calculators help estimate monthly repayment obligations
          before taking a loan.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Loan Comparison
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Borrowers can compare different loan amounts,
          durations, and interest rates easily.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Financial Clarity
        </h3>

        <p className="text-slate-400 leading-relaxed">
          EMI estimation helps avoid unexpected repayment burdens.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Smarter Borrowing
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Users can choose more manageable repayment structures.
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
          How is EMI calculated?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          EMI depends on loan amount, interest rate,
          and repayment duration using standard amortization formulas.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Does longer loan tenure reduce EMI?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Longer tenure generally reduces monthly EMI
          but may increase total interest paid.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3">
          Which loan has lowest EMI?
        </h3>

        <p className="text-slate-400 leading-relaxed">
          Lower EMIs depend on lower interest rates,
          smaller loan amounts, and longer repayment periods.
        </p>
      </div>
    </div>
  </div>
</div>
      </section>
    </div>
  );
}