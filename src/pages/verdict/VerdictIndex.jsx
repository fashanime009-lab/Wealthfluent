import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdSlot from "@/components/ads/AdSlot";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

const decisions = [
  {
    slug: "rent-vs-buy",
    title: "Rent vs Buy",
    category: "Housing",
    description:
      "Should you buy a home or keep renting and invest the difference? Real net worth comparison.",
  },
  {
    slug: "debt-vs-invest",
    title: "Pay Off Debt vs Invest",
    category: "Debt",
    description:
      "Extra cash each month — debt or the market? Simulated month by month for your real numbers.",
  },
  {
    slug: "lease-vs-buy-car",
    title: "Lease vs Buy a Car",
    category: "Vehicles",
    description:
      "The lower lease payment is obvious. What it costs you long-term isn't — until you run it.",
  },
  {
    slug: "insurance-need",
    title: "How Much Term Insurance Do You Need?",
    category: "Insurance",
    description:
      "Not '10x your income' — the real number, based on your actual debts, goals, and savings.",
  },
];

export default function VerdictIndex() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="Verdict — Financial Decisions, Decided"
        description="Real answers to the money decisions you're actually stuck on — rent vs buy, debt vs invest, lease vs buy a car, and how much insurance you need — with the math shown. Free, no signup."
        path="/verdict"
        keywords="rent vs buy calculator, pay off debt vs invest, lease vs buy car, term insurance calculator, financial decision tool"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
        ])}
      />

      <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
        Free. No signup. No subscriptions.
      </span>
      <h1 className="mt-6 text-[38px] font-black leading-[1.08] text-slate-950 sm:text-[48px]">
        You don't need a calculator.<br />You need a <span className="text-emerald-700">verdict.</span>
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">
        Rent or buy. Pay off debt or invest. Most calculators hand you a number and leave you to
        figure out what it means. These tools compute the real answer, and show the work.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {decisions.map((d) => (
          <Link
            key={d.slug}
            to={`/verdict/${d.slug}`}
            className="group rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,.09)]"
          >
            <span className="text-[11px] font-black uppercase tracking-wide text-emerald-700">{d.category}</span>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{d.title}</h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">{d.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-black text-slate-900 group-hover:text-emerald-700">
              Get your verdict <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <AdSlot slotId="verdict_index_mid" className="mt-12" />
    </div>
  );
}
