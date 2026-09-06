// ==========================================
// FINAIW Reminder Engine v1
// Generates smart financial reminders
// ==========================================
import { getGoals } from "../services/goalEngine";
import { buildFinancialCore } from "./financialCoreEngine";
export function buildReminders(workspace) {
  const reminders = [];

  const financialCore = buildFinancialCore();

// Goal summary (use later as more reminder types are added)
const goalSummary = financialCore.goals;

// Detailed goal list
const goals = getGoals();

  for (const goal of goals) {
    if (goal.completed) continue;

    const current = Number(goal.currentAmount ?? 0);
    const target = Number(goal.targetAmount ?? 0);

    if (current === 0) {
      reminders.push({
        id: `goal-start-${goal.id}`,
        priority: "high",
        type: "goal",
        title: `Start "${goal.title}"`,
        description: "Make your first contribution to begin this goal.",
        action: "Start Goal",
      });

      continue;
    }

    if (current < target) {
      reminders.push({
        id: `goal-progress-${goal.id}`,
        priority: "medium",
        type: "goal",
        title: `Continue "${goal.title}"`,
        description: "Keep contributing to stay on track.",
        action: "Review Goal",
      });
    }
  }

  const sortedReminders = reminders.sort((a, b) => {
    const order = {
      high: 0,
      medium: 1,
      low: 2,
    };

    return order[a.priority] - order[b.priority];
});

return sortedReminders;
}