import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { sipFutureValue } from "@/utils/projections";
import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "When should I start retirement planning?", a: "Starting early allows investments more time to grow through the power of compounding. The earlier you start, the smaller the monthly investments needed." },
  { q: "How much retirement corpus is enough?", a: "Retirement corpus depends on lifestyle goals, inflation, expenses, and expected retirement age. A common rule is to have 20-30 times your annual expenses." },
  { q: "What is the 4% rule in retirement?", a: "The 4% rule suggests withdrawing 4% of your retirement corpus annually to ensure funds last for 30 years." },
  { q: "Does this calculator account for inflation?", a: "No — the projected corpus is in nominal (today's rupee) terms. Use the Inflation Calculator alongside this one to see what that corpus is actually worth in real purchasing power by the time you retire." },
  { q: "Should my SIP amount stay fixed until retirement?", a: "Not necessarily — a step-up SIP that increases with your income each year typically reaches a larger corpus than a flat SIP of the same starting amount, since later increases still get years of compounding before retirement." },
];

export default function RetirementCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(25);
  const { settings } = useSettings();

  const months = years * 12;

  // Shared helper — handles a 0% return (the annuity formula divides by the
  // rate, so the inline version returned NaN whenever the slider hit 0%).
  const futureValue = Math.round(sipFutureValue(monthlyInvestment, years, annualReturn));

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = futureValue - investedAmount;

  // Shared, currency-aware formatter (lakh/crore grouping for INR).
  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="Retirement Calculator – Retirement Planning Tool"
        description="Project the corpus a monthly investment builds by retirement — enter the amount, expected return and years invested to see contributions vs returns."
        path="/retirement-calculator"
        keywords="retirement calculator, retirement planning, retirement corpus, pension planning"
        jsonLd={[
        calculatorSchema({
          name: "Retirement Calculator",
          description: "Project the corpus a monthly investment builds by retirement — enter the amount, expected return and years invested to see contributions vs returns.",
          path: "/retirement-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Retirement Calculator"
            description="Estimate retirement corpus growth and future wealth accumulation through long-term investments and compounding."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Monthly investment" value={monthlyInvestment} onChange={setMonthlyInvestment} min={500} max={1000000} step={500} format={fmt} />
              <CalcField label="Expected annual return" value={annualReturn} onChange={setAnnualReturn} min={-15} max={30} step={0.5} suffix="%" />
              <CalcField label="Investment duration" value={years} onChange={setYears} min={1} max={50} suffix=" yrs" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Estimated retirement corpus" value={fmt(futureValue)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Total investment" value={fmt(investedAmount)} share={futureValue > 0 ? (investedAmount / futureValue) * 100 : 0} tone="signal" />
                <CalcStat
                  label="Estimated returns"
                  value={`${estimatedReturns >= 0 ? "+" : "-"}${fmt(Math.abs(estimatedReturns))}`}
                  share={Math.min(100, Math.abs((estimatedReturns / investedAmount) * 100))}
                />
              </div>
              <button
                onClick={() => {
                  window.open("https://www.investopedia.com/retirement-planning-4689695", "_blank");
                }}
                className="w-full border border-[#047857] bg-[#047857] py-3.5 text-[15px] font-semibold text-[#ffffff] transition hover:bg-[#036048] dark:border-[#34d399] dark:bg-[#34d399] dark:text-[#0b1210] dark:hover:bg-[#2bbd8a]"
              >
                Plan Your Retirement
              </button>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock market returns are not fixed and cannot be predicted with certainty.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="retirement_calc_mid" />

            <CalcSection title="What is retirement planning?">
              <p>
                Retirement planning helps individuals estimate future financial needs and build long-term
                investment strategies for financial independence after retirement. It involves calculating the
                required corpus based on current savings, expected returns, and inflation.
              </p>
            </CalcSection>

            <CalcSection title="How is your retirement corpus calculated?">
              <p>This calculator projects a monthly SIP forward using the future value of a growing annuity:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = SIP × [((1 + r)^n − 1) / r] × (1 + r)
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">SIP</strong> is your monthly
                investment, <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is the monthly
                expected return, and <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is the total
                number of months until retirement. A ₹15,000 monthly SIP at 12% annual return over 25 years grows
                to a corpus well beyond ₹2 crore — most of which comes from compounding on earlier contributions,
                not the contributions themselves, which is why starting a decade earlier matters more than
                investing a larger amount later.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of retirement planning">
              <CalcBenefitGrid
                items={[
                  { title: "Financial independence", text: "Retirement planning helps create sustainable long-term financial security and stability." },
                  { title: "Wealth growth", text: "Long-term compounding can significantly increase retirement savings over time." },
                  { title: "Inflation protection", text: "Planning ensures your retirement corpus accounts for rising cost of living and inflation." },
                  { title: "Peace of mind", text: "A well-structured plan reduces financial stress and provides clarity for the future." },
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
