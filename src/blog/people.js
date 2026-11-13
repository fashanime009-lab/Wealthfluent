import { SITE_URL } from "@/components/seo/Seo";

// Byline and schema helpers shared by blog posts (BlogPostPage) and guide
// pages (GuidePage).

// Joins reviewer names the way the byline needs them: "A, and B" for two,
// "A, B, and C" for three or more — never just a bare comma list, which
// reads as a single run-on name rather than distinct people.
export function joinReviewers(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// Parses frontmatter.reviewedBy entries ("Nishit B, Founder") into the
// {name, jobTitle} shape articleSchema's JSON-LD needs, so the structured
// data always matches the visible byline above instead of drifting from it.
export function parseReviewers(names) {
  return names.map((entry) => {
    const commaIndex = entry.indexOf(",");
    const name = commaIndex === -1 ? entry.trim() : entry.slice(0, commaIndex).trim();
    const jobTitle = commaIndex === -1 ? undefined : entry.slice(commaIndex + 1).trim();
    return { "@type": "Person", name, ...(jobTitle ? { jobTitle } : {}) };
  });
}

// frontmatter.author is either the team ("FINAIW Team") or one person in the
// same "Name, Job title" form as reviewedBy. A person becomes a Person
// author in the Article schema; the team stays the publisher organization.
export function parseAuthor(entry) {
  if (!entry || entry === "FINAIW Team") return undefined;
  return { ...parseReviewers([entry])[0], url: `${SITE_URL}/about` };
}
