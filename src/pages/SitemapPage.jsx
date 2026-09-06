import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { Home, Calculator, Wrench, BookOpen, Scale, ArrowRight, Map } from "lucide-react";

const sitemapSections = [
  {
    title: "Home & About",
    icon: Home,
    pages: [
      { name: "Home", path: "/", description: "Main landing page" },
      { name: "About Us", path: "/about", description: "Learn about FINAIW" },
      { name: "Contact Us", path: "/contact", description: "Get in touch" },
      { name: "Help Center", path: "/help", description: "FAQs and support" },
      { name: "Feedback", path: "/feedback", description: "Share your thoughts" },
      { name: "Settings", path: "/settings", description: "Preferences and data controls" },
    ],
  },
  {
    title: "Calculators",
    icon: Calculator,
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
      { name: "Emergency Fund Calculator", path: "/emergency-fund-calculator", description: "Plan your safety net" },
      { name: "Wealth Age Calculator", path: "/wealth-age-calculator", description: "Compare your financial age to your real age" },
      { name: "Retirement Calculator", path: "/retirement-calculator", description: "Plan retirement wealth" },
      { name: "Annual Retirement Income", path: "/annual-retirement-income", description: "Calculate retirement income" },
      { name: "Retirement Investment Tracker", path: "/retirement-investment-tracker", description: "Track retirement investments" },
      { name: "FIRE Calculator", path: "/fire-calculator", description: "Financial Independence, Retire Early" },
      { name: "Goal Planner", path: "/goal-planner", description: "Plan with asset allocation" },
    ],
  },
  {
    title: "Verdicts",
    icon: Scale,
    pages: [
      { name: "All Verdicts", path: "/verdict", description: "Browse all verdict tools" },
      { name: "Rent vs Buy", path: "/verdict/rent-vs-buy", description: "Should you rent or buy a home" },
      { name: "Debt vs Invest", path: "/verdict/debt-vs-invest", description: "Pay off debt or invest first" },
      { name: "Lease vs Buy a Car", path: "/verdict/lease-vs-buy-car", description: "Compare leasing vs buying a car" },
      { name: "Do You Need Insurance", path: "/verdict/insurance-need", description: "Check if you need life insurance" },
    ],
  },
  {
    title: "Tools & Resources",
    icon: Wrench,
    pages: [
      { name: "All Tools", path: "/tools", description: "Browse all tools" },
      { name: "Goals", path: "/goals", description: "Track your savings goals" },
      { name: "Financial Profile", path: "/financial-profile", description: "Update your financial profile" },
      { name: "Insights", path: "/insights", description: "Personalized financial insights" },
      { name: "Home Buying Journey", path: "/journeys/home-buying", description: "Step-by-step home buying guide" },
    ],
  },
  {
    title: "Learning Center",
    icon: BookOpen,
    pages: [
      { name: "Learn", path: "/learn", description: "Daily financial lessons" },
      { name: "News", path: "/news", description: "Latest financial news" },
      { name: "Quizzes", path: "/quizzes", description: "Test your financial knowledge" },
    ],
  },
  {
    title: "Legal",
    icon: Scale,
    pages: [
      { name: "Privacy Policy", path: "/privacy-policy", description: "How we protect your data" },
      { name: "Disclaimer", path: "/disclaimer", description: "Legal disclaimer" },
      { name: "Terms of Service", path: "/terms-of-service", description: "Terms for using FINAIW" },
    ],
  },
];

const totalPages = sitemapSections.reduce((sum, section) => sum + section.pages.length, 0);

export default function SitemapPage() {
  return (
    <>
      <Seo
        title="Sitemap"
        description="Explore the complete sitemap of FINAIW. Find all calculators, tools, resources, and legal pages in one place."
        path="/sitemap"
        keywords="sitemap, FINAIW, site navigation, financial calculators, tools"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Sitemap - FINAIW",
          description: "Complete sitemap of FINAIW showing all available pages.",
          url: "https://finaiw.com/sitemap",
        }}
      />

      <div className="min-h-screen bg-[#fbfdfc]">
        <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            {/* Header */}
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
                <Map size={13} /> FINAIW Sitemap
              </span>
              <h1 className="mx-auto mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[42px]">
                Site navigation
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-7 text-slate-500">
                Explore all pages on FINAIW — from calculators and tools to learning resources and
                legal information.
              </p>
              <p className="mt-2 text-[13px] font-semibold text-slate-400">
                {totalPages} pages across {sitemapSections.length} categories
              </p>
            </div>

            {/* Quick Links */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {sitemapSections.map((section) => {
                const Icon = section.icon;
                return (
                  <a
                    key={section.title}
                    href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-[13px] font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    <Icon size={14} className="text-emerald-700" />
                    {section.title}
                  </a>
                );
              })}
            </div>

            {/* Sitemap Sections */}
            <div className="space-y-12">
              {sitemapSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} id={section.title.toLowerCase().replace(/\s+/g, "-")}>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <Icon size={18} />
                      </span>
                      <h2 className="text-[20px] font-black text-slate-950">{section.title}</h2>
                      <span className="text-[13px] font-semibold text-slate-400">
                        ({section.pages.length} pages)
                      </span>
                    </div>
                    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      {section.pages.map((page) => (
                        <Link
                          key={page.path}
                          to={page.path}
                          className="group flex flex-col rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:shadow-[0_14px_35px_rgba(15,23,42,.06)]"
                        >
                          <span className="text-[14px] font-bold text-slate-800 transition group-hover:text-emerald-700">
                            {page.name}
                          </span>
                          <span className="mt-1 text-[12.5px] text-slate-500">{page.description}</span>
                          <span className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-bold text-emerald-600 opacity-0 transition group-hover:opacity-100">
                            Go to page <ArrowRight size={11} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SEO Note */}
            <div className="mt-12 border-t border-slate-100 pt-8">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                <h3 className="text-[13px] font-black text-slate-700">About This Sitemap</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-slate-500">
                  This sitemap is designed to help you find exactly what you're looking for on
                  FINAIW. If you can't find what you need, please visit our{" "}
                  <Link to="/help" className="font-semibold text-emerald-700 hover:underline">
                    Help Center
                  </Link>{" "}
                  or{" "}
                  <Link to="/contact" className="font-semibold text-emerald-700 hover:underline">
                    Contact Us
                  </Link>
                  .
                </p>
              </div>
            </div>

            <p className="mt-6 border-t border-slate-100 pt-4 text-[12px] leading-5 text-slate-400">
              This sitemap is also available in machine-readable format for search engines and
              crawlers at <code className="text-slate-500">/sitemap.xml</code>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
