// ======================================================
// FINAIW Net Worth Engine V2
// ======================================================

export function buildNetWorth(goals = []) {
  const assets = [];
  const liabilities = [];

  let activeGoal = null;

  goals.forEach((goal) => {
    if (!activeGoal && !goal.completed) {
      activeGoal = goal;
    }

    assets.push({
      id: goal.id,
      title: goal.title,
      category: goal.type ?? "Investment",

      current: Number(goal.current ?? 0),

      target: Number(goal.target ?? 0),

      monthlyContribution: Number(
        goal.monthlyContribution ?? 0
      ),

      duration: Number(goal.duration ?? 0),

      expectedReturn: Number(
        goal.expectedReturn ?? 0
      ),
    });
  });

  const totalAssets = assets.reduce(
    (sum, asset) => sum + asset.current,
    0
  );

  const totalLiabilities = liabilities.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const netWorth = totalAssets - totalLiabilities;

  const allocation = calculateAllocation(assets);

  return {
    activeGoal,

    assets,

    liabilities,

    allocation,

    totalAssets,

    totalLiabilities,

    netWorth,
  };
}

function calculateAllocation(assets) {
  const total = assets.reduce(
    (sum, asset) => sum + asset.current,
    0
  );

  if (total === 0) {
    return [];
  }

  return assets.map((asset) => ({
    name: asset.title,

    value: asset.current,

    percentage: Math.round(
      (asset.current / total) * 100
    ),
  }));
}