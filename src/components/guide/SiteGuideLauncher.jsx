import { lazy, Suspense, useEffect, useState } from "react";
import { Compass, X } from "lucide-react";

// The guide panel only exists once opened, so it loads then (warmed on hover/focus).
const loadSiteGuide = () => import("./SiteGuide");
const SiteGuide = lazy(loadSiteGuide);
import { getItem, setItem } from "@/utils/safeStorage";
import { isPrerendering } from "@/utils/prerender";

const HINT_SEEN_KEY = "finaiw-guide-hint-seen";
const COOKIE_CONSENT_KEY = "finaiw-cookie-consent";

export default function SiteGuideLauncher() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // The cookie banner (see CookieConsent.jsx) occupies the bottom of the
  // screen until a choice is made. Sitting at the same bottom-right spot
  // would overlap it, so this button lifts itself up while that banner is
  // still showing.
  const [cookieBannerVisible, setCookieBannerVisible] = useState(
    () => typeof window !== "undefined" && !getItem(COOKIE_CONSENT_KEY)
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (getItem(HINT_SEEN_KEY)) return undefined;
    // Same reason as the cookie banner: a timed hint must not race the snapshot.
    if (isPrerendering()) return undefined;
    const t = setTimeout(() => setShowHint(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!cookieBannerVisible) return undefined;
    // The banner resolves itself (Accept/Decline) purely via localStorage
    // with no custom event, so poll briefly rather than over-engineer a
    // cross-component event bus for a one-time UI adjustment.
    const interval = setInterval(() => {
      if (getItem(COOKIE_CONSENT_KEY)) {
        setCookieBannerVisible(false);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [cookieBannerVisible]);

  const dismissHint = () => {
    setShowHint(false);
    setItem(HINT_SEEN_KEY, "1");
  };

  const toggleGuide = () => {
    setOpen((v) => !v);
    if (showHint) dismissHint();
  };

  return (
    <div className={`fixed right-5 z-[110] transition-[bottom] duration-300 ${cookieBannerVisible ? "bottom-28 sm:bottom-24" : "bottom-5"}`}>
      {open && (
        <div className="mb-3 w-[92vw] max-w-[380px]">
          <Suspense fallback={null}>
            <SiteGuide onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </Suspense>
        </div>
      )}

      {!open && showHint && (
        <div data-runtime-only="site-guide-hint" className="absolute bottom-full right-0 mb-3 w-[220px] border border-[#eef1ec]/15 bg-[#0e1512] p-3.5">
          <button
            onClick={dismissHint}
            aria-label="Dismiss"
            className="absolute right-2.5 top-2.5 text-[#eef1ec]/40 hover:text-[#eef1ec]"
          >
            <X size={13} />
          </button>
          <p className="pr-4 text-[12.5px] leading-5 text-[#eef1ec]/85">
            New here? Tap for a 30-second guide to what's on this site.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={toggleGuide}
        onPointerEnter={loadSiteGuide}
        onFocus={loadSiteGuide}
        aria-label={open ? "Close site guide" : "Open site guide"}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#047857] text-white transition hover:bg-[#065f46] dark:bg-[#34d399] dark:text-[#052e22] dark:hover:bg-[#6ee7b7]"
        style={{ height: 52, width: 52 }}
      >
        {open ? <X size={20} /> : <Compass size={20} />}
      </button>
    </div>
  );
}
