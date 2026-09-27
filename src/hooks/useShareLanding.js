import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

// Reads a numeric share param (e.g. ?p=63.2 on a shared link) once per
// page load, firing a share_landing GA4 event when it's present and
// valid. Generic across tools: pass the query param name this page uses
// and a short context string to tell events from different tools apart.
// Returns the parsed number (never the full precision an attacker-ish
// value could carry — capped to 0 < n <= 100), or null when absent/bad.
export default function useShareLanding(paramName, { context } = {}) {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get(paramName);

  const value = useMemo(() => {
    const n = Number(raw);
    return raw != null && Number.isFinite(n) && n > 0 && n <= 100 ? Math.round(n * 10) / 10 : null;
  }, [raw]);

  // Guards against StrictMode's dev-only double-invoked effects firing this
  // twice for the same value — harmless in production (StrictMode doesn't
  // do this there) but worth not double-counting in dev either.
  const trackedValue = useRef(null);
  useEffect(() => {
    if (value === null || trackedValue.current === value) return;
    trackedValue.current = value;
    trackEvent("share_landing", { p: value, context });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return value;
}
