import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import AdSlot from "@/components/ads/AdSlot";
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
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="Rent vs Buy Calculator — Real Verdict | FINAIW"
        description="See whether renting and investing the difference beats buying a home over your real time horizon — free."
        path="/verdict/rent-vs-buy"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Rent vs Buy Calculator", path: "/verdict/rent-vs-buy" },
        ])}
      />

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Verdict</span>
      <h1 className="mt-3 text-[36px] font-black leading-tight text-slate-950 sm:text-[44px]">Rent vs Buy</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
        Enter your real numbers. We simulate net worth month by month for both paths and tell you which one wins.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm">
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
          <VerdictResult tone={result.tone} headline={headline} reasoning={reasoning}>
            <div className="grid grid-cols-2 gap-4 border-t border-white pt-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Buying — net worth</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.buyerNetWorth)}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Renting & investing</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.renterNetWorth)}</p>
              </div>
            </div>
          </VerdictResult>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="text-[12px] font-black uppercase tracking-wide text-slate-400">Net worth over time</p>
            <div className="mt-5">
              <VerdictChart data={result.series} keys={["buy", "rent"]} colors={["#047857", "#f59e0b"]} labels={["Buying", "Renting & investing"]} />
            </div>
          </div>

          <AdSlot slotId="verdict_rent_vs_buy_result" />
        </div>
      </div>

      <div className="mt-16 max-w-2xl border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-black text-slate-950">How this verdict is calculated</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          We assume both paths start with the same capital — the down payment — and the same monthly budget. The
          buyer puts that capital into the home and pays EMI plus maintenance. The renter invests that same
          capital in the market instead, pays rent, and invests whatever's left over each month. We simulate this
          month by month, then compare net worth at the end of your time horizon.
        </p>
      </div>

      <VerdictFAQ
        className="mt-12 max-w-2xl"
        items={[
          { q: "Does this include stamp duty, registration, or brokerage?", a: "Not by default — those are one-time costs that vary a lot by city. If you know yours, mentally add them to the down payment slider." },
          { q: "Why does renting sometimes win even though rent 'feels like throwing money away'?", a: "Because the alternative isn't spending nothing — it's investing the gap. When rent is well below the true cost of owning, that monthly gap compounding in the market can outgrow the home's appreciation." },
          { q: "What if I plan to sell before the loan is paid off?", a: "The tool already accounts for this — it uses the actual remaining loan balance at your chosen time horizon, not the full loan term." },
        ]}
      />
    </div>
  );
}
