import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";
import { useSettings } from "../context/SettingsContext";

const FIELDS = [
  { name: "age", label: "Current Age", min: 18, max: 70, step: 1, isAge: true },
  { name: "monthlyIncome", label: "Monthly Income", min: 5000, max: 1000000, step: 1000 },
  { name: "monthlySavings", label: "Monthly Savings", min: 0, max: 500000, step: 500 },
  { name: "investments", label: "Investments", min: 0, max: 10000000, step: 5000 },
  { name: "debt", label: "Debt", min: 0, max: 10000000, step: 5000 },
  { name: "monthlyExpenses", label: "Monthly Expenses", min: 0, max: 500000, step: 500 },
];

export default function WealthAgeCalculatorPage() {
  const { settings } = useSettings();
  const currency = settings.currency;

  const [formData, setFormData] = useState({
    age: 25,
    monthlyIncome: 50000,
    monthlySavings: 15000,
    investments: 300000,
    debt: 100000,
    monthlyExpenses: 25000,
  });

  const handleChange = (name, rawValue, fallback) => {
    const value = Number(rawValue);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(value) ? fallback : value,
    }));
  };

  const results = useMemo(() => {
    const savingsRate =
      formData.monthlyIncome > 0
        ? (formData.monthlySavings / formData.monthlyIncome) * 100
        : 0;

    const netWorth = formData.investments - formData.debt;

    let wealthAge = formData.age;

    if (savingsRate >= 40) wealthAge -= 8;
    else if (savingsRate >= 30) wealthAge -= 5;
    else if (savingsRate >= 20) wealthAge -= 2;
    else wealthAge += 3;

    if (netWorth > 1000000) wealthAge -= 5;
    if (netWorth < 0) wealthAge += 5;

    wealthAge = Math.max(1, wealthAge);

    const wealthScore = Math.max(
      1,
      Math.min(100, Math.round(savingsRate + netWorth / 100000))
    );

    let personality = "Balanced Builder";
    if (wealthScore >= 80) personality = "Wealth Accelerator";
    else if (wealthScore >= 60) personality = "Growth Builder";
    else if (wealthScore >= 40) personality = "Smart Saver";
    else personality = "Financial Explorer";

    let status = "Average";
    if (wealthAge < formData.age) status = "Ahead For Your Age";
    if (wealthAge > formData.age) status = "Needs Improvement";

    return { savingsRate, netWorth, wealthAge, wealthScore, personality, status };
  }, [formData]);

  return (
    <>
      <Seo
        title="Wealth Age Calculator – Compare Your Financial Age to Your Real Age"
        description="Free Wealth Age Calculator: see how your savings rate and net worth compare to your real age, with a wealth score and personalized insights."
        path="/wealth-age-calculator"
        keywords="wealth age calculator, financial age, net worth calculator, savings rate, wealth score"
        jsonLd={calculatorSchema({
          name: "Wealth Age Calculator",
          description: "Free Wealth Age Calculator: see how your savings rate and net worth compare to your real age, with a wealth score and personalized insights.",
          path: "/wealth-age-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Calculators
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Wealth Age Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Discover your financial age, wealth score, and investment personality
              using your income, savings, debt, and financial habits.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Your Financial Data
              </h2>

              <div className="space-y-8">
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-600">
                        {field.label}
                      </label>
                      <span className="text-sm font-semibold text-emerald-700">
                        {field.isAge
                          ? `${formData[field.name]} yrs`
                          : formatCurrency(formData[field.name], currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value, field.min)}
                      className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{field.isAge ? `${field.min} yrs` : formatCurrency(field.min, currency)}</span>
                      <span>{field.isAge ? `${field.max} yrs` : formatCurrency(field.max, currency)}</span>
                    </div>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value, field.min)}
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  This is a motivational comparison tool, not a precise actuarial or
                  financial planning measure.
                </p>
                <p>
                  Your actual financial standing depends on many factors this
                  simplified score doesn't capture.
                </p>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="flex flex-col gap-6">
              {/* Top stat cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="text-slate-500 text-sm mb-2">Financial Age</p>
                  <h2 className="text-3xl md:text-4xl font-black text-emerald-700">
                    {results.wealthAge}
                  </h2>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5">
                  <p className="text-slate-500 text-sm mb-2">Wealth Score</p>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800">
                    {results.wealthScore}
                  </h2>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5">
                  <p className="text-slate-500 text-sm mb-2">Savings Rate</p>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800">
                    {Math.round(results.savingsRate)}%
                  </h2>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5">
                  <p className="text-slate-500 text-sm mb-2">Net Worth</p>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 break-words">
                    {formatCurrency(results.netWorth, currency)}
                  </h2>
                </div>
              </div>

              {/* Main insight card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
                <div className="grid sm:grid-cols-[180px_1fr] gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-[160px] h-[160px] rounded-full border-[10px] border-emerald-600 flex items-center justify-center bg-emerald-50">
                      <div className="text-center">
                        <p className="text-slate-500 text-xs mb-1">Wealth Score</p>
                        <h2 className="text-4xl font-black text-emerald-700">
                          {results.wealthScore}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-emerald-700 uppercase tracking-[2px] text-xs font-bold mb-3">
                      Financial Analysis
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
                      {results.personality}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-5">
                      Your financial behavior suggests that you are currently{" "}
                      <span className="text-slate-900 font-bold">{results.status}</span>.
                      Your savings habits, net worth, and investment growth indicate
                      your long-term wealth-building potential.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-700">
                        Savings Rate: {Math.round(results.savingsRate)}%
                      </span>
                      <span className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600">
                        Net Worth: {formatCurrency(results.netWorth, currency, true)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="text-emerald-700 font-bold mb-2">Wealth Optimization</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Increasing your monthly savings rate can significantly reduce your
                    financial age and accelerate your path toward financial freedom.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="text-emerald-700 font-bold mb-2">Recommendation</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Focus on growing investments while reducing high-interest debt to
                    improve your overall wealth score over time.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="text-emerald-700 font-bold mb-2">Financial Discipline</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Consistent investing and controlled spending habits are what
                    currently support your long-term wealth creation journey.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="text-emerald-700 font-bold mb-2">Future Potential</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Your current financial pattern suggests strong future compounding
                    opportunities if maintained consistently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="wealthage_calc_mid" />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is a Wealth Age Calculator?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                A Wealth Age Calculator compares your actual financial age — how
                old your savings rate and net worth suggest you are, financially
                — against your real age. It's a quick, single-number gut check on
                whether your saving habits and current net worth are ahead of,
                on pace with, or behind where your birth-certificate age would
                suggest, based on your income, savings, investments, and debt.
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                It isn't a precise actuarial measure — it's a motivational
                snapshot meant to make savings rate and net worth tangible in a
                way a raw percentage or rupee figure often doesn't.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                How Is Wealth Age Calculated?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Two factors adjust your real age up or down: your savings rate
                (monthly savings ÷ monthly income) and your net worth (investments
                minus debt). A savings rate of 40%+ subtracts 8 years; 30-39%
                subtracts 5; 20-29% subtracts 2; below 20% adds 3 years. A net
                worth above ₹10 lakh subtracts a further 5 years, while a negative
                net worth adds 5 years. The two adjustments combine, so someone
                saving aggressively with a strong net worth can show a wealth age
                well below their real age — and the reverse is true for a high
                real age with a low savings rate and negative net worth.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    What's a good wealth age?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Anything below your real age means your current habits are
                    outpacing what your age alone would predict. There's no
                    universal target — the number is most useful tracked over
                    time against your own past results.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Why did my wealth age go up instead of down?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Usually a savings rate under 20% and/or a negative or low net
                    worth (debt exceeding investments). Increasing monthly
                    savings or paying down high-interest debt are the two most
                    direct levers to bring it back down.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Is this the same as a real financial planning tool?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    No — treat it as a quick gut-check, not a substitute for a
                    full financial plan. For actual retirement projections, use
                    the Retirement or FIRE calculators, which model your specific
                    numbers rather than producing a single comparative score.
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
