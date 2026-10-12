import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useTilt from "@/hooks/useTilt";
import { trackEvent } from "@/lib/analytics";

// The one signature "answer" readout, reused everywhere a calculator has a
// single headline number — same dark instrument panel as the homepage's
// live demo, so the whole site says "here's the number" the same way. The
// panel tilts toward the pointer, like a physical object rather than a
// flat rectangle — see useTilt for why it only ever responds to the cursor.
export default function CalcResultPanel({ label, value, note }) {
  const { ref, style, onPointerMove, onPointerLeave } = useTilt();
  const { pathname } = useLocation();
  const fired = useRef(false);

  // Fires once per page visit, the first time a result is actually shown
  // (not on every input tweak) — every calculator renders this component
  // for its headline number, so this is the one place that gives
  // calculator_used coverage for all of them without touching 27+ pages
  // individually. tool_name comes from the route itself, which is already
  // unique per calculator.
  useEffect(() => {
    if (fired.current || value == null || value === "") return;
    fired.current = true;
    trackEvent("calculator_used", { tool_name: pathname.replace(/^\//, "").replace(/-/g, "_") || "home" });
  }, [value, pathname]);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={style}
      className="rounded-lg bg-[#0e1512] p-6 sm:p-7"
    >
      <p className="text-[13px] text-[#eef1ec]/55">{label}</p>
      <p className="font-mono-tech mt-1 text-[30px] font-medium leading-none tabular-nums text-[#34d399] sm:text-[46px]">
        {value}
      </p>
      {note && <p className="mt-3 text-[12.5px] text-[#eef1ec]/50">{note}</p>}
    </div>
  );
}
