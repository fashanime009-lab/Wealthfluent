import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { WorkspaceProvider } from "./context/WorkspaceContext";

import { FinanceProvider } from "./context/FinanceContext";

import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";

// Every page ships prerendered (see scripts/prerender.mjs) and this is a full
// client render, not hydration, so mounting replaces that static markup — first
// with the router's Suspense fallback while the route chunk loads. If that
// happens before the browser has presented the static page, the page's real
// content is thrown away before it can count as the Largest Contentful Paint,
// and LCP becomes whatever React renders later (in practice the cookie banner).
// So wait for the first paint, then mount. Never longer than the safety timeout,
// and straight away in a background tab, where painting is suspended.
function mountAfterFirstPaint(mount) {
  let mounted = false;
  const run = () => {
    if (mounted) return;
    mounted = true;
    mount();
  };

  if (document.visibilityState === "hidden" || !window.PerformanceObserver) {
    run();
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().some((entry) => entry.name === "first-contentful-paint")) {
        observer.disconnect();
        requestAnimationFrame(() => setTimeout(run, 0));
      }
    });
    observer.observe({ type: "paint", buffered: true });
  } catch {
    run();
    return;
  }
  window.setTimeout(run, 1500);
}

mountAfterFirstPaint(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <HelmetProvider>
        <ThemeProvider>
          <FinanceProvider>
            <SettingsProvider>
              <WorkspaceProvider>
                <App />
              </WorkspaceProvider>
            </SettingsProvider>
          </FinanceProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
});