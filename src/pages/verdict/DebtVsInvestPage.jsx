import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import AdSlot from "@/components/ads/AdSlot";
import { calculateDebtVsInvest } from "@/verdict/logic/debtVsInvest";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function DebtVsInvestPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const [debtBalance, setDebtBalance] = useState(500000);
  const [debtRate, setDebtRate] = useState(16);
  const [minPayment, setMinPayment] = useState(15000);
  const [extra, setExtra] = useState(10000);
  const [investReturnPct, setInvestReturnPct] = useState(12);
  const [years, setYears] = useState(5);

  const result = useMemo(
    () => calculateDebtVsInvest({ debtBalance, debtRate, minPayment, extra, investReturnPct, years }),
    [debtBalance, debtRate, minPayment, extra, investReturnPct, years]
  );

  const headline = result.winner === "debt"
    ? `Paying off debt wins by ${fmt(Math.abs(result.gap))}`
    : `Investing wins by ${fmt(Math.abs(result.gap))}`;

  const reasoning = result.tone === "caution"
    ? "The two paths land close enough that either is reasonable — guaranteed debt payoff vs. market-dependent growth is really a risk preference here."
    : result.winner === "debt"
    ? `Your debt rate (${debtRate}%) beats your expected investment return (${investReturnPct}%) — paying it off first is a guaranteed return no investment can promise.`
    : `Your expected investment return (${investReturnPct}%) beats your debt rate (${debtRate}%) by enough that investing the extra outgrows what you'd save in interest.`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="Pay Off Debt vs Invest Calculator — Real Verdict | FINAIW"
        description="Should extra cash go toward debt or investing? A real net-worth simulation compares both paths."
        path="/verdict/debt-vs-invest"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Pay Off Debt vs Invest Calculator", path: "/verdict/debt-vs-invest" },
        ])}
      />

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Verdict</span>
      <h1 className="mt-3 text-[36px] font-black leading-tight text-slate-950 sm:text-[44px]">Pay Off Debt vs Invest</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
        You have extra cash each month. Should it go to your debt or into the market? We simulate both, month by month.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm">
          <VerdictSlider label="Current debt balance" value={debtBalance} onChange={setDebtBalance} min={10000} max={5000000} step={10000} format={fmt} />
          <VerdictSlider label="Debt interest rate" value={debtRate} onChange={setDebtRate} min={2} max={36} step={0.5} suffix="%" />
          <VerdictSlider label="Minimum monthly payment" value={minPayment} onChange={setMinPayment} min={1000} max={100000} step={500} format={fmt} />
          <VerdictSlider label="Extra cash available monthly" value={extra} onChange={setExtra} min={500} max={100000} step={500} format={fmt} />
          <VerdictSlider label="Expected investment return" value={investReturnPct} onChange={setInvestReturnPct} min={4} max={20} suffix="%" />
          <VerdictSlider label="Time horizon" value={years} onChange={setYears} min={1} max={20} suffix=" yrs" />
        </div>

        <div className="space-y-6">
          <VerdictResult tone={result.tone} headline={headline} reasoning={reasoning}>
            <div className="grid grid-cols-2 gap-4 border-t border-white pt-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Debt-first — net worth</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.netWorthA)}</p>
                {result.payoffMonth && <p className="text-[12px] text-slate-500">Debt cleared in {result.payoffMonth} months</p>}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Invest-first — net worth</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.netWorthB)}</p>
              </div>
            </div>
          </VerdictResult>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="text-[12px] font-black uppercase tracking-wide text-slate-400">Net worth over time</p>
            <div className="mt-5">
              <VerdictChart data={result.series} keys={["debtFirst", "investFirst"]} colors={["#047857", "#f59e0b"]} labels={["Debt-first", "Invest-first"]} />
            </div>
          </div>

          <AdSlot slotId="verdict_debt_vs_invest_result" />
        </div>
      </div>

      <div className="mt-16 max-w-2xl border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-black text-slate-950">How this verdict is calculated</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          Both paths spend the exact same cash every month. Debt-first puts the minimum plus the extra toward the
          debt until it's gone, then invests everything for the rest of the horizon. Invest-first pays only the
          minimum and invests the extra from month one. We compare net worth — investments minus any remaining
          debt — at the end.
        </p>
      </div>

      <VerdictFAQ
        className="mt-12 max-w-2xl"
        items={[
          { q: "Isn't paying off debt always the 'safe' choice?", a: "Paying off debt is a guaranteed return equal to the interest rate. Investing can lose money. If your debt rate is high, that guarantee is hard to beat; if it's low, investing often wins but carries real risk." },
          { q: "What about high-interest credit card debt specifically?", a: "Credit card rates (often 30-40%+) are almost always higher than realistic investment returns — the debt-first path will virtually always win." },
          { q: "Does this account for the psychological value of being debt-free?", a: "No — this only compares net worth. Being debt-free has real value beyond the math that this tool doesn't try to quantify." },
        ]}
      />
    </div>
  );
}
