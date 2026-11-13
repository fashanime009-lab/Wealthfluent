import { Link, Navigate, useLocation } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/seo/Seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { getGuideByPath } from "@/guides/guides";
import { formatPostDate } from "@/blog/formatDate";
import { extractFaqItems } from "@/blog/markdownSections";
import { joinReviewers, parseAuthor, parseReviewers } from "@/blog/people";
import PostMarkdown from "@/blog/PostMarkdown";
import WealthAgeCalculator from "@/components/calculators/WealthAgeCalculator";

// Tools a guide can embed, by frontmatter `embedTool`. The Markdown marks
// the spot with a line like "[Embed: Wealth Age Calculator]". These are the
// same components the calculator pages use, not copies.
const EMBEDDABLE_TOOLS = {
  "wealth-age-calculator": () => <WealthAgeCalculator stacked />,
};

const EMBED_LINE = /^\[Embed: [^\]]+\]\s*$/m;

/**
 * A standalone guide page (content/pages/*.md) at a top-level URL. Same
 * article styling, byline and Article/FAQ schema as a blog post, but it
 * sits under Tools in the breadcrumb and can embed a working tool.
 */
export default function GuidePage() {
  const { pathname } = useLocation();
  const guide = getGuideByPath(pathname);

  if (!guide) return <Navigate to="/tools" replace />;

  const { frontmatter, content, url } = guide;
  const absoluteHeroUrl = `${SITE_URL}${frontmatter.heroImage || "/og-image.png"}`;
  const faqItems = extractFaqItems(content);

  // The body's first line repeats the hero image for anyone previewing the
  // raw Markdown; it's rendered once from frontmatter.heroImage below.
  const body = content.replace(/^!\[[^\]]*\]\([^)]*\)\s*\n+/, "");
  const [beforeEmbed, afterEmbed] = EMBED_LINE.test(body) ? body.split(EMBED_LINE) : [body, null];
  const Tool = EMBEDDABLE_TOOLS[frontmatter.embedTool];

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <Seo
          title={frontmatter.seoTitle}
          appendSiteName={false}
          description={frontmatter.metaDescription}
          path={url}
          type="article"
          image={absoluteHeroUrl}
          keywords={(frontmatter.keywords || []).join(", ")}
          publishedTime={frontmatter.datePublished}
          modifiedTime={frontmatter.dateModified}
          jsonLd={[
            articleSchema({
              title: frontmatter.h1,
              description: frontmatter.metaDescription,
              path: url,
              publishedTime: frontmatter.datePublished,
              modifiedTime: frontmatter.dateModified,
              image: absoluteHeroUrl,
              reviewedBy: parseReviewers(frontmatter.reviewedBy || []),
              author: parseAuthor(frontmatter.author),
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
              { name: frontmatter.h1, path: url },
            ]),
            ...(faqItems.length ? [faqSchema(faqItems)] : []),
          ]}
        />

        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#111814]/55 dark:text-[#eef1ec]/50">
          <Link to="/" className="hover:text-[#111814] dark:hover:text-[#eef1ec]">Home</Link>
          <span>›</span>
          <Link to="/tools" className="hover:text-[#111814] dark:hover:text-[#eef1ec]">Tools</Link>
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
          <PostMarkdown>{beforeEmbed}</PostMarkdown>
        </div>

        {afterEmbed !== null && Tool && (
          <div className="my-10">
            <Tool />
          </div>
        )}

        {afterEmbed !== null && (
          <div className="prose-blog space-y-5 text-[15px] leading-7 text-[#111814]/80 dark:text-[#eef1ec]/80">
            <PostMarkdown>{afterEmbed}</PostMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
