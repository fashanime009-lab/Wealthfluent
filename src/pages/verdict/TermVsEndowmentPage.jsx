import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictContent from "@/components/verdict/VerdictContent";
import AdSlot from "@/components/ads/AdSlot";
import { TERM_VS_ENDOWMENT } from "@/data/verdictContent";
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
    ? "On maturity value alone the two paths land close together — so the deciding factor is how much cover each gives your family, and whether your assumed returns match a real policy illustration."
    : result.winner === "termInvest"
    ? `Investing the premium difference at ${investReturnPct}% outgrows the endowment/ULIP's ${endowmentReturnPct}% by enough to overcome the endowment putting more money in each year — and a term plan typically gives your family far more cover per rupee of premium.`
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
        faqSchema(TERM_VS_ENDOWMENT.faqs.map((f) => ({ question: f.q, answer: f.a }))),
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
      <VerdictContent content={TERM_VS_ENDOWMENT} />
    </div>
    </div>
  );
}
