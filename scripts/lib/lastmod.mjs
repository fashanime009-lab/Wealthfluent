// Real <lastmod> dates for the sitemap, from git history: the date of the
// last commit that touched the files a page is built from. Blog posts keep
// the dateModified from their own frontmatter (set in routes.mjs), which is
// also what their Article schema says.
//
// Needs the full history. .github/workflows/cloudflare.yml checks out with
// fetch-depth: 0; on a shallow clone (or with no git at all) every page
// would look changed "today", so lastmod is left out instead of guessed.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LESSONS } from "../../src/data/lessons.js";

function git(repoRoot, args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function hasFullHistory(repoRoot) {
  try {
    return git(repoRoot, ["rev-parse", "--is-shallow-repository"]) === "false";
  } catch {
    return false;
  }
}

// App.jsx's lazy imports + <Route path element> pairs -> { "/path": "src/pages/X.jsx" }.
function routeSourceFiles(repoRoot) {
  const app = readFileSync(path.join(repoRoot, "src/App.jsx"), "utf-8");
  const components = Object.fromEntries(
    [...app.matchAll(/const (\w+) = lazy\(\(\) => import\("([^"]+)"\)\)/g)].map(([, name, spec]) => [
      name,
      spec.replace(/^@\//, "src/").replace(/^\.\//, "src/"),
    ])
  );
  const files = {};
  for (const [, routePath, name] of app.matchAll(/<Route path="([^"]+)" element=\{<(\w+) \/>\}/g)) {
    const base = components[name];
    if (!base) continue;
    const file = [".jsx", ".js", ".tsx", ".ts"].map((ext) => base + ext).find((f) => {
      try {
        readFileSync(path.join(repoRoot, f));
        return true;
      } catch {
        return false;
      }
    });
    if (file) files[routePath] = file;
  }
  return files;
}

function lastCommitDate(repoRoot, files) {
  const out = git(repoRoot, ["log", "-1", "--format=%cs", "--", ...files]);
  return out || undefined;
}

// Each lesson is one object in src/data/lessons.js, so date the lines of
// that object rather than the whole file.
function lessonRangeDate(repoRoot, slug) {
  const lines = readFileSync(path.join(repoRoot, "src/data/lessons.js"), "utf-8").split("\n");
  const at = lines.findIndex((line) => line.includes(`slug: "${slug}"`));
  if (at === -1) return undefined;
  let start = at;
  while (start > 0 && !/^ {2}\{\s*$/.test(lines[start])) start -= 1;
  let end = at;
  while (end < lines.length - 1 && !/^ {2}\},?\s*$/.test(lines[end])) end += 1;
  const out = git(repoRoot, ["log", "-1", "--format=%cs", "--no-patch", "-L", `${start + 1},${end + 1}:src/data/lessons.js`]);
  return out.split("\n")[0] || undefined;
}

const latest = (...dates) => dates.filter(Boolean).sort().at(-1);

export function addLastmod(routes, repoRoot) {
  if (!hasFullHistory(repoRoot)) {
    console.warn("⚠️  No full git history (shallow clone?): sitemap lastmod left out for non-blog pages.");
    return routes;
  }
  const sources = routeSourceFiles(repoRoot);
  const lessonSlugs = new Set(LESSONS.map((lesson) => lesson.slug));
  const blogDates = routes.filter((r) => r.path.startsWith("/blog/")).map((r) => r.lastmod);

  return routes.map((route) => {
    if (route.lastmod) return route; // blog posts: frontmatter dateModified
    const p = route.path;
    let lastmod;
    if (p.startsWith("/learn/") && lessonSlugs.has(p.slice(7))) {
      lastmod = latest(lessonRangeDate(repoRoot, p.slice(7)), lastCommitDate(repoRoot, [sources["/learn/:slug"]]));
    } else if (p === "/learn") {
      lastmod = lastCommitDate(repoRoot, [sources["/learn"], "src/data/lessons.js"]);
    } else if (p === "/blog") {
      lastmod = latest(lastCommitDate(repoRoot, [sources["/blog"]]), ...blogDates);
    } else if (sources[p]) {
      lastmod = lastCommitDate(repoRoot, [sources[p]]);
    }
    if (!lastmod) console.warn(`⚠️  No source file found for ${p}: lastmod left out.`);
    return lastmod ? { ...route, lastmod } : route;
  });
}
