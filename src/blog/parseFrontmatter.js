// Minimal YAML-frontmatter parser for this project's blog posts — not a
// general YAML parser, just enough for the flat, hand-authored shape every
// post's frontmatter actually uses: quoted/unquoted strings, bare dates
// (kept as plain "YYYY-MM-DD" strings, never parsed into a Date — that
// would reintroduce timezone-shift bugs for no benefit), and single-line
// arrays of strings (`["a, with a comma", "b"]`). Pulling in a full YAML
// library (gray-matter, js-yaml, ...) for a format this constrained would
// be more dependency than the problem needs. Values with multi-line block
// scalars aren't supported — every field here is single-line by
// convention; keep future posts' frontmatter that way too.
//
// Pure JS, no Node builtins — importable from both the Vite-bundled React
// app (src/blog/posts.js) and plain-Node build scripts (scripts/lib/
// blogPosts.mjs), so the parsing logic itself can never drift between them.
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const [, frontmatterBlock, content] = match;
  const data = {};

  for (const line of frontmatterBlock.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    data[key] = parseValue(value);
  }

  return { data, content: content.trim() };
}

function parseValue(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    return inner ? splitRespectingQuotes(inner) : [];
  }
  // Bare (unquoted) true/false — e.g. `draft: true` — becomes a real
  // boolean; a quoted "true" stays a string, same as standard YAML.
  if (value === "true") return true;
  if (value === "false") return false;
  return stripQuotes(value);
}

// A plain `inner.split(",")` breaks on values like "Nishit B, Founder" —
// a quoted string that itself contains a comma. This walks the string
// char by char so commas inside a quoted item don't count as separators.
function splitRespectingQuotes(str) {
  const items = [];
  let current = "";
  let quoteChar = null;

  for (const char of str) {
    if (quoteChar) {
      if (char === quoteChar) quoteChar = null;
      else current += char;
    } else if (char === '"' || char === "'") {
      quoteChar = char;
    } else if (char === ",") {
      items.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) items.push(current.trim());
  return items;
}

function stripQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}
