import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictContent from "@/components/verdict/VerdictContent";
import AdSlot from "@/components/ads/AdSlot";
import { RENT_VS_BUY } from "@/data/verdictContent";
import { calculateRentVsBuy } from "@/verdict/logic/rentVsBuy";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function RentVsBuyPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const [homePrice, setHomePrice] = useState(8000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentGrowthPct, setRentGrowthPct] = useState(5);
  const [homeAppreciationPct, setHomeAppreciationPct] = useState(6);
  const [investReturnPct, setInvestReturnPct] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(
    () =>
      calculateRentVsBuy({
        homePrice, downPaymentPct, loanRate, loanTenureYears, monthlyRent,
        rentGrowthPct, homeAppreciationPct, investReturnPct, maintenancePct: 1, years,
      }),
    [homePrice, downPaymentPct, loanRate, loanTenureYears, monthlyRent, rentGrowthPct, homeAppreciationPct, investReturnPct, years]
  );

  const headline = result.winner === "buy"
    ? `Buying wins by ${fmt(Math.abs(result.gap))}`
    : `Renting & investing wins by ${fmt(Math.abs(result.gap))}`;

  const reasoning = result.tone === "caution"
    ? "The gap is small enough that either choice is reasonable — this comes down to how much you value owning vs flexibility."
    : result.winner === "buy"
    ? "Home appreciation plus the equity you build outpaces what the same money would likely earn invested elsewhere."
    : "The monthly gap between renting and owning is large enough that investing it consistently outgrows the home's appreciation.";

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
      <Seo
        title="Rent vs Buy Calculator — Real Verdict | FINAIW"
        description="See whether renting and investing the difference beats buying a home over your real time horizon — free."
        path="/verdict/rent-vs-buy"
        jsonLd={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Rent vs Buy Calculator", path: "/verdict/rent-vs-buy" },
        ]),
        faqSchema(RENT_VS_BUY.faqs.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Verdict</span>
      <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">Rent vs Buy</h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        Enter your real numbers. We simulate net worth month by month for both paths and tell you which one wins.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
          <VerdictSlider label="Home price" value={homePrice} onChange={setHomePrice} min={1500000} max={50000000} step={100000} format={fmt} />
          <VerdictSlider label="Down payment" value={downPaymentPct} onChange={setDownPaymentPct} min={5} max={50} suffix="%" />
          <VerdictSlider label="Loan interest rate" value={loanRate} onChange={setLoanRate} min={5} max={14} step={0.1} suffix="%" />
          <VerdictSlider label="Loan tenure" value={loanTenureYears} onChange={setLoanTenureYears} min={5} max={30} suffix=" yrs" />
          <VerdictSlider label="Equivalent monthly rent" value={monthlyRent} onChange={setMonthlyRent} min={5000} max={200000} step={1000} format={fmt} />
          <VerdictSlider label="Annual rent growth" value={rentGrowthPct} onChange={setRentGrowthPct} min={0} max={12} suffix="%" />
          <VerdictSlider label="Annual home appreciation" value={homeAppreciationPct} onChange={setHomeAppreciationPct} min={0} max={12} suffix="%" />
          <VerdictSlider label="Expected investment return" value={investReturnPct} onChange={setInvestReturnPct} min={4} max={18} suffix="%" />
          <VerdictSlider label="Time horizon" value={years} onChange={setYears} min={3} max={30} suffix=" yrs" />
        </div>

        <div className="space-y-6">
          <VerdictResult
            tone={result.tone}
            headline={headline}
            reasoning={reasoning}
            fmt={fmt}
            a={{ label: "Buying", value: result.buyerNetWorth }}
            b={{ label: "Renting & investing", value: result.renterNetWorth }}
          />

          <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <p className="text-[12.5px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/60">Net worth over time</p>
            <div className="mt-5">
              <VerdictChart data={result.series} keys={["buy", "rent"]} colors={["#047857", "#9a3412"]} labels={["Buying", "Renting & investing"]} />
            </div>
          </div>

          <AdSlot slotId="verdict_rent_vs_buy_result" />
        </div>
      </div>

      <VerdictContent content={RENT_VS_BUY} />
    </div>
    </div>
  );
}
