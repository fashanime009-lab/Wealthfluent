import { getProfile } from "@/store/profileStore";

export function buildExpenses() {
 const expenses = getProfile().expenses;

  const total =
    expenses.housing +
    expenses.food +
    expenses.transport +
    expenses.utilities +
    expenses.healthcare +
    expenses.insurance +
    expenses.education +
    expenses.entertainment +
    expenses.shopping +
    expenses.emi +
    expenses.subscriptions +
    expenses.other;

  return {
    data: {
      ...expenses,
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