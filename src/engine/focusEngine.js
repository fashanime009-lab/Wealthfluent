export function buildTodayFocus(financialCore) {
  const tasks = [];

  const { cashflow, wealth } = financialCore;

  // Improve cash flow first
  if ((cashflow.data?.monthlySurplus ?? 0) <= 0) {
    tasks.push({
      priority: 100,
      title: "Increase Monthly Cash Flow",
      description:
        "Your monthly surplus is £0 or below. Improving cash flow should be your first priority.",
      action: "Review Cash Flow",
      type: "cashflow",
    });
  }

  // Then build wealth
  if ((wealth.data?.netWorth ?? 0) <= 0) {
    tasks.push({
      priority: 90,
      title: "Build Your Net Worth",
      description:
        "You haven't added any assets yet. Start tracking what you own.",
      action: "Add Assets",
      type: "wealth",
    });
  }

  // Default state
  if (tasks.length === 0) {
    tasks.push({
      priority: 1,
      title: "You're on Track",
      description:
        "Your financial foundation looks healthy. Keep reviewing your progress.",
      action: "View Dashboard",
      type: "success",
    });
  }

  tasks.sort((a, b) => b.priority - a.priority);

  return tasks[0];
}