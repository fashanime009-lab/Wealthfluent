// Standalone guide pages (content/pages/*.md): long-form pages at a
// top-level URL, with an optional embedded tool. Loaded the same way as
// blog posts (src/blog/posts.js); each page's frontmatter `url` is its
// route, and App.jsx gives that route to GuidePage.
import { parseFrontmatter } from "@/blog/parseFrontmatter";

const modules = import.meta.glob("/content/pages/*.md", { eager: true, query: "?raw", import: "default" });

export const GUIDE_PAGES = Object.values(modules)
  .map((raw) => {
    const { data, content } = parseFrontmatter(raw);
    return { url: data.url, frontmatter: data, content };
  })
  .filter((page) => page.url && !page.frontmatter.draft);

const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export function getGuideByPath(path) {
  return GUIDE_PAGES.find((page) => page.url === normalize(path)) ?? null;
}
