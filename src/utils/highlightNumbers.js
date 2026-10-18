// Lesson bodies are already full of real worked numbers ($10,000, 12%,
// ₹1.76Cr) — they're just buried in plain paragraph text, which is a lot of
// what makes a lesson read like a dense article instead of something
// scannable. This finds them with a regex rather than requiring every one
// of 30 lessons to be hand-annotated with new data, so it stays accurate
// as lessons are edited instead of drifting out of sync with hand-picked
// callouts. The currency figures themselves are computed per-viewer by
// src/data/lessons.js (see currencyHelpers/fmt there), so this has to
// recognize every symbol formatCurrency can produce (₹$€£¥, plus the A$/C$
// two-character ones) and every compact suffix it can append (K/M/B/T for
// most currencies, L/Cr for INR) — not just ₹.
// \b after the suffix stops "Cr" from swallowing the start of an unrelated
// capitalized word — without it, "₹50L Credit card" would highlight as
// "₹50L Cr" + "edit card", which is exactly the kind of bug this file
// exists to not have.
const NUMBER_PATTERN = /(?:A\$|C\$|[₹$€£¥])[\d,]+(?:\.\d+)?(?:Cr\b|[KMBTL]\b)?|-?\d+(?:\.\d+)?%/g;

// React nodes for one paragraph, with every matched figure wrapped so it
// can be styled distinctly from the surrounding prose.
export function highlightText(text) {
  const nodes = [];
  let lastIndex = 0;
  for (const match of text.matchAll(NUMBER_PATTERN)) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push({ value: match[0], key: `${match.index}-${match[0]}` });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

const CURRENCY_START = /^(?:A\$|C\$|[₹$€£¥])/;

// The standout figures across a whole lesson, for a "numbers worth
// remembering" recap. Currency amounts are kept ahead of plain percentages
// (a currency figure says more on its own than "12%" does out of context),
// de-duplicated, and capped — a recap of 15 numbers isn't a recap.
export function extractKeyNumbers(paragraphs, max = 6) {
  const seen = new Set();
  const currency = [];
  const percent = [];
  for (const text of paragraphs) {
    for (const match of text.matchAll(NUMBER_PATTERN)) {
      const value = match[0];
      if (seen.has(value)) continue;
      seen.add(value);
      (CURRENCY_START.test(value) ? currency : percent).push(value);
    }
  }
  return [...currency, ...percent].slice(0, max);
}
