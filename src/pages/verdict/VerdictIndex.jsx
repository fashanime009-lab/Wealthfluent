import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "@/components/ads/AdSlot";
import VerdictScale from "@/components/verdict/VerdictScale";
import VerdictContent from "@/components/verdict/VerdictContent";
import { VERDICT_INDEX } from "@/data/verdictContent";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

const decisions = [
  {
    slug: "rent-vs-buy",
    category: "Housing",
    title: "Rent vs Buy",
    description: "Should you buy a home or keep renting and invest the difference?",
    tone: "go",
    a: { label: "Buying", value: 310000 },
    b: { label: "Renting & investing", value: 350000 },
    example: "A representative home price vs. rent, over 10 years",
  },
  {
    slug: "debt-vs-invest",
    category: "Debt",
    title: "Pay Off Debt vs Invest",
    description: "Extra cash each month — debt or the market? Simulated for your real numbers.",
    tone: "go",
    a: { label: "Debt-first", value: 54000 },
    b: { label: "Invest-first", value: 41000 },
    example: "A high-interest debt balance vs. a 12% expected return",
  },
  {
    slug: "lease-vs-buy-car",
    category: "Vehicles",
    title: "Lease vs Buy a Car",
    description: "The lower lease payment is obvious. What it costs long-term isn't.",
    tone: "caution",
    a: { label: "Buying", value: 19500 },
    b: { label: "Leasing & investing", value: 21000 },
    example: "A mid-range car over a 5-year loan or lease",
  },
  {
    slug: "insurance-need",
    category: "Insurance",
    title: "How Much Term Insurance Do You Need?",
    description: "Not '10x your income' — the real number, based on your debts, goals and savings.",
    tone: "stop",
    a: { label: "What you'd need", value: 6200000 },
    b: { label: "What you have", value: 2000000 },
    example: "A mid-income earner with an outstanding home loan",
  },
  {
    slug: "term-vs-endowment",
    category: "Insurance",
    title: "Term Insurance vs Endowment/ULIP",
    description: "Same premium, two paths — a cheap term plan plus investing, or one bundled policy.",
    tone: "go",
    a: { label: "Term + invest", value: 2017000 },
    b: { label: "Endowment / ULIP", value: 1395000 },
    example: "A ₹40,000/yr premium budget over 20 years",
  },
];

export default function VerdictIndex() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
    <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8 lg:px-12">
      <Seo
        title="Verdict — Financial Decisions, Decided"
        description="Real answers to the money decisions you're actually stuck on — rent vs buy, debt vs invest, lease vs buy a car, how much insurance you need, and term vs endowment — with the math shown. Free, no signup."
        path="/verdict"
        keywords="rent vs buy calculator, pay off debt vs invest, lease vs buy car, term insurance calculator, term vs endowment, financial decision tool"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Verdict", path: "/verdict" },
          ]),
          faqSchema(VERDICT_INDEX.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <h1 className="font-display max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
        You don't need a calculator. You need a verdict.
      </h1>
      <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        Rent or buy. Pay off debt or invest. Most calculators hand you a number and leave you to
        figure out what it means. These five run the real simulation and tell you which side wins —
        free, no signup.
      </p>

      <div className="mt-12 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {decisions.map((d) => (
          <Link
            key={d.slug}
            to={`/verdict/${d.slug}`}
            className="group grid grid-cols-1 gap-6 py-8 transition-opacity hover:opacity-80 sm:grid-cols-[1.1fr_1fr] sm:gap-10"
          >
            <div className="min-w-0">
              <span className="text-[12.5px] font-semibold text-[#047857] dark:text-[#34d399]">{d.category}</span>
              <h2 className="font-display mt-1.5 text-[22px] font-extrabold leading-snug text-[#111814] dark:text-[#eef1ec]">
                {d.title}
              </h2>
              <p className="mt-2 max-w-[42ch] text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
                {d.description}
              </p>
              <span className="mt-4 inline-block text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25">
                Get your verdict
              </span>
            </div>

            <div className="min-w-0">
              <p className="mb-3 text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">{d.example}</p>
              <VerdictScale a={d.a} b={d.b} fmt={fmt} tone={d.tone} />
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slotId="verdict_index_mid" className="mt-14" />

      <VerdictContent content={VERDICT_INDEX} className="mt-16 space-y-12" />
    </div>
    </div>
  );
}
