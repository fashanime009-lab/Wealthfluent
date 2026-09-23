// Category identity colors — commits to what the old badge tones only
// hinted at. Each category gets its own hue so a reader can tell what
// kind of tool they're looking at by color alone, not just decoration.
//
// Deliberately kept separate from the verdict system's tone colors (go
// green / counter rust in src/components/verdict/palette.js) — those
// mean "how decisive," these mean "what domain." Retirement went through
// two revisions: first gold (#a16207/#facc15), whose bright variant sat
// only ~5° from the verdict system's then-amber counter (#fbbf24) on the
// hue wheel — genuinely hard to tell apart. Moved to rose, which fixed
// that but drifted from the "warm, earthy" feeling the category wanted.
// Settled on ochre/tan (~42-46°), with the verdict counter itself moved
// to rust/brick (~13-15°) so the two stay ~27-32° apart — both keep a
// warm, earthy identity without reading as the same signal.
export const CATEGORY_COLORS = {
  loan: {
    name: "Loan & Interest",
    light: "#1d4ed8", // blue-700 — on the light field / as a label
    bright: "#60a5fa", // blue-400 — on dark panels / dark mode
    panel: "#0b1220", // dark navy — this category's instrument-panel background
  },
  investment: {
    name: "Investment Planning",
    light: "#047857", // reuses the brand signal — investing is the brand's core
    bright: "#34d399",
    panel: "#0e1512", // the original graphite-green panel
  },
  retirement: {
    name: "Retirement Planning",
    light: "#9c7a2d", // muted ochre/tan
    bright: "#c9a227",
    panel: "#181206", // dark umber
  },
  wealth: {
    name: "Wealth & Goals",
    light: "#7c3aed", // violet-600
    bright: "#a78bfa",
    panel: "#150f1f", // dark plum
  },
};
