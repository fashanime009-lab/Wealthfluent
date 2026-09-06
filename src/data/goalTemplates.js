// ==========================================
// FINAIW Goal Templates
// Single source of truth for every financial goal
// ==========================================

export const GOAL_TYPES = {
  BUDGET: {
    id: "budget",
    title: "Budget Basics",
    icon: "wallet",
    color: "slate",

    difficulty: "Beginner",

    estimatedTime: "5 min",

    xp: 10,

    wealthScore: 1,

    calculator: "Budget Planner",

    lesson: "Budgeting Fundamentals",
  },

  EMERGENCY: {
    id: "emergency",

    title: "Emergency Fund",

    icon: "shield",

    color: "emerald",

    difficulty: "Beginner",

    estimatedTime: "10 min",

    xp: 20,

    wealthScore: 3,

    calculator: "Emergency Fund Calculator",

    lesson: "Emergency Fund Basics",
  },

  DEBT: {
    id: "debt",

    title: "Debt Management",

    icon: "credit-card",

    color: "orange",

    difficulty: "Intermediate",

    estimatedTime: "10 min",

    xp: 25,

    wealthScore: 4,

    calculator: "Debt Payoff Calculator",

    lesson: "Good Debt vs Bad Debt",
  },

  INVESTING: {
    id: "investing",

    title: "Investing",

    icon: "trending-up",

    color: "blue",

    difficulty: "Intermediate",

    estimatedTime: "15 min",

    xp: 30,

    wealthScore: 5,

    calculator: "SIP Calculator",

    lesson: "Investing Fundamentals",
  },

  RETIREMENT: {
    id: "retirement",

    title: "Retirement Planning",

    icon: "sun",

    color: "violet",

    difficulty: "Advanced",

    estimatedTime: "20 min",

    xp: 40,

    wealthScore: 8,

    calculator: "Retirement Planner",

    lesson: "Retirement Planning Guide",
  },

  FIRE: {
    id: "fire",

    title: "Financial Independence",

    icon: "flame",

    color: "red",

    difficulty: "Advanced",

    estimatedTime: "25 min",

    xp: 50,

    wealthScore: 10,

    calculator: "FIRE Calculator",

    lesson: "Financial Independence",
  },
};