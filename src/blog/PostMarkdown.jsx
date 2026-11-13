import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { dimensionsFor } from "@/blog/imageDimensions";

// Renders a chunk of post/guide Markdown with the site's article styling.
// Shared by BlogPostPage and GuidePage so both look and behave the same.

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
      className={`w-full border border-[#111814]/10 dark:border-[#eef1ec]/10 ${dims?.maxWidth ? "mx-auto" : ""}`}
      style={dims?.maxWidth ? { maxWidth: dims.maxWidth } : undefined}
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

export default function PostMarkdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {children}
    </ReactMarkdown>
  );
}
