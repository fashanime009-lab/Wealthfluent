// ==========================================
// FINAIW Snapshot Engine
// ==========================================

import { buildFinancialCore } from "./financialCoreEngine";

export function buildSnapshot() {
  const financialCore = buildFinancialCore();

  return financialCore.snapshot;
}