// Formats a "YYYY-MM-DD" frontmatter date as "Month D, YYYY" without ever
// constructing a Date object from the bare string — `new Date("2026-10-21")`
// parses as UTC midnight, which then renders as the *previous* day in any
// timezone west of UTC. Splitting the string and looking up the month name
// directly sidesteps that entirely.
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatPostDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
