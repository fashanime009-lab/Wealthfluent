import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CalculatorsPage() {
  const calculators = [
    {
      title: "SIP Calculator",
      desc: "Estimate mutual fund SIP returns and wealth growth.",
      route: "/sip-calculator",
      icon: "📈",
    },
    {
      title: "EMI Calculator",
      desc: "Calculate monthly EMI payments instantly.",
      route: "/emi-calculator",
      icon: "🏦",
    },
    {
      title: "FD Calculator",
      desc: "Estimate FD maturity value and interest earned.",
      route: "/fd-calculator",
      icon: "💰",
    },
    {
      title: "CAGR Calculator",
      desc: "Measure annual investment growth rate.",
      route: "/cagr-calculator",
      icon: "🚀",
    },
    {
      title: "GST Calculator",
      desc: "Add or remove GST instantly.",
      route: "/gst-calculator",
      icon: "🧾",
    },
    {
      title: "Retirement Calculator",
      desc: "Plan long-term retirement wealth goals.",
      route: "/retirement-calculator",
      icon: "🌴",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Finance Calculators – WealthFluent
        </title>

        <meta
          name="description"
          content="Explore free finance calculators including SIP, EMI, FD, GST, CAGR, and retirement planning tools."
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
                to="/blog"
                className="text-slate-300 hover:text-white transition"
              >
                Blog
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

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-cyan-400 font-semibold mb-6">
            SMART FINANCIAL TOOLS
          </p>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">
            Free Financial Tools
            <span className="block text-cyan-400">
              For Better Decisions
            </span>
          </h1>

          <p className="text-slate-400 text-xl leading-relaxed max-w-3xl mx-auto">
            Explore modern finance calculators, investment planning tools,
            and educational resources designed for smarter wealth growth.
          </p>
        </section>

        {/* Calculators */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {calculators.map((calculator, index) => (
              <Link
                key={index}
                to={calculator.route}
                className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-2 transition duration-300"
              >
                <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-4xl mb-8">
                  {calculator.icon}
                </div>

                <h2 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
                  {calculator.title}
                </h2>

                <p className="text-slate-400 leading-relaxed mb-8">
                  {calculator.desc}
                </p>

                <span className="text-cyan-400 font-bold">
                  Open Calculator →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-12">
            <h2 className="text-5xl font-black mb-8">
              Why Use Finance Calculators?
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Finance calculators help users make smarter financial
              decisions by estimating investments, loan EMIs,
              retirement planning, tax calculations, and wealth growth.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              WealthFluent provides free online financial calculators
              designed for beginners, investors, students,
              and personal finance learners.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}