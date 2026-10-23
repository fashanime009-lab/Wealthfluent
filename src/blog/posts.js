// Loads every post in content/blog/*.md at build time via Vite's
// import.meta.glob (eager + raw text), so adding a second post is
// genuinely just dropping in one more .md file — no import to add here,
// no registry to update.
import { parseFrontmatter } from "./parseFrontmatter";

const modules = import.meta.glob("/content/blog/*.md", { eager: true, query: "?raw", import: "default" });

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

export const BLOG_POSTS = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: data.slug || slugFromPath(path),
      frontmatter: data,
      content,
    };
  })
  .filter((post) => !post.frontmatter.draft)
  // Newest first, by datePublished.
  .sort((a, b) => (a.frontmatter.datePublished < b.frontmatter.datePublished ? 1 : -1));

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}
