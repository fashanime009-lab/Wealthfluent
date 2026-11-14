import { lazy, Suspense, useEffect, useState } from "react";
import { Compass, X } from "lucide-react";

// The guide panel only exists once opened, so it loads then (warmed on hover/focus).
const loadSiteGuide = () => import("./SiteGuide");
const SiteGuide = lazy(loadSiteGuide);
import { getItem, setItem } from "@/utils/safeStorage";
import { COOKIE_CONSENT_KEY } from "@/lib/consent";
import { isPrerendering } from "@/utils/prerender";

const HINT_SEEN_KEY = "finaiw-guide-hint-seen";

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

  // On a phone the button sits on top of whatever is in the bottom-right
  // corner (calculator results, table cells). Slide it out of the way while
  // the reader scrolls down, and bring it back as soon as they scroll up or
  // are near the top of the page.
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (y < 300 || y < lastY - 6) setTucked(false);
        else if (y > lastY + 6) setTucked(true);
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  const hidden = tucked && !open && !showHint;

  const dismissHint = () => {
    setShowHint(false);
    setItem(HINT_SEEN_KEY, "1");
  };

  const toggleGuide = () => {
    setOpen((v) => !v);
    if (showHint) dismissHint();
  };

  return (
    <div
      role="region"
      aria-label="Site guide"
      className={`fixed right-5 z-[110] transition-[bottom,transform,opacity] duration-300 motion-reduce:transition-none ${cookieBannerVisible ? "bottom-28 sm:bottom-24" : "bottom-5"} ${hidden ? "pointer-events-none translate-y-24 opacity-0" : ""}`}
    >
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
            className="absolute right-2.5 top-2.5 text-[#eef1ec]/50 hover:text-[#eef1ec]"
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
        onFocus={() => {
          loadSiteGuide();
          setTucked(false);
        }}
        aria-label={open ? "Close site guide" : "Open site guide"}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#047857] text-white transition hover:bg-[#065f46] dark:bg-[#34d399] dark:text-[#052e22] dark:hover:bg-[#6ee7b7]"
        style={{ height: 52, width: 52 }}
      >
        {open ? <X size={20} /> : <Compass size={20} />}
      </button>
    </div>
  );
}
