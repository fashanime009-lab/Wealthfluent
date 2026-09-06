// ==========================================
// FINAIW Goal Engine v1
// ==========================================


const STORAGE_KEY = "finaiw-goals";
/**
 * Load all goals
 */
export function getGoals() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

/**
 * Save all goals
 */
export function saveGoals(goals) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(goals)
  );

  window.dispatchEvent(
    new CustomEvent("finaiw:goals-updated")
  );
}

/**
 * Add a goal
 */
export function addGoal(goal) {
  const goals = getGoals();

  const existingIndex = goals.findIndex(
    (g) => g.type === goal.type && !g.completed
  );

  if (existingIndex >= 0) {
    const updatedGoal = {
      ...goals[existingIndex],

      // Keep original identity
      id: goals[existingIndex].id,
      createdAt: goals[existingIndex].createdAt,

      // Update timestamp
      updatedAt: Date.now(),

      // Replace values from calculator
      ...goal,
    };

    goals[existingIndex] = updatedGoal;

    saveGoals(goals);

    return updatedGoal;
  }

 const newGoal = {
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  updatedAt: Date.now(),

  completed: false,

  category: goal.category ?? "General",

  progress: goal.progress ?? 0,

  status: goal.status ?? "Ready",

  currentAmount: goal.currentAmount ?? 0,

  targetAmount: goal.targetAmount ?? 0,

  nextMilestone: goal.nextMilestone ?? "Start saving",

  nextAction: goal.nextAction ?? "Review your financial plan",

  icon: goal.icon ?? "target",

  ...goal,
};

  goals.push(newGoal);

  saveGoals(goals);

  return newGoal;
}

/**
 * Update goal
 */
export function updateGoal(id, updates) {
  const goals = getGoals().map(goal =>
    goal.id === id
      ? { ...goal, ...updates }
      : goal
  );

  saveGoals(goals);

  return goals;
}

/**
 * Delete goal
 */
export function deleteGoal(id) {
  const goals = getGoals().filter(
    goal => goal.id !== id
  );

  saveGoals(goals);

  return goals;
}

/**
 * Complete goal
 */
export function completeGoal(id) {
  return updateGoal(id, {
    completed: true,
    progress: 100,
    completedAt: Date.now(),
  });
}
export function getGoalSummary(goals = []) {
  const completed = goals.filter((g) => g.completed).length;

  const activeGoals = goals.filter((g) => !g.completed);

  if (activeGoals.length === 0) {
    return {
      total: goals.length,
      completed,
      averageProgress: 100,
      nextGoal: null,
    };
  }

  const goalsWithProgress = activeGoals.map((goal) => {
    const progress =
      goal.targetAmount > 0
        ? Math.min(
            100,
            Math.round(
              (goal.currentAmount / goal.targetAmount) * 100
            )
          )
        : 0;

    return {
      ...goal,
      progress,
    };
  });

  const averageProgress =
    goalsWithProgress.reduce(
      (sum, goal) => sum + goal.progress,
      0
    ) / goalsWithProgress.length;





  return {
    total: goals.length,
    completed,
    averageProgress: Math.round(averageProgress),
    nextGoal: null,
  };
}