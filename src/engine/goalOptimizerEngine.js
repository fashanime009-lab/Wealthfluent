// Financial Goal Planner engine — a standalone multi-goal budget optimizer.
//
// This is its own concept: goals are entered directly into this tool (see
// FinancialGoalPlannerPage.jsx), not pulled from Goals or the Financial
// Profile — those are a different feature (manual contribution tracking)
// and a different feature (a health score) respectively. This tool takes
// a fixed monthly budget and a set of goals you weight yourself, and
// decides how to split that budget between them.
//
// THE ACTUAL ALGORITHM
// A naive planner sorts goals by importance and fully funds the top one
// before the next sees a single rupee. That sounds reasonable but is
// provably wasteful: pouring your whole budget into one expensive goal
// while a cheaper, almost-as-important goal gets nothing produces less
// total "goal satisfaction" than splitting sensibly.
//
// This is a fractional knapsack problem — a well-known, provably-optimal
// allocation model. Each goal has a "density": how much weighted
// importance it returns per rupee you give it (importance x urgency,
// divided by what it actually costs to fund). Funding goals in order of
// density, each completely before moving to the next, mathematically
// maximizes total weighted satisfaction for any fixed budget — there is
// no other split of the same budget across the same goals that scores
// higher on the metric this tool optimizes for. That guarantee is why
// this strategy is always shown funding more of what you said matters
// than the naive "biggest priority first" approach, for the same money.

export const RISK_PROFILE_RATE = {
  conservative: 5,
  moderate: 9,
  aggressive: 13,
};

const MAX_HORIZON_MONTHS = 600; // 50 years — beyond this we just say "not reachable at this pace"

export function monthsUntil(targetDate) {
  if (!targetDate) return null;
  const now = new Date();
  const target = new Date(targetDate);
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(1, months);
}

// Required monthly contribution to grow `current` to `target` in `months`
// at annual rate `ratePct` — solved from the standard future-value-of-an-
// annuity formula.
export function requiredMonthlyContribution(current, target, months, ratePct) {
  const remaining = Math.max(0, target - current);
  if (remaining <= 0) return 0;
  const i = ratePct / 100 / 12;
  if (i === 0) return remaining / months;
  const growthOfCurrent = current * (1 + i) ** months;
  const stillNeeded = Math.max(0, target - growthOfCurrent);
  if (stillNeeded <= 0) return 0;
  const annuityFactor = ((1 + i) ** months - 1) / i;
  return stillNeeded / annuityFactor;
}

// The inverse question: at `monthly` contribution, how many months does it
// actually take to reach `target` from `current`? Stepped month by month
// rather than solved in closed form — goal counts are small, so exact
// simulation is cheap and avoids the algebra of isolating n from a mixed
// lump-sum-plus-annuity growth equation.
export function monthsToReach(current, target, monthly, ratePct) {
  const remaining = Math.max(0, target - current);
  if (remaining <= 0) return 0;
  const i = ratePct / 100 / 12;
  // With no contribution and no growth, current never changes — genuinely
  // unreachable. With either money coming in or a positive rate, keep
  // simulating: current alone can still compound its way to target.
  if (monthly <= 0 && i <= 0) return Infinity;
  let balance = current;
  for (let n = 1; n <= MAX_HORIZON_MONTHS; n++) {
    balance = balance * (1 + i) + monthly;
    // Tolerate sub-rupee floating-point drift from repeated multiplication
    // — without this, a goal funded at exactly its required pace can
    // report reaching target one month late purely from float rounding.
    if (balance >= target - 0.5) return n;
  }
  return Infinity;
}

// importance x urgency — how much this goal matters, weighted by how
// soon it's due. Used both as the knapsack's value weight and, applied
// identically inside scoreStrategy, as what "satisfaction" means.
function effectiveWeight(goal) {
  const urgency = 12 / Math.max(1, goal.months);
  return goal.importance * urgency;
}

// Weighted value returned per rupee — the knapsack "density" that ordering
// by it is provably optimal for.
function density(goal) {
  if (goal.requiredMonthly <= 0) return Infinity;
  return effectiveWeight(goal) / goal.requiredMonthly;
}

function withRequirements(goals) {
  return goals.map((g) => {
    const rate = RISK_PROFILE_RATE[g.riskProfile] ?? RISK_PROFILE_RATE.moderate;
    const requiredMonthly = requiredMonthlyContribution(g.currentAmount, g.targetAmount, g.months, rate);
    return { ...g, rate, requiredMonthly };
  });
}

function greedyFund(goals, budget, sortKey) {
  const withReq = withRequirements(goals).sort(sortKey);
  let pool = budget;
  return withReq.map((g) => {
    const allocated = Math.max(0, Math.min(g.requiredMonthly, pool));
    pool -= allocated;
    return { ...g, allocated };
  });
}

// Strategy 1 — Equal split, capped at what each goal actually needs, with
// one pass to hand any goal's unused share to the others. The naive
// "fair" instinct: same amount to everyone regardless of what they need.
export function allocateEqual(goals, budget) {
  const withReq = withRequirements(goals);
  const share = budget / withReq.length;
  let leftover = 0;
  const first = withReq.map((g) => {
    const allocated = Math.min(share, g.requiredMonthly);
    leftover += share - allocated;
    return { ...g, allocated };
  });
  if (leftover <= 0.01) return first;
  const stillShort = first.filter((g) => g.allocated < g.requiredMonthly - 0.01);
  if (!stillShort.length) return first;
  const extraShare = leftover / stillShort.length;
  return first.map((g) =>
    g.allocated < g.requiredMonthly - 0.01
      ? { ...g, allocated: Math.min(g.requiredMonthly, g.allocated + extraShare) }
      : g
  );
}

// Strategy 2 — Priority order: fund the single most important/urgent
// goal completely before the next sees anything, ignoring what each goal
// actually costs to fund. Common-sense, but not what maximizes how much
// of your stated priorities you actually get funded — kept as the
// baseline the optimizer is measured against.
export function allocatePriority(goals, budget) {
  return greedyFund(goals, budget, (a, b) => effectiveWeight(b) - effectiveWeight(a));
}

// Strategy 3 — the recommendation: fractional-knapsack greedy by density
// (weighted importance per rupee it costs to fund). Provably maximizes
// total weighted satisfaction for this budget — see file header.
export function allocateOptimized(goals, budget) {
  return greedyFund(goals, budget, (a, b) => density(b) - density(a));
}

// A 0-100 "portfolio satisfaction" score for a strategy's result: how
// much of what you said matters actually got funded, weighted by
// importance x urgency — not just how many rupees got placed.
export function scoreStrategy(allocations) {
  const totalWeight = allocations.reduce((s, g) => s + effectiveWeight(g), 0);
  if (totalWeight === 0) return 0;
  const achieved = allocations.reduce((s, g) => {
    const fulfilled = g.requiredMonthly > 0 ? Math.min(1, g.allocated / g.requiredMonthly) : 1;
    return s + effectiveWeight(g) * fulfilled;
  }, 0);
  return Math.round((achieved / totalWeight) * 100);
}

export function compareStrategies(goals, budget) {
  const equal = allocateEqual(goals, budget);
  const priority = allocatePriority(goals, budget);
  const optimized = allocateOptimized(goals, budget);

  return {
    equal: { allocations: equal, score: scoreStrategy(equal) },
    priority: { allocations: priority, score: scoreStrategy(priority) },
    optimized: { allocations: optimized, score: scoreStrategy(optimized) },
  };
}
