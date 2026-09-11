import { getProfile } from "@/store/profileStore";

export function buildIncome() {
  const income = getProfile().income;

  const total =
    income.salary +
    income.freelance +
    income.business +
    income.rental +
    income.dividends +
    income.interest +
    income.other;

  return {
    data: {
      ...income,
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