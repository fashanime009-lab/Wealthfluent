import { buildReminders } from "./reminderEngine";
import { buildSnapshot } from "./snapshotEngine";
import { buildFinancialCore } from "./financialCoreEngine";
import { buildTodayFocus } from "./focusEngine";
export function buildDashboard(workspace) {
  const financialCore = buildFinancialCore();
  const goals = workspace?.goals ?? [];

  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed"
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  );

 

 const priority = getPriority(activeGoals);

const reminders = buildReminders(workspace);

// Snapshot now reads from Financial Core internally
const snapshot = buildSnapshot();

  return {
  status: buildWorkspaceStatus({
  activeGoals,
  completedGoals,
}),

// Temporary compatibility layer
greeting: {
  title: buildWorkspaceStatus({
    activeGoals,
    completedGoals,
  }).label,

  subtitle: buildWorkspaceStatus({
    activeGoals,
    completedGoals,
  }).headline,

  message: buildWorkspaceStatus({
    activeGoals,
    completedGoals,
  }).summary,
},



   priority,

brief: {
  summary: getBriefSummary(activeGoals, completedGoals),
  highlights: getBriefHighlights(activeGoals, reminders, priority),
  action: "Review Today's Brief",
},

recommendation: {
  title: priority.title,
  description: priority.description,
  action: "Review Recommendation",
},

reminders,

snapshot,

health: financialCore.health,

focus: buildTodayFocus(financialCore),
  };
}

function getPriority(activeGoals) {
  if (!activeGoals.length) {
    return {
      title: "Create Your Next Goal",
      description:
        "You've completed everything. Start planning your next milestone.",
      action: "Create Goal",
    };
  }

  const goal = activeGoals[0];

  return {
    title: `Continue "${goal.title}"`,
    description:
      "Stay consistent to keep moving toward your target.",
    action: "Continue Planning",
  };
}

function getBriefSummary(activeGoals, completedGoals) {
  if (activeGoals.length === 0 && completedGoals.length === 0) {
    return "Welcome to FINAIW. Create your first financial goal to get started.";
  }

  if (activeGoals.length === 0) {
    return "You've completed all of your active financial goals.";
  }

  return "Your financial day looks healthy. Here's what deserves your attention today.";
}

function getBriefHighlights(activeGoals, reminders = [], priority) {
  const highlights = [];

  if (activeGoals.length > 0) {
    highlights.push({
      category: "goals",
      status: "good",
      title: "Goals",
      text: `${activeGoals.length} active goal${
        activeGoals.length === 1 ? "" : "s"
      } progressing normally.`,
    });
  }

  if (reminders.length === 0) {
    highlights.push({
      category: "reminders",
      status: "good",
      title: "Reminders",
      text: "No reminders require your attention today.",
    });
  } else {
    const highPriorityCount = reminders.filter((r) => r.priority === "high").length;
    highlights.push({
      category: "reminders",
      status: highPriorityCount > 0 ? "warning" : "info",
      title: "Reminders",
      text:
        highPriorityCount > 0
          ? `${highPriorityCount} reminder${highPriorityCount === 1 ? "" : "s"} need${highPriorityCount === 1 ? "s" : ""} attention.`
          : `${reminders.length} reminder${reminders.length === 1 ? "" : "s"} waiting for review.`,
    });
  }

  if (priority?.title) {
    highlights.push({
      category: "recommendations",
      status: "info",
      title: "AI",
      text: `${priority.title} — one recommendation is ready for review.`,
    });
  }

  return highlights;
}


function buildWorkspaceStatus({
  activeGoals,
  completedGoals,
}) {
  if (activeGoals.length === 0 && completedGoals.length === 0) {
    return {
      level: "empty",
      label: "TODAY",
      headline: "Let's build your financial plan.",
      summary:
        "Create your first financial goal to start using your workspace.",
    };
  }

  if (activeGoals.length === 0) {
    return {
      level: "complete",
      label: "TODAY",
      headline: "Everything is complete.",
      summary:
        "No active goals require your attention today.",
    };
  }

  return {
    level: "good",
    label: "TODAY",
    headline: "Everything is on track.",
    summary: `${activeGoals.length} active goal${
      activeGoals.length === 1 ? "" : "s"
    } currently progressing.`,
  };
}