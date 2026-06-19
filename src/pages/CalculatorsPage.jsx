import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CalculatorsPage() {
  const calculators = [
    {
      title: "SIP Calculator",
      desc: "Estimate mutual fund SIP returns and wealth growth.",
      route: "/sip-calculator",
      icon: "📈",
      color: "from-blue-500 to-cyan-400",
      popular: true,
    },
    {
      title: "EMI Calculator",
      desc: "Calculate monthly EMI payments instantly.",
      route: "/emi-calculator",
      icon: "🏦",
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "FD Calculator",
      desc: "Estimate FD maturity value and interest earned.",
      route: "/fd-calculator",
      icon: "💰",
      color: "from-amber-500 to-orange-400",
    },
    {
      title: "CAGR Calculator",
      desc: "Measure annual investment growth rate.",
      route: "/cagr-calculator",
      icon: "🚀",
      color: "from-purple-500 to-pink-400",
    },
    {
      title: "GST Calculator",
      desc: "Add or remove GST instantly.",
      route: "/gst-calculator",
      icon: "🧾",
      color: "from-red-500 to-rose-400",
    },
    {
      title: "Retirement Calculator",
      desc: "Plan long-term retirement wealth goals.",
      route: "/retirement-calculator",
      icon: "🌴",
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
  ];

  return (
    <>
      <Helmet>
        <title>Finance Calculators – WealthFluent</title>
        <meta
          name="description"
          content="Explore free finance calculators including SIP, EMI, FD, GST, CAGR, and retirement planning tools."
        />
        <meta
          name="keywords"
          content="finance calculators, SIP calculator, EMI calculator, FD calculator, GST calculator, CAGR calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl"></div>
        </div>

        <Navbar />

        {/* Hero */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center z-10">
          <div className="inline-block bg-blue-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-blue-700 font-medium text-sm mb-4 border border-blue-200/50">
            🧮 Smart Financial Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Free Financial Tools
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              For Better Decisions
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Explore modern finance calculators, investment planning tools,
            and educational resources designed for smarter wealth growth.
          </p>
        </section>

        {/* Calculators Grid */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {calculators.map((calc, index) => (
              <Link
                key={index}
                to={calc.route}
                className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/70 overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${calc.color} rounded-3xl blur-xl opacity-20`}></div>
                </div>

                {/* Badge */}
                {calc.popular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-200/50 z-10">
                    Popular
                  </span>
                )}
                {calc.new && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-rose-200/50 z-10">
                    New
                  </span>
                )}

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${calc.color} flex items-center justify-center text-3xl shadow-lg shadow-blue-200/50 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {calc.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {calc.desc}
                  </p>
                  <span className="text-blue-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                    Open Calculator
                    <svg
                      className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
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
        </section>

        {/* Statistics / Social Proof */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-blue-600">10,000+</div>
              <div className="text-slate-500 mt-1">Calculations Performed</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-600">7</div>
              <div className="text-slate-500 mt-1">Financial Tools Available</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-600">100%</div>
              <div className="text-slate-500 mt-1">Free & Secure</div>
            </div>
          </div>
        </section>

        {/* SEO / Info Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Why Use Finance Calculators?
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              Finance calculators help users make smarter financial
              decisions by estimating investments, loan EMIs,
              retirement planning, tax calculations, and wealth growth.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              WealthFluent provides free online financial calculators
              designed for beginners, investors, students,
              and personal finance learners.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-slate-800 mb-2">Investment Planning</h3>
                <p className="text-sm text-slate-500">SIP, CAGR, and retirement calculators to grow your wealth.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="font-semibold text-slate-800 mb-2">Loan Management</h3>
                <p className="text-sm text-slate-500">EMI calculators to plan home, car, and personal loans.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-3xl mb-3">🧾</div>
                <h3 className="font-semibold text-slate-800 mb-2">Tax & Savings</h3>
                <p className="text-sm text-slate-500">GST and FD calculators for smarter tax and savings planning.</p>
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

        <Footer />
      </div>
    </>
  );
}