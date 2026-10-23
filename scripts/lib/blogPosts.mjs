// Node-side mirror of src/blog/posts.js, for build scripts that run under
// plain Node (route listing for the sitemap/prerender crawl) rather than
// through Vite's bundler — import.meta.glob only exists in Vite, so this
// reads content/blog/*.md directly off disk instead. Both share the exact
// same parseFrontmatter() so the parsing logic itself can't drift between
// the two.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "../../src/blog/parseFrontmatter.js";

export function getBlogPosts(repoRoot) {
  const blogDir = path.join(repoRoot, "content/blog");
  let files;
  try {
    files = readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  return files
    .map((file) => {
      const raw = readFileSync(path.join(blogDir, file), "utf-8");
      const { data } = parseFrontmatter(raw);
      return {
        slug: data.slug || file.replace(/\.md$/, ""),
        frontmatter: data,
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.datePublished < b.frontmatter.datePublished ? 1 : -1));
}
