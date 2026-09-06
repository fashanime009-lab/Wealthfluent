// ======================================================
// FINAIW User Income
// Single Source of Truth
// ======================================================

export const userIncome = {
  salary: 4000,

  freelance: 1000,

  business: 500,

  rental: 0,

  dividends: 100,

  interest: 50,

  other: 0,
};

export function getIncome() {
  return userIncome;
}