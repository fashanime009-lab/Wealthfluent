import { useEffect, useRef, useState } from "react";

// Fires once when the element first scrolls into view — used to trigger a
// single draw-in/fill animation instead of replaying every time the user
// scrolls back past it.
export default function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView];
}
