// Shared OG card layout, used by both api/og/index.js (Vercel) and
// netlify/functions/og.mjs (Netlify). Deliberately dependency-free: each
// entry point imports satori/resvg itself, because Netlify's bundler only
// ships those packages when they're static ESM imports in the function.
// Underscore prefix keeps Vercel from treating this file as a function.
const WIDTH = 1200;
const HEIGHT = 630;

const el = (type, style, children) => ({ type, props: { style, children } });

function clampPercent(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return null;
  return Math.round(n * 10) / 10;
}

function buildCard(p) {
  return el(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      background: "linear-gradient(160deg, #0e1512 0%, #04140f 100%)",
      color: "#eef1ec",
      fontFamily: "Geist",
    },
    [
      el("div", { display: "flex", alignItems: "baseline" }, [
        el("span", { fontSize: 40, fontWeight: 700, color: "#ffffff" }, "FIN"),
        el("span", { fontSize: 40, fontWeight: 700, color: "#34d399" }, "AIW"),
      ]),
      el("div", { display: "flex", flexDirection: "column" }, [
        el("span", { fontSize: 26, fontWeight: 700, color: "#34d399", letterSpacing: 1 }, "GLOBAL NET WORTH PERCENTILE"),
        el(
          "span",
          { fontSize: 108, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, marginTop: 12 },
          `Top ${p}% globally`
        ),
        el(
          "span",
          { fontSize: 34, color: "rgba(238,241,236,0.75)", marginTop: 18 },
          "Free global net worth percentile calculator — any currency, no signup"
        ),
      ]),
      el(
        "div",
        { display: "flex", alignItems: "center", fontSize: 28, color: "rgba(238,241,236,0.55)" },
        "finaiw.com/net-worth-percentile"
      ),
    ]
  );
}

module.exports = { WIDTH, HEIGHT, clampPercent, buildCard };
