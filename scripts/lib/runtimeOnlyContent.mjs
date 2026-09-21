/**
 * Standing check for scripts/prerender.mjs: anything that should exist only
 * for a real visitor's browser must never end up frozen into a prerendered
 * file. Each snapshot is run through findRuntimeOnlyContent() before it is
 * written, and any hit fails that route (and so the build).
 *
 * This is the general form of a bug class that has bitten three times —
 * localhost ad-request URLs baked into every page, a build-specific AdSense
 * script tag baked into every page, and then that same tag turning out to be
 * a synchronous, parser-blocking <script> in <head> that held first paint for
 * seconds on slow connections. All three came from third-party code or timers
 * acting on the headless snapshot the way they would on a visitor.
 *
 * To keep new runtime-only UI out of the HTML, either skip it while
 * isPrerendering() (src/utils/prerender.js) is true, or at minimum tag its
 * root with data-runtime-only="<name>" so this check catches it if it leaks.
 */

export const RUNTIME_ONLY_ATTR = "data-runtime-only";

// Copy of the runtime-only UI, as a second net in case the attribute is
// ever dropped from one of them.
const RUNTIME_ONLY_TEXT = ["doesn't set tracking cookies", "New here? Tap for a 30-second guide"];

const AD_IFRAME = /<iframe\b[^>]*(?:googlesyndication\.com|doubleclick\.net|adtrafficquality\.google|google\.com\/recaptcha|id="google_ads_iframe)/i;

// What AdSense's responsive-ad code leaves on <main>/wrappers. The app itself
// never writes an inline !important style.
const AD_LAYOUT_STYLE = /style="[^"]*height:\s*auto\s*!important/i;

const decodeAmp = (s) => s.replace(/&amp;/g, "&");

// External <script src> URLs the source template (index.html) declares
// itself — the only ones allowed to appear in a snapshot.
export function readAllowedScriptSrcs(templateHtml) {
  return [...templateHtml.matchAll(/<script\b[^>]*\bsrc="(https?:\/\/[^"]+)"/g)].map((m) => decodeAmp(m[1]));
}

export function findRuntimeOnlyContent(html, { allowedScriptSrcs }) {
  const problems = [];

  for (const m of html.matchAll(/<script\b[^>]*\bsrc="(https?:\/\/[^"]+)"/g)) {
    const src = decodeAmp(m[1]);
    if (!allowedScriptSrcs.includes(src)) problems.push(`script not in the source template: ${src}`);
  }

  if (/<ins\b[^>]*adsbygoogle/i.test(html) || html.includes("data-adsbygoogle-status")) {
    problems.push("ad slot markup (<ins class=\"adsbygoogle\">)");
  }
  if (AD_IFRAME.test(html)) problems.push("ad-network <iframe>");
  if (AD_LAYOUT_STYLE.test(html)) problems.push("ad script layout override (inline height: auto !important)");
  if (/<meta\b[^>]*http-equiv="origin-trial"/i.test(html)) problems.push("origin-trial <meta> injected by ad scripts");

  const local = html.match(/(?:localhost|127\.0\.0\.1):\d+/);
  if (local) problems.push(`local build-server URL: ${local[0]}`);

  for (const m of html.matchAll(new RegExp(`${RUNTIME_ONLY_ATTR}="([^"]*)"`, "g"))) {
    problems.push(`${RUNTIME_ONLY_ATTR} element: ${m[1]}`);
  }

  const text = html.replace(/&#0?39;|&apos;/g, "'");
  for (const phrase of RUNTIME_ONLY_TEXT) {
    if (text.includes(phrase)) problems.push(`runtime-only text: "${phrase}"`);
  }

  return problems;
}
