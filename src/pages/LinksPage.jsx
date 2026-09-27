import { Link } from "react-router-dom";
import {
  Percent,
  Calculator,
  Scale,
  BookOpen,
  Info,
  Wallet,
} from "lucide-react";
import Seo from "@/components/seo/Seo";

// A single-page "link in bio" landing — meant for Instagram/X/WhatsApp
// profile links, not for site navigation, so it's kept out of the navbar
// and out of the sitemap. noindex because its only job is a list of links
// to pages that are already indexed on their own; indexing this too would
// just be a near-duplicate of /sitemap.
const LINKS = [
  {
    to: "/net-worth-percentile",
    icon: Percent,
    label: "Global Net Worth Percentile",
    desc: "See where you rank against the world",
  },
  {
    to: "/sip-calculator",
    icon: Wallet,
    label: "SIP Calculator",
    desc: "What your monthly investing grows to",
  },
  {
    to: "/verdict",
    icon: Scale,
    label: "Verdict",
    desc: "Rent vs buy, debt vs invest, and more — decided",
  },
  {
    to: "/calculators",
    icon: Calculator,
    label: "All calculators",
    desc: "EMI, FD, CAGR, retirement, tax and more",
  },
  {
    to: "/learn",
    icon: BookOpen,
    label: "Learn",
    desc: "One real financial lesson a day",
  },
  {
    to: "/about",
    icon: Info,
    label: "About FINAIW",
    desc: "Who's behind it and how we check our numbers",
  },
];

export default function LinksPage() {
  return (
    <>
      <Seo
        title="FINAIW — Links"
        description="Free financial calculators, verdicts and lessons — start here."
        path="/links"
        noindex
      />

      <div className="min-h-[80vh] bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[440px] px-5 py-16 text-center">
          <div className="flex items-baseline justify-center">
            <span className="font-display text-[26px] font-extrabold text-[#111814] dark:text-[#eef1ec]">FIN</span>
            <span className="font-display text-[26px] font-extrabold text-[#047857] dark:text-[#34d399]">AIW</span>
          </div>
          <p className="mt-2 text-[13.5px] text-[#111814]/60 dark:text-[#eef1ec]/60">
            Free financial calculators, verdicts &amp; lessons. No signup.
          </p>

          <div className="mt-10 space-y-3">
            {LINKS.map(({ to, icon: Icon, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-4 border border-[#111814]/12 bg-[#ffffff] px-5 py-4 text-left transition hover:border-[#111814]/30 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] dark:hover:border-[#eef1ec]/30"
              >
                <Icon size={18} className="flex-shrink-0 text-[#047857] dark:text-[#34d399]" />
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold text-[#111814] dark:text-[#eef1ec]">{label}</span>
                  <span className="block text-[12.5px] text-[#111814]/55 dark:text-[#eef1ec]/50">{desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/"
            className="mt-10 inline-block text-[13px] font-semibold text-[#111814]/60 underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec]/55 dark:decoration-[#eef1ec]/25"
          >
            finaiw.com
          </Link>
        </div>
      </div>
    </>
  );
}
