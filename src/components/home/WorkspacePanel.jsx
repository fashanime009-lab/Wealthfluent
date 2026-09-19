import { Link } from "react-router-dom";
import VerdictScale from "@/components/verdict/VerdictScale";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import useInView from "@/hooks/useInView";

const SNAPSHOTS = [
  {
    slug: "rent-vs-buy",
    category: "Housing",
    tone: "go",
    a: { label: "Buying", value: 310000 },
    b: { label: "Renting & investing", value: 350000 },
  },
  {
    slug: "debt-vs-invest",
    category: "Debt",
    tone: "go",
    a: { label: "Debt-first", value: 54000 },
    b: { label: "Invest-first", value: 41000 },
  },
  {
    slug: "lease-vs-buy-car",
    category: "Vehicles",
    tone: "caution",
    a: { label: "Buying", value: 19500 },
    b: { label: "Leasing & investing", value: 21000 },
  },
];

export default function WorkspacePanel() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const [ref, inView] = useInView(0.3);

  return (
    // Full-bleed — deliberately breaks out of the page's neutral field
    // into its own colored room, the second "alive" moment on the page
    // after the Hero. Emerald gets a whole surface to own here, not just
    // a rare accent on text.
    <section ref={ref} className="bg-[#052e22] py-20 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[22px] font-extrabold leading-[1.2] tracking-[-0.01em] text-[#eef1ec] sm:text-[26px]">
              You don't need a calculator. You need a verdict.
            </h2>
            <p className="mt-4 max-w-sm text-[14px] leading-7 text-[#eef1ec]/60">
              Rent or buy. Pay off debt or invest. We run the real simulation, month by month, and tell
              you which side wins.
            </p>
            <Link
              to="/verdict"
              className="mt-6 inline-flex h-11 items-center bg-[#34d399] px-5 text-[13.5px] font-semibold text-[#052e22] transition hover:bg-[#6ee7b7]"
            >
              Get your verdict
            </Link>
          </div>

          <div className="divide-y divide-[#eef1ec]/10 border-y border-[#eef1ec]/10">
            {SNAPSHOTS.map((s, i) => (
              <Link
                key={s.slug}
                to={`/verdict/${s.slug}`}
                className={`room-fill-in ${inView ? "is-in-view" : ""} grid gap-4 py-6 transition-opacity hover:opacity-80 sm:grid-cols-[0.9fr_1.4fr] sm:items-center sm:gap-8`}
                style={{ transitionDelay: inView ? `${i * 110}ms` : "0ms" }}
              >
                <span className="text-[12.5px] font-semibold text-[#34d399]">{s.category}</span>
                <VerdictScale a={s.a} b={s.b} fmt={fmt} tone={s.tone} onDark />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
