import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";
import { useSettings } from "../context/SettingsContext";

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanYears, setLoanYears] = useState(5);

const { settings } = useSettings();

const currency = settings.currency;
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
    <>
      <Seo
        title="Loan EMI Calculator – Calculate Monthly Loan Payments"
        description="Free EMI Calculator to estimate monthly loan repayments for home, personal, car, and education loans with interest rate and tenure options."
        path="/emi-calculator"
        keywords="EMI calculator, loan EMI calculator, home loan EMI, personal loan EMI, car loan EMI"
        jsonLd={calculatorSchema({
          name: "Loan EMI Calculator",
          description: "Free EMI Calculator to estimate monthly loan repayments for home, personal, car, and education loans with interest rate and tenure options.",
          path: "/emi-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
      

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Calculators
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Loan EMI Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate monthly EMI payments for home loans, personal loans,
              car loans, and other financing options instantly.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Loan Details
              </h2>

              <div className="space-y-8">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Loan Amount
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
  {formatCurrency(loanAmount, currency)}
</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}10,000</span>
<span>{currency}10,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) =>
                      setLoanAmount(Number(e.target.value) || 10000)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Interest Rate (p.a.) %
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {interestRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Loan Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Loan Duration (Years)
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {loanYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={loanYears}
                    onChange={(e) =>
                      setLoanYears(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-slate-500">Monthly EMI</p>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mt-1">
                  {formatCurrency(emi, currency)}
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Principal Amount */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Principal Amount</span>
                    <span className="text-lg font-semibold text-slate-800">
  {formatCurrency(loanAmount, currency)}
</span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.min((loanAmount / totalPayment) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Total Interest */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Interest</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      {formatCurrency(totalInterest, currency)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min((totalInterest / totalPayment) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Total Payment */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Payment</span>
                    <span className="text-lg font-semibold text-slate-800">
                     {formatCurrency(totalPayment, currency)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only
                  and do not represent actual loan terms or guaranteed approvals.
                </p>
                <p>
                  Interest rates and loan terms may vary based on lender policies
                  and borrower eligibility.
                </p>
              </div>
            </div>
            
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="emi_calc_mid" />
            {/* What is EMI Calculator */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is a Loan EMI Calculator?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                An EMI Calculator helps borrowers estimate monthly loan repayments
                based on loan amount, interest rate, and repayment duration.
                It is commonly used for home loans, personal loans, education loans,
                and vehicle financing.
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                EMI stands for Equated Monthly Installment — a fixed payment amount
                a borrower makes to a lender at a specified date each month. Every EMI
                is split between two parts: interest (the lender's charge for lending
                the money) and principal (the actual loan amount being repaid). In the
                early years of a loan, a larger share of each EMI goes toward interest;
                as the loan matures, more of it goes toward principal, even though the
                EMI amount itself stays constant throughout the tenure.
              </p>
            </div>

            {/* How EMI Is Calculated */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                How Is EMI Calculated?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                EMI is calculated using the standard reducing-balance formula:
              </p>
              <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                Here, <strong>P</strong> is the principal loan amount, <strong>R</strong> is
                the monthly interest rate (annual rate divided by 12, then by 100), and{" "}
                <strong>N</strong> is the total number of monthly installments (loan
                tenure in years × 12). For example, a ₹5,00,000 loan at 10% annual
                interest over 5 years has R = 0.008333 and N = 60, which works out to
                an EMI of roughly ₹10,624/month — the same figure the calculator above
                produces for those inputs.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of EMI Calculation
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Better Budget Planning
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    EMI calculators help estimate monthly repayment obligations
                    before taking a loan.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Loan Comparison
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Borrowers can compare different loan amounts,
                    durations, and interest rates easily.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Financial Clarity
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    EMI estimation helps avoid unexpected repayment burdens.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Smarter Borrowing
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Users can choose more manageable repayment structures.
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
                    How is EMI calculated?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    EMI depends on loan amount, interest rate,
                    and repayment duration using standard amortization formulas.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Does longer loan tenure reduce EMI?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Longer tenure generally reduces monthly EMI
                    but may increase total interest paid.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Which loan has lowest EMI?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Lower EMIs depend on lower interest rates,
                    smaller loan amounts, and longer repayment periods.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Does prepaying a loan reduce EMI or tenure?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Most lenders let you choose: reduce the tenure while keeping the
                    EMI the same (saves the most total interest), or reduce the EMI
                    while keeping the original tenure. Shortening the tenure is
                    usually the better move if you can afford the current EMI.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Is a fixed or floating interest rate better for EMI?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Fixed rates keep your EMI unchanged for the loan's life but are
                    usually priced higher upfront. Floating rates track a benchmark
                    and can rise or fall, which changes your EMI (or tenure)
                    over time — most long-tenure loans like home loans are floating.
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