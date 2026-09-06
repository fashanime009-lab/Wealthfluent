import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

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