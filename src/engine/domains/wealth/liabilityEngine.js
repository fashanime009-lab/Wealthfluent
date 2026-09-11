import { getProfile } from "@/store/profileStore";

export function buildLiabilities() {
  const liabilities = getProfile().liabilities;

  const total =
    liabilities.homeLoan +
    liabilities.personalLoan +
    liabilities.vehicleLoan +
    liabilities.educationLoan +
    liabilities.creditCard +
    liabilities.other;

  return {
    data: {
      ...liabilities,
      total,
    },

    insights: [],

    recommendations: [],

    alerts: [],

    score: null,

    metadata: {
      lastUpdated: null,
    },
  };
}