import { useCallback, useRef, useState } from "react";

const MAX_DEG = 6;
const REST_STYLE = {
  transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
  boxShadow: "0px 18px 40px -14px rgba(0,0,0,0.35)",
  transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease-out",
};

// Perspective tilt for the site's instrument-panel readouts — the panel
// leans toward wherever the pointer is, like a physical object with mass,
// instead of a flat rectangle with a shadow painted on it. It only ever
// moves in direct response to the cursor: no idle motion, nothing plays
// on its own. Disabled entirely for touch (no hover to track) and for
// prefers-reduced-motion, rather than faking the effect on either.
export default function useTilt() {
  const ref = useRef(null);
  const [style, setStyle] = useState(REST_STYLE);
  const enabledRef = useRef(null);

  const isEnabled = () => {
    if (enabledRef.current === null) {
      enabledRef.current =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return enabledRef.current;
  };

  const onPointerMove = useCallback((e) => {
    if (!isEnabled() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * MAX_DEG * 2;
    const rotateX = (0.5 - py) * MAX_DEG * 2;
    const shadowX = (px - 0.5) * -26;
    const shadowY = (py - 0.5) * -18 + 20;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
      boxShadow: `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 42px -14px rgba(0,0,0,0.45)`,
      transition: "transform 0.12s ease-out, box-shadow 0.12s ease-out",
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    if (!isEnabled()) return;
    setStyle(REST_STYLE);
  }, []);

  return { ref, style, onPointerMove, onPointerLeave };
}
