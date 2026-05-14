import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ArticleLayout({
  title,
  description,
  category,
  readTime,
  children,
}) {
  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta
          name="description"
          content={description}
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
                to="/sip-calculator"
                className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-bold"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              {category}
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">
              {title}
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed max-w-3xl">
              {description}
            </p>

            {/* Author */}
            <div className="flex items-center gap-5 mt-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />

              <div>
                <h3 className="text-xl font-bold">
                  WealthFluent Editorial Team
                </h3>

                <p className="text-slate-400">
                  Updated May 2026 • {readTime}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                {/* Related Tool */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[30px] p-8">
                  <p className="text-cyan-400 font-semibold mb-3">
                    FINANCE TOOLS
                  </p>

                  <h3 className="text-3xl font-black mb-5">
                    Explore Calculators
                  </h3>

                  <p className="text-slate-400 leading-relaxed mb-8">
                    Use smart finance calculators for investing,
                    retirement, EMI planning, and wealth growth.
                  </p>

                  <Link
                    to="/sip-calculator"
                    className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-2xl text-black font-bold inline-block"
                  >
                    Open Tools
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">
                  <h3 className="text-2xl font-black mb-6">
                    Quick Links
                  </h3>

                  <div className="space-y-4">
                    <Link
                      to="/sip-calculator"
                      className="block text-slate-300 hover:text-cyan-300 transition"
                    >
                      SIP Calculator
                    </Link>

                    <Link
                      to="/emi-calculator"
                      className="block text-slate-300 hover:text-cyan-300 transition"
                    >
                      EMI Calculator
                    </Link>

                    <Link
                      to="/retirement-calculator"
                      className="block text-slate-300 hover:text-cyan-300 transition"
                    >
                      Retirement Calculator
                    </Link>

                    <Link
                      to="/blog"
                      className="block text-slate-300 hover:text-cyan-300 transition"
                    >
                      Finance Blog
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <article className="space-y-12">
              {/* Cover */}
              <div className="h-[420px] rounded-[40px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />

              {/* Article Content */}
              <div className="space-y-10 text-lg text-slate-300 leading-relaxed">
                {children}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-12 text-center">
                <p className="text-cyan-400 font-semibold mb-4">
                  WEEKLY FINANCE INSIGHTS
                </p>

                <h2 className="text-5xl font-black mb-6">
                  Learn Smarter
                  <span className="block text-cyan-400">
                    Financial Strategies
                  </span>
                </h2>

                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                  Explore investing guides, budgeting strategies,
                  retirement planning, and personal finance tips.
                </p>

                <Link
                  to="/blog"
                  className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-black font-black inline-block"
                >
                  Explore More Articles
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}