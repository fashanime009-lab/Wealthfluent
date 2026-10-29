import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Seo, { SITE_URL } from "@/components/seo/Seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { getPostBySlug } from "@/blog/posts";
import { formatPostDate } from "@/blog/formatDate";
import { splitIntoH2Sections, sectionHasTable, extractFaqItems } from "@/blog/markdownSections";
import { dimensionsFor } from "@/blog/imageDimensions";

// Joins reviewer names the way the byline needs them: "A, and B" for two,
// "A, B, and C" for three or more — never just a bare comma list, which
// reads as a single run-on name rather than distinct people.
function joinReviewers(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// Parses frontmatter.reviewedBy entries ("Nishit B, Founder") into the
// {name, jobTitle} shape articleSchema's JSON-LD needs, so the structured
// data always matches the visible byline above instead of drifting from it.
function parseReviewers(names) {
  return names.map((entry) => {
    const commaIndex = entry.indexOf(",");
    const name = commaIndex === -1 ? entry.trim() : entry.slice(0, commaIndex).trim();
    const jobTitle = commaIndex === -1 ? undefined : entry.slice(commaIndex + 1).trim();
    return { "@type": "Person", name, ...(jobTitle ? { jobTitle } : {}) };
  });
}

// Internal (root-relative) links use React Router's Link for client-side
// navigation, matching every other internal link on the site; anything
// else (there are none in this post, but future posts might link out)
// stays a plain anchor that opens in a new tab.
function MarkdownLink({ href, children }) {
  if (href?.startsWith("/")) {
    return (
      <Link to={href} className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30"
    >
      {children}
    </a>
  );
}

// Every body image except the hero (rendered separately, see below) is
// lazy-loaded with explicit width/height from the known-dimensions lookup
// so the layout doesn't shift as it loads in.
function MarkdownImage({ src, alt }) {
  const dims = dimensionsFor(src);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={dims?.width}
      height={dims?.height}
      className="w-full border border-[#111814]/10 dark:border-[#eef1ec]/10"
    />
  );
}

// GFM tables are wider than the 720px article column on most posts —
// scroll horizontally on narrow viewports instead of overflowing or
// forcing tiny, unreadable text.
function MarkdownTable({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left text-[13.5px]">{children}</table>
    </div>
  );
}

const markdownComponents = {
  a: MarkdownLink,
  img: MarkdownImage,
  table: MarkdownTable,
  th: ({ children }) => (
    <th className="border-b border-[#111814]/15 py-2.5 pr-4 font-semibold text-[#111814]/70 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/70">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[#111814]/10 py-2.5 pr-4 align-top text-[#111814]/70 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/70">
      {children}
    </td>
  ),
  // h1 deliberately absent — the post's only H1 is frontmatter.h1, rendered
  // once above; the Markdown body never uses a bare "# " line, but if a
  // future post did, letting it fall through to the browser default
  // (rather than styling it like a real heading) keeps that mistake
  // visually obvious instead of quietly producing a second H1.
  h2: ({ children }) => (
    <h2 className="font-display pt-2 text-[21px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-[16px] font-bold text-[#111814] dark:text-[#eef1ec]">{children}</h3>
  ),
  p: ({ children }) => <p className="leading-7">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-[#111814] dark:text-[#eef1ec]">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-6">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#111814]/20 pl-4 italic text-[#111814]/70 dark:border-[#eef1ec]/20 dark:text-[#eef1ec]/65">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="font-mono-tech bg-[#111814]/5 px-1.5 py-0.5 text-[13px] dark:bg-[#eef1ec]/10">{children}</code>
  ),
};

// Defaults match the first post (SIP-focused) so existing frontmatter
// without ctaPath/ctaLabel/ctaDescription keeps rendering identically —
// any post whose relevant tool isn't the SIP Calculator should set those
// three frontmatter fields instead of leaving this pointing at the wrong tool.
function BlogCta({
  path = "/sip-calculator",
  label = "Open the SIP Calculator →",
  description = "Plug in your own timeline and return assumption — the FINAIW SIP Calculator works in any currency.",
}) {
  return (
    <div className="my-8 border border-[#047857]/25 bg-[#047857]/5 px-6 py-6 dark:border-[#34d399]/25 dark:bg-[#34d399]/5">
      <p className="text-[15px] font-semibold text-[#111814] dark:text-[#eef1ec]">
        Find your exact number in 30 seconds.
      </p>
      <p className="mt-1.5 text-[13.5px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">{description}</p>
      <Link
        to={path}
        className="mt-4 inline-block text-[13.5px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30"
      >
        {label}
      </Link>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const { frontmatter, content } = post;
  // heroImage is optional — a post without custom art falls back to the
  // site's default OG image rather than rendering a broken <img src>, so
  // publishing a new post never blocks on having bespoke images ready.
  const absoluteHeroUrl = `${SITE_URL}${frontmatter.heroImage || "/og-image.png"}`;
  const faqItems = extractFaqItems(content);

  // The post body's first line is the hero image, embedded a second time
  // for authors previewing the raw Markdown file directly — it's rendered
  // once already, above, from frontmatter.heroImage, so just that one
  // line is dropped here rather than showing the hero twice. Stripping it
  // from the raw content (not filtering whole sections afterward) matters
  // because the intro paragraphs that follow it on the same unheaded
  // section would otherwise be dropped along with it.
  const bodyWithoutDuplicateHero = content.replace(/^!\[[^\]]*\]\([^)]*\)\s*\n+/, "");
  const sections = splitIntoH2Sections(bodyWithoutDuplicateHero);
  const firstTableIndex = sections.findIndex((section) => sectionHasTable(section));
  const ctaProps = {
    ...(frontmatter.ctaPath && { path: frontmatter.ctaPath }),
    ...(frontmatter.ctaLabel && { label: frontmatter.ctaLabel }),
    ...(frontmatter.ctaDescription && { description: frontmatter.ctaDescription }),
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <Seo
          title={frontmatter.seoTitle}
          appendSiteName={false}
          description={frontmatter.metaDescription}
          path={`/blog/${post.slug}`}
          type="article"
          image={absoluteHeroUrl}
          keywords={(frontmatter.keywords || []).join(", ")}
          publishedTime={frontmatter.datePublished}
          modifiedTime={frontmatter.dateModified}
          jsonLd={[
            articleSchema({
              title: frontmatter.h1,
              description: frontmatter.metaDescription,
              path: `/blog/${post.slug}`,
              publishedTime: frontmatter.datePublished,
              modifiedTime: frontmatter.dateModified,
              image: absoluteHeroUrl,
              reviewedBy: parseReviewers(frontmatter.reviewedBy || []),
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: frontmatter.h1, path: `/blog/${post.slug}` },
            ]),
            ...(faqItems.length ? [faqSchema(faqItems)] : []),
          ]}
        />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#111814]/55 dark:text-[#eef1ec]/50">
          <Link to="/" className="hover:text-[#111814] dark:hover:text-[#eef1ec]">Home</Link>
          <span>›</span>
          <Link to="/blog" className="hover:text-[#111814] dark:hover:text-[#eef1ec]">Blog</Link>
          <span>›</span>
          <span className="truncate text-[#111814]/75 dark:text-[#eef1ec]/70">{frontmatter.h1}</span>
        </nav>

        <h1 className="font-display mt-5 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[38px]">
          {frontmatter.h1}
        </h1>

        <p className="mt-3 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
          By {frontmatter.author} · Reviewed by {joinReviewers(frontmatter.reviewedBy || [])} · Updated{" "}
          {formatPostDate(frontmatter.dateModified)} · {frontmatter.readTime}
        </p>

        {frontmatter.heroImage && (
          <img
            src={frontmatter.heroImage}
            alt={frontmatter.heroAlt || frontmatter.h1}
            width={1200}
            height={630}
            className="mt-8 w-full border border-[#111814]/10 dark:border-[#eef1ec]/10"
          />
        )}

        <div className="prose-blog mt-9 space-y-5 text-[15px] leading-7 text-[#111814]/80 dark:text-[#eef1ec]/80">
          {sections.map((section, i) => (
            <div key={i} className="space-y-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {section}
              </ReactMarkdown>
              {i === firstTableIndex && <BlogCta {...ctaProps} />}
            </div>
          ))}
        </div>

        <BlogCta {...ctaProps} />
      </div>
    </div>
  );
}
