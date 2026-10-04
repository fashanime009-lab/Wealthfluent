import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

// Tax-exempt gratuity ceiling for private-sector employees under the
// Payment of Gratuity Act, in effect since the last government
// notification raising it from ₹10 lakh — confirm the current limit
// before relying on this for a tax decision, since it's set by
// government notification and can change.
const EXEMPTION_LIMIT = 2000000;

const FAQ_ITEMS = [
  { q: "What is the gratuity formula in India?", a: "For employees covered under the Payment of Gratuity Act, 1972: Gratuity = (Last drawn basic salary + DA) × 15 × completed years of service ÷ 26. The 26 represents working days in a month under the Act's convention, and 15 represents 15 days' wages per year of service." },
  { q: "Am I eligible for gratuity?", a: "Generally, yes, after 5 years of continuous service with the same employer, at establishments with 10 or more employees. The 5-year requirement is waived in cases of death or disability. Check your specific employment terms, since some organizations offer gratuity on more generous terms than the legal minimum." },
  { q: "How are years of service rounded?", a: "A completed year with more than 6 months of service in the final year rounds up to the next full year; 6 months or less rounds down. Someone with 7 years 8 months of service is treated as 8 years; someone with 7 years 4 months is treated as 7." },
  { q: "Is gratuity taxable?", a: `For private-sector employees covered under the Act, gratuity is tax-exempt up to ₹${(EXEMPTION_LIMIT/100000).toFixed(0)} lakh (the limit is set by government notification and has changed before, so confirm the current figure). Government employees receive full tax exemption. Any amount above the exemption limit is taxed as salary income.` },
  { q: "What if my employer isn't covered under the Gratuity Act?", a: "A different formula applies: (Last drawn salary × 15 × completed years of service) ÷ 30, using actual days in a month rather than the Act's 26-day convention, and years of service aren't rounded the same way. This calculator uses the Act's formula, which covers most organized-sector employers." },
];

export default function GratuityCalculatorPage() {
  const [lastSalary, setLastSalary] = useState(50000);
  const [years, setYears] = useState(8);
  const { settings } = useSettings();

  const gratuityAmount = Math.round((lastSalary * 15 * years) / 26);
  const taxableAmount = Math.max(0, gratuityAmount - EXEMPTION_LIMIT);
  const isEligible = years >= 5;

  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="Gratuity Calculator – Estimate Your Gratuity Amount"
        description="Calculate your gratuity amount from your last drawn salary and years of service, using the Payment of Gratuity Act formula. Free, no signup."
        path="/gratuity-calculator"
        keywords="gratuity calculator, gratuity calculator India, gratuity formula, payment of gratuity act"
        jsonLd={[
        calculatorSchema({
          name: "Gratuity Calculator",
          description: "Calculate your gratuity amount from your last drawn salary and years of service, using the Payment of Gratuity Act formula.",
          path: "/gratuity-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Gratuity Calculator"
            description="Estimate the gratuity you're entitled to from your last drawn salary and years of service."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Last drawn basic salary + DA (monthly)" value={lastSalary} onChange={setLastSalary} min={5000} max={1000000} step={1000} format={fmt} />
              <CalcField label="Completed years of service" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              {isEligible ? (
                <>
                  <CalcResultPanel label="Gratuity amount" value={fmt(gratuityAmount)} />
                  {taxableAmount > 0 ? (
                    <div className="border border-[#111814]/12 bg-[#ffffff] px-6 py-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                      <p className="text-[13px] text-[#111814]/70 dark:text-[#eef1ec]/70">
                        Tax-exempt up to {fmt(EXEMPTION_LIMIT)}; the remaining {fmt(taxableAmount)} is taxable as
                        salary income.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-[#047857]/25 bg-[#047857]/5 px-6 py-5 dark:border-[#34d399]/25 dark:bg-[#34d399]/5">
                      <p className="text-[13px] text-[#047857] dark:text-[#34d399]">
                        Fully tax-exempt under the current ₹{(EXEMPTION_LIMIT / 100000).toFixed(0)} lakh limit.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-[#111814]/12 bg-[#ffffff] px-6 py-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/70 dark:text-[#eef1ec]/70">
                    Under 5 years of service generally isn't eligible for gratuity under the Act (except in cases of
                    death or disability). The amount shown below is illustrative only.
                  </p>
                  <p className="font-mono-tech mt-3 text-[22px] font-medium tabular-nums text-[#111814]/50 dark:text-[#eef1ec]/50">
                    {fmt(gratuityAmount)}
                  </p>
                </div>
              )}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                For employees covered under the Payment of Gratuity Act, 1972. The exemption limit is set by
                government notification and can change — confirm the current figure before relying on this for a
                tax decision.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="gratuity_calc_mid" />

            <CalcSection title="What is a gratuity calculator?">
              <p>
                Gratuity is a lump-sum payment an employer makes to an employee as a reward for long, continuous
                service — typically paid at resignation, retirement, or termination after at least 5 years with the
                same employer. A gratuity calculator estimates this amount from your last drawn salary and years of
                service, using the formula set out in the Payment of Gratuity Act, 1972.
              </p>
              <p>
                It isn't a savings account you contribute to — it's a statutory entitlement funded by the employer
                (often through a gratuity insurance policy), separate from your EPF balance, your own investments
                and any bonus.
              </p>
            </CalcSection>

            <CalcSection title="How is gratuity calculated?">
              <p>For employees covered under the Act:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Gratuity = (Last drawn salary × 15 × Years of service) ÷ 26
              </p>
              <p>
                "Last drawn salary" means basic pay plus dearness allowance, not your full CTC. A ₹50,000 monthly
                basic+DA with 8 completed years of service works out to about ₹2,30,769. Years of service are
                rounded: more than 6 months in the final year rounds up to the next full year, 6 months or less
                rounds down — 12 years 7 months is treated as 13 years, 12 years 4 months as 12.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of knowing your gratuity">
              <CalcBenefitGrid
                items={[
                  { title: "Plan a job change", text: "Knowing what you'd leave behind in unvested gratuity helps weigh the real cost of switching employers before 5 years." },
                  { title: "Retirement planning input", text: "Gratuity is a real, predictable lump sum — worth including alongside EPF and your own investments when estimating your retirement corpus." },
                  { title: "Negotiation context", text: "Understanding how gratuity accrues with tenure clarifies what a counteroffer with a shorter notice period or tenure actually costs you." },
                  { title: "Tax planning", text: "Knowing whether your gratuity will exceed the exemption limit helps you plan for the tax on the amount above it." },
                ]}
              />
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
