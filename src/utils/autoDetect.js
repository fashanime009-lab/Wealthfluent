// Client-side-only detection for theme and currency defaults — no IP
// lookup, no geolocation permission prompt, no network call of any kind.
// Both signals come from information the browser already resolves for
// itself (the device's own clock and its own timezone), so this stays
// consistent with the rest of the site's "nothing leaves your device"
// promise: nothing is sent anywhere to make these guesses.

// Simple day/night split by local device hour. Not sunrise/sunset for
// the person's exact coordinates — that would need a geolocation prompt
// or a network call to a sunrise API, both of which cost either a
// permission dialog or a privacy tradeoff this site doesn't make
// elsewhere. 6am-7pm as "day" is a plain, explainable rule that already
// tracks the person's real local time correctly, since it reads straight
// off their device's own clock (which is already set to their timezone).
export function isDaytime(date = new Date()) {
  const hour = date.getHours();
  return hour >= 6 && hour < 19;
}

// Timezone -> currency. The browser resolves this with zero permission
// needed (Intl.DateTimeFormat), and a timezone is a far more reliable
// location signal than navigator.language, which mostly reflects OS
// language settings and stays "en-US" on plenty of devices that have
// never been near the US. Only the currencies this site actually
// supports (see src/data/currencies.js) are mapped; everything else
// falls back to USD.
const EXACT_ZONE_CURRENCY = {
  "Europe/London": "GBP",
  "Europe/Belfast": "GBP",
  "Europe/Isle_of_Man": "GBP",
  "Europe/Jersey": "GBP",
  "Europe/Guernsey": "GBP",
  "Asia/Kolkata": "INR",
  "Asia/Calcutta": "INR",
  "Asia/Tokyo": "JPY",
};

const CANADA_ZONES = new Set([
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns",
  "America/Regina",
  "America/Montreal",
  "America/Iqaluit",
  "America/Whitehorse",
  "America/Yellowknife",
]);

export function detectCurrency() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (EXACT_ZONE_CURRENCY[zone]) return EXACT_ZONE_CURRENCY[zone];
    if (CANADA_ZONES.has(zone)) return "CAD";
    if (zone.startsWith("Australia/")) return "AUD";
    if (zone.startsWith("Europe/")) return "EUR";
    return "USD";
  } catch {
    return "USD";
  }
}
