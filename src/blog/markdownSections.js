// Small, post-structure-aware helpers built on top of a post's raw
// Markdown body — splitting it into H2 sections (so a CTA box can be
// inserted after a specific one) and pulling the FAQ section's Q&A pairs
// out for FAQPage JSON-LD. Deriving the schema answers from the same
// Markdown the page actually renders means they can never drift out of
// sync with what a visitor — or Google — sees on the page.

// Splits on lines starting with "## " (top-level sections), each section
// keeping its own heading. Content before the first "## " (the intro
// paragraph(s)) is its own leading section with no heading line.
export function splitIntoH2Sections(markdown) {
  const lines = markdown.split("\n");
  const sections = [];
  let current = [];

  for (const line of lines) {
    if (line.startsWith("## ") && current.length) {
      sections.push(current.join("\n").trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) sections.push(current.join("\n").trim());
  return sections;
}

// A GFM table's delimiter row looks like `| --- | --- |` (optionally
// without the outer pipes) — a reliable, format-agnostic signal that a
// section contains a real table, rather than guessing from pipe
// characters alone (which also show up in plain prose).
const TABLE_DELIMITER_ROW = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/m;

export function sectionHasTable(section) {
  return TABLE_DELIMITER_ROW.test(section);
}

// Same idea as splitIntoH2Sections, one level down — splits an H2
// section's own body on "### " lines.
function splitIntoH3Sections(section) {
  const lines = section.split("\n");
  const parts = [];
  let current = [];

  for (const line of lines) {
    if (line.startsWith("### ") && current.length) {
      parts.push(current.join("\n").trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) parts.push(current.join("\n").trim());
  return parts;
}

// Finds "## Frequently asked questions" (case-insensitive) and reads each
// "### Question" / answer-paragraph pair beneath it. Returns [] if the
// post has no FAQ section — FAQPage schema is then simply omitted for it.
export function extractFaqItems(markdown) {
  const faqSection = splitIntoH2Sections(markdown).find((section) =>
    /^##\s+frequently asked questions\s*$/im.test(section.split("\n")[0])
  );
  if (!faqSection) return [];

  const items = [];
  // First part of the split is the "## Frequently asked questions" heading
  // line itself (no leading "### "), not a question — skip it.
  for (const part of splitIntoH3Sections(faqSection).slice(1)) {
    const lines = part.split("\n");
    const question = lines[0].replace(/^###\s+/, "").trim();
    const answer = stripMarkdownInline(lines.slice(1).join(" ").trim().replace(/\s+/g, " "));
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

// Plain-text answers for JSON-LD — schema.org's Answer.text isn't meant
// to carry Markdown/HTML, so bold/italic/link syntax is stripped rather
// than passed through raw.
function stripMarkdownInline(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}
