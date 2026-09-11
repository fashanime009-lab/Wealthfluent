// ======================================================
// FINAIW Financial Profile Engine
// Single Source of Truth for the user's financial profile
// ======================================================

import { getGoals } from "../services/goalEngine";
import { buildCashflow } from "./domains/cashflow";
import { buildWealth } from "./domains/wealth";
import { buildEmergencyFund } from "@/engine/domains/emergencyFund";

export function buildFinancialCore() {
  const goals = getGoals();
    const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);
    const cashflow = buildCashflow();
    const emergencyFund = buildEmergencyFund(
  cashflow.data.monthlyExpenses
);
  const wealth = buildWealth();
  const totalAssets = wealth?.data?.totalAssets ?? 0;

const assetData = wealth.assets.data;

const allocation =
  totalAssets > 0
    ? {
        cash: Math.round(((assetData.cash ?? 0) / totalAssets) * 100),
        savings: Math.round(((assetData.savings ?? 0) / totalAssets) * 100),
        investments: Math.round(((assetData.investments ?? 0) / totalAssets) * 100),
        retirement: Math.round(((assetData.retirement ?? 0) / totalAssets) * 100),
        property: Math.round(((assetData.property ?? 0) / totalAssets) * 100),
        vehicle: Math.round(((assetData.vehicle ?? 0) / totalAssets) * 100),
        business: Math.round(((assetData.business ?? 0) / totalAssets) * 100),
        other: Math.round(((assetData.other ?? 0) / totalAssets) * 100),
      }
    : null;
   const snapshot = {
  netWorth: wealth?.data?.netWorth ?? null,
  cashFlow: cashflow?.data?.monthlySurplus ?? null,

  emergencyFund: {
    current: emergencyFund.data.current,
    required: emergencyFund.data.required,
    monthsCovered: emergencyFund.data.monthsCovered,
  },

  allocation,
};



    const cashflowScore = cashflow.score ?? {};
  const wealthScore = wealth.score ?? {};

  const goalValue =
    goals.length === 0
      ? 0
      : Math.round((completedGoals.length / goals.length) * 100);

  const goalLevel =
    goalValue >= 80
      ? "excellent"
      : goalValue >= 60
      ? "good"
      : goalValue >= 40
      ? "fair"
      : "poor";

  const goalScore = {
    value: goalValue,
    level: goalLevel,
  };

  const overall = Math.round(
    (
      (cashflowScore.value ?? 0) +
      (wealthScore.value ?? 0) +
      goalScore.value
    ) / 3
  );

  const categories = [
    {
      key: "cashflow",
      title: "Cash Flow",
      score: cashflowScore.value ?? 0,
      status: cashflowScore.level ?? "unknown",
      action: "Review Cash Flow",
      diagnosis:
        "Improving your monthly surplus will have the biggest impact on your financial health.",
    },
    {
      key: "wealth",
      title: "Wealth",
      score: wealthScore.value ?? 0,
      status: wealthScore.level ?? "unknown",
      action: "Review Net Worth",
      diagnosis:
        "Growing your assets will strengthen your long-term financial position.",
    },
    {
      key: "goals",
      title: "Goals",
      score: goalScore.value,
      status: goalScore.level,
      action: "Review Goals",
      diagnosis:
        "Keeping your goals updated helps your financial plan stay on track.",
    },
  ];

  const weakest = [...categories].sort((a, b) => a.score - b.score)[0];

  const health = {
    overall,

    headline:
      overall >= 80
        ? "Excellent Financial Health"
        : overall >= 60
        ? "Good Financial Health"
        : overall >= 40
        ? "Needs Improvement"
        : "Needs Immediate Attention",

    weakestCategory: weakest.title,

    diagnosis: weakest.diagnosis,

    recommendedAction: weakest.action,

    rows: categories,
  };



  // ------------------------------------------------------
  // GOAL SUMMARY
  // ------------------------------------------------------

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount ?? 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount ?? 0),
    0
  );

  const completionRate =
    totalTarget > 0
      ? Math.round((totalSaved / totalTarget) * 100)
      : 0;

  return {
    
    coreVersion: "1.0",

    goals: {
      total: goals.length,

      active: activeGoals.length,

      completed: completedGoals.length,

      totalTarget,

      totalSaved,

      completionRate,
    },

    cashflow,

    wealth,

    emergencyFund,

    snapshot,

    health,
  };
  
}