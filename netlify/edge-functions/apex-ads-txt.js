// Serves ads.txt directly on the apex domain instead of redirecting it to www.
// AdSense checks ads.txt on finaiw.com itself, and Netlify's built-in
// "redirect to primary domain" (www) runs before netlify.toml redirect rules,
// so a forced rule can't exempt this one file. Edge functions run first.
// Every other host (www, deploy previews) falls through to the static file.
const APEX = "finaiw.com";

export default async (request, context) => {
  if (new URL(request.url).hostname !== APEX) return context.next();

  // public/ads.txt stays the single source of truth: read it from the www
  // host, which serves the static file without any redirect.
  const upstream = await fetch("https://www.finaiw.com/ads.txt").catch(() => null);
  if (!upstream?.ok) return context.next();

  return new Response(await upstream.text(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

export const config = { path: "/ads.txt" };
