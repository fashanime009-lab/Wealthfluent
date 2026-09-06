import { LESSONS } from "./lessons";

// A flat, searchable index of every real page on FINAIW. Kept as a plain
// data file (not derived from any one page's private list) so the search
// modal doesn't depend on the internal structure of CalculatorsPage or any
// other single page.
export const searchIndex = [
  // Core pages
  { title: "Home", description: "FINAIW homepage", path: "/", category: "Page" },
  { title: "About Us", description: "Learn about FINAIW", path: "/about", category: "Page" },
  { title: "Contact Us", description: "Get in touch with FINAIW", path: "/contact", category: "Page" },
  { title: "Help Center", description: "FAQs and support", path: "/help", category: "Page" },
  { title: "Feedback", description: "Share suggestions, bugs, or feature requests", path: "/feedback", category: "Page" },
  { title: "Settings", description: "Currency, theme, and privacy & data controls", path: "/settings", category: "Page" },
  { title: "Sitemap", description: "Every page on FINAIW in one place", path: "/sitemap", category: "Page" },

  // Calculators
  { title: "All Calculators", description: "Browse every financial calculator", path: "/calculators", category: "Calculator" },
  { title: "SIP Calculator", description: "Estimate mutual fund SIP returns", path: "/sip-calculator", category: "Calculator" },
  { title: "Goal SIP Calculator", description: "Find the monthly SIP needed for your goal", path: "/goal-sip", category: "Calculator" },
  { title: "EMI Calculator", description: "Calculate monthly loan payments", path: "/emi-calculator", category: "Calculator" },
  { title: "FD Calculator", description: "Estimate fixed deposit maturity value", path: "/fd-calculator", category: "Calculator" },
  { title: "CAGR Calculator", description: "Measure compound annual growth rate", path: "/cagr-calculator", category: "Calculator" },
  { title: "GST Calculator", description: "Add or remove GST from an amount", path: "/gst-calculator", category: "Calculator" },
  { title: "Inflation Calculator", description: "See how inflation affects your money", path: "/inflation-calculator", category: "Calculator" },
  { title: "Future Value Calculator", description: "Project compound interest growth", path: "/future-value-calculator", category: "Calculator" },
  { title: "Rate of Return Calculator", description: "Calculate annualized returns", path: "/rate-of-return-calculator", category: "Calculator" },
  { title: "Bond Yield Calculator", description: "Calculate current yield and YTM", path: "/bond-yield-calculator", category: "Calculator" },
  { title: "Net Worth Calculator", description: "Track your assets and liabilities", path: "/networth-calculator", category: "Calculator" },
  { title: "Emergency Fund Calculator", description: "Plan your financial safety net", path: "/emergency-fund-calculator", category: "Calculator" },
  { title: "Wealth Age Calculator", description: "Compare your financial age to your real age", path: "/wealth-age-calculator", category: "Calculator" },
  { title: "Retirement Calculator", description: "Plan your retirement corpus", path: "/retirement-calculator", category: "Calculator" },
  { title: "Annual Retirement Income", description: "Estimate sustainable retirement income", path: "/annual-retirement-income", category: "Calculator" },
  { title: "Retirement Investment Tracker", description: "Track investments toward retirement", path: "/retirement-investment-tracker", category: "Calculator" },
  { title: "FIRE Calculator", description: "Financial Independence, Retire Early", path: "/fire-calculator", category: "Calculator" },
  { title: "Goal Planner", description: "Plan a goal with custom asset allocation", path: "/goal-planner", category: "Calculator" },

  // Verdicts
  { title: "All Verdicts", description: "Browse every verdict tool", path: "/verdict", category: "Verdict" },
  { title: "Rent vs Buy", description: "Should you rent or buy a home", path: "/verdict/rent-vs-buy", category: "Verdict" },
  { title: "Debt vs Invest", description: "Pay off debt or invest first", path: "/verdict/debt-vs-invest", category: "Verdict" },
  { title: "Lease vs Buy a Car", description: "Compare leasing vs buying a car", path: "/verdict/lease-vs-buy-car", category: "Verdict" },
  { title: "Do You Need Insurance", description: "Check if you need life insurance", path: "/verdict/insurance-need", category: "Verdict" },

  // Tools
  { title: "All Tools", description: "Browse all tools", path: "/tools", category: "Tool" },
  { title: "Goals", description: "Track your savings goals", path: "/goals", category: "Tool" },
  { title: "Financial Profile", description: "Update your financial profile", path: "/financial-profile", category: "Tool" },
  { title: "Insights", description: "Personalized financial insights", path: "/insights", category: "Tool" },
  { title: "Home Buying Journey", description: "Step-by-step home buying guide", path: "/journeys/home-buying", category: "Tool" },

  // Learning
  { title: "Learn", description: "Daily financial lessons", path: "/learn", category: "Learn" },
  { title: "News", description: "Latest financial news", path: "/news", category: "Learn" },
  { title: "Quizzes", description: "Test your financial knowledge", path: "/quizzes", category: "Learn" },

  // Legal
  { title: "Privacy Policy", description: "How FINAIW protects your data", path: "/privacy-policy", category: "Page" },
  { title: "Disclaimer", description: "Legal disclaimer", path: "/disclaimer", category: "Page" },
  { title: "Terms of Service", description: "Terms for using FINAIW", path: "/terms-of-service", category: "Page" },

  // Individual lessons — pulled in automatically so new lessons are
  // searchable without touching this file again.
  ...LESSONS.map((lesson) => ({
    title: lesson.title,
    description: lesson.summary,
    path: `/learn/${lesson.slug}`,
    category: "Lesson",
  })),
];
