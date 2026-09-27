import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { trackEvent } from "@/lib/analytics";

// Solid, filled brand glyphs on a tinted circular badge — the earlier
// thin gray outline icons barely showed up against the dark background.
// Instagram is built from plain shapes (rounded square + ring + dot) so
// there's zero risk of a malformed hand-typed path; Facebook and X use
// their well-known, widely-republished single-path glyphs.
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="white" stroke="none" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
      <path d="M15.5 8.5h2.1V5.6c-.4-.05-1.6-.16-2.9-.16-2.9 0-4.9 1.77-4.9 5.02v2.6H6.9v3.26h2.9V21h3.3v-6.68h2.8l.45-3.26h-3.25v-2.26c0-.95.26-1.6 1.6-1.6z" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
      <path d="M13.6 10.6 21 2h-2.2l-6.4 7.3L7.3 2H2l7.8 11.3L2 22h2.2l6.8-7.7 5.4 7.7H22l-8.4-11.4Zm-2.4 2.7-.8-1.1L4.1 3.6h2.4l5.1 7.2.8 1.1 6.6 9.3h-2.4l-5.4-7.5Z" />
    </svg>
  );
}

const SOCIALS = [
  {
    href: "https://www.instagram.com/finaiw.inc",
    Glyph: InstagramGlyph,
    label: "Instagram",
    className: "bg-[radial-gradient(circle_at_30%_110%,#feda75,#fa7e1e_28%,#d62976_48%,#962fbf_68%,#4f5bd5_88%)]",
  },
  {
    href: "https://www.facebook.com/share/14sveM9NKs2/",
    Glyph: FacebookGlyph,
    label: "Facebook",
    className: "bg-[#1877F2]",
  },
  {
    href: "https://x.com/Finaiw",
    Glyph: XGlyph,
    label: "X",
    className: "bg-[#0b1210] border border-white/25",
  },
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
            {SOCIALS.map(({ href, Glyph, label, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                onClick={() => trackEvent("outbound_click", { platform: label.toLowerCase(), from: "links_page" })}
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-black/30 transition hover:scale-110 ${className}`}
              >
                <Glyph />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
