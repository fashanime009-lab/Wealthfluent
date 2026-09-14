import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";

const sitemapSections = [
  {
    title: "Home & About",
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
    pages: [
      { name: "All Tools", path: "/tools", description: "Browse all tools" },
      { name: "Goals", path: "/goals", description: "Track your savings goals" },
      { name: "Financial Profile", path: "/financial-profile", description: "Update your financial profile" },
      { name: "Insights", path: "/insights", description: "Personalized financial insights" },
    ],
  },
  {
    title: "Learning Center",
    pages: [
      { name: "Learn", path: "/learn", description: "Daily financial lessons" },
      { name: "News", path: "/news", description: "Latest financial news" },
      { name: "Quizzes", path: "/quizzes", description: "Test your financial knowledge" },
    ],
  },
  {
    title: "Legal",
    pages: [
      { name: "Privacy Policy", path: "/privacy-policy", description: "How we protect your data" },
      { name: "Disclaimer", path: "/disclaimer", description: "Legal disclaimer" },
      { name: "Terms of Service", path: "/terms-of-service", description: "Terms for using FINAIW" },
    ],
  },
];

const totalPages = sitemapSections.reduce((sum, section) => sum + section.pages.length, 0);

// A real slugify, not just a whitespace swap — "Tools & Resources" and
// "Home & About" both contain "&", which produced ids like
// "tools-&-resources". That's a valid HTML id, but not a valid unescaped
// CSS selector, and document.querySelector() in ScrollToTop.jsx throws a
// SyntaxError on it — an uncaught error there crashes the whole React
// tree, so clicking either of these quick-links blanked the entire page.
const sectionAnchor = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function SitemapPage() {
  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
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

      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Sitemap</span>
        <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
          Site navigation
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Explore all pages on FINAIW — from calculators and tools to learning resources and legal
          information.
        </p>
        <p className="font-mono-tech mt-2 text-[12.5px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
          {totalPages} pages across {sitemapSections.length} categories
        </p>

        {/* Quick links — plain text tabs, not pills */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
          {sitemapSections.map((section) => (
            <a
              key={section.title}
              href={`#${sectionAnchor(section.title)}`}
              className="text-[14px] font-semibold text-[#111814]/40 transition hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
            >
              {section.title}
            </a>
          ))}
        </div>

        {/* Sitemap sections — a dense list, not a card grid */}
        <div className="mt-4">
          {sitemapSections.map((section) => (
            <div
              key={section.title}
              id={sectionAnchor(section.title)}
              className="scroll-mt-24 border-b border-[#111814]/10 last:border-b-0 dark:border-[#eef1ec]/10"
            >
              <h2 className="pt-8 text-[13px] font-semibold text-[#111814]/45 dark:text-[#eef1ec]/45">
                {section.title} ({section.pages.length})
              </h2>
              <div className="divide-y divide-[#111814]/8 dark:divide-[#eef1ec]/8">
                {section.pages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="flex items-baseline justify-between gap-6 py-4 transition-opacity hover:opacity-70"
                  >
                    <span className="min-w-0 flex-shrink-0 text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">
                      {page.name}
                    </span>
                    <span className="min-w-0 truncate text-right text-[12.5px] text-[#111814]/50 dark:text-[#eef1ec]/50">
                      {page.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Help note */}
        <p className="mt-10 max-w-[68ch] text-[13.5px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
          If you can't find what you need, please visit our{" "}
          <Link
            to="/help"
            className="font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
          >
            Help Center
          </Link>{" "}
          or{" "}
          <Link
            to="/contact"
            className="font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
          >
            Contact Us
          </Link>
          .
        </p>

        <p className="mt-4 max-w-[68ch] text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
          This sitemap is also available in machine-readable format for search engines and crawlers
          at <code className="text-[#111814]/60 dark:text-[#eef1ec]/60">/sitemap.xml</code>.
        </p>
      </div>
    </div>
  );
}
