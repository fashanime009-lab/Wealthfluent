import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import AdSlot from "@/components/ads/AdSlot";
import { calculateLeaseVsBuy } from "@/verdict/logic/leaseVsBuy";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function LeaseVsBuyPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const [carPrice, setCarPrice] = useState(1200000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(9);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [monthlyLease, setMonthlyLease] = useState(18000);
  const [dueAtSigning, setDueAtSigning] = useState(100000);
  const [depreciationPct, setDepreciationPct] = useState(15);
  const [investReturnPct, setInvestReturnPct] = useState(10);
  const [years, setYears] = useState(5);

  const result = useMemo(
    () => calculateLeaseVsBuy({ carPrice, downPaymentPct, loanRate, loanTenureYears, monthlyLease, dueAtSigning, depreciationPct, investReturnPct, years }),
    [carPrice, downPaymentPct, loanRate, loanTenureYears, monthlyLease, dueAtSigning, depreciationPct, investReturnPct, years]
  );

  const headline = result.winner === "buy"
    ? `Buying wins by ${fmt(Math.abs(result.gap))}`
    : `Leasing wins by ${fmt(Math.abs(result.gap))}`;

  const reasoning = result.tone === "caution"
    ? "Close enough that either is reasonable — leasing gives flexibility to upgrade, buying gives you an asset at the end."
    : result.winner === "buy"
    ? "You end up owning a depreciated but real asset, and it's worth more than what leasing would've let you invest instead."
    : "Leasing's lower monthly cost, invested consistently, outgrows the depreciated resale value you'd own by buying.";

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="Lease vs Buy a Car Calculator — Real Verdict | FINAIW"
        description="Should you lease or buy your next car? A real net-worth simulation, not just a monthly payment comparison."
        path="/verdict/lease-vs-buy-car"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Lease vs Buy a Car Calculator", path: "/verdict/lease-vs-buy-car" },
        ])}
      />

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Verdict</span>
      <h1 className="mt-3 text-[36px] font-black leading-tight text-slate-950 sm:text-[44px]">Lease vs Buy a Car</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
        Leasing's lower monthly payment is obvious. What it costs you in the long run isn't — until you run the numbers.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm">
          <VerdictSlider label="Car price" value={carPrice} onChange={setCarPrice} min={300000} max={8000000} step={50000} format={fmt} />
          <VerdictSlider label="Down payment (if buying)" value={downPaymentPct} onChange={setDownPaymentPct} min={0} max={50} suffix="%" />
          <VerdictSlider label="Loan interest rate" value={loanRate} onChange={setLoanRate} min={5} max={16} step={0.1} suffix="%" />
          <VerdictSlider label="Loan tenure" value={loanTenureYears} onChange={setLoanTenureYears} min={1} max={7} suffix=" yrs" />
          <VerdictSlider label="Monthly lease payment" value={monthlyLease} onChange={setMonthlyLease} min={3000} max={150000} step={500} format={fmt} />
          <VerdictSlider label="Due at signing (lease)" value={dueAtSigning} onChange={setDueAtSigning} min={0} max={500000} step={5000} format={fmt} />
          <VerdictSlider label="Annual depreciation" value={depreciationPct} onChange={setDepreciationPct} min={5} max={25} suffix="%" />
          <VerdictSlider label="Expected investment return" value={investReturnPct} onChange={setInvestReturnPct} min={4} max={18} suffix="%" />
          <VerdictSlider label="Time horizon" value={years} onChange={setYears} min={1} max={7} suffix=" yrs" />
        </div>

        <div className="space-y-6">
          <VerdictResult tone={result.tone} headline={headline} reasoning={reasoning}>
            <div className="grid grid-cols-2 gap-4 border-t border-white pt-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Buying — net worth</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.buyerNetWorth)}</p>
                <p className="text-[12px] text-slate-500">Resale value {fmt(result.carResaleValue)}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Leasing & investing</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.lesseeNetWorth)}</p>
              </div>
            </div>
          </VerdictResult>

          <AdSlot slotId="verdict_lease_vs_buy_result" />
        </div>
      </div>

      <VerdictFAQ
        className="mt-16 max-w-2xl"
        items={[
          { q: "Doesn't leasing always cost more in the end?", a: "Not always — it depends on the specific car's depreciation rate and your investment return. Fast-depreciating cars make leasing more attractive." },
          { q: "What about mileage limits and wear-and-tear charges?", a: "This tool doesn't model those — if you drive well above typical limits, factor in likely lease-end penalties by adding them to your monthly lease cost." },
        ]}
      />
    </div>
  );
}
