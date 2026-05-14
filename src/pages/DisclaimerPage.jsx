import { Link } from "react-router-dom";

export default function DisclaimerPage() {
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
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black mb-10">
          Disclaimer
        </h1>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <p>
            The information provided on WealthFluent is for
            educational and informational purposes only.
          </p>

          <p>
            We do not provide financial, investment, tax,
            or legal advice. Users should consult qualified
            financial professionals before making investment
            or financial decisions.
          </p>

          <p>
            Calculator results are estimates based on
            user-provided information and should not be
            considered guaranteed outcomes.
          </p>

          <p>
            WealthFluent is not responsible for any financial
            losses, investment decisions, or actions taken
            based on information available on this website.
          </p>

          <p>
            Third-party advertisements and affiliate links
            may appear on this website in the future.
          </p>
        </div>
      </section>
    </div>
  );
}