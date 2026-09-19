import { useState, useEffect } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useFinance } from "../context/FinanceContext";
import { useSettings } from "../context/SettingsContext";

import AdSlot from "../components/ads/AdSlot";
import { formatCurrency } from "../utils/currency";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What is a good SIP amount?", a: "A good SIP amount depends on income, financial goals, and investment horizon." },
  { q: "Is SIP better than FD?", a: "SIPs offer market-linked growth potential, while fixed deposits provide stable fixed returns." },
  { q: "Can SIP create long-term wealth?", a: "Long-term SIP investing combined with compounding can significantly grow wealth over time." },
  { q: "What happens if I miss a SIP installment?", a: "Most mutual funds simply skip that month without penalty — your SIP continues from the next scheduled date. Repeated missed installments over several months can sometimes trigger an auto-cancellation, so check your specific fund's policy." },
  { q: "Should I stop my SIP when markets fall?", a: "Generally no — a falling market means your fixed SIP amount buys more units at a lower price, which is the entire point of rupee-cost averaging. Stopping during a downturn is one of the most common ways investors damage their own long-term returns." },
];

export default function SIPCalculatorPage() {
  const { setSipData } = useFinance();
  const { settings } = useSettings();

  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Calculations
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  const investedAmount = monthlyInvestment * months;
  const futureValue =
    annualReturn === 0
      ? investedAmount
      : Math.round(
          monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate)
        );
  const estimatedReturns = futureValue - investedAmount;

  // Update context
  useEffect(() => {
    setSipData({
      monthlyInvestment,
      annualReturn,
      years,
      futureValue,
    });
  }, [monthlyInvestment, annualReturn, years, futureValue, setSipData]);

  return (
    <>
      <Seo
        title="SIP Calculator – Calculate Investment Growth"
        description="Enter your monthly SIP amount, expected return, and investment period to see how a mutual fund SIP grows over time, including total invested versus total returns."
        path="/sip-calculator"
        keywords="SIP calculator, mutual fund calculator, investment calculator, SIP return calculator"
        jsonLd={[
        calculatorSchema({
          name: "SIP Calculator",
          description: "Enter your monthly SIP amount, expected return, and investment period to see how a mutual fund SIP grows over time, including total invested versus total returns.",
          path: "/sip-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="SIP Calculator"
            description="Find the future value of your monthly/quarterly SIP investment."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="SIP Amount" value={monthlyInvestment} onChange={setMonthlyInvestment} min={500} max={100000} step={500} format={fmt} />
              <CalcField label="Expected Rate of Return (p.a.) %" value={annualReturn} onChange={setAnnualReturn} min={-15} max={30} step={0.5} suffix="%" />
              <CalcField label="Investment Duration (In Years)" value={years} onChange={setYears} min={1} max={50} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Future value of your investment" value={fmt(futureValue)} />

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Your Investment" value={fmt(investedAmount)} share={(investedAmount / futureValue) * 100} tone="signal" />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Estimated Returns</span>
                    <span
                      className={`font-mono-tech text-[15px] tabular-nums ${
                        estimatedReturns >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {estimatedReturns >= 0 ? "+" : "-"}
                      {fmt(Math.abs(estimatedReturns))}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] rounded-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
                    <div
                      className={`h-full rounded-full opacity-70 dark:opacity-80 ${
                        estimatedReturns >= 0 ? "bg-[#047857] dark:bg-[#34d399]" : "bg-red-600 dark:bg-red-400"
                      }`}
                      style={{
                        width: `${Math.min(Math.abs((estimatedReturns / investedAmount) * 100), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => setShowInvestModal(true)}
                className="inline-flex h-12 w-full items-center justify-center bg-[#047857] text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
              >
                Start Investing Smarter
              </button>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <CalcSection title="What Is SIP Calculator?">
              <p>
                A SIP Calculator helps investors estimate future wealth creation
                through Systematic Investment Plans (SIP) using monthly investments,
                expected annual returns, and investment duration.
              </p>
            </CalcSection>

            <CalcSection title="How Are SIP Returns Calculated?">
              <p>
                Each monthly installment compounds for a different length of time,
                so SIP maturity uses the future value of a growing annuity:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = P × [((1 + r)^n − 1) / r] × (1 + r)
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is your monthly investment,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is
                the monthly rate of return, and <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is the number of
                months invested. Because each installment starts compounding at a
                different point, roughly half your final corpus in a long SIP
                typically comes from your earliest 3-4 years of contributions —
                which is why staying invested through a long horizon matters more
                than the exact monthly amount.
              </p>
            </CalcSection>

            <AdSlot slotId="sip_calc_mid" />

            <CalcSection title="Benefits Of SIP Investments">
              <CalcBenefitGrid
                items={[
                  { title: "Cost Averaging", text: "SIP investments reduce market timing risks by investing consistently over time." },
                  { title: "Long-Term Wealth Growth", text: "Compounding can significantly increase investment value over long investment periods." },
                  { title: "Flexible Investing", text: "Investors can start SIPs with small monthly amounts based on financial goals." },
                  { title: "Disciplined Saving", text: "SIPs encourage consistent long-term investing habits." },
                ]}
              />
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>

          {/* Investment Modal */}
          {showInvestModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111814]/60 p-4 backdrop-blur-sm dark:bg-black/70">
              <div className="relative w-full max-w-2xl border border-[#111814]/12 bg-[#ffffff] p-8 dark:border-[#eef1ec]/12 dark:bg-[#0e1512]">
                {/* Close Button */}
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[#111814]/15 text-[18px] leading-none text-[#111814]/60 transition hover:border-[#111814]/30 hover:text-[#111814] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/60 dark:hover:border-[#eef1ec]/30 dark:hover:text-[#eef1ec]"
                >
                  ×
                </button>

                <div>
                  <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">
                    Smart Wealth Plan
                  </p>
                  <h2 className="font-display mt-2 text-[26px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
                    Your SIP Could Grow To
                  </h2>
                  <h3 className="font-mono-tech mt-2 text-[42px] font-medium leading-none tabular-nums text-[#047857] dark:text-[#34d399]">
                    {fmt(futureValue)}
                  </h3>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="border border-[#111814]/12 p-4 text-center dark:border-[#eef1ec]/12">
                      <p className="text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">Monthly SIP</p>
                      <p className="font-mono-tech mt-1 text-[18px] font-semibold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                        {fmt(monthlyInvestment)}
                      </p>
                    </div>
                    <div className="border border-[#111814]/12 p-4 text-center dark:border-[#eef1ec]/12">
                      <p className="text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">Expected Return</p>
                      <p className="font-mono-tech mt-1 text-[18px] font-semibold tabular-nums text-[#047857] dark:text-[#34d399]">
                        {annualReturn}%
                      </p>
                    </div>
                    <div className="border border-[#111814]/12 p-4 text-center dark:border-[#eef1ec]/12">
                      <p className="text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">Investment Time</p>
                      <p className="font-mono-tech mt-1 text-[18px] font-semibold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                        {years} Years
                      </p>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="mt-6 border border-[#111814]/12 p-5 dark:border-[#eef1ec]/12">
                    <h4 className="text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                      AI Wealth Insight
                    </h4>
                    <p className="mt-1 text-[13.5px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
                      If you increase your monthly investment by just 2,000 units every year,
                      your long-term wealth potential could increase dramatically
                      through compound growth.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                      onClick={() => {
                        setShowInvestModal(false);
                        setTimeout(() => {
                          window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                          });
                        }, 200);
                      }}
                      className="flex-1 border border-[#111814]/20 py-3.5 text-[15px] font-semibold text-[#111814] transition hover:border-[#047857] hover:text-[#047857] dark:border-[#eef1ec]/20 dark:text-[#eef1ec] dark:hover:border-[#34d399] dark:hover:text-[#34d399]"
                    >
                      Continue Exploring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
