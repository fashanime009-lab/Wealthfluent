import { LESSONS } from "../lessons";

/**
 * Lesson → lesson links, shown as "Keep learning" at the end of each lesson.
 * Keyed by lesson slug; the value is the slugs of the lessons a reader of
 * that one should look at next, in order. Three each, chosen for topic
 * (what the reader is likely to ask next), not for "next in the list" —
 * the page already has a Next link for that.
 *
 * Every lesson is the target of at least two others, so no lesson depends
 * on /learn alone to be found by a crawler — recheck that when editing this
 * file. Unknown slugs are skipped at render time rather than throwing.
 *
 * The calculator each lesson points to lives on the lesson itself
 * (`relatedTool`), and calculators point back via calculatorRecommendations.
 */
export const LESSON_RECOMMENDATIONS = {
  "compound-interest": ["time-value-of-money", "sip-vs-lump-sum", "understanding-cagr"],
  "investment-basics": ["risk-management", "market-basics", "mutual-fund-types"],
  "retirement-planning": ["nps-vs-ppf-vs-epf", "fire-movement-basics", "life-stages-and-asset-allocation"],
  "risk-management": ["investment-basics", "market-basics", "rebalancing-a-portfolio"],
  "market-basics": ["investment-basics", "index-funds-vs-active-funds", "behavioral-investing-mistakes"],
  "emergency-funds": ["sinking-funds", "budgeting-basics", "health-insurance-basics"],
  "debt-management": ["credit-score", "home-loan-basics", "rent-vs-buy-a-home"],
  "budgeting-basics": ["emergency-funds", "sinking-funds", "understanding-gst"],
  "understanding-inflation": ["investment-basics", "gold-and-alternative-assets", "time-value-of-money"],
  "credit-score": ["debt-management", "home-loan-basics", "budgeting-basics"],
  "health-insurance-basics": ["term-insurance-basics", "emergency-funds", "risk-management"],
  "mutual-fund-types": ["reading-a-mutual-fund-factsheet", "index-funds-vs-active-funds", "sip-vs-lump-sum"],
  "behavioral-investing-mistakes": ["rebalancing-a-portfolio", "risk-management", "sip-vs-lump-sum"],
  "gold-and-alternative-assets": ["understanding-inflation", "life-stages-and-asset-allocation", "rebalancing-a-portfolio"],
  "home-loan-basics": ["rent-vs-buy-a-home", "credit-score", "term-insurance-basics"],
  "index-funds-vs-active-funds": ["mutual-fund-types", "reading-a-mutual-fund-factsheet", "sip-vs-lump-sum"],
  "term-insurance-basics": ["health-insurance-basics", "life-stages-and-asset-allocation", "emergency-funds"],
  "nps-vs-ppf-vs-epf": ["retirement-planning", "salary-structuring-and-tax", "fire-movement-basics"],
  "rebalancing-a-portfolio": ["life-stages-and-asset-allocation", "risk-management", "behavioral-investing-mistakes"],
  "understanding-cagr": ["compound-interest", "reading-a-mutual-fund-factsheet", "time-value-of-money"],
  "sinking-funds": ["emergency-funds", "budgeting-basics", "understanding-inflation"],
  "salary-structuring-and-tax": ["nps-vs-ppf-vs-epf", "understanding-gst", "net-worth-tracking"],
  "sip-vs-lump-sum": ["compound-interest", "index-funds-vs-active-funds", "behavioral-investing-mistakes"],
  "reading-a-mutual-fund-factsheet": ["mutual-fund-types", "index-funds-vs-active-funds", "understanding-cagr"],
  "life-stages-and-asset-allocation": ["rebalancing-a-portfolio", "retirement-planning", "gold-and-alternative-assets"],
  "net-worth-tracking": ["budgeting-basics", "fire-movement-basics", "debt-management"],
  "fire-movement-basics": ["retirement-planning", "net-worth-tracking", "understanding-inflation"],
  "rent-vs-buy-a-home": ["home-loan-basics", "time-value-of-money", "budgeting-basics"],
  "understanding-gst": ["salary-structuring-and-tax", "budgeting-basics", "understanding-inflation"],
  "time-value-of-money": ["compound-interest", "understanding-inflation", "understanding-cagr"],
};

const lessonBySlug = new Map(LESSONS.map((lesson) => [lesson.slug, lesson]));

/**
 * The lessons to show under a lesson, as [{ to, label, note }] — label is the
 * lesson title and note its summary. Unknown slugs (either the lesson itself
 * or a target) are skipped, so a typo here can never blank a page.
 */
export function getLessonRelated(slug) {
  return (LESSON_RECOMMENDATIONS[slug] ?? [])
    .map((target) => lessonBySlug.get(target))
    .filter((lesson) => lesson && lesson.slug !== slug)
    .map((lesson) => ({ to: `/learn/${lesson.slug}`, label: lesson.title, note: lesson.summary }));
}
