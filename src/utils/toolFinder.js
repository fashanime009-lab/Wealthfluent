import { TOOL_FINDER_INDEX } from "@/data/toolFinderIndex";

const STOPWORDS = new Set([
  "a", "an", "the", "i", "im", "my", "me", "to", "for", "of", "on", "in",
  "is", "are", "do", "does", "should", "can", "will", "how", "much", "what",
  "or", "and", "vs", "versus", "need", "want", "get", "help", "with", "am",
  "it", "this", "that", "be", "have", "has", "you", "your",
]);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Deterministic, in-browser keyword matcher — no API call, nothing typed
// here is stored or sent anywhere. Scores every tool against the query and
// returns the best match plus which words drove the match, so the result
// can explain itself (see the "why this" line in ToolFinder.jsx).
export function matchTool(query) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 3) return null;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return null;

  let best = null;

  for (const tool of TOOL_FINDER_INDEX) {
    let score = 0;
    const matchedTerms = new Set();

    for (const phrase of tool.keywords) {
      const normalizedPhrase = normalize(phrase);
      if (normalizedPhrase.includes(" ") && normalizedQuery.includes(normalizedPhrase)) {
        score += 6;
        matchedTerms.add(phrase);
      }
    }

    // Title + hand-written keywords only — never the free-prose description.
    // Description text carries incidental words ("today", "later", "before
    // making a decision") that aren't real intent signals and were matching
    // unrelated queries (e.g. "what's the weather like today" hitting the
    // Inflation Calculator purely on the word "today"). A Set, not a list,
    // so a word repeated across several of a tool's own keyword phrases
    // (e.g. "car" in three different Lease vs Buy phrases) only scores once
    // per query token — otherwise tools with more repetitive keyword
    // writing would out-rank genuinely better matches.
    const haystack = new Set(tokenize(`${tool.title} ${tool.keywords.join(" ")}`));
    for (const qToken of queryTokens) {
      for (const hToken of haystack) {
        if (hToken === qToken) {
          score += 3;
          matchedTerms.add(qToken);
        } else if (hToken.length > 3 && qToken.length > 3 && (hToken.includes(qToken) || qToken.includes(hToken))) {
          score += 1;
          matchedTerms.add(qToken);
        }
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { tool, score, matchedTerms: Array.from(matchedTerms) };
    }
  }

  // A single generic word matching by itself (score 3) isn't enough
  // confidence to show a result — require either a real phrase hit or at
  // least two contributing words.
  if (!best || best.score < 4) return null;
  return { ...best, matchedTerms: dedupeTerms(best.matchedTerms) };
}

// Drop single-word terms that are already covered by a longer matched
// phrase, so the "matched" line reads as a short, non-redundant summary
// instead of the phrase followed by its own words repeated.
function dedupeTerms(terms) {
  const phrases = terms.filter((t) => t.includes(" "));
  return terms
    .filter((t) => t.includes(" ") || !phrases.some((p) => p.includes(t)))
    .sort((a, b) => b.length - a.length);
}
