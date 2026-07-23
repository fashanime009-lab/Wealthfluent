import { saveCalculatorResult } from "./saveCalculatorResult";

export function createCalculatorEngine({
  saveCalculation,
  addRecentActivity,
  updateDashboard,
}) {
  return {
    save(config) {
      return saveCalculatorResult({
        saveCalculation,
        addRecentActivity,
        updateDashboard,
        ...config,
      });
    },
  };
}