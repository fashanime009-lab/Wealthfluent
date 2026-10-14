import { readJSON, setItem } from "./safeStorage";

// A lightweight "save this result" feature — no account, nothing ever
// sent anywhere, just a short list kept in this browser's localStorage.
// Capped at 20 so it can't grow unbounded; saving a 21st drops the oldest.
export const SAVED_RESULTS_KEY = "finaiw-saved-results";
const MAX_SAVED = 20;

export function getSavedResults() {
  const list = readJSON(SAVED_RESULTS_KEY, []);
  return Array.isArray(list) ? list : [];
}

// Just this page's saved amounts — a calculator's own "Save this result"
// section only ever needs to show what was saved from itself, not every
// tool's saved list.
export function getSavedResultsForRoute(route) {
  return getSavedResults().filter((r) => r.route === route);
}

// A page can save several distinct amounts (change an input, save again),
// but the exact same displayed value for the same tool only saves once —
// `value` is the formatted result string itself, so two saves are "the
// same result" exactly when they'd read identically in the saved list.
export function isValueSaved(route, value) {
  return getSavedResults().some((r) => r.route === route && r.value === value);
}

export function saveResult({ label, value, route }) {
  if (isValueSaved(route, value)) return getSavedResults();
  const list = getSavedResults();
  const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label, value, route, savedAt: Date.now() };
  const next = [entry, ...list].slice(0, MAX_SAVED);
  setItem(SAVED_RESULTS_KEY, JSON.stringify(next));
  return next;
}

export function removeSavedResult(id) {
  const next = getSavedResults().filter((r) => r.id !== id);
  setItem(SAVED_RESULTS_KEY, JSON.stringify(next));
  return next;
}
