import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Reusable AdSense/Ezoic display ad slot.
 * Give every placement a unique slotId so performance can be tracked per-placement
 * in the ad network dashboard.
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
  const insRef = useRef(null);

  useEffect(() => {
    try {
      if (insRef.current && !insRef.current.dataset.adsbygoogleStatus) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      console.error("AdSense push failed");
    }
  }, []);

  return (
    <div
      className={`flex w-full justify-center overflow-hidden my-6 ${className}`}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
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
