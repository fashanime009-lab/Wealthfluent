// True only inside the headless Chromium that scripts/prerender.mjs uses to
// snapshot each route into static HTML — it sets window.__PRERENDER__ before
// any page script runs. Anything that should exist only for a real visitor
// (a consent dialog, a first-visit hint, live ad requests) checks this and
// skips itself, so it can't race the snapshot and end up frozen into the
// shipped HTML. Real browsers never set the flag.
export const isPrerendering = () => typeof window !== "undefined" && window.__PRERENDER__ === true;
