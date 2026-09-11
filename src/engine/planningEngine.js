// ==========================================
// FINAIW Planning Engine v1
// ==========================================

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const DEFAULT_MILESTONES = [25, 50, 75, 100];

function buildTargets(remainingAmount, monthsRemaining) {
  const monthlySavings =
    monthsRemaining
      ? Math.ceil(remainingAmount / monthsRemaining)
      : null;

  const weeklySavings =
    monthlySavings !== null
      ? Math.ceil(monthlySavings / 4.345)
      : null;

  const dailySavings =
    monthlySavings !== null
      ? Math.ceil(monthlySavings / 30)
      : null;

  return {
    monthlySavings,
    weeklySavings,
    dailySavings,
  };
}

function buildMilestones(
  targetAmount,
  currentAmount
) {
  return DEFAULT_MILESTONES.map((percent) => {
    const milestoneAmount = Math.round(
      (targetAmount * percent) / 100
    );

    return {
      id: percent,

      title:
        percent === 100
          ? "Goal Complete"
          : `${percent}% Complete`,

      percent,

      targetAmount: milestoneAmount,

      achieved:
        currentAmount >= milestoneAmount,

      remaining: Math.max(
        milestoneAmount - currentAmount,
        0
      ),
    };
  });
}

function buildTimeline(
  goal,
  today,
  targetDate,
  daysRemaining,
  monthsRemaining
) {
  return {
    startDate: goal.createdAt
      ? new Date(goal.createdAt)
      : today,

    targetDate,

    estimatedCompletion: targetDate,

    daysRemaining,

    monthsRemaining,

    yearsRemaining:
      monthsRemaining !== null
        ? Number((monthsRemaining / 12).toFixed(1))
        : null,
  };
}

function buildRisks({
  targetDate,
  progress,
  monthsRemaining,
  currentAmount,
  targetAmount,
}) {
  const risks = [];

  if (!targetDate) {
    risks.push({
      id: "missing-target-date",
      severity: "warning",
      title: "No Target Date",
      description:
        "Set a target date to generate an accurate financial plan.",
      recommendation:
        "Choose a realistic completion date for this goal.",
    });
  }

  if (progress === 0) {
    risks.push({
      id: "no-progress",
      severity: "warning",
      title: "No Progress Yet",
      description:
        "You haven't started saving toward this goal.",
      recommendation:
        "Make your first contribution to begin building momentum.",
    });
  }

  if (
    monthsRemaining !== null &&
    monthsRemaining <= 3 &&
    progress < 100
  ) {
    risks.push({
      id: "deadline-near",
      severity: "high",
      title: "Deadline Approaching",
      description:
        "Your target date is less than 3 months away.",
      recommendation:
        "Increase monthly savings or extend the target date.",
    });
  }

  if (currentAmount > targetAmount) {
    risks.push({
      id: "goal-exceeded",
      severity: "info",
      title: "Goal Exceeded",
      description:
        "You've already saved more than your original target.",
      recommendation:
        "Consider increasing your goal or creating a new one.",
    });
  }

  return risks;
}

