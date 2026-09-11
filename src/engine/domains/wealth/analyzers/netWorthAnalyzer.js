export function calculateNetWorth(totalAssets, totalLiabilities) {
  const amount = totalAssets - totalLiabilities;

  let status = "negative";

  if (amount > 0) status = "positive";
  if (amount >= 1000000) status = "strong";

  return {
    amount,
    status,
  };
}