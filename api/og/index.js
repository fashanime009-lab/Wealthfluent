// Dynamic OG image for shared results — currently just the Global Net
// Worth Percentile page (?p=<top-percent>), built generic enough that
// the verdict pages can add their own ?kind= variant later without a new
// endpoint.
//
// Uses satori + @resvg/resvg-js directly rather than the higher-level
// @vercel/og wrapper. @vercel/og (1.0.3, the current release) turned out
// not to run in this project at all, in any configuration — verified
// against real Vercel deploys, not just `vercel dev`:
//   - `runtime: "edge"` is rejected outright at deploy time (its Edge
//     build references Node's "module" built-in).
//   - Its Node build (dist/index.node.js) is itself an ES module, so a
//     CommonJS require() of it throws ERR_REQUIRE_ESM...
//   - ...but loading it as ESM (a plain import, static or dynamic) hits
//     a *different* failure: a bundled dependency (harfbuzzjs, used
//     internally by its font shaping) calls require("fs") in a way its
//     own esbuild-produced shim rejects once the whole graph is ESM.
// satori and @resvg/resvg-js are the two libraries @vercel/og wraps
// (SVG generation, then SVG->PNG rasterization) — using them directly
// avoids that wrapper's bundle entirely, and both publish a working
// CommonJS build, so this file needs none of the CJS/ESM juggling above.
//
// This directory has its own package.json ("type": "commonjs") so it
// doesn't inherit the project root's "type": "module".
//
// Plain object element trees instead of JSX for the same reason as
// before: a JSX version of this file (api/og.jsx) silently failed to
// register as a Vercel Function at all and fell through to the SPA —
// Vercel's function-file detection doesn't pick up .jsx the way a
// Next.js app's does.
//
// Classic (req, res) handler, matching every other function in api/ —
// NOT `module.exports = (request) => new Response(...)`. That Web-API
// style only takes effect for a NAMED `GET`/`fetch` export; a *default*
// export is always treated as the classic (req, res) signature, and a
// Response it returns is silently discarded (Vercel logs a warning, but
// only after the fact) — the request just hangs with no response ever
// sent, which is exactly what happened here until this was caught by
// testing the endpoint for real rather than trusting a clean deploy.
const fs = require("fs");
const path = require("path");
const satori = require("satori").default;
const { Resvg } = require("@resvg/resvg-js");

const WIDTH = 1200;
const HEIGHT = 630;

// Geist, Vercel's own open-source font (SIL OFL) — the same file
// @vercel/og itself bundles for exactly this purpose. Satori has no
// built-in font and needs the actual bytes; embedded in this directory
// (not read from a node_modules path) so Vercel's function bundler
// reliably includes it regardless of what's a traced dependency.
const FONT_DATA = fs.readFileSync(path.join(__dirname, "Geist-Regular.ttf"));

const el = (type, style, children) => ({ type, props: { style, children } });

function clampPercent(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return null;
  return Math.round(n * 10) / 10;
}

module.exports = async function handler(req, res) {
  const p = clampPercent(req.query.p);

  if (p === null) {
    res.status(400).send("Missing or invalid p");
    return;
  }

  const root = el(
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

  try {
    const svg = await satori(root, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Geist", data: FONT_DATA, weight: 700, style: "normal" }],
    });

    const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, immutable, no-transform, max-age=31536000");
    res.status(200).send(png);
  } catch (err) {
    console.error("OG image render failed:", err);
    res.status(500).send("Image generation failed");
  }
};
