import { getProfile } from "@/store/profileStore";
import { analyzeEmergencyFund } from "./emergencyFundAnalyzer";

export function buildEmergencyFund(monthlyExpenses) {
  const fund = getProfile().emergencyFund;

  const analysis = analyzeEmergencyFund(
    Number(fund.current ?? 0),
    monthlyExpenses
  );

  return {
    data: {
      current: Number(fund.current ?? 0),
      required: analysis.requiredFund,
      monthsCovered: analysis.monthsCovered,
    },

    score: {
      value:
        analysis.level === "excellent"
          ? 100
          : analysis.level === "good"
          ? 70
          : analysis.level === "average"
          ? 40
          : 10,

      level: analysis.level,
    },

    insights: [],

    recommendations: [],

    alerts: [],
  };
}