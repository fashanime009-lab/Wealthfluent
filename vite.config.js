import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// public/games/ is a separate static app (not a React route) with its own
// index.html. vite preview's static server resolves a directory request to
// its index.html automatically, but vite dev's own middleware doesn't — an
// extension-less URL like /games/ falls through to the SPA's history
// fallback before the public-dir static server gets a chance to resolve it,
// landing on the React app's 404 route instead. This plugin rewrites the
// request to the real file first, early enough (registered directly inside
// configureServer, so it runs before Vite's own internal middlewares) to
// pre-empt that fallback. Dev-server-only — the production build already
// resolves this correctly without it.
function gamesDevFallback() {
  return {
    name: "games-dev-fallback",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/games" || req.url === "/games/") {
          req.url = "/games/index.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), gamesDevFallback()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/journeys": path.resolve(__dirname, "./src/journeys"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/context": path.resolve(__dirname, "./src/context"),
    },
  },
});