import {
  scoreNetWorth,
  scoreSavings,
  scoreEmergencyFund,
  scoreDebt,
  scoreGoals,
} from "./scoreRules";

import { getScoreLevel } from "./scoreLevels";

export function calculateFinancialScore(data) {
  const breakdown = {
    netWorth: scoreNetWorth(data.netWorth || 0),

    savings: scoreSavings(data.monthlyInvestment || 0),

    emergencyFund: scoreEmergencyFund(
      data.emergencyFundMonths || 0
    ),

    debt: scoreDebt(data.debtRatio || 100),

    goals: scoreGoals(data.goalProgress || 0),
  };

  const score = Object.values(breakdown).reduce(
    (total, value) => total + value,
    0
  );

  const level = getScoreLevel(score);

  return {
    score,

    level: level.level,

    color: level.color,

    description: level.description,

    breakdown,
  };
}