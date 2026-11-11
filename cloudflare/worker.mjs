// Cloudflare Worker for finaiw.com.
//
// Static files (the prerendered pages, assets, images, ads.txt) are served
// straight from Workers static assets without running this script at all;
// wrangler.jsonc's run_worker_first only sends the dynamic paths below
// here, so ordinary page views never count against the free plan's daily
// Worker request quota.
//
// The api/ handlers are the same Vercel-style (req, res) files Netlify
// runs, wrapped by the same adapter, so there's still one copy of each.
import contact from "../api/contact.js";
import feedback from "../api/feedback.js";
import newsletter from "../api/newsletter.js";
import news from "../api/news.js";
import netWorthShare from "../api/net-worth-share.js";
import { fromVercelHandler } from "../netlify/lib/vercelAdapter.mjs";

const HANDLERS = {
  "/api/contact": fromVercelHandler(contact),
  "/api/feedback": fromVercelHandler(feedback),
  "/api/newsletter": fromVercelHandler(newsletter),
  "/api/news": fromVercelHandler(news),
  "/api/net-worth-share": fromVercelHandler(netWorthShare),
  // The URL people actually share, kept out of /api/.
  "/net-worth-percentile/share": fromVercelHandler(netWorthShare),
};

// Same rounding as api/og/_card.js's clampPercent(), so the lookup lands
// on the file scripts/generate-og-images.mjs wrote for this percentage.
function ogKey(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return null;
  return String(Math.round(n * 10) / 10);
}

// Share cards are pre-rendered at build time (the free plan's 10 ms CPU
// budget can't run satori + resvg per request); /api/og?p= stays the
// public URL so existing share links keep their preview image.
async function serveOgImage(request, env) {
  const key = ogKey(new URL(request.url).searchParams.get("p"));
  if (key === null) return new Response("Missing or invalid p", { status: 400 });

  const file = await env.ASSETS.fetch(new URL(`/og/net-worth/${key}.png`, request.url));
  if (!file.ok) return new Response("Image not found", { status: 404 });

  return new Response(file.body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, immutable, no-transform, max-age=31536000",
    },
  });
}

// _headers marks workers.dev hosts noindex for static assets, but its rules
// don't apply to responses the Worker builds, so do the same here.
function withNoindexOnWorkersDev(request, response) {
  if (!new URL(request.url).hostname.endsWith(".workers.dev")) return response;
  const marked = new Response(response.body, response);
  marked.headers.set("X-Robots-Tag", "noindex");
  return marked;
}

export default {
  async fetch(request, env) {
    return withNoindexOnWorkersDev(request, await route(request, env));
  },
};

async function route(request, env) {
  const { pathname } = new URL(request.url);

  if (pathname === "/api/og") return serveOgImage(request, env);

  const handler = HANDLERS[pathname];
  if (handler) {
    return handler(request, { ip: request.headers.get("CF-Connecting-IP") || "unknown" });
  }

  return env.ASSETS.fetch(request);
}
