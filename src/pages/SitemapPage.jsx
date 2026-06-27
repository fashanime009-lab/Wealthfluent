import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Home & About",
      icon: "🏠",
      pages: [
        { name: "Home", path: "/", description: "Main landing page" },
        { name: "About Us", path: "/about", description: "Learn about FINAIW" },
        { name: "Contact Us", path: "/contact", description: "Get in touch" },
        { name: "Help Center", path: "/help", description: "FAQs and support" },
        { name: "Feedback", path: "/feedback", description: "Share your thoughts" },
      ],
    },
    {
      title: "Calculators",
      icon: "🧮",
      pages: [
        { name: "All Calculators", path: "/calculators", description: "Browse all calculators" },
        { name: "SIP Calculator", path: "/sip-calculator", description: "Estimate mutual fund SIP returns" },
        { name: "Goal SIP Calculator", path: "/goal-sip", description: "Find SIP needed for your goal" },
        { name: "EMI Calculator", path: "/emi-calculator", description: "Calculate monthly loan payments" },
        { name: "FD Calculator", path: "/fd-calculator", description: "Estimate fixed deposit returns" },
        { name: "CAGR Calculator", path: "/cagr-calculator", description: "Measure annual growth rate" },
        { name: "GST Calculator", path: "/gst-calculator", description: "Add or remove GST" },
        { name: "Inflation Calculator", path: "/inflation-calculator", description: "See inflation impact" },
        { name: "Future Value Calculator", path: "/future-value-calculator", description: "Compound interest growth" },
        { name: "Rate of Return Calculator", path: "/rate-of-return-calculator", description: "Calculate annualized returns" },
        { name: "Bond Yield Calculator", path: "/bond-yield-calculator", description: "Calculate bond yields" },
        { name: "Net Worth Calculator", path: "/networth-calculator", description: "Track assets and liabilities" },
        { name: "Retirement Calculator", path: "/retirement-calculator", description: "Plan retirement wealth" },
        { name: "Annual Retirement Income", path: "/annual-retirement-income", description: "Calculate retirement income" },
        { name: "Retirement Investment Tracker", path: "/retirement-investment-tracker", description: "Track retirement investments" },
        { name: "FIRE Calculator", path: "/fire-calculator", description: "Financial Independence, Retire Early" },
        { name: "Goal Planner", path: "/goal-planner", description: "Plan with asset allocation" },
      ],
    },
    {
      title: "Tools & Resources",
      icon: "🛠️",
      pages: [
        { name: "All Tools", path: "/tools", description: "Browse all tools" },
       
       
      ],
    },
    {
      title: "Learning Center",
      icon: "📚",
      pages: [
        { name: "Blogs", path: "/blogs", description: "Financial insights and articles" },
        { name: "News", path: "/news", description: "Latest financial news" },
        { name: "Quizzes", path: "/quizzes", description: "Test your financial knowledge" },
        { name: "How SIP Builds Wealth", path: "/how-sip-builds-wealth", description: "SIP wealth creation guide" },
      ],
    },
    {
      title: "Legal",
      icon: "⚖️",
      pages: [
        { name: "Privacy Policy", path: "/privacy-policy", description: "How we protect your data" },
        { name: "Disclaimer", path: "/disclaimer", description: "Legal disclaimer" },
        
      ],
    },
  ];

  // Calculate total pages
  const totalPages = sitemapSections.reduce((sum, section) => sum + section.pages.length, 0);

  return (
    <>
      <Helmet>
        <title>Sitemap – FINAIW</title>
        <meta
          name="description"
          content="Explore the complete sitemap of FINAIW. Find all calculators, tools, resources, and legal pages in one place."
        />
        <meta
          name="keywords"
          content="sitemap, FINAIW, site navigation, financial calculators, tools"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sitemap - FINAIW",
            "description": "Complete sitemap of FINAIW showing all available pages.",
            "url": "https://finaiw.com/sitemap",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                FINAIW Sitemap
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Site Navigation
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Explore all pages on FINAIW — from calculators and tools to learning
                resources and legal information.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {totalPages} pages across {sitemapSections.length} categories
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {sitemapSections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 transition px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <span>{section.icon}</span>
                  {section.title}
                </a>
              ))}
            </div>

            {/* Sitemap Sections */}
            <div className="space-y-12">
              {sitemapSections.map((section) => (
                <div
                  key={section.title}
                  id={section.title.toLowerCase().replace(/\s+/g, "-")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {section.title}
                    </h2>
                    <span className="text-sm text-slate-400 font-medium">
                      ({section.pages.length} pages)
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.pages.map((page) => (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="group flex flex-col rounded-xl border border-slate-200/60 p-4 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <span className="font-medium text-slate-800 group-hover:text-blue-600 transition">
                          {page.name}
                        </span>
                        <span className="text-sm text-slate-500 mt-1">
                          {page.description}
                        </span>
                        <span className="text-xs text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition">
                          Go to page →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* SEO Note */}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  About This Sitemap
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  This sitemap is designed to help you find exactly what you're looking
                  for on FINAIW. If you can't find what you need, please visit our{" "}
                  <Link to="/help" className="text-blue-600 hover:underline">
                    Help Center
                  </Link>{" "}
                  or{" "}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    Contact Us
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Structured Data Notice */}
            <div className="mt-6 text-xs text-slate-400 border-t border-slate-200 pt-4">
              <p>
                This sitemap is also available in machine‑readable format for search
                engines and crawlers at <code className="text-slate-500">/sitemap.xml</code>.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}