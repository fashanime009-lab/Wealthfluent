// Personal Goals — a completely independent system from calculators.
// A goal here is something the person explicitly creates (a name, a target
// amount, an optional target date) and grows over time by logging real
// contributions themselves. No calculator output ever becomes a goal.
const STORAGE_KEY = "finaiw-personal-goals";

export const GOAL_CATEGORIES = [
  { id: "savings", label: "Savings" },
  { id: "debt", label: "Debt Payoff" },
  { id: "investment", label: "Investment" },
  { id: "purchase", label: "Big Purchase" },
  { id: "other", label: "Other" },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  window.dispatchEvent(new CustomEvent("finaiw:personal-goals-updated"));
}

export function getPersonalGoals() {
  return load();
}

export function createPersonalGoal({ title, category, targetAmount, startingAmount = 0, targetDate }) {
  const goals = load();
  const goal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    category,
    targetAmount: Number(targetAmount) || 0,
    currentAmount: Number(startingAmount) || 0,
    targetDate: targetDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    contributions: startingAmount
      ? [{ amount: Number(startingAmount), date: new Date().toISOString(), note: "Starting amount" }]
      : [],
  };
  goals.unshift(goal);
  save(goals);
  return goal;
}

export function addContribution(goalId, amount, note = "") {
  const goals = load();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return null;

  goal.currentAmount = Math.max(0, (goal.currentAmount || 0) + Number(amount));
  goal.contributions = [
    ...(goal.contributions || []),
    { amount: Number(amount), date: new Date().toISOString(), note },
  ];
  if (goal.targetAmount > 0 && goal.currentAmount >= goal.targetAmount) {
    goal.completed = true;
  }
  save(goals);
  return goal;
}

export function updatePersonalGoal(goalId, updates) {
  const goals = load();
  const idx = goals.findIndex((g) => g.id === goalId);
  if (idx === -1) return null;
  goals[idx] = { ...goals[idx], ...updates };
  save(goals);
  return goals[idx];
}

export function deletePersonalGoal(goalId) {
  save(load().filter((g) => g.id !== goalId));
}

export function completePersonalGoal(goalId) {
  return updatePersonalGoal(goalId, { completed: true });
}

export function reopenPersonalGoal(goalId) {
  return updatePersonalGoal(goalId, { completed: false });
}
