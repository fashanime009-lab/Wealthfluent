import { useEffect, useRef } from "react";

// Like setInterval, but pauses while the tab is hidden (backgrounded,
// minimized, a different tab focused) and fires once immediately when it
// becomes visible again before resuming — so a page nobody's looking at
// never keeps polling in the background. Built for the News and Quizzes
// pages, which poll a metered news API on a timer; a background tab
// polling every 60s was burning real API credit for no one.
export default function useVisibleInterval(callback, delay) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return undefined;
    let intervalId = null;

    const start = () => {
      if (intervalId) return;
      intervalId = window.setInterval(() => callbackRef.current(), delay);
    };
    const stop = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        // Catch up right away rather than leaving stale content on screen
        // until the next tick — matches how Slack/Twitter refresh on refocus.
        callbackRef.current();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [delay]);
}
