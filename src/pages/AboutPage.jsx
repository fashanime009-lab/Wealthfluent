import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-cyan-400 font-semibold mb-3">
            ABOUT WEALTHFLUENT
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Smart Finance Tools
            <span className="block text-cyan-400">
              Built For Everyone
            </span>
          </h1>
        </div>

        <div className="space-y-10 text-slate-300 text-lg leading-relaxed">
          <p>
            WealthFluent is a modern finance platform designed to help
            users make smarter money decisions through simple and
            powerful financial calculators.
          </p>

          <p>
            Our mission is to provide free financial tools for
            investment planning, loan calculations, retirement
            planning, tax estimation, and wealth growth analysis.
          </p>

          <p>
            We believe financial education and planning tools should
            be accessible to everyone without subscriptions or hidden
            fees.
          </p>

          <p>
            WealthFluent focuses on creating fast, accurate, and
            easy-to-use calculators with a premium user experience
            optimized for both desktop and mobile users.
          </p>

          <p>
            In the future, the platform will continue expanding with
            additional financial tools, guides, educational content,
            and investment resources.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-4xl font-black text-cyan-400">
              100+
            </h3>

            <p className="text-slate-400 mt-3">
              Planned Finance Tools
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-4xl font-black text-cyan-400">
              Free
            </h3>

            <p className="text-slate-400 mt-3">
              Forever Access
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-4xl font-black text-cyan-400">
              Fast
            </h3>

            <p className="text-slate-400 mt-3">
              Optimized Performance
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}