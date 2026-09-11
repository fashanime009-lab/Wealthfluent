/**
 * Journey Engine
 *
 * Converts a financial goal into an execution journey.
 * This file contains business logic only.
 * No React, UI, or styling code belongs here.
 */

const MONTHS_IN_YEAR = 12;
const DAYS_IN_MONTH = 30.44;

function getMonthsRemaining(targetDate) {
  if (!targetDate) return 0;

  const today = new Date();
  const target = new Date(targetDate);

  const months =
    (target.getFullYear() - today.getFullYear()) * MONTHS_IN_YEAR +
    (target.getMonth() - today.getMonth());

  return Math.max(months, 0);
}

export function buildJourney(goal) {
  const targetAmount = Number(goal.targetAmount ?? 0);
  const currentAmount = Number(goal.currentAmount ?? 0);

  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

  const progress =
    targetAmount > 0
      ? Math.min((currentAmount / targetAmount) * 100, 100)
      : 0;

  const monthsRemaining = getMonthsRemaining(goal.targetDate);

  const monthlyTarget =
    monthsRemaining > 0
      ? remainingAmount / monthsRemaining
      : remainingAmount;

  const dailyTarget = monthlyTarget / DAYS_IN_MONTH;

  let health;

if (progress >= 80) {
  health = {
    score: 95,
    status: "Excellent",
    reason: "You're very close to achieving your goal.",
    nextAction: "Maintain your current savings strategy.",
  };
} else if (progress >= 60) {
  health = {
    score: 80,
    status: "On Track",
    reason: "You're making solid progress toward your goal.",
    nextAction: "Continue your monthly contributions.",
  };
} else if (progress >= 40) {
  health = {
    score: 60,
    status: "Moderate",
    reason: "You're progressing, but there's room for improvement.",
    nextAction: "Consider increasing your monthly savings.",
  };
} else if (progress >= 20) {
  health = {
    score: 40,
    status: "Behind",
    reason: "You're behind your target progress.",
    nextAction: "Increase your monthly investment if possible.",
  };
} else {
  health = {
    score: 20,
    status: "Critical",
    reason: "Your current pace is unlikely to reach your target.",
    nextAction: "Review your financial plan immediately.",
  };
}

const summary = {
  targetAmount,
  currentAmount,
  remainingAmount,

  progress,

  monthsRemaining,

  monthlyTarget,

  dailyTarget,
};

return {
  summary,

  health,

  milestones: [],

  tasks: [],

  timeline: [],

  recommendations: [],
};
}