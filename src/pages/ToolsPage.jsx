import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ToolsPage() {
  const tools = [
    {
      title: "Goal Planner",
      desc: "Plan future savings and investment goals.",
      icon: "🎯",
    },
    {
      title: "Risk Analyzer",
      desc: "Understand investment risk profiles.",
      icon: "📊",
    },
    {
      title: "Portfolio Tracker",
      desc: "Track investments and asset allocation.",
      icon: "📈",
    },
    {
      title: "Inflation Calculator",
      desc: "Estimate purchasing power impact over time.",
      icon: "📉",
    },
    {
      title: "Wealth Roadmap",
      desc: "Visualize long-term financial growth journey.",
      icon: "🛣️",
    },
    {
      title: "Finance Glossary",
      desc: "Learn essential finance terminology easily.",
      icon: "📚",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Smart Finance Tools – WealthFluent
        </title>

        <meta
          name="description"
          content="Explore smart finance planning tools, investment utilities, financial learning resources, and wealth planning systems."
        />
      </Helmet>

      <div className="min-h-screen bg-[#07111f] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-black">
                Wealth<span className="text-cyan-400">Fluent</span>
              </h1>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/calculators"
                className="text-slate-300 hover:text-white transition"
              >
                Calculators
              </Link>

              <Link
                to="/blog"
                className="text-slate-300 hover:text-white transition"
              >
                Blog
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-cyan-400 font-semibold mb-6">
            SMART FINANCIAL UTILITIES
          </p>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">
            Advanced Finance
            <span className="block text-cyan-400">
              Planning Tools
            </span>
          </h1>

          <p className="text-slate-400 text-xl leading-relaxed max-w-3xl mx-auto">
            Explore premium financial planning utilities,
            investment tools, market resources,
            and educational finance systems.
          </p>
        </section>

        {/* Tools Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-2 transition duration-300"
              >
                <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-4xl mb-8">
                  {tool.icon}
                </div>

                <h2 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
                  {tool.title}
                </h2>

                <p className="text-slate-400 leading-relaxed mb-8">
                  {tool.desc}
                </p>

                <button className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-2xl text-black font-bold">
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-12">
            <h2 className="text-5xl font-black mb-8">
              Smart Financial Planning Resources
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Financial planning tools help investors, beginners,
              and wealth builders make smarter money decisions
              using data-driven insights and calculators.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              WealthFluent combines finance education,
              investment planning systems, and wealth tools
              to improve long-term financial understanding.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}