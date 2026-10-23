import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { BLOG_POSTS } from "@/blog/posts";
import { formatPostDate } from "@/blog/formatDate";

function PostCard({ post }) {
  const { frontmatter } = post;
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block border-b border-[#111814]/10 py-8 transition-opacity hover:opacity-80 dark:border-[#eef1ec]/10 sm:flex sm:items-start sm:gap-8 sm:py-10"
    >
      <img
        src={frontmatter.heroImage}
        alt={frontmatter.heroAlt || frontmatter.h1}
        width={1200}
        height={630}
        loading="lazy"
        className="aspect-[1200/630] w-full flex-shrink-0 border border-[#111814]/10 object-cover dark:border-[#eef1ec]/10 sm:w-[280px]"
      />
      <div className="mt-5 min-w-0 sm:mt-0">
        <span className="text-[12px] font-semibold text-[#047857] dark:text-[#34d399]">{frontmatter.category}</span>
        <h2 className="font-display mt-1.5 text-[20px] font-extrabold leading-snug text-[#111814] dark:text-[#eef1ec]">
          {frontmatter.h1}
        </h2>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
          {frontmatter.metaDescription}
        </p>
        <div className="mt-3 flex items-center gap-2 text-[12.5px] text-[#111814]/55 dark:text-[#eef1ec]/50">
          <span>{formatPostDate(frontmatter.datePublished)}</span>
          <span>·</span>
          <span>{frontmatter.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndexPage() {
  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[800px] px-5 py-16 sm:px-8 lg:px-12">
        <Seo
          title="Blog — Real Numbers on Investing, Saving and Planning"
          description="FINAIW's blog: clear, number-first articles on investing, saving, retirement and goal planning — reviewed by our team, not AI-generated filler."
          path="/blog"
          keywords="personal finance blog, investing articles, how to invest, financial planning blog"
          jsonLd={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ])}
        />

        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Blog</span>
        <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
          Real numbers, not advice columns
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Worked examples and real figures on investing, saving and planning — reviewed by our team
          before anything goes out.
        </p>

        <div className="mt-12">
          {BLOG_POSTS.length === 0 ? (
            <p className="border border-[#111814]/10 p-6 text-center text-[13px] font-medium text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
              No posts yet — check back soon.
            </p>
          ) : (
            BLOG_POSTS.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
