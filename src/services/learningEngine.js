const STORAGE_KEY = "finaiw-learning";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-08-17"
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedSlugs: [], completedDates: [] };
  } catch {
    return { completedSlugs: [], completedDates: [] };
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("finaiw:learning-updated"));
}

export function isLessonComplete(slug) {
  return load().completedSlugs.includes(slug);
}

export function getCompletedSlugs() {
  return load().completedSlugs;
}

export function markLessonComplete(slug) {
  const state = load();
  if (!state.completedSlugs.includes(slug)) {
    state.completedSlugs.push(slug);
  }
  const today = todayKey();
  if (!state.completedDates.includes(today)) {
    state.completedDates.push(today);
  }
  save(state);
}

// Real streak: count consecutive calendar days (ending today or yesterday)
// that have at least one completed lesson. Not a fake incrementing counter.
export function getStreak() {
  const { completedDates } = load();
  if (completedDates.length === 0) return 0;

  const dateSet = new Set(completedDates);
  const cursor = new Date();

  // If nothing done today, streak can still count through yesterday.
  if (!dateSet.has(todayKeyFor(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dateSet.has(todayKeyFor(cursor))) return 0;
  }

  let streak = 0;
  while (dateSet.has(todayKeyFor(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function todayKeyFor(date) {
  return date.toISOString().slice(0, 10);
}

export function getLessonsCompletedCount() {
  return load().completedSlugs.length;
}
