// ======================================================
// FINAIW User Assets
// Single Source of Truth
// ======================================================

export const userAssets = {
  cash: 5000,

  savings: 10000,

  investments: 25000,

  retirement: 0,

  property: 0,

  vehicles: 0,

  gold: 2000,

  crypto: 1000,

  other: 0,
};

export function getAssets() {
  return userAssets;
}