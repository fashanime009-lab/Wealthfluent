import { Link } from "react-router-dom";

export default function ContactPage() {
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

      {/* Main */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-cyan-400 font-semibold mb-3">
            CONTACT US
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Get In Touch
          </h1>

          <p className="text-slate-400 text-lg mt-6 max-w-2xl leading-relaxed">
            Have questions, feedback, partnership opportunities,
            or suggestions for new finance tools? Reach out anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h2 className="text-3xl font-black mb-8">
              Contact Information
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-slate-400 mb-2">
                  General Inquiries
                </p>

                <h3 className="text-2xl font-bold text-cyan-400">
                  contact@wealthfluent.com
                </h3>
              </div>

              <div>
                <p className="text-slate-400 mb-2">
                  Business Partnerships
                </p>

                <h3 className="text-2xl font-bold text-cyan-400">
                  partnerships@wealthfluent.com
                </h3>
              </div>

              <div>
                <p className="text-slate-400 mb-2">
                  Response Time
                </p>

                <h3 className="text-2xl font-bold">
                  Within 24-48 Hours
                </h3>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[32px] p-8">
            <h2 className="text-3xl font-black mb-8">
              Why Contact Us?
            </h2>

            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                • Report calculator issues or bugs
              </p>

              <p>
                • Suggest new finance tools
              </p>

              <p>
                • Partnership and advertising inquiries
              </p>

              <p>
                • General feedback and improvements
              </p>

              <p>
                • Financial content collaboration
              </p>
            </div>

            <div className="mt-10 p-6 bg-[#0d1a2b] border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-black mb-4">
                WealthFluent Mission
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Building free and accessible financial tools
                for smarter money management and long-term
                wealth growth.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}