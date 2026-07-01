import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function WealthAgeCalculatorPage() {

  const [formData, setFormData] = useState({
    age: 25,
    monthlyIncome: 50000,
    monthlySavings: 15000,
    investments: 300000,
    debt: 100000,
    monthlyExpenses: 25000,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const results = useMemo(() => {

    const savingsRate =
      (formData.monthlySavings / formData.monthlyIncome) * 100;

    const netWorth =
      formData.investments - formData.debt;

    let wealthAge = formData.age;

    if (savingsRate >= 40) wealthAge -= 8;
    else if (savingsRate >= 30) wealthAge -= 5;
    else if (savingsRate >= 20) wealthAge -= 2;
    else wealthAge += 3;

    if (netWorth > 1000000) wealthAge -= 5;
    if (netWorth < 0) wealthAge += 5;

    const wealthScore = Math.max(
      1,
      Math.min(
        100,
        Math.round(
          savingsRate +
          (netWorth / 100000)
        )
      )
    );

    let personality = "Balanced Builder";

    if (wealthScore >= 80)
      personality = "Wealth Accelerator";

    else if (wealthScore >= 60)
      personality = "Growth Builder";

    else if (wealthScore >= 40)
      personality = "Smart Saver";

    else
      personality = "Financial Explorer";

    let status = "Average";

    if (wealthAge < formData.age)
      status = "Ahead For Your Age";

    if (wealthAge > formData.age)
      status = "Needs Improvement";

    return {
      savingsRate,
      netWorth,
      wealthAge,
      wealthScore,
      personality,
      status,
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

          <div className="flex items-center gap-4">

            <Link
              to="/tools"
              className="text-slate-300 hover:text-white transition"
            >
              Tools
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

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

        <div className="text-center mb-16">

          <p className="text-cyan-400 uppercase tracking-[4px] text-sm font-semibold mb-5">
            AI Wealth Intelligence
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">

            Wealth Age

            <span className="block text-cyan-400">
              Calculator
            </span>

          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-xl leading-relaxed">
            Discover your financial age, wealth score,
            and investment personality using your
            income, savings, debt, and financial habits.
          </p>

        </div>

        {/* GRID */}

        <div className="grid xl:grid-cols-[380px_1fr] gap-8 lg:gap-10">

          {/* LEFT PANEL */}

          <div className="xl:sticky xl:top-28 h-fit">

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl">

              <div className="mb-8">

                <p className="text-cyan-400 uppercase tracking-[3px] text-sm font-semibold mb-3">
                  Financial Inputs
                </p>

                <h2 className="text-3xl font-black">
                  Your Financial Data
                </h2>

              </div>

              <div className="space-y-6">

                {[
                  {
                    label: "Current Age",
                    name: "age",
                  },
                  {
                    label: "Monthly Income",
                    name: "monthlyIncome",
                  },
                  {
                    label: "Monthly Savings",
                    name: "monthlySavings",
                  },
                  {
                    label: "Investments",
                    name: "investments",
                  },
                  {
                    label: "Debt",
                    name: "debt",
                  },
                  {
                    label: "Monthly Expenses",
                    name: "monthlyExpenses",
                  },
                ].map((field, index) => (

                  <div key={index}>

                    <div className="flex items-center justify-between mb-3">

                      <label className="text-slate-300 font-medium">
                        {field.label}
                      </label>

                      <span className="text-cyan-400 font-bold">
                        ₹{formData[field.name].toLocaleString()}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="1"
                      max="1000000"
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

          {/* RIGHT PANEL */}

          <div className="space-y-8">

            {/* TOP CARDS */}

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="rounded-[32px] p-7 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-400/20">

                <p className="text-slate-300 mb-3">
                  Financial Age
                </p>

                <h2 className="text-5xl font-black text-cyan-400">
                  {results.wealthAge}
                </h2>

              </div>

              <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

                <p className="text-slate-300 mb-3">
                  Wealth Score
                </p>

                <h2 className="text-5xl font-black">
                  {results.wealthScore}
                </h2>

              </div>

              <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

                <p className="text-slate-300 mb-3">
                  Savings Rate
                </p>

                <h2 className="text-5xl font-black">
                  {Math.round(results.savingsRate)}%
                </h2>

              </div>

              <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

                <p className="text-slate-300 mb-3">
                  Net Worth
                </p>

                <h2 className="text-3xl font-black break-words">
                  ₹{results.netWorth.toLocaleString()}
                </h2>

              </div>

            </div>

            {/* MAIN INSIGHT */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10">

              <div className="grid lg:grid-cols-[300px_1fr] gap-10 items-center">

                {/* CIRCLE */}

                <div className="flex justify-center">

                  <div className="relative w-[240px] h-[240px] rounded-full border-[14px] border-cyan-400 flex items-center justify-center bg-[#0f172a] shadow-[0_0_80px_rgba(34,211,238,0.15)]">

                    <div className="text-center">

                      <p className="text-slate-400 mb-2">
                        Wealth Score
                      </p>

                      <h2 className="text-6xl font-black text-cyan-400">
                        {results.wealthScore}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* TEXT */}

                <div>

                  <p className="text-cyan-400 uppercase tracking-[3px] text-sm font-semibold mb-4">
                    AI Financial Analysis
                  </p>

                  <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">

                    {results.personality}

                  </h2>

                  <p className="text-slate-400 text-lg leading-relaxed mb-8">

                    Your financial behavior suggests that you are currently{" "}
                    <span className="text-white font-bold">
                      {results.status}
                    </span>.
                    Your savings habits, net worth, and investment growth
                    indicate strong long-term wealth-building potential.

                  </p>

                  <div className="flex flex-wrap gap-4">

                    <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl px-5 py-3">
                      FIRE Potential: High
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                      Risk Profile: Moderate
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                      Wealth Growth: Stable
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* INSIGHT CARDS */}

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

                <h3 className="text-cyan-400 text-2xl font-bold mb-4">
                  Wealth Optimization
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Increasing your monthly savings rate
                  can significantly reduce your financial age
                  and accelerate your path toward financial freedom.
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

                <h3 className="text-cyan-400 text-2xl font-bold mb-4">
                  AI Recommendation
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Focus on growing investments while reducing
                  high-interest debt to improve your overall
                  wealth score over time.
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

                <h3 className="text-cyan-400 text-2xl font-bold mb-4">
                  Financial Discipline
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Consistent investing and controlled spending
                  habits are currently supporting your
                  long-term wealth creation journey.
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

                <h3 className="text-cyan-400 text-2xl font-bold mb-4">
                  Future Wealth Potential
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Your current financial pattern suggests
                  strong future compounding opportunities
                  if maintained consistently.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}