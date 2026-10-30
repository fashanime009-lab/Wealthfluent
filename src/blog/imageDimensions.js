// Known pixel dimensions for blog body images, keyed by filename — used to
// set explicit width/height on every lazy-loaded image so the layout
// doesn't shift as it loads. The hero image isn't here: it's rendered
// separately from the Markdown body (see BlogPostPage.jsx) using its own
// frontmatter-driven dimensions, not lazy-loaded.
//
// When adding a new post, add its body images' real dimensions here too —
// an image missing from this table still renders fine, it just won't have
// width/height set (a minor CLS risk, not a broken page).
export const BLOG_IMAGE_DIMENSIONS = {
  "monthly-investment-to-reach-1-million-by-years.webp": { width: 1200, height: 700 },
  "cost-of-starting-to-invest-late.webp": { width: 1000, height: 1500 },
  "real-value-of-1-million-after-inflation.webp": { width: 1200, height: 700 },
  "monthly-retirement-investment-by-starting-age.webp": { width: 1200, height: 700 },
  "you-invest-vs-compounding-by-starting-age.webp": { width: 1200, height: 700 },
  "cost-of-waiting-to-save-for-retirement.webp": { width: 1000, height: 1500 },
  "retirement-savings-on-track-by-age.webp": { width: 1200, height: 700 },
  "emi-vs-total-interest-by-tenure.webp": { width: 1200, height: 700 },
  "home-loan-emi-for-common-loan-amounts.webp": { width: 1000, height: 1500 },
  "janitor-vs-banker-two-lives.webp": { width: 1000, height: 1500 },
  "warren-buffett-wealth-after-65.webp": { width: 1200, height: 700 },
};

export function dimensionsFor(src) {
  const filename = src.split("/").pop();
  return BLOG_IMAGE_DIMENSIONS[filename] ?? null;
}
