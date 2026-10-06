// Metadata for the homepage Smart Tool Finder — one entry per calculator
// and verdict tool. `keywords` are real phrases and synonyms a visitor
// might actually type, hand-written rather than derived from the title,
// so matching works on intent ("should I pay off my loan or invest")
// and not just exact tool names. Matching itself (src/utils/toolFinder.js)
// runs entirely client-side — this file and that logic are the whole
// "AI" here, no network call and nothing typed is ever stored.
export const TOOL_FINDER_INDEX = [
  // Loan & Interest
  {
    title: "EMI Calculator",
    description: "Monthly payments for a home, car, or personal loan.",
    category: "loan",
    route: "/emi-calculator",
    keywords: ["emi", "loan payment", "monthly payment", "home loan", "car loan", "personal loan", "mortgage", "how much loan can i afford", "borrow"],
  },
  {
    title: "Future Value Calculator",
    description: "What a lump sum grows to with compound interest.",
    category: "loan",
    route: "/future-value-calculator",
    keywords: ["future value", "lump sum", "compound interest", "grow money", "one time investment"],
  },
  {
    title: "Rate of Return Calculator",
    description: "The annualized return between two values.",
    category: "loan",
    route: "/rate-of-return-calculator",
    keywords: ["rate of return", "annualized return", "what return did i get", "investment performance", "roi"],
  },
  {
    title: "Bond Yield Calculator",
    description: "Current yield and yield to maturity on a bond.",
    category: "loan",
    route: "/bond-yield-calculator",
    keywords: ["bond yield", "bond", "yield to maturity", "ytm", "coupon"],
  },
  {
    title: "Fixed Deposit Calculator",
    description: "Maturity value and interest earned on an FD.",
    category: "loan",
    route: "/fd-calculator",
    keywords: ["fd", "fixed deposit", "fd maturity", "term deposit", "safe savings", "bank deposit interest"],
  },
  {
    title: "GST Calculator",
    description: "GST on a purchase or invoice, India.",
    category: "loan",
    route: "/gst-calculator",
    keywords: ["gst", "tax on invoice", "add gst", "remove gst", "invoice tax"],
  },

  // Investment Planning
  {
    title: "SIP Calculator",
    description: "What a recurring monthly investment grows to.",
    category: "investment",
    route: "/sip-calculator",
    keywords: ["sip", "monthly investment", "mutual fund", "recurring investment", "invest every month", "systematic investment"],
  },
  {
    title: "Goal Investment Calculator",
    description: "The monthly SIP needed to hit a target amount.",
    category: "investment",
    route: "/goal-sip",
    keywords: ["goal sip", "how much should i invest for a goal", "target amount", "save for a specific amount"],
  },
  {
    title: "Inflation Calculator",
    description: "What today's money will cost you later.",
    category: "investment",
    route: "/inflation-calculator",
    keywords: ["inflation", "future cost", "purchasing power", "what will things cost", "money worth less"],
  },
  {
    title: "CAGR Calculator",
    description: "The compound annual growth rate between two values.",
    category: "investment",
    route: "/cagr-calculator",
    keywords: ["cagr", "growth rate", "compound annual growth", "annual growth between two values"],
  },

  // Retirement Planning
  {
    title: "Retirement Calculator",
    description: "The corpus a monthly investment builds by retirement.",
    category: "retirement",
    route: "/retirement-calculator",
    keywords: ["retirement", "retirement corpus", "how much do i need to retire", "retirement planning", "pension"],
  },
  {
    title: "FIRE Calculator",
    description: "The number you need to retire early, at 25x expenses.",
    category: "retirement",
    route: "/fire-calculator",
    keywords: ["fire", "financial independence", "retire early", "fire number", "25x expenses"],
  },
  {
    title: "Annual Retirement Income Calculator",
    description: "Sustainable yearly income from a retirement corpus.",
    category: "retirement",
    route: "/annual-retirement-income",
    keywords: ["retirement income", "yearly income from savings", "4% rule", "how much can i withdraw"],
  },
  {
    title: "Retirement Investment Tracker",
    description: "Track retirement investments year by year, in one place.",
    category: "retirement",
    route: "/retirement-investment-tracker",
    keywords: ["track retirement", "retirement tracker", "retirement portfolio", "401k tracker", "pension tracker"],
  },

  // Wealth & Goals
  {
    title: "Net Worth Calculator",
    description: "Assets minus liabilities — your real net worth.",
    category: "wealth",
    route: "/networth-calculator",
    keywords: ["net worth", "what am i worth", "assets and liabilities", "how much am i worth"],
  },
  {
    title: "Goal Planner",
    description: "A savings plan for a target amount with variable allocation.",
    category: "wealth",
    route: "/goal-planner",
    keywords: ["goal planner", "savings plan", "plan a goal", "save for a house", "save for a wedding", "big purchase plan"],
  },
  {
    title: "Emergency Fund Calculator",
    description: "The safety net you need for unexpected expenses.",
    category: "wealth",
    route: "/emergency-fund-calculator",
    keywords: ["emergency fund", "safety net", "how much should i save for emergencies", "rainy day fund"],
  },
  {
    title: "Wealth Age Calculator",
    description: "How your net worth and savings rate compare to your age.",
    category: "wealth",
    route: "/wealth-age-calculator",
    keywords: ["wealth age", "am i on track financially", "compare net worth to age", "financial age"],
  },

  // Verdicts
  {
    title: "Rent vs Buy",
    description: "Should you buy a home or keep renting and invest the difference?",
    category: "verdict",
    route: "/verdict/rent-vs-buy",
    keywords: ["rent or buy", "rent vs buy", "should i buy a home", "buying a home", "renting vs owning"],
  },
  {
    title: "Pay Off Debt vs Invest",
    description: "Extra cash each month — debt or the market? Simulated for your real numbers.",
    category: "verdict",
    route: "/verdict/debt-vs-invest",
    keywords: ["pay off debt or invest", "debt vs invest", "should i pay off my loan or invest", "extra emi or invest", "clear debt or invest", "debt vs saving"],
  },
  {
    title: "Lease vs Buy a Car",
    description: "The lower lease payment is obvious. What it costs long-term isn't.",
    category: "verdict",
    route: "/verdict/lease-vs-buy-car",
    keywords: ["lease or buy a car", "lease vs buy car", "should i lease a car", "car lease", "buying a car"],
  },
  {
    title: "Do You Need Insurance",
    description: "Check if you need life insurance, and how much term cover actually makes sense.",
    category: "verdict",
    route: "/verdict/insurance-need",
    keywords: ["do i need insurance", "life insurance", "term insurance", "how much insurance do i need", "insurance need"],
  },
];
