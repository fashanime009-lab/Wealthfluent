import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";


export default function CalculatorsPage() {
  const [searchParams] = useSearchParams();

const selectedCategory = searchParams.get("category");
  // ─── Only calculators that have been created ──────────────────
  const categories = [
    {
      id: "loan",
      name: "Interest & Loan Calculators",
      icon: "🏦",
      description: "Calculate loan payments, future values, investment returns, and bond yields.",
      calculators: [
        {
          title: "EMI Calculator",
          desc: "Calculate monthly EMI payments for loans.",
          route: "/emi-calculator",
          icon: "🏦",
          color: "from-emerald-500 to-teal-400",
        },
        {
          title: "Future Value Calculator",
          desc: "Calculate the future value with compound interest.",
          route: "/future-value-calculator",
          icon: "⏳",
          color: "from-indigo-500 to-blue-400",
        },
        {
          title: "Rate of Return Calculator",
          desc: "Find the annualized return on your investments.",
          route: "/rate-of-return-calculator",
          icon: "📈",
          color: "from-teal-500 to-cyan-400",
        },
        {
          title: "Bond Yield Calculator",
          desc: "Calculate current yield and yield to maturity.",
          route: "/bond-yield-calculator",
          icon: "📜",
          color: "from-slate-500 to-gray-400",
        },
        {
          title: "Fixed Deposit Calculator",
desc: "Estimate deposit maturity value and interest earned.",
          route: "/fd-calculator",
          icon: "💰",
          color: "from-amber-500 to-orange-400",
        },
        {
          title: "GST Calculator",
          desc: "Calculate GST for purchases and business transactions (India).",
          route: "/gst-calculator",
          icon: "🧾",
          color: "from-red-500 to-rose-400",
        },
      ],
    },
    {
      id: "investment",
      name: "Investment Planning",
      icon: "📈",
      description: "Plan recurring investments and long-term wealth creation.",
      calculators: [
        {
          title: "SIP Calculator",
          desc: "Estimate recurring investment growth over time.",
          route: "/sip-calculator",
          icon: "📊",
          color: "from-blue-500 to-cyan-400",
          popular: true,
        },
        {
          title: "Goal Investment Calculator",
          desc: "Find the monthly SIP needed to reach your goal.",
          route: "/goal-sip",
          icon: "🎯",
          color: "from-fuchsia-500 to-pink-400",
        },
        {
          title: "Inflation Calculator",
          desc: "See how inflation impacts your purchasing power.",
          route: "/inflation-calculator",
          icon: "📉",
          color: "from-amber-500 to-yellow-400",
        },
      ],
    },
    {
      id: "retirement",
      name: "Retirement Planning",
      icon: "🌴",
      description: "Secure your future with smart retirement strategies.",
      calculators: [
        {
          title: "Retirement Calculator",
          desc: "Plan long-term retirement wealth goals.",
          route: "/retirement-calculator",
          icon: "🌅",
          color: "from-green-500 to-emerald-400",
        },
        {
          title: "FIRE Calculator",
          desc: "Plan Financial Independence & Retire Early.",
          route: "/fire-calculator",
          icon: "🔥",
          color: "from-rose-500 to-red-400",
          new: true,
        },
        {
          title: "Annual Retirement Income Calculator",
          desc: "Calculate your annual income during retirement.",
          route: "/annual-retirement-income",
          icon: "💰",
          color: "from-amber-500 to-orange-400",
        },
        {
          title: "Retirement Investment Tracker",
          desc: "Track your retirement investments year by year.",
          route: "/retirement-investment-tracker",
          icon: "📋",
          color: "from-sky-500 to-blue-400",
        },
      ],
    },
    {
      id: "wealth",
      
      name: "Wealth & Goal Planning",
      icon: "💼",
      description: "Track your net worth and plan your financial goals.",
      calculators: [
        {
          title: "Net Worth Calculator",
          desc: "Track your assets, liabilities, and net worth.",
          route: "/networth-calculator",
          icon: "💼",
          color: "from-cyan-500 to-blue-400",
        },
        {
          title: "Goal Planner",
          desc: "Plan your retirement with variable asset allocation.",
          route: "/goal-planner",
          icon: "🎯",
          color: "from-violet-500 to-purple-400",
        },
      ],
    },
  ];
const filteredCategories =
  !selectedCategory
    ? categories
    : categories.filter((category) => {
        if (selectedCategory === "loan")
          return category.id === "loan";

        if (selectedCategory === "investment")
          return category.id === "investment";

        if (selectedCategory === "retirement")
          return category.id === "retirement";

        if (selectedCategory === "wealth")
          return category.id === "wealth";

        if (selectedCategory === "goal")
          return category.id === "wealth";

        return true;
      });
  // ─── Total count ──────────────────────────────────────────────
  const totalCalculators = filteredCategories.reduce((sum, cat) => sum + cat.calculators.length, 0);

  return (
    <>
      <Helmet>
        <title>Financial Calculators – FINAIW</title>
        <meta
          name="description"
          content="Explore free financial calculators for investments, loans, retirement planning, bond yields, net worth, inflation, and more. Make smarter financial decisions with FINAIW."
        />
        <meta
          name="keywords"
          content="financial calculators, investment calculator, loan calculator, retirement calculator, bond yield calculator, net worth calculator, inflation calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl"></div>
        </div>

       

        {/* Hero */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center z-10">
          <div className="inline-block bg-blue-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-blue-700 font-medium text-sm mb-4 border border-blue-200/50">
            🧮 Smart Financial Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Financial Calculators
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              For Smarter Decisions
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Explore a curated collection of financial calculators for investing, retirement planning, loans, inflation, bond analysis, and wealth management.
          </p>
        </section>

        {/* Category Stats */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {filteredCategories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center">
                <div className="text-2xl">{cat.icon}</div>
                <div className="text-xs font-semibold text-slate-700 mt-1 leading-tight">{cat.name}</div>
                <div className="text-[10px] text-slate-400">{cat.calculators.length} Tools</div>
              </div>
            ))}
          </div>
        </section>

        {/* Calculators by Category */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-16 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {category.name}
                  </h2>
                  <p className="text-slate-500 text-sm">{category.description}</p>
                </div>
              </div>

              {/* Category Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.calculators.map((calc) => (
                  <Link
                    key={calc.route}
                    to={calc.route}
                    className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/70 overflow-hidden"
                  >
                    {/* Gradient glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${calc.color} rounded-2xl blur-xl opacity-20`}
                      ></div>
                    </div>

                    {/* Badges */}
                    {calc.popular && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-blue-200/50 z-10">
                        Popular
                      </span>
                    )}
                    {calc.new && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-red-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-rose-200/50 z-10">
                        New
                      </span>
                    )}

                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center text-2xl shadow-lg shadow-blue-200/50 mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {calc.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {calc.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {calc.desc}
                      </p>
                      <span className="text-blue-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        Open
                        <svg
                          className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Statistics / Social Proof */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-blue-600">{totalCalculators}</div>
              <div className="text-slate-500 mt-1">Financial Tools</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-600">{categories.length}</div>
              <div className="text-slate-500 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-600">100%</div>
              <div className="text-slate-500 mt-1">Free & Secure</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-600">✓ Trusted</div>
              <div className="text-slate-500 mt-1">By Investors</div>
            </div>
          </div>
        </section>

        {/* SEO / Info Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Why Use FINAIW Calculators?
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              Our calculators are designed to help you make smarter financial decisions
              with clarity and confidence. Whether you're planning investments, managing
              loans, or preparing for retirement, these tools give you data-driven insights
              at your fingertips.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              FINAIW is your trusted partner for financial literacy — offering
              intuitive tools that are both educational and practical for everyday use.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-slate-800 mb-2">Investment Planning</h3>
                <p className="text-sm text-slate-500">Investment, CAGR, and retirement calculators to grow your wealth.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="font-semibold text-slate-800 mb-2">Loan Management</h3>
                <p className="text-sm text-slate-500">EMI calculators to plan home, car, and personal loans.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">🧾</div>
                <h3 className="font-semibold text-slate-800 mb-2">Tax & Savings</h3>
                <p className="text-sm text-slate-500">Tax and savings calculators for smarter financial planning.</p>
              </div>
            </div>
            <div className="mt-8 text-xs text-slate-400 border-t border-slate-100 pt-6">
              <p>
                <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                These tools are for illustrative purposes only and do not constitute financial advice.
                Please consult a certified financial advisor for personalised guidance.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}