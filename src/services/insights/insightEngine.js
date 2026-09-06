export function getInsights(workspace) {
  const insights = [];

  const dashboard = workspace?.dashboard || {};
const goals = workspace?.goals || [];

  // Monthly Investment
  if (!dashboard.monthlyInvestment) {
    insights.push({
  id: "investment",
  type: "warning",
  title: "Start Investing",
  message:
    "You don't have a monthly investment yet. Even a small SIP can build long-term wealth.",
  button: "Open SIP Calculator",
  action: "/sip-calculator",
  score: 80,
});
  } else {
    insights.push({
  id: "investment",
  type: "success",
  title: "Investment Active",
  message:
    `You're investing regularly. Keep contributing consistently to benefit from compounding.`,

  button: "Review SIP",

  action: "/sip-calculator",

  score: 10,
});
  }
const retirementGoal = goals.find(
  (goal) => goal.type === "retirement"
);
const emergencyFund = dashboard.emergencyFund || {};

const emergencyProgress =
  emergencyFund.progress ??
  emergencyFund.fundedPercentage ??
  0;

const emergencyTarget =
  emergencyFund.targetAmount ?? 0;

const emergencyCurrent =
  emergencyFund.currentAmount ?? 0;

if (!retirementGoal) {
  insights.push({
    id: "retirement",
    type: "warning",
    title: "Create Your Retirement Goal",
    message:
      "Saving for retirement early gives your investments more time to grow.",
    button: "Open Goal Planner",
    action: "/goal-planner",
    score: 70,
  });
}
// Emergency Fund
if (!emergencyTarget) {
  insights.push({
    id: "emergencyFund",
    type: "warning",

    title: "Build Your Emergency Fund",

    message:
      "Create an emergency fund before taking on additional financial risk.",

    button: "Open Emergency Fund",

    action: "/emergency-fund-calculator",

    score: 90,
  });
} else if (emergencyProgress < 100) {
  insights.push({
    id: "emergencyFund",
    type: "warning",

    title: "Complete Emergency Fund",

    message: `You're ${Math.round(
      emergencyProgress
    )}% funded. ₹${(
      emergencyTarget - emergencyCurrent
    ).toLocaleString()} remaining.`,

    button: "Continue",

    action: "/emergency-fund-calculator",

    score: 85,
  });
} else {
  insights.push({
    id: "emergencyFund",
    type: "success",

    title: "Emergency Fund Complete",

    message:
      "Great! Your emergency fund is fully funded and protecting your finances.",

    button: "View Emergency Fund",

    action: "/emergency-fund-calculator",

    score: 15,
  });
}
  // Net Worth
  if (!dashboard.netWorth) {
    insights.push({
  id: "networth",
  type: "info",
  title: "Calculate Net Worth",
  message:
    "Track your assets and liabilities to understand your financial position.",
  button: "Open Net Worth",
  action: "/networth-calculator",
  score: 100,
});
  } else {
    insights.push({
  id: "networth",
  type: "success",
  title: "Net Worth Recorded",
  message:
    "Great! Your net worth is now being tracked inside your Workspace.",

  button: "View Net Worth",

  action: "/networth-calculator",

  score: 5,
});
  }

 

  return insights.sort(
  (a, b) => (b.score ?? 0) - (a.score ?? 0)
);
}