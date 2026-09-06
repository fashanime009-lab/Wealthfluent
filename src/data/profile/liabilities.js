// ======================================================
// FINAIW User Liabilities
// Single Source of Truth
// ======================================================

export const userLiabilities = {
  homeLoan: 15000,

  personalLoan: 5000,

  vehicleLoan: 0,

  educationLoan: 0,

  creditCard: 2000,

  other: 0,
};
export function getLiabilities() {
  return userLiabilities;
}