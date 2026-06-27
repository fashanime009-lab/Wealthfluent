import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function CalculatorLayout({
  title,
  description,
  toolLabel,
  children,
  seoContent,
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
                to="/"
                className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-bold"
              >
                Home
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              {toolLabel}
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">
              {title}
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </section>

        {/* Main */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {children}

          {/* SEO */}
          {seoContent && (
            <div className="mt-24">
              {seoContent}
            </div>
          )}

          {/* CTA */}
          <div className="mt-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-12 text-center">
            <p className="text-cyan-400 font-semibold mb-4">
              EXPLORE MORE FINANCE TOOLS
            </p>

            <h2 className="text-5xl font-black mb-6">
              Smart Financial
              <span className="block text-cyan-400">
                Planning Tools
              </span>
            </h2>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Explore investing calculators, EMI tools,
              retirement planning, budgeting tools,
              and finance guides.
            </p>

            <Link
              to="/"
              className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-black font-black inline-block"
            >
              Explore Website
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}