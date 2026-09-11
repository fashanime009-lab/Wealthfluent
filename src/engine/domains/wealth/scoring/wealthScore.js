export function buildWealthScore(netWorth) {
  let value = 0;

  if (netWorth > 0) value += 40;
  if (netWorth >= 100000) value += 20;
  if (netWorth >= 500000) value += 20;
  if (netWorth >= 1000000) value += 20;

  return {
    value: Math.min(value, 100),
    level:
      value >= 80
        ? "excellent"
        : value >= 60
        ? "good"
        : value >= 40
        ? "average"
        : "poor",
  };
}