function buildForecast({
  goal,
  currentAmount,
  targetAmount,
  remainingAmount,
  monthsRemaining,
}) {
  const requiredMonthlySavings =
    monthsRemaining !== null
      ? Math.ceil(remainingAmount / monthsRemaining)
      : null;

const goalAgeMonths = goal.createdAt
  ? Math.max(
      Math.ceil(
        (Date.now() - new Date(goal.createdAt).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      ),
      1
    )
  : 1;

const currentMonthlySavings =
  Math.ceil(currentAmount / goalAgeMonths);

const monthsToComplete =
  currentMonthlySavings > 0
    ? Math.ceil(remainingAmount / currentMonthlySavings)
    : null;

 const estimatedCompletionDate =
  monthsToComplete !== null
    ? new Date(
        new Date().setMonth(
          new Date().getMonth() + monthsToComplete
        )
      )
    : null;

 const monthsAheadOrBehind =
  estimatedCompletionDate && goal.targetDate
    ? Math.ceil(
        (estimatedCompletionDate -
          new Date(goal.targetDate)) /
          (1000 * 60 * 60 * 24 * 30)
      )
    : null;

let status = "unknown";

if (currentAmount >= targetAmount) {
  status = "completed";
} else if (monthsAheadOrBehind !== null) {
  if (monthsAheadOrBehind <= -1) {
    status = "ahead";
  } else if (monthsAheadOrBehind === 0) {
    status = "on-track";
  } else {
    status = "behind";
  }
}

  return {
    requiredMonthlySavings,

    currentMonthlySavings,

    estimatedCompletionDate,

    monthsAheadOrBehind,

    status,

    
  };


}

function buildRecommendations({
  forecast,
}) {
  const recommendations = [];

  if (forecast.status === "behind") {
    recommendations.push({
      id: "increase-savings",
      type: "action",
      title: "Increase Monthly Savings",
      description:
        "Your current saving pace may not be enough to reach your goal on time.",
    });
  }

  if (forecast.status === "ahead") {
    recommendations.push({
      id: "great-progress",
      type: "success",
      title: "You're Ahead",
      description:
        "You're currently saving faster than required. Keep the momentum going.",
    });
  }

  if (forecast.status === "on-track") {
    recommendations.push({
      id: "stay-consistent",
      type: "info",
      title: "Stay Consistent",
      description:
        "You're on track. Continue saving at your current pace.",
    });
  }

  return recommendations;
}

function buildHealth({
  progress,
  risks,
  forecast,
}) {
  let score = 100;

  // Progress contribution
  if (progress < 25) {
    score -= 25;
  } else if (progress < 50) {
    score -= 15;
  } else if (progress < 75) {
    score -= 5;
  }

  // Forecast contribution
  if (forecast.status === "behind") {
    score -= 20;
  } else if (forecast.status === "on-track") {
    score -= 5;
  }

  // Risk contribution
  score -= risks.length * 5;

  // Keep score between 0–100
  score = Math.max(0, Math.min(score, 100));

  let grade = "F";
  let status = "Critical";

  if (score >= 90) {
    grade = "A+";
    status = "Excellent";
  } else if (score >= 80) {
    grade = "A";
    status = "Very Good";
  } else if (score >= 70) {
    grade = "B";
    status = "Good";
  } else if (score >= 60) {
    grade = "C";
    status = "Average";
  } else if (score >= 40) {
    grade = "D";
    status = "Needs Attention";
  }

  return {
    score,
    grade,
    status,
  };
}

function buildNextAction({
  forecast,
  targets,
}) {
  if (!forecast || !targets) {
    return null;
  }

  const status = forecast.status ?? "unknown";

if (status === "completed") {
  return {
    title: "Goal achieved! 🎉",
    subtitle: "Congratulations! Consider creating your next financial goal.",
    dailySavings: null,
    priority: "low",
    status,
  };
}

  if (status === "behind") {
    return {
      title: `Increase monthly savings to ₹${targets.monthlySavings ?? 0}`,
      subtitle: "You're behind schedule.",
      dailySavings: targets.dailySavings,
      priority: "high",
      status,
    };
  }

  if (status === "ahead") {
    return {
      title: "Maintain your current savings",
      subtitle: "You're ahead of schedule.",
      dailySavings: targets.dailySavings,
      priority: "low",
      status,
    };
  }

  if (status === "on-track") {
    return {
      title: `Save ₹${targets.monthlySavings ?? 0} this month`,
      subtitle: "You're on track.",
      dailySavings: targets.dailySavings,
      priority: "normal",
      status,
    };
  }

  return {
    title: "Complete your planning setup",
    subtitle: "Add a target date to generate recommendations.",
    dailySavings: null,
    priority: "normal",
    status: "unknown",
  };
}

export function buildPlanning(goal) {
  if (!goal) return null;

  const targetAmount = Number(goal.targetAmount ?? 0);
  const currentAmount = Number(goal.currentAmount ?? 0);

  const remainingAmount = Math.max(
    targetAmount - currentAmount,
    0
  );

  const progress =
    targetAmount > 0
      ? Math.min(
          Math.round((currentAmount / targetAmount) * 100),
          100
        )
      : 0;

  const today = new Date();

  const targetDate = goal.targetDate
    ? new Date(goal.targetDate)
    : null;

  const daysRemaining = targetDate
    ? Math.max(
        Math.ceil((targetDate - today) / MS_PER_DAY),
        0
      )
    : null;

  const monthsRemaining =
    daysRemaining !== null
      ? Math.max(
          Math.ceil(daysRemaining / 30),
          1
        )
      : null;

const targets = buildTargets(
  remainingAmount,
  monthsRemaining
);

const milestones = buildMilestones(
  targetAmount,
  currentAmount
);

const timeline = buildTimeline(
  goal,
  today,
  targetDate,
  daysRemaining,
  monthsRemaining
);

const risks = buildRisks({
  targetDate,
  progress,
  monthsRemaining,
  currentAmount,
  targetAmount,
});

const forecast = buildForecast({
  goal,
  currentAmount,
  targetAmount,
  remainingAmount,
  monthsRemaining,
});

const recommendations = buildRecommendations({
  forecast,
});

const health = buildHealth({
  progress,
  risks,
  forecast,
});
const nextAction = buildNextAction({
  forecast,
  targets,
});

  return {
    overview: {
      progress,
      remainingAmount,
      daysRemaining,
      monthsRemaining,
      targetDate,
    },

   targets,

   milestones,

    timeline,

    risks,

    forecast,
    
    health,

    recommendations,

nextAction,
  };
}