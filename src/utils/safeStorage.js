// localStorage that can't take the app down. Reading or writing it can
// throw — storage blocked in the browser's settings, a sandboxed frame, a
// full quota — and JSON.parse throws on any value that isn't valid JSON
// (a half-written save, another script or a person editing it by hand).
// The providers that wrap the whole app used to do all of this unguarded
// during render or in effects, so one bad value blanked EVERY page for that
// visitor until they cleared their storage. Everything here fails soft:
// reads fall back to a default, writes just report whether they worked.

export function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // nothing to do — storage is unavailable
  }
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// For state that's expected to be a plain object: anything else that parses
// (null, a number, an array, a string) is treated as missing.
export function readObject(key, fallback = {}) {
  const value = readJSON(key, fallback);
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}
