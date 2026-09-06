const STORAGE_KEY = "finaiw-history";

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function addHistory(item) {
  const history = getHistory();

  history.unshift({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...item,
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history.slice(0, 20))
  );
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}