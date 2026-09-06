import { useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import VerdictSlider from "@/components/verdict/VerdictSlider";
import VerdictResult from "@/components/verdict/VerdictResult";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import AdSlot from "@/components/ads/AdSlot";
import { calculateInsuranceNeed } from "@/verdict/logic/insuranceNeed";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "@/context/SettingsContext";

export default function InsuranceNeedPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [incomeReplacementYears, setIncomeReplacementYears] = useState(15);
  const [outstandingLoans, setOutstandingLoans] = useState(3000000);
  const [futureGoalsCost, setFutureGoalsCost] = useState(2000000);
  const [existingSavings, setExistingSavings] = useState(1000000);
  const [existingCover, setExistingCover] = useState(1000000);

  const result = useMemo(
    () => calculateInsuranceNeed({ annualIncome, incomeReplacementYears, outstandingLoans, futureGoalsCost, existingSavings, existingCover }),
    [annualIncome, incomeReplacementYears, outstandingLoans, futureGoalsCost, existingSavings, existingCover]
  );

  const headline = result.isAdequate ? "You're adequately covered" : `You need ${fmt(result.additionalCoverNeeded)} more cover`;
  const reasoning = result.isAdequate
    ? "Your existing cover and savings already meet or exceed what your dependents would need if something happened to you."
    : "This gap is what a term policy should cover — the difference between what your dependents would need and what you currently have.";

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
      <Seo
        title="How Much Term Life Insurance Do You Need? — Real Verdict | FINAIW"
        description="Calculate the exact term insurance cover you need using the standard needs-based method — free, no signup."
        path="/verdict/insurance-need"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verdict", path: "/verdict" },
          { name: "How Much Term Life Insurance Do You Need?", path: "/verdict/insurance-need" },
        ])}
      />

      <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Verdict</span>
      <h1 className="mt-3 text-[36px] font-black leading-tight text-slate-950 sm:text-[44px]">How Much Term Insurance Do You Need?</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
        Not "10x your income" — the actual number, based on what your dependents would really need to replace.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm">
          <VerdictSlider label="Your annual income" value={annualIncome} onChange={setAnnualIncome} min={200000} max={10000000} step={50000} format={fmt} />
          <VerdictSlider label="Years of income to replace" value={incomeReplacementYears} onChange={setIncomeReplacementYears} min={5} max={30} suffix=" yrs" />
          <VerdictSlider label="Outstanding loans" value={outstandingLoans} onChange={setOutstandingLoans} min={0} max={20000000} step={100000} format={fmt} />
          <VerdictSlider label="Future goals (education, marriage)" value={futureGoalsCost} onChange={setFutureGoalsCost} min={0} max={10000000} step={100000} format={fmt} />
          <VerdictSlider label="Existing savings & investments" value={existingSavings} onChange={setExistingSavings} min={0} max={20000000} step={100000} format={fmt} />
          <VerdictSlider label="Existing life cover" value={existingCover} onChange={setExistingCover} min={0} max={20000000} step={100000} format={fmt} />
        </div>

        <div className="space-y-6">
          <VerdictResult tone={result.tone} headline={headline} reasoning={reasoning}>
            <div className="grid grid-cols-2 gap-4 border-t border-white pt-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Total need</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.totalNeed)}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Total you have</p>
                <p className="mt-1 text-[22px] font-black text-slate-950">{fmt(result.totalHave)}</p>
              </div>
            </div>
          </VerdictResult>

          <AdSlot slotId="verdict_insurance_need_result" />
        </div>
      </div>

      <VerdictFAQ
        className="mt-16 max-w-2xl"
        items={[
          { q: "Why not just use '10-15x annual income'?", a: "That rule ignores your actual debts, goals, and existing savings — it can leave you under- or over-insured. The needs-based method here accounts for your specific numbers instead." },
          { q: "Should I include my spouse's income?", a: "This calculates cover for one person's income being lost. If both partners work, run it separately for each." },
        ]}
      />
    </div>
  );
}
