// ==========================================
// FINAIW Goal Intelligence Engine v1
// Single Source of Truth for Goal Intelligence
// ==========================================

export function buildGoalIntelligence(goal) {
  if (!goal) return null;

  const current = Number(goal.currentAmount ?? 0);
  const target = Number(goal.targetAmount ?? 0);

  const progress =
    target > 0
      ? Math.min(Math.round((current / target) * 100), 100)
      : 0;

  const amountRemaining = Math.max(target - current, 0);

  let healthLevel = "healthy";
  let healthScore = 100;
  let healthReason = "Your goal is progressing normally.";

  if (progress === 0) {
    healthLevel = "starting";
    healthScore = 20;
    healthReason = "You haven't started contributing yet.";
  } else if (progress < 25) {
    healthLevel = "building";
    healthScore = 40;
    healthReason = "Your goal has started but still needs momentum.";
  } else if (progress < 75) {
    healthLevel = "healthy";
    healthScore = 70;
    healthReason = "You're making steady progress.";
  } else if (progress < 100) {
    healthLevel = "excellent";
    healthScore = 90;
    healthReason = "You're close to achieving this goal.";
  } else {
    healthLevel = "completed";
    healthScore = 100;
    healthReason = "Goal completed successfully.";
  }

  let recommendation = {
    title: "Continue Progress",
    description: "Keep contributing toward your financial goal.",
  };

  if (progress === 0) {
    recommendation = {
      title: "Start Your Goal",
      description: "Make your first contribution to begin building momentum.",
    };
  } else if (progress >= 100) {
    recommendation = {
      title: "Create Your Next Goal",
      description: "You've completed this goal. Plan your next milestone.",
    };
  }

  return {
    progress,

    health: {
      level: healthLevel,
      score: healthScore,
      reason: healthReason,
    },

    milestone: {
      currentAmount: current,
      targetAmount: target,
      amountRemaining,
      percentageRemaining: Math.max(100 - progress, 0),
    },

    recommendation,
  };
}