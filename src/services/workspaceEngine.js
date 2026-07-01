// ==========================================
// FINAIW Workspace Engine V2
// Single Source of Truth
// ==========================================

import { getGoals } from "./goalEngine";

export function getWorkspaceState() {
  const goals = getGoals();

  const activeGoal =
    goals.find((goal) => !goal.completed) ?? null;

  if (!activeGoal) {
    return {
      activeGoal: null,

      today: {
        title: "Start Your Financial Journey",
        description:
          "Use a calculator to create your first financial goal.",
        estimatedTime: "5 min",
        xp: 0,
        wealthScore: 0,
      },

      progress: {
        percentage: 0,
        completed: 0,
        total: 1,
        stage: "Getting Started",
      },

      rewards: {
        xp: 0,
        wealthScore: 0,
      },

      quickActions: [
        {
          id: "calculator",
          label: "Explore Calculators",
        },
      ],

      recommendation: {
        title: "Create Your First Goal",
        description:
          "Saving your first goal unlocks your personalized workspace.",
      },
    };
  }

  const current = Number(activeGoal.current ?? 0);
  const target = Number(activeGoal.target ?? 0);

  const percentage =
    target > 0
      ? Math.min(Math.round((current / target) * 100), 100)
      : 0;

  return {
    activeGoal,

    today: {
      title: activeGoal.title,

      description:
        activeGoal.recommendation ??
        "Continue progressing toward your financial goal.",

      estimatedTime: "5 min",

      xp: activeGoal.xp ?? 40,

      wealthScore: activeGoal.wealthScore ?? 5,
    },

    progress: {
      percentage,

      completed: percentage >= 100 ? 1 : 0,

      total: 1,

      stage: activeGoal.title,
    },

    rewards: {
      xp: activeGoal.xp ?? 40,

      wealthScore: activeGoal.wealthScore ?? 5,
    },

    quickActions: [
      {
        id: "calculator",
        label:
          activeGoal.calculator ??
          "Open Calculator",
      },
      {
        id: "goal",
        label: "Update Goal",
      },
      {
        id: "lesson",
        label:
          activeGoal.lesson ??
          "Continue Learning",
      },
      {
        id: "progress",
        label: "View Progress",
      },
    ],

    recommendation: {
      title: "Recommended Next Step",

      description:
        activeGoal.recommendation ??
        "Stay consistent with your financial plan.",
    },
  };
}