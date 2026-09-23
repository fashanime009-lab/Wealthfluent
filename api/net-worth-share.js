// Share stub for the Global Net Worth Percentile page — a tiny static
// HTML document with server-rendered OG/Twitter tags for a specific
// ?p=<top-percent>, at a clean public URL a visitor might actually paste
// into WhatsApp/X/Reddit. Exists only because the rest of the site is a
// client-rendered SPA prerendered once at BUILD time (see
// scripts/prerender.mjs) — that works for a fixed set of routes, but not
// for the unbounded ?p= value space a percentile can take, so this one
// route is real per-request server rendering instead.
//
// A crawler that fetches this URL directly sees correct preview tags with
// no JavaScript required. A real visitor is redirected on to the actual
// interactive tool (/net-worth-percentile?p=...), which reads the same
// ?p= to show the "Your friend is in the top X%..." banner.
//
// Publicly reachable at /net-worth-percentile/share via the rewrite in
// vercel.json (kept out of /api/ in the URL a person actually shares).
const SITE_URL = "https://www.finaiw.com";

function clampPercent(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return null;
  return Math.round(n * 10) / 10;
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default async function handler(req, res) {
  const p = clampPercent(req.query.p);

  if (p === null) {
    res.writeHead(302, { Location: `${SITE_URL}/net-worth-percentile` });
    res.end();
    return;
  }

  const destination = `/net-worth-percentile?p=${p}`;
  const destinationUrl = `${SITE_URL}${destination}`;
  const ogImageUrl = `${SITE_URL}/api/og?p=${p}`;
  const title = `I'm in the top ${p}% of the world by net worth | FINAIW`;
  const description = `See where your own net worth ranks — free global net worth percentile calculator, any currency, no signup.`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${escapeHtml(destinationUrl)}" />
<meta name="robots" content="noindex, follow" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="FINAIW" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(destinationUrl)}" />
<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />

<meta http-equiv="refresh" content="0;url=${escapeHtml(destination)}" />
<script>location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
<p>Taking you to your result — <a href="${escapeHtml(destination)}">continue</a>.</p>
</body>
</html>`;

  // A given ?p= always produces identical output, so this can be cached
  // hard at the edge; a fresh visit still gets it near-instantly either way.
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
