import { useEffect, useState } from "react";
import { Compass, X } from "lucide-react";
import SiteGuide from "./SiteGuide";

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
    () => typeof window !== "undefined" && !localStorage.getItem(COOKIE_CONSENT_KEY)
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (localStorage.getItem(HINT_SEEN_KEY)) return undefined;
    const t = setTimeout(() => setShowHint(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!cookieBannerVisible) return undefined;
    // The banner resolves itself (Accept/Decline) purely via localStorage
    // with no custom event, so poll briefly rather than over-engineer a
    // cross-component event bus for a one-time UI adjustment.
    const interval = setInterval(() => {
      if (localStorage.getItem(COOKIE_CONSENT_KEY)) {
        setCookieBannerVisible(false);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [cookieBannerVisible]);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_SEEN_KEY, "1");
  };

  const toggleGuide = () => {
    setOpen((v) => !v);
    if (showHint) dismissHint();
  };

  return (
    <div className={`fixed right-5 z-[110] transition-[bottom] duration-300 ${cookieBannerVisible ? "bottom-28 sm:bottom-24" : "bottom-5"}`}>
      {open && (
        <div className="relative mb-3 w-[92vw] max-w-[380px]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close guide"
            className="absolute -top-3 -right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,.18)] hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300"
          >
            <X size={16} />
          </button>
          <SiteGuide onNavigate={() => setOpen(false)} />
        </div>
      )}

      {!open && showHint && (
        <div className="absolute bottom-full right-0 mb-3 w-[220px] rounded-2xl bg-slate-950 p-3.5 text-white shadow-[0_16px_35px_rgba(15,23,42,.3)]">
          <button
            onClick={dismissHint}
            aria-label="Dismiss"
            className="absolute right-2 top-2 text-slate-400 hover:text-white"
          >
            <X size={13} />
          </button>
          <p className="pr-4 text-[12.5px] font-semibold leading-5">
            New here? Tap for a 30-second guide to what's on this site.
          </p>
          <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-slate-950" />
        </div>
      )}

      <button
        type="button"
        onClick={toggleGuide}
        aria-label={open ? "Close site guide" : "Open site guide"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-800 text-white shadow-[0_16px_35px_rgba(4,120,87,.35)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
      >
        {open ? <X size={22} /> : <Compass size={22} />}
      </button>
    </div>
  );
}
