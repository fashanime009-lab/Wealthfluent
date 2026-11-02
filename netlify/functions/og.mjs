// Netlify's own OG entry point rather than wrapping api/og/index.js: that
// file's require("satori") ends up inlined in this bundle, where Netlify's
// bundler doesn't see it and never ships the package (502 "Cannot find
// module 'satori'"). Static imports here are traced and shipped.
import fs from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import card from "../../api/og/_card.js";

const { WIDTH, HEIGHT, clampPercent, buildCard } = card;

// Shipped at its repo-relative path via netlify.toml included_files; this
// bundle lands at netlify/functions/og.mjs inside the function, so the
// relative URL resolves the same as in the repo.
const FONT_DATA = fs.readFileSync(new URL("../../api/og/Geist-Regular.ttf", import.meta.url));

export default async (request) => {
  const p = clampPercent(new URL(request.url).searchParams.get("p"));

  if (p === null) {
    return new Response("Missing or invalid p", { status: 400 });
  }

  try {
    const svg = await satori(buildCard(p), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Geist", data: FONT_DATA, weight: 700, style: "normal" }],
    });

    const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();

    return new Response(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    });
  } catch (err) {
    console.error("OG image render failed:", err);
    return new Response("Image generation failed", { status: 500 });
  }
};

export const config = { path: "/api/og" };
