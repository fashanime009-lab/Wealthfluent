// ======================================================
// FINAIW Profile Store
// Single Source of Truth
// ======================================================

const STORAGE_KEY = "finaiw-profile";
const listeners = new Set();
const defaultProfile = {
  assets: {
  cash: 10000,
  savings: 20000,
  investments: 50000,
  retirement: 15000,
  property: 0,
  vehicle: 5000,
  business: 0,
  other: 0,
},

  liabilities: {
  homeLoan: 50000,
  personalLoan: 10000,
  vehicleLoan: 5000,
  educationLoan: 0,
  creditCard: 2000,
  other: 1000,
},

  income: {
  salary: 5000,
  freelance: 500,
  business: 200,
  rental: 300,
  dividends: 50,
  interest: 20,
  other: 100,
},

  expenses: {
    housing: 2000,
    food: 0,
    transport: 0,
    utilities: 0,
    healthcare: 0,
    insurance: 0,
    education: 0,
    entertainment: 0,
    shopping: 0,
    emi: 0,
    subscriptions: 0,
    other: 0,
  },

  emergencyFund: {
    current: 0,
  },
  goals: [
  {
    id: "retirement",
    name: "Retirement",
    target: 500000,
    saved: 100000,
  },

  {
    id: "travel",
    name: "Travel",
    target: 8000,
    saved: 5000,
  },

  {
    id: "car",
    name: "Buy a Car",
    target: 25000,
    saved: 12000,
  },
],
};

export function getProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return structuredClone(defaultProfile);
  }

  return JSON.parse(saved);
}

export function saveProfile(profile) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );

  notify();
}

export function updateProfile(partial) {
  const current = getProfile();

  const updated = {
    ...current,
    ...partial,
  };

  saveProfile(updated);

  return updated;
}

export function resetProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

export function subscribe(listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}