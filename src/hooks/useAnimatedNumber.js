import { useEffect, useRef, useState } from "react";

// Smoothly tweens a displayed number toward the real target value whenever
// it changes, instead of the number just snapping. No animation library —
// plain requestAnimationFrame.
export default function useAnimatedNumber(target, duration = 450) {
  const [display, setDisplay] = useState(target);
  const frame = useRef(null);
  const from = useRef(target);

  useEffect(() => {
    from.current = display;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(from.current + (target - from.current) * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}
