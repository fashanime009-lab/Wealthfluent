import { buildAssets } from "./assetEngine";
import { buildLiabilities } from "./liabilityEngine";
import { calculateNetWorth } from "./analyzers/netWorthAnalyzer";
import { buildWealthScore } from "./scoring/wealthScore";

export function buildWealth() {
  const assets = buildAssets();
  const liabilities = buildLiabilities();

  const netWorth = calculateNetWorth(
    assets.data.total,
    liabilities.data.total
  );

  const score = buildWealthScore(netWorth.amount);

  return {
    data: {
      totalAssets: assets.data.total,
      totalLiabilities: liabilities.data.total,
      netWorth: netWorth.amount,
      status: netWorth.status,
    },

    assets,
    liabilities,

    insights: [],
    recommendations: [],
    alerts: [],

    score,

    metadata: {
      version: "1.0",
    },
  };
}