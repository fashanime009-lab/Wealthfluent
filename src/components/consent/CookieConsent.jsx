import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getItem, setItem } from "../../utils/safeStorage";
import { updateAnalyticsConsent, updateAdConsent } from "../../lib/analytics";
import { isPrerendering } from "../../utils/prerender";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 border transition ${
        checked
          ? "border-[#047857] bg-[#047857] dark:border-[#34d399] dark:bg-[#34d399]"
          : "border-[#111814]/20 bg-transparent dark:border-[#eef1ec]/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-3.5 w-3.5 transition ${
          checked ? "left-[18px] bg-[#eef1ec] dark:bg-[#052e22]" : "left-0.5 bg-[#111814]/35 dark:bg-[#eef1ec]/35"
        }`}
      />
    </button>
  );
}

const STORAGE_KEY = "finaiw-cookie-consent";

// Advertising (Google AdSense) and analytics (Google Analytics) are the
// two things on the whole site that actually set a cookie — everything
// else FINAIW remembers about you (financial profile, goals, streak,
// theme, currency) is localStorage: first-party, device-only, never sent
// to us or anyone else, and not something cookie-consent rules apply to.
// Both Google scripts always load (see index.html) so Google's own
// verification crawlers can find them without clicking this banner; what
// this component actually controls is the Consent Mode signals
// (updateAdConsent / updateAnalyticsConsent) that tell those scripts
// whether they're allowed to set a cookie or personalize anything — not
// whether the script is present at all.

// Reads whatever's in localStorage and normalizes it to the current shape.
// Handles three generations of stored value: the original plain
// "accepted"/"declined" string, the first categorized shape
// ({ advertising }), and the current one ({ advertising, analytics }) — an
// old visitor from either earlier era still works instead of the banner
// re-showing needlessly. A record with only `advertising` (pre-analytics)
// carries that same choice over to `analytics`, treating it as the single
// bundled decision it was at the time.
function readStoredConsent() {
  if (typeof window === "undefined") return null;
  const raw = getItem(STORAGE_KEY);
  if (!raw) return null;
  if (raw === "accepted") return { advertising: true, analytics: true };
  if (raw === "declined") return { advertising: false, analytics: false };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.advertising !== "boolean") return null;
    return {
      advertising: parsed.advertising,
      analytics: typeof parsed.analytics === "boolean" ? parsed.analytics : parsed.advertising,
    };
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(() => readStoredConsent());
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draftAdvertising, setDraftAdvertising] = useState(true);
  const [draftAnalytics, setDraftAnalytics] = useState(true);

  useEffect(() => {
    if (consent) {
      updateAdConsent(consent.advertising === true);
      updateAnalyticsConsent(consent.analytics === true);
      return undefined;
    }
    // Never show in the prerender snapshot: the timer below races the capture,
    // and a dialog frozen into static HTML is dead markup that flashes at
    // every returning visitor. Real visitors never set this flag.
    if (isPrerendering()) return undefined;
    // Small delay so it doesn't compete with the initial page paint.
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (advertising, analytics) => {
    const value = { advertising, analytics, decidedAt: new Date().toISOString() };
    setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    updateAdConsent(advertising);
    updateAnalyticsConsent(analytics);
    setVisible(false);
    setExpanded(false);
  };

  if (consent || !visible) return null;

  return (
    <div data-runtime-only="cookie-consent" className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 sm:p-5">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col border border-[#111814]/12 bg-[#eef1ec] dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
        <div className="flex flex-shrink-0 flex-col gap-4 border-b border-[#111814]/10 p-5 dark:border-[#eef1ec]/10 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-[13px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
              FINAIW itself doesn't set tracking cookies. Analytics and advertising <em>do</em> use
              real cookies, and it's your call whether to allow them.{" "}
              <Link
                to="/privacy-policy"
                className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-2 dark:text-[#34d399] dark:decoration-[#34d399]/30"
              >
                Privacy Policy
              </Link>
            </p>
            <button
              onClick={() => {
                setDraftAdvertising(true);
                setDraftAnalytics(true);
                setExpanded((v) => !v);
              }}
              className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#111814]/55 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:text-[#eef1ec]"
            >
              {expanded ? "Hide details" : "See exactly what's stored, and choose"}
              <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="flex w-full flex-shrink-0 gap-2.5 sm:w-auto">
            <button
              onClick={() => save(false, false)}
              className="flex-1 border border-[#111814]/20 px-4 py-2.5 text-[13px] font-semibold text-[#111814]/70 transition hover:border-[#111814]/35 sm:flex-none dark:border-[#eef1ec]/20 dark:text-[#eef1ec]/70 dark:hover:border-[#eef1ec]/35"
            >
              Decline
            </button>
            <button
              onClick={() => save(true, true)}
              className="flex-1 bg-[#047857] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#065f46] sm:flex-none"
            >
              Accept
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-4 overflow-y-auto border-t border-[#111814]/10 p-5 dark:border-[#eef1ec]/10">
            {/* Necessary — this is genuinely not a cookie, and genuinely
                can't be turned off without breaking the product, so it's
                shown as always-on rather than as a fake toggle. */}
            <div className="flex items-start justify-between gap-4 border-t border-[#111814]/10 pt-4 first:border-t-0 first:pt-0 dark:border-[#eef1ec]/10">
              <div className="min-w-0">
                <p className="font-display text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                  Local storage (not a cookie) — always on
                </p>
                <p className="mt-1 text-[12.5px] leading-5 text-[#111814]/55 dark:text-[#eef1ec]/55">
                  Your financial profile, goals, learning streak, calculator history, and
                  display preferences (theme, currency — often auto-set from your device's clock
                  and timezone) are saved on this device only, so the app remembers them between
                  visits. Nothing is transmitted to FINAIW's servers
                  or any third party — you can verify or clear it anytime from{" "}
                  <Link
                    to="/settings"
                    className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-2 dark:text-[#34d399] dark:decoration-[#34d399]/30"
                  >
                    Settings
                  </Link>
                  . This isn't part of cookie consent rules and can't be meaningfully "declined"
                  without breaking the calculators and dashboard themselves.
                </p>
              </div>
              <span className="mt-0.5 flex-shrink-0 text-[11px] font-semibold text-[#111814]/40 dark:text-[#eef1ec]/40">
                Always on
              </span>
            </div>

            {/* Analytics — real cookies (Google Analytics), genuinely optional. */}
            <div className="flex items-start justify-between gap-4 border-t border-[#111814]/10 pt-4 dark:border-[#eef1ec]/10">
              <div className="min-w-0">
                <p className="font-display text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                  Analytics cookies (Google Analytics)
                </p>
                <p className="mt-1 text-[12.5px] leading-5 text-[#111814]/55 dark:text-[#eef1ec]/55">
                  If enabled, Google Analytics sets cookies to help us see which calculators
                  and pages people actually use, so we know what to improve or build next. If
                  you turn this off, no analytics cookies are set and every tool on the site
                  still works exactly the same.
                </p>
              </div>
              <Toggle
                checked={draftAnalytics}
                onChange={() => setDraftAnalytics((v) => !v)}
                label="Toggle analytics cookies"
              />
            </div>

            {/* Advertising — real cookies (Google AdSense), genuinely optional. */}
            <div className="flex items-start justify-between gap-4 border-t border-[#111814]/10 pt-4 dark:border-[#eef1ec]/10">
              <div className="min-w-0">
                <p className="font-display text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                  Advertising cookies (Google AdSense)
                </p>
                <p className="mt-1 text-[12.5px] leading-5 text-[#111814]/55 dark:text-[#eef1ec]/55">
                  If enabled, Google AdSense sets cookies to show ads and measure their
                  performance — this is what keeps every calculator on FINAIW free. If you turn
                  this off, no ad cookies are set and every tool on the site still works exactly
                  the same; you just won't see ads.
                </p>
              </div>
              <Toggle
                checked={draftAdvertising}
                onChange={() => setDraftAdvertising((v) => !v)}
                label="Toggle advertising cookies"
              />
            </div>

            <div className="flex justify-end border-t border-[#111814]/10 pt-4 dark:border-[#eef1ec]/10">
              <button
                onClick={() => save(draftAdvertising, draftAnalytics)}
                className="bg-[#047857] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#065f46]"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
