// ==========================================
// FINAIW Workspace Engine V2
// Single Source of Truth
// ==========================================

import { getGoals } from "./goalEngine";
import { buildGoalIntelligence } from "../engine";

export function getWorkspaceState() {
  const goals = getGoals();

  const activeGoal =
    goals.find((goal) => !goal.completed) ?? null;

  if (!activeGoal) {
    return {

    goals,

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


const intelligence = buildGoalIntelligence(activeGoal);

const percentage = intelligence.progress;

  return {
    goals,

    activeGoal,
    today: {
  title: activeGoal.title,

  description:
    intelligence.recommendation.description,

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
  title: intelligence.recommendation.title,

  description: intelligence.recommendation.description,
},
  };
}