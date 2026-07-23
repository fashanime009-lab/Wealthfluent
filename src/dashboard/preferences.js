const STORAGE_KEY = "finaiw-dashboard-preferences";

export function getDashboardPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveDashboardPreferences(preferences) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(preferences)
  );
}