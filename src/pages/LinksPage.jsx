import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import Seo from "@/components/seo/Seo";

// Lucide dropped brand marks a while back, so Instagram and Facebook are
// hand-drawn here in the same stroke style (viewBox 24, 2px round stroke)
// as every lucide icon elsewhere on the site, rather than pulling in a
// whole separate icon set for two glyphs. X's brand mark is close enough
// to lucide's own "X" (close) icon that it's reused as-is.
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIALS = [
  { href: "https://www.instagram.com/finaiw.inc", icon: InstagramIcon, label: "Instagram" },
  { href: "https://www.facebook.com/share/14sveM9NKs2/", icon: FacebookIcon, label: "Facebook" },
  { href: "https://x.com/Finaiw", icon: X, label: "X" },
];

// A single-page "link in bio" landing — meant for Instagram/X/WhatsApp
// profile links, not for site navigation, so it's kept out of the navbar
// and out of the sitemap. noindex because its only job is to route social
// visitors to the real site and its social accounts, and indexing it
// would just be a thin near-duplicate of /sitemap.
//
// Deliberately just the socials plus one link to the site, not a list of
// individual tools — a social bio visitor wants "where's the real site
// and where else do you post", not a menu they'd get from the navbar
// once they're there anyway.
//
// Fixed dark theme regardless of the visitor's device setting, same as
// the OG share card — this is a one-off "profile card" for distribution
// off-site, not a page someone browses alongside the rest of the site,
// so it gets its own deliberate look instead of following light/dark.
export default function LinksPage() {
  return (
    <>
      <Seo
        title="FINAIW — Links"
        description="Free financial calculators, verdicts and lessons — start here."
        path="/links"
        noindex
      />

      <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#0e1512_0%,#04140f_100%)]">
        {/* Soft glow accents — decorative only, no effect on layout */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#34d399]/20 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#047857]/25 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-[380px] px-6 py-16 text-center">
          <div className="flex items-baseline justify-center">
            <span className="font-display text-[34px] font-extrabold text-[#eef1ec]">FIN</span>
            <span className="font-display text-[34px] font-extrabold text-[#34d399] drop-shadow-[0_0_24px_rgba(52,211,153,0.45)]">
              AIW
            </span>
          </div>
          <div className="mx-auto mt-4 h-[2px] w-10 bg-[#34d399]/60" />
          <p className="mt-4 text-[13.5px] leading-6 text-[#eef1ec]/60">
            Free financial calculators, verdicts &amp; lessons.
            <br />
            No signup, ever.
          </p>

          <Link
            to="/"
            className="group mt-10 flex items-center justify-center gap-2 border border-[#34d399]/30 bg-[#047857] py-4 text-[14.5px] font-semibold text-white shadow-[0_0_30px_-8px_rgba(4,120,87,0.7)] transition hover:scale-[1.02] hover:bg-[#065f46] active:scale-[0.99]"
          >
            Visit finaiw.com
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>

          <p className="mt-10 text-[11.5px] font-semibold uppercase tracking-[0.15em] text-[#eef1ec]/40">
            Follow FINAIW
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center border border-[#eef1ec]/15 text-[#eef1ec]/70 transition hover:scale-110 hover:border-[#34d399]/50 hover:bg-[#34d399]/10 hover:text-[#34d399]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
