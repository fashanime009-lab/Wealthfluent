import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function BlogPage() {
  const articles = [
    {
      title: "How SIP Investments Build Long-Term Wealth",
      desc: "Understand compounding and disciplined investing strategies.",
      category: "Investing",
      route: "/how-sip-builds-wealth",
      read: "5 min read",
    },
    {
      title: "Best Financial Habits For Beginners",
      desc: "Learn practical money habits for long-term financial growth.",
      category: "Personal Finance",
      route: "/best-financial-habits",
      read: "4 min read",
    },
    {
      title: "EMI vs Full Payment: Which Is Better?",
      desc: "Compare financing and full-payment financial decisions.",
      category: "Loans",
      route: "/emi-vs-full-payment",
      read: "6 min read",
    },
    {
      title: "Why Long-Term Investing Matters",
      desc: "Discover how time impacts wealth creation and compounding.",
      category: "Investing",
      route: "/long-term-investing",
      read: "7 min read",
    },
    {
      title: "How To Start Budgeting Effectively",
      desc: "Simple budgeting techniques for financial stability.",
      category: "Budgeting",
      route: "/budgeting-guide",
      read: "5 min read",
    },
    {
      title: "Understanding Compound Interest",
      desc: "Learn the power of compound growth for investments.",
      category: "Finance Basics",
      route: "/compound-interest-guide",
      read: "6 min read",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Finance Blog – WealthFluent Articles & Guides
        </title>

        <meta
          name="description"
          content="Explore finance articles, investment guides, budgeting tips, retirement planning, and wealth growth strategies."
        />
      </Helmet>

      <div className="min-h-screen bg-[#07111f] text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-black">
                Wealth<span className="text-cyan-400">Fluent</span>
              </h1>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-slate-300 hover:text-white transition"
              >
                Home
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
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-cyan-400 font-semibold mb-4">
                FINANCE BLOG
              </p>

              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                Smart Financial
                <span className="block text-cyan-400">
                  Guides & Insights
                </span>
              </h1>

              <p className="text-slate-400 text-xl leading-relaxed mt-8 max-w-2xl">
                Explore investing strategies, budgeting guides,
                retirement planning tips, loan education,
                and personal finance insights.
              </p>
            </div>

            {/* Featured */}
            <Link
              to="/how-sip-builds-wealth"
              className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-10 hover:border-cyan-400/30 transition duration-300"
            >
              <div className="h-72 rounded-[32px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-10" />

              <div className="inline-flex bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                FEATURED ARTICLE
              </div>

              <h2 className="text-5xl font-black leading-tight mb-6 group-hover:text-cyan-300 transition">
                How SIP Investments Build Long-Term Wealth
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Learn how disciplined SIP investing and compounding
                can significantly improve long-term wealth creation.
              </p>
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex flex-wrap gap-4">
            {[
              "All",
              "Investing",
              "Budgeting",
              "Retirement",
              "Loans",
              "Finance Basics",
            ].map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-2xl border transition ${
                  index === 0
                    ? "bg-cyan-500 text-black border-cyan-500 font-bold"
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <Link
                key={index}
                to={article.route}
                className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-2 transition duration-300"
              >
                <div className="h-56 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-8 relative overflow-hidden">
                  <div className="absolute bottom-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold text-cyan-300">
                    {article.category}
                  </div>
                </div>

                <h3 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
                  {article.title}
                </h3>

                <p className="text-slate-400 leading-relaxed mb-8">
                  {article.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">
                    Read Article →
                  </span>

                  <span className="text-slate-500 text-sm">
                    {article.read}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}