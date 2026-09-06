import { buildIncome } from "./incomeEngine";
import { buildExpenses } from "./expenseEngine";
import { calculateSavingsRate } from "./analyzers/savingsRateAnalyzer";
import { calculateMonthlySurplus } from "./analyzers/monthlySurplusAnalyzer";
import { buildCashflowScore } from "./scoring/cashflowScore";
import { buildCashflowRecommendations } from "./recommendations/recommendationEngine";
import { buildCashflowAlerts } from "./alerts/alertEngine";

export function buildCashflow() {
  const income = buildIncome();

  const expenses = buildExpenses();

  const monthlyIncome = income.data.total;

  const monthlyExpenses = expenses.data.total;

const monthlySurplus = calculateMonthlySurplus(
  monthlyIncome,
  monthlyExpenses
);

  const savingsRate = calculateSavingsRate(
  monthlyIncome,
  monthlyExpenses
);
const score = buildCashflowScore({
  savingsRate: savingsRate.percentage,
  monthlySurplus: monthlySurplus.amount,
});

const recommendations = buildCashflowRecommendations({
  savingsRate: savingsRate.percentage,
  monthlySurplus: monthlySurplus.amount,
});

const alerts = buildCashflowAlerts({
  monthlySurplus: monthlySurplus.amount,
});

  return {
    data: {
      monthlyIncome,
      monthlyExpenses,
      monthlySurplus: monthlySurplus.amount,
      savingsRate: savingsRate.percentage,
cashflowStatus: savingsRate.status,
    },

    income,

    expenses,

    insights: [],

    recommendations,

    alerts,

    score,

    metadata: {
      version: "1.0",
    },
  };
}