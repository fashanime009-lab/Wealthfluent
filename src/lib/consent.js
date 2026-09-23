import { getItem } from "@/utils/safeStorage";

// The one place the cookie-consent localStorage key and its shape are
// defined. CookieConsent.jsx (the source of truth for what gets written)
// and SiteGuideLauncher.jsx (which reads it to reposition itself) both
// import this instead of redeclaring the string, and anything new that
// needs to gate on consent — like GA4 events below — does too, so there's
// exactly one key to keep in sync rather than three independent copies.
export const COOKIE_CONSENT_KEY = "finaiw-cookie-consent";

function readConsent() {
  try {
    const raw = getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return readConsent()?.analytics === true;
}

export function hasAdConsent() {
  return readConsent()?.advertising === true;
}
