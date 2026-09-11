// Google Analytics via Consent Mode v2. The gtag.js script itself always
// loads (see index.html — this is required for Google's own verification
// tools to detect the tag, and lets Consent Mode send cookieless "denied"
// pings that Google can still model against). What this file controls is
// whether real analytics_storage is actually granted, which is the thing
// that determines whether any cookie gets set or any identifiable data is
// collected — not whether the script is present.

function gtagReady() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

// Called from CookieConsent.jsx whenever the visitor's analytics choice is
// known — on save (accept/decline) and on mount if a prior choice is
// already stored. Safe to call even if gtag hasn't finished loading yet
// (rare race on a very slow connection): dataLayer.push still queues it.
export function updateAnalyticsConsent(granted) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

// Same idea for the ad-related consent signals. This is separate from
// whether adsbygoogle.js itself is injected (still handled directly in
// CookieConsent.jsx, unconditionally not loaded until accepted) — this
// additionally tells Google's Consent Mode-aware systems the visitor's
// actual choice, since those signals default to fully denied in
// index.html and would otherwise stay denied forever regardless of what
// the visitor picks.
export function updateAdConsent(granted) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}

// Call on every client-side route change (wired into ScrollToTop.jsx,
// which already listens for route changes for its own purpose). Firing
// this regardless of consent is intentional and matches how Consent Mode
// is meant to work — with storage denied, this becomes an anonymous,
// cookieless ping Google can still use for aggregate modeling; with
// storage granted, it's a normal, fully attributed pageview.
export function trackPageview(path) {
  if (!gtagReady()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
