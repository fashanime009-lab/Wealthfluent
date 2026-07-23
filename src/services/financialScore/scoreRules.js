export const SCORE_RULES = {
  netWorth: {
    maxPoints: 20,
  },

  savings: {
    maxPoints: 20,
  },

  emergencyFund: {
    maxPoints: 20,
  },

  debt: {
    maxPoints: 20,
  },

  goals: {
    maxPoints: 20,
  },
};
export function scoreNetWorth(netWorth) {
  return netWorth > 0 ? 25 : 0;
}
export function scoreSavings(monthlyInvestment) {
  return monthlyInvestment > 0 ? 25 : 0;
}
export function scoreEmergencyFund(monthsCovered) {
  if (monthsCovered >= 12) return 20;
  if (monthsCovered >= 6) return 18;
  if (monthsCovered >= 3) return 12;
  if (monthsCovered >= 1) return 6;

  return 0;
}
export function scoreDebt(debtRatio) {
  if (debtRatio <= 10) return 20;
  if (debtRatio <= 20) return 18;
  if (debtRatio <= 35) return 15;
  if (debtRatio <= 50) return 10;
  if (debtRatio <= 70) return 5;

  return 0;
}
export function scoreGoals(progress) {
  if (progress >= 100) return 20;
  if (progress >= 75) return 18;
  if (progress >= 50) return 15;
  if (progress >= 25) return 10;
  if (progress > 0) return 5;

  return 0;
}