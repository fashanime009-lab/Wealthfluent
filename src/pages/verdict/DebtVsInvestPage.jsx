import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictChart from "@/components/verdict/VerdictChart";
import VerdictContent from "@/components/verdict/VerdictContent";
import AdSlot from "@/components/ads/AdSlot";
import { DEBT_VS_INVEST } from "@/data/verdictContent";
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
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
      <Seo
        title="Pay Off Debt vs Invest Calculator — Real Verdict | FINAIW"
        description="Should extra cash go toward debt or investing? A real net-worth simulation compares both paths."
        path="/verdict/debt-vs-invest"
        jsonLd={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "Pay Off Debt vs Invest Calculator", path: "/verdict/debt-vs-invest" },
        ]),
        faqSchema(DEBT_VS_INVEST.faqs.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Verdict</span>
      <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">Pay Off Debt vs Invest</h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        You have extra cash each month. Should it go to your debt or into the market? We simulate both, month by month.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
          <VerdictSlider label="Current debt balance" value={debtBalance} onChange={setDebtBalance} min={10000} max={5000000} step={10000} format={fmt} />
          <VerdictSlider label="Debt interest rate" value={debtRate} onChange={setDebtRate} min={2} max={36} step={0.5} suffix="%" />
          <VerdictSlider label="Minimum monthly payment" value={minPayment} onChange={setMinPayment} min={1000} max={100000} step={500} format={fmt} />
          <VerdictSlider label="Extra cash available monthly" value={extra} onChange={setExtra} min={500} max={100000} step={500} format={fmt} />
          <VerdictSlider label="Expected investment return" value={investReturnPct} onChange={setInvestReturnPct} min={4} max={20} suffix="%" />
          <VerdictSlider label="Time horizon" value={years} onChange={setYears} min={1} max={20} suffix=" yrs" />
        </div>

        <div className="space-y-6">
          <VerdictResult
            tone={result.tone}
            headline={headline}
            reasoning={reasoning}
            fmt={fmt}
            a={{ label: "Debt-first", value: result.netWorthA, note: result.payoffMonth ? `Debt cleared in ${result.payoffMonth} months` : undefined }}
            b={{ label: "Invest-first", value: result.netWorthB }}
          />

          <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <p className="text-[12.5px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/60">Net worth over time</p>
            <div className="mt-5">
              <VerdictChart data={result.series} keys={["debtFirst", "investFirst"]} colors={["#047857", "#9a3412"]} labels={["Debt-first", "Invest-first"]} />
            </div>
          </div>

          <AdSlot slotId="verdict_debt_vs_invest_result" />
        </div>
      </div>
      <VerdictContent content={DEBT_VS_INVEST} />
    </div>
    </div>
  );
}
