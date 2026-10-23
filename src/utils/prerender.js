// True only inside the headless Chromium that scripts/prerender.mjs uses to
// snapshot each route into static HTML — it sets window.__PRERENDER__ before
// any page script runs. Anything that should exist only for a real visitor
// (a consent dialog, a first-visit hint, live ad requests) checks this and
// skips itself, so it can't race the snapshot and end up frozen into the
// shipped HTML. Real browsers never set the flag.
export const isPrerendering = () => typeof window !== "undefined" && window.__PRERENDER__ === true;

// Every route ships pre-rendered (scripts/prerender.mjs) with a real
// <title>, meta description, canonical, OG/Twitter tags and JSON-LD baked
// into the static HTML for crawlers. When a real visitor's browser then
// mounts the full client app (src/main.jsx uses createRoot, not
// hydrateRoot — see its own comment on why), react-helmet-async has no way
// to know those baked-in tags came from an earlier, unrelated Helmet
// render in a different browser process at build time. Its reconciliation
// only tracks tags *it* rendered during *this* page's lifecycle, starting
// from an empty set on every fresh mount — so instead of replacing the
// static tags, it just appends a second, fresh set on top of them.
//
// Call once, right before the client app mounts, so there's only ever one
// generation of SEO tags in the document afterward: the one Helmet itself
// just rendered.
const PRERENDERED_SEO_SELECTOR = [
  "title",
  'meta[name="description"]',
  'meta[name="keywords"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'meta[property^="article:"]',
  'script[type="application/ld+json"]',
].join(",");

export function clearPrerenderedSeoTags() {
  document.head.querySelectorAll(PRERENDERED_SEO_SELECTOR).forEach((el) => el.remove());
}
