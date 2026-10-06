import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

// Where the "SIP vs Lump Sum" article lives. The lesson already exists; if it is
// ever replaced by a longer article, change this one path.
const SIP_VS_LUMP_SUM_PATH = "/learn/sip-vs-lump-sum";

// In-copy link styling, matching the underlined links used elsewhere in the content.
const linkClass =
  "font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25";

const FAQ_ITEMS = [
  { q: "What is a good SIP amount?", a: "A good SIP amount depends on income, financial goals, and investment horizon." },
  { q: "Is SIP better than FD?", a: "SIPs offer market-linked growth potential, while fixed deposits provide stable fixed returns." },
  { q: "Is SIP better than lump sum investment?", a: "It depends on your situation. If you invest from monthly income, a SIP is the practical way to do it — there is no lump sum to compare against. If you already have a large amount available, investing it sooner has historically tended to beat spreading it out over most long periods, because markets rise more often than they fall and money invested earlier compounds for longer. A SIP (or staggering the amount over a few months) mainly reduces the risk of investing everything just before a fall. A calculator that assumes a steady return, like this one, will always favour the lump sum because the money starts earning sooner — that is a property of the assumption, not a prediction." },
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
        title="SIP Calculator - See What Your Monthly SIP Grows To | FINAIW"
        description="Calculate what your SIP investment could grow to with real compound math. Free, no signup — see monthly amount, expected return, and final corpus instantly."
        path="/sip-calculator"
        keywords="SIP calculator, mutual fund calculator, investment calculator, SIP return calculator"
        jsonLd={[
        calculatorSchema({
          name: "SIP Calculator",
          description: "Calculate what your SIP investment could grow to with real compound math. Free, no signup — see monthly amount, expected return, and final corpus instantly.",
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
            description="Find the future value of your monthly SIP investment."
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
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <CalcSection title="What is a SIP and how does it work?">
              <p>
                A SIP, or Systematic Investment Plan, is a way of investing a fixed amount in a mutual fund at regular
                intervals — usually every month — instead of putting in one large sum. Each installment is debited
                automatically and buys units of the fund at that day's price (its NAV).
              </p>
              <p>
                Because the amount is fixed, your money buys more units when the price is low and fewer when it is
                high, which averages out your purchase price over time. This is called rupee-cost averaging. It also
                turns investing into a habit: you don't have to decide when to invest, because the schedule does.
              </p>
              <p>
                For example, investing ₹5,000 a month for 15 years means putting in ₹9,00,000 in total. At an assumed
                12% a year, this calculator estimates it grows to about ₹25,22,880 — roughly ₹16,22,880 of that from
                returns. The 12% is an assumption you can change, not a promise: real fund returns vary from year to
                year and can be negative.
              </p>
              <p>
                Working backward from a target amount instead? The{" "}
                <Link to="/goal-sip" className={linkClass}>
                  Goal SIP Calculator
                </Link>{" "}
                finds the monthly SIP you would need to reach it.
              </p>
            </CalcSection>

            <CalcSection title="How is SIP return calculated?">
              <p>
                Each monthly installment compounds for a different length of time — the first for the whole period,
                the last for a single month — so a SIP's maturity value uses the future value of equal payments made
                at the start of each month:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = P × [((1 + r)^n − 1) / r] × (1 + r)
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is your monthly investment,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is the monthly rate of return (the
                annual rate divided by 12, then by 100), and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is the number of months invested
                (years × 12).
              </p>
              <p>
                For the defaults above, P = ₹5,000. A 12% annual return gives r = 12 ÷ 12 ÷ 100 = 0.01, and 15 years
                gives n = 180. Then (1.01)^180 = 5.9958, so [(1.01)^180 − 1] / 0.01 = 499.58. Multiplying by ₹5,000
                gives about ₹24,97,900, and the final × 1.01 gives ₹25,22,880 — the same figure the calculator above
                produces for those inputs.
              </p>
              <p>
                Because early installments compound the longest, they carry disproportionate weight. In this example
                the first 5 years of installments are only a third of the money you put in (₹3,00,000 of ₹9,00,000),
                yet they account for about 54% of the final corpus. That is why staying invested for a long horizon
                matters more than the exact monthly amount.
              </p>
              <p>
                Already invested? The{" "}
                <Link to="/cagr-calculator" className={linkClass}>
                  CAGR Calculator
                </Link>{" "}
                can check your actual returns after the fact. It compares one starting value with one ending value, so
                for a SIP with monthly installments treat it as a rough guide — the exact measure is XIRR, which
                weights each installment by its date.
              </p>
            </CalcSection>

            <AdSlot slotId="sip_calc_mid" />

            <CalcSection title="SIP vs Lump Sum — which is better?">
              <p>
                They answer different situations. A SIP is how most people invest, out of monthly income. A lump sum
                applies when you already have a large amount available, such as a bonus or maturity proceeds.
              </p>
              <p>
                If the money is there today, a calculation with a steady return always favours investing it all at
                once, because every rupee starts earning sooner. ₹6,00,000 invested as a lump sum for 5 years at 12%
                grows to about ₹10,90,018; the same ₹6,00,000 invested as ₹10,000 a month over those 5 years (with the
                not-yet-invested part earning nothing) grows to about ₹8,24,864. But that gap comes from assuming a
                smooth 12%. Real markets fall as well as rise, and a SIP's real benefit — spreading your entry points so
                you don't invest everything just before a downturn — is exactly what a fixed-return calculator can't
                show.
              </p>
              <p>
                For how to choose, including the middle path of investing part now and staggering the rest, read the
                full{" "}
                <Link to={SIP_VS_LUMP_SUM_PATH} className={linkClass}>
                  SIP vs Lump Sum
                </Link>{" "}
                lesson.
              </p>
            </CalcSection>

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
                      <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Monthly SIP</p>
                      <p className="font-mono-tech mt-1 text-[18px] font-semibold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                        {fmt(monthlyInvestment)}
                      </p>
                    </div>
                    <div className="border border-[#111814]/12 p-4 text-center dark:border-[#eef1ec]/12">
                      <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Expected Return</p>
                      <p className="font-mono-tech mt-1 text-[18px] font-semibold tabular-nums text-[#047857] dark:text-[#34d399]">
                        {annualReturn}%
                      </p>
                    </div>
                    <div className="border border-[#111814]/12 p-4 text-center dark:border-[#eef1ec]/12">
                      <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Investment Time</p>
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
