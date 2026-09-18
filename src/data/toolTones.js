// Identity colors for the /tools instruments — deliberately NOT borrowed
// from the calculator category system (categoryColors.js), since these
// aren't calculators and shouldn't visually read as one. Picked to sit
// clear of every existing hue in the palette: rust ~14°, ochre ~44°,
// brand green ~160°, cobalt ~217°, violet ~262°. Teal ~190° sits in the
// 57° gap between green and cobalt, ~28-30° from each — the same margin
// this codebase already established as enough to read as distinct (see
// categoryColors.js's ochre/rust history). Rose ~347° sits in the wide
// gap after violet, well clear of both violet and rust.
export const TOOL_TONES = {
  goalPlanner: {
    name: "Financial Goal Planner",
    light: "#0e7490", // cyan-700 — on the light field / as a label
    bright: "#22d3ee", // cyan-400 — on dark panels / dark mode
    panel: "#062024", // dark teal — this tool's instrument-panel background
  },
  riskAnalyzer: {
    name: "Investment Risk Analyzer",
    light: "#be123c", // rose-700
    bright: "#fb7185", // rose-400
    panel: "#1f0a10", // dark rose-black
  },
  healthCheckup: {
    name: "Financial Health Checkup",
    light: "#1d4ed8", // cobalt-700
    bright: "#60a5fa", // cobalt-400
    panel: "#0a1530", // dark cobalt-black
  },
  debtStrategy: {
    name: "Debt Payoff Strategy Planner",
    light: "#c2410c", // rust-700
    bright: "#fb923c", // rust-400
    panel: "#241006", // dark rust-black
  },
};
