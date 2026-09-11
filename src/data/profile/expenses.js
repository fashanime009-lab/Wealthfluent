// ======================================================
// FINAIW User Expenses
// Single Source of Truth
// ======================================================

export const userExpenses = {
  housing: 1000,
  food: 500,
  transport: 300,
  utilities: 200,
  healthcare: 100,
  insurance: 100,
  education: 0,
  entertainment: 300,
  shopping: 200,
  emi: 500,
  subscriptions: 50,
  other: 50,
};
export function getExpenses() {
  return userExpenses;
}