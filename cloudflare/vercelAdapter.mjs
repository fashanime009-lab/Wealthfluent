// Runs an existing Vercel-style `(req, res)` handler from api/ inside the
// Cloudflare Worker (cloudflare/worker.mjs), so the handler files stay the
// single source of truth. Covers exactly the request/response surface those handlers use:
// req.method/headers/query/body/socket.remoteAddress and
// res.status/json/send/setHeader/writeHead/end.
export function fromVercelHandler(handler) {
  return async (request, context) => {
    const url = new URL(request.url);
    const headers = Object.fromEntries(request.headers);

    let body;
    if (request.method !== "GET" && request.method !== "HEAD") {
      const text = await request.text();
      const type = headers["content-type"] || "";
      if (!text) {
        body = undefined;
      } else if (type.includes("application/json")) {
        try {
          body = JSON.parse(text);
        } catch {
          body = undefined;
        }
      } else if (type.includes("application/x-www-form-urlencoded")) {
        body = Object.fromEntries(new URLSearchParams(text));
      } else {
        body = text;
      }
    }

    const req = {
      method: request.method,
      url: url.pathname + url.search,
      headers,
      query: Object.fromEntries(url.searchParams),
      body,
      socket: { remoteAddress: context?.ip || "unknown" },
    };

    let statusCode = 200;
    const outHeaders = new Headers();
    let finished = false;
    let resolveResponse;
    const response = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    const res = {
      status(code) {
        statusCode = code;
        return res;
      },
      setHeader(name, value) {
        outHeaders.set(name, String(value));
        return res;
      },
      writeHead(code, extraHeaders = {}) {
        statusCode = code;
        for (const [name, value] of Object.entries(extraHeaders)) outHeaders.set(name, String(value));
        return res;
      },
      json(data) {
        if (!outHeaders.has("content-type")) outHeaders.set("content-type", "application/json; charset=utf-8");
        return res.end(JSON.stringify(data));
      },
      send(data) {
        if (data == null) return res.end();
        if (typeof data === "string") {
          if (!outHeaders.has("content-type")) outHeaders.set("content-type", "text/html; charset=utf-8");
          return res.end(data);
        }
        if (data instanceof Uint8Array) return res.end(data);
        return res.json(data);
      },
      end(data) {
        if (!finished) {
          finished = true;
          // 204/304 responses may not carry a body.
          const payload = statusCode === 204 || statusCode === 304 ? null : (data ?? null);
          resolveResponse(new Response(payload, { status: statusCode, headers: outHeaders }));
        }
        return res;
      },
    };

    try {
      await handler(req, res);
    } catch (error) {
      console.error("Unhandled function error:", error);
      if (!finished) res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    if (!finished) res.status(500).json({ success: false, message: "No response from handler" });

    return response;
  };
}
