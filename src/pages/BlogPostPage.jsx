import { Link, Navigate, useParams } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/seo/Seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { getPostBySlug } from "@/blog/posts";
import { formatPostDate } from "@/blog/formatDate";
import { splitIntoH2Sections, sectionHasTable, extractFaqItems } from "@/blog/markdownSections";
import { joinReviewers, parseAuthor, parseReviewers } from "@/blog/people";
import PostMarkdown from "@/blog/PostMarkdown";

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
  // Posts that aren't about a calculator (e.g. compliance guides) set
  // `cta: false` to drop the "Find your exact number" box entirely.
  const showCta = frontmatter.cta !== false;
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
              author: parseAuthor(frontmatter.author),
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
          By {frontmatter.author}
          {frontmatter.reviewedBy?.length > 0 && <> · Reviewed by {joinReviewers(frontmatter.reviewedBy)}</>} · Updated{" "}
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
              <PostMarkdown>{section}</PostMarkdown>
              {showCta && i === firstTableIndex && <BlogCta {...ctaProps} />}
            </div>
          ))}
        </div>

        {showCta && <BlogCta {...ctaProps} />}
      </div>
    </div>
  );
}
