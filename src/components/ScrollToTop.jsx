import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "../lib/analytics";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // Fires a Google Analytics pageview on every client-side route change.
  // Separate effect from the scroll logic below (different dependency —
  // this shouldn't re-fire on a same-page hash change, only on an actual
  // new route). No-ops safely if analytics was never enabled/loaded.
  useEffect(() => {
    trackPageview(pathname + search);
  }, [pathname, search]);

  useEffect(() => {
    if (hash) {
      // Try immediately; if the target page is still lazy-loading (its DOM
      // node doesn't exist yet), retry once after a short delay instead of
      // falling through to the default scroll-to-top behavior below.
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };

      if (!scrollToHash()) {
        const timeout = setTimeout(scrollToHash, 150);
        return () => clearTimeout(timeout);
      }
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname, hash]);

  return null;
}