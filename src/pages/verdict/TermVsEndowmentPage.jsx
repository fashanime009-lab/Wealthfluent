import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import AdSlot from "@/components/ads/AdSlot";
import { calculateTermVsEndowment } from "@/verdict/logic/termVsEndowment";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function TermVsEndowmentPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const [annualPremiumBudget, setAnnualPremiumBudget] = useState(40000);
  const [termPremium, setTermPremium] = useState(12000);
  const [years, setYears] = useState(20);
  const [investReturnPct, setInvestReturnPct] = useState(12);
  const [endowmentReturnPct, setEndowmentReturnPct] = useState(5.5);

  const result = useMemo(
    () => calculateTermVsEndowment({ annualPremiumBudget, termPremium, years, investReturnPct, endowmentReturnPct }),
    [annualPremiumBudget, termPremium, years, investReturnPct, endowmentReturnPct]
  );

  const headline = result.winner === "termInvest"
    ? `Term + Invest wins by ${fmt(Math.abs(result.gap))}`
    : `The endowment/ULIP wins by ${fmt(Math.abs(result.gap))}`;

  const reasoning = result.tone === "caution"
    ? "The two paths land close enough that either is reasonable here — but that's unusual for this comparison, so double-check your assumed returns."
    : result.winner === "termInvest"
    ? `Investing the premium difference at ${investReturnPct}% outgrows the endowment/ULIP's ${endowmentReturnPct}% by enough to more than make up for term insurance's lower payout at death — while also leaving you with real cover.`
    : `Your assumed endowment/ULIP return (${endowmentReturnPct}%) is close enough to your market return assumption (${investReturnPct}%) that the bundled policy edges ahead here — worth double-checking those numbers against a real illustration.`;

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
      <Seo
        title="Term Insurance vs Endowment/ULIP — Real Verdict | FINAIW"
        description="Should the same premium go into a term plan plus investing, or an endowment/ULIP policy? A real maturity-value simulation compares both."
        path="/verdict/term-vs-endowment"
        jsonLd={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Term Insurance vs Endowment/ULIP", path: "/verdict/term-vs-endowment" },
        ]),
        faqSchema([
          {
            "question": "Isn't an endowment or ULIP better because it combines insurance and investment?",
            "answer": "Bundling is exactly the problem, not the benefit. The insurance portion inside these plans is far more expensive per rupee of cover than a term plan, and the investment portion typically returns less than investing the same money directly — you end up with a mediocre version of both instead of a good version of either."
          },
          {
            "question": "What if I've already bought an endowment or ULIP policy?",
            "answer": "Surrendering early usually comes with a real cost, so it's worth checking the surrender value and any remaining lock-in before deciding — this tool is best used before buying, to compare the two paths up front."
          },
          {
            "question": "Does this account for the tax treatment of maturity proceeds?",
            "answer": "No — this only compares raw maturity value from the premium and assumed returns. Tax treatment on both sides can matter and depends on current rules and your specific policy, so it's worth checking separately."
          }
        ]),
      ]}
      />

      <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Verdict</span>
      <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">Term Insurance vs Endowment/ULIP</h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        Same premium budget, two paths: a cheap term plan plus investing the rest, or one bundled endowment/ULIP policy. We simulate both to maturity.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
          <VerdictSlider label="Total annual premium budget" value={annualPremiumBudget} onChange={setAnnualPremiumBudget} min={10000} max={300000} step={1000} format={fmt} />
          <VerdictSlider label="Term insurance premium (for real cover)" value={termPremium} onChange={setTermPremium} min={2000} max={100000} step={500} format={fmt} />
          <VerdictSlider label="Policy / investment horizon" value={years} onChange={setYears} min={5} max={35} step={1} suffix=" yrs" />
          <VerdictSlider label="Expected market return (term + invest)" value={investReturnPct} onChange={setInvestReturnPct} min={4} max={20} step={0.5} suffix="%" />
          <VerdictSlider label="Expected endowment/ULIP return (net of charges)" value={endowmentReturnPct} onChange={setEndowmentReturnPct} min={3} max={9} step={0.1} suffix="%" />
        </div>

        <div className="space-y-6">
          <VerdictResult
            tone={result.tone}
            headline={headline}
            reasoning={reasoning}
            fmt={fmt}
            a={{ label: "Term + invest", value: result.maturityTermInvest }}
            b={{ label: "Endowment / ULIP", value: result.maturityEndowment }}
          />

          <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <p className="text-[12.5px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/60">Maturity value over time</p>
            <div className="mt-5">
              <VerdictChart data={result.series} keys={["termInvest", "endowment"]} colors={["#047857", "#9a3412"]} labels={["Term + invest", "Endowment / ULIP"]} />
            </div>
          </div>

          <AdSlot slotId="verdict_term_vs_endowment_result" />
        </div>
      </div>

      <div className="mt-16 max-w-2xl border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
        <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">How this verdict is calculated</h2>
        <p className="mt-3 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Both paths spend the same total premium every year. Term + invest spends a small slice on a term
          premium for real cover, then invests everything left over from the budget in the market. Endowment /
          ULIP puts the entire budget into the policy, growing at your assumed net-of-charges return instead. We
          compare the maturity value of both after the full horizon.
        </p>
      </div>

      <VerdictFAQ
        className="mt-12 max-w-2xl"
        items={[
          { q: "Isn't an endowment or ULIP better because it combines insurance and investment?", a: "Bundling is exactly the problem, not the benefit. The insurance portion inside these plans is far more expensive per rupee of cover than a term plan, and the investment portion typically returns less than investing the same money directly — you end up with a mediocre version of both instead of a good version of either." },
          { q: "What if I've already bought an endowment or ULIP policy?", a: "Surrendering early usually comes with a real cost, so it's worth checking the surrender value and any remaining lock-in before deciding — this tool is best used before buying, to compare the two paths up front." },
          { q: "Does this account for the tax treatment of maturity proceeds?", a: "No — this only compares raw maturity value from the premium and assumed returns. Tax treatment on both sides can matter and depends on current rules and your specific policy, so it's worth checking separately." },
        ]}
      />
    </div>
    </div>
  );
}
