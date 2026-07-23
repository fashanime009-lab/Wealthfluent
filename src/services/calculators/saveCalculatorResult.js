export function saveCalculatorResult({
  saveCalculation,
  addRecentActivity,
  updateDashboard,
  type,
  title,
  values,
  summary,
  dashboard = {},
}) {
 const payload = {
  type,
  title,
  values,
  summary,
  updatedAt: new Date().toISOString(),
};

  saveCalculation(type, payload);

  addRecentActivity({
  type,
  title,
  value: summary,
});

  if (Object.keys(dashboard).length > 0) {
    updateDashboard(dashboard);
    payload.dashboard = dashboard;
  }

  return payload;
}