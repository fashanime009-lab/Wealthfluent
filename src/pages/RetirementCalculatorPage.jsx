import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";

export default function RetirementCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(25);
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  const futureValue = Math.round(
    monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate))
  );

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = futureValue - investedAmount;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Seo
        title="Retirement Calculator – Retirement Planning Tool"
        description="Free Retirement Calculator to estimate retirement corpus, future savings growth, and long-term investment planning."
        path="/retirement-calculator"
        keywords="retirement calculator, retirement planning, retirement corpus, pension planning"
        jsonLd={calculatorSchema({
          name: "Retirement Calculator",
          description: "Free Retirement Calculator to estimate retirement corpus, future savings growth, and long-term investment planning.",
          path: "/retirement-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Retirement Planning Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Retirement Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Estimate retirement corpus growth and future wealth
              accumulation through long-term investments and compounding.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Retirement Planning
              </h2>

              <div className="space-y-8">
                {/* Monthly Investment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Monthly Investment
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {currency}{formatCurrency(monthlyInvestment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1000000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{currency}500</span>
<span>{currency}1,000,000</span>
                  </div>
                  <input
                    type="number"
                    min="500"
                    max="1000000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value) || 500)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Expected Return */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Expected Annual Return (%)
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {annualReturn}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-15%</span>
                    <span>30%</span>
                  </div>
                  <input
                    type="number"
                    min="-15"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) =>
                      setAnnualReturn(Number(e.target.value) || 0)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Investment Duration (Years)
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {years} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>50 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={years}
                    onChange={(e) =>
                      setYears(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-slate-500">Estimated Retirement Corpus</p>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mt-1">
                  {currency}{formatCurrency(futureValue)}
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Total Investment */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Investment</span>
                    <span className="text-lg font-semibold text-slate-800">
                      {currency}{formatCurrency(investedAmount)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.min((investedAmount / futureValue) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Estimated Returns */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Estimated Returns</span>
                    <span
                      className={`text-lg font-semibold ${
                        estimatedReturns >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {estimatedReturns >= 0 ? "+" : "-"}
{currency}
{formatCurrency(Math.abs(estimatedReturns))}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        estimatedReturns >= 0 ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.abs((estimatedReturns / investedAmount) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  window.open("https://www.investopedia.com/retirement-planning-4689695", "_blank");
                }}
                className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 transition text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300/50 text-lg"
              >
                Plan Your Retirement
              </button>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only
                  and do not represent actual returns.
                </p>
                <p>
                  Stock Market does not have a fixed rate of return and it is
                  not possible to predict the rate of return.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="retirement_calc_mid" />
            {/* What is Retirement Planning */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is Retirement Planning?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Retirement planning helps individuals estimate future
                financial needs and build long-term investment strategies
                for financial independence after retirement. It involves
                calculating the required corpus based on current savings,
                expected returns, and inflation.
              </p>
            </div>

            {/* How Retirement Corpus Is Calculated */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                How Is Your Retirement Corpus Calculated?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                This calculator projects a monthly SIP forward using the future
                value of a growing annuity:
              </p>
              <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                FV = SIP × [((1 + r)^n − 1) / r] × (1 + r)
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                Here <strong>SIP</strong> is your monthly investment, <strong>r</strong> is
                the monthly expected return, and <strong>n</strong> is the total number
                of months until retirement. A ₹15,000 monthly SIP at 12% annual
                return over 25 years grows to a corpus well beyond ₹2 crore —
                most of which comes from compounding on earlier contributions,
                not the contributions themselves, which is why starting a decade
                earlier matters more than investing a larger amount later.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of Retirement Planning
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Financial Independence
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Retirement planning helps create sustainable
                    long-term financial security and stability.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Wealth Growth
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Long-term compounding can significantly increase
                    retirement savings over time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Inflation Protection
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Planning ensures your retirement corpus accounts
                    for rising cost of living and inflation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Peace of Mind
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A well-structured plan reduces financial stress
                    and provides clarity for the future.
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
                    When should I start retirement planning?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Starting early allows investments more time to grow
                    through the power of compounding. The earlier you start,
                    the smaller the monthly investments needed.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    How much retirement corpus is enough?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Retirement corpus depends on lifestyle goals,
                    inflation, expenses, and expected retirement age.
                    A common rule is to have 20-30 times your annual expenses.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    What is the 4% rule in retirement?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    The 4% rule suggests withdrawing 4% of your retirement
                    corpus annually to ensure funds last for 30 years.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Does this calculator account for inflation?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    No — the projected corpus is in nominal (today's rupee)
                    terms. Use the Inflation Calculator alongside this one to see
                    what that corpus is actually worth in real purchasing power by
                    the time you retire.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Should my SIP amount stay fixed until retirement?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Not necessarily — a step-up SIP that increases with your
                    income each year typically reaches a larger corpus than a
                    flat SIP of the same starting amount, since later increases
                    still get years of compounding before retirement.
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