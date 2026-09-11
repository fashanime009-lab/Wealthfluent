export function buildCashflowAlerts({
  monthlySurplus,
}) {
  const alerts = [];

  if (monthlySurplus < 0) {
    alerts.push({
      severity: "critical",
      message:
        "Negative monthly cashflow detected.",
    });
  }

  return alerts;
}