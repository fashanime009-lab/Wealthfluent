import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { isPrerendering } from "@/utils/prerender";

// Runs `fn` once the page has finished loading AND the browser is idle, so ad
// work never competes with the content, fonts and scripts the first paint
// needs. Returns a function that cancels it.
function afterLoadAndIdle(fn) {
  let cancelled = false;
  let idleId;
  let timerId;

  const run = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => !cancelled && fn(), { timeout: 3000 });
    } else {
      timerId = window.setTimeout(() => !cancelled && fn(), 200);
    }
  };

  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
}

/**
 * Reusable AdSense/Ezoic display ad slot.
 * Give every placement a unique slotId so performance can be tracked per-placement
 * in the ad network dashboard.
 *
 * WHEN THE AD IS REQUESTED — the <ins> is always rendered, but the request
 * (adsbygoogle.push) is deferred until the page has loaded and gone idle, and
 * then only fires once the slot is within ~400px of the viewport. Requesting
 * on mount meant every slot on the page — including ones several screens down
 * — asked for an ad while the page was still trying to paint. The adsbygoogle.js
 * tag in index.html is untouched (AdSense verification needs it present); only
 * when slots are initialised changes. If IntersectionObserver is missing the
 * ad is requested right after idle. Nothing is requested while prerendering.
 *
 * IMPORTANT: format="auto" + data-full-width-responsive reserves height
 * *before* an ad is known to fill, and that reserved height can balloon to
 * several hundred (sometimes thousand+) pixels depending on the container's
 * width. Left uncapped, that has repeatedly broken page layouts (huge blank
 * gaps, or — inside a CSS grid — stretching every sibling card to match).
 * `maxHeight` clamps this everywhere by default; pass a taller value only
 * for a placement that's deliberately sized for a big ad unit.
 */
export default function AdSlot({ slotId, format = "auto", className = "", maxHeight = 280 }) {
  const boxRef = useRef(null);
  const insRef = useRef(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    const ins = insRef.current;
    const box = boxRef.current;
    if (!ins || !box || isPrerendering()) return undefined;

    let observer;

    const requestAd = () => {
      if (requestedRef.current || ins.dataset.adsbygoogleStatus) return;
      requestedRef.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        console.error("AdSense push failed");
      }
    };

    const cancelIdle = afterLoadAndIdle(() => {
      if (typeof IntersectionObserver === "undefined") {
        requestAd();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            requestAd();
          }
        },
        { rootMargin: "400px 0px" }
      );
      observer.observe(box);
    });

    return () => {
      cancelIdle();
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`flex w-full justify-center overflow-hidden my-6 ${className}`}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-1366197478696723"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

AdSlot.propTypes = {
  slotId: PropTypes.string.isRequired,
  format: PropTypes.string,
  className: PropTypes.string,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};
