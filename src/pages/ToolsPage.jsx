import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";


export default function ToolsPage() {
  const tools = [
    {
      title: "Financial Goal Planner",
      desc: "Plan future savings and investment goals.",
      icon: "🎯",
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Investment Risk Analyzer",
      desc: "Understand investment risk profiles.",
      icon: "📊",
      color: "from-purple-500 to-pink-400",
    },
    {
      title: "Portfolio Management",
      desc: "Track investments and monitor portfolio performance.",
      icon: "📈",
      //route: "/portfolio-tracker",
      color: "from-emerald-500 to-teal-400",
      popular: true,
    },
    {
      title: "Inflation Insights",
      desc: "Estimate purchasing power impact over time.",
      icon: "📉",
      color: "from-amber-500 to-orange-400",
    },
    {
      title: "Wealth Roadmap",
      desc: "Visualize long-term financial growth journey.",
      icon: "🛣️",
      color: "from-rose-500 to-red-400",
    },
    {
      title: "Finance Glossary",
      desc: "Learn essential finance terminology easily.",
      icon: "📚",
      color: "from-indigo-500 to-blue-400",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Smart Finance Tools – WealthFluent</title>
        <meta
          name="description"
          content="Explore smart finance planning tools, investment utilities, financial learning resources, and wealth planning systems."
        />
        <meta
          name="keywords"
          content="finance tools, goal planner, risk analyzer, portfolio tracker, inflation calculator, wealth roadmap"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-3xl"></div>
        </div>

       

        {/* Hero */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center z-10">
          <div className="inline-block bg-blue-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-blue-700 font-medium text-sm mb-4 border border-blue-200/50">
            🧰 Smart Financial Utilities
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Advanced Finance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Planning Tools
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Discover upcoming financial research tools, portfolio management utilities, investment analysis resources, and educational finance systems.
          </p>
        </section>

        {/* Tools Grid */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/70 overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${tool.color} rounded-3xl blur-xl opacity-20`}></div>
                </div>

                {/* Badge */}
                {tool.popular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-200/50 z-10">
                    Popular
                  </span>
                )}

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg shadow-blue-200/50 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tool.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {tool.desc}
                  </p>

                  {tool.route ? (
                    <Link
                      to={tool.route}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition px-6 py-3 rounded-2xl text-white font-bold w-full shadow-lg shadow-blue-200/50 hover:shadow-xl"
                    >
                      Open Tool
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-slate-100 text-slate-400 px-6 py-3 rounded-2xl font-bold w-full cursor-not-allowed border border-slate-200"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics / Social Proof */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-blue-600">6</div>
              <div className="text-slate-500 mt-1">Upcoming Tools</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-600">100%</div>
              <div className="text-slate-500 mt-1">Free to Use</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-600">🚀</div>
              <div className="text-slate-500 mt-1">Launching Soon</div>
            </div>
          </div>
        </section>

        {/* SEO / Info Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Smart Financial Planning Resources
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              Financial planning tools help investors, beginners, and wealth
              builders make smarter money decisions using data-driven insights
              and calculators.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              WealthFluent combines finance education, investment planning
              systems, and wealth tools to improve long-term financial
              understanding.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-slate-800 mb-2">Goal Setting</h3>
                <p className="text-sm text-slate-500">Define and track your financial goals with precision.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-slate-800 mb-2">Risk Assessment</h3>
                <p className="text-sm text-slate-500">Understand your risk tolerance and investment comfort.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-slate-800 mb-2">Financial Literacy</h3>
                <p className="text-sm text-slate-500">Learn key finance terms and concepts easily.</p>
              </div>
            </div>
            <div className="mt-8 text-xs text-slate-400 border-t border-slate-100 pt-6">
              <p>
                <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                These tools are for educational and illustrative purposes only.
                Always consult a certified financial advisor for personalised advice.
              </p>
            </div>
          </div>
        </section>

       
      </div>
    </>
  );
}