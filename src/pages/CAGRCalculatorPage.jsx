import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
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
  { q: "What is a good CAGR?", a: "It depends on the investment type, market conditions, and level of risk. Historically, stock markets have delivered strong long-term returns, while fixed-income investments generally provide lower but more stable returns." },
  { q: "What does CAGR mean?", a: "CAGR stands for Compound Annual Growth Rate: the single, constant yearly growth rate that would take an investment from its starting value to its ending value over a set number of years, with growth compounding each year. It smooths out the ups and downs — an investment that doubled in 5 years has a CAGR of about 14.87%, whether it grew evenly or in bursts." },
  { q: "How do I calculate CAGR for a stock or mutual fund?", a: "Take the value at the end divided by the value at the start, raise it to the power of 1 divided by the number of years, subtract 1, and multiply by 100. Or enter the three numbers above. This works for a stock, fund NAV or portfolio bought once and held. If you added money at different times, as with a monthly SIP, CAGR isn't accurate — use XIRR, which weights each cash flow by its date." },
  { q: "What is the difference between CAGR and average annual return?", a: "An average adds up yearly returns and divides by the number of years, ignoring compounding, so it overstates growth when returns swing. If an investment gains 50% one year and loses 50% the next, the average return is 0%, but ₹100 becomes ₹75 — a CAGR of about −13.4% a year. CAGR is the figure that matches what your money actually did." },
  { q: "Why is CAGR important?", a: "CAGR provides a smoothed annual growth rate that removes volatility, making it easier to compare investments with different time horizons and evaluate long-term performance." },
  { q: "What is the difference between CAGR and absolute return?", a: "Absolute return measures total growth over the entire period, while CAGR expresses it as an annualised rate, making comparisons across different timeframes more meaningful." },
  { q: "Does CAGR account for volatility or risk?", a: "No. CAGR only looks at the start and end values, so it can't tell you how bumpy the path was. Two investments with the same CAGR can have very different volatility — pair it with standard deviation or a year-by-year return chart for the full picture." },
  { q: "Can CAGR be negative?", a: "Yes — if the final value is lower than the initial value, CAGR comes out negative, reflecting an average annual loss over the period rather than growth." },
];

export default function CAGRCalculatorPage() {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(50000);
  const [years, setYears] = useState(5);
  const { settings } = useSettings();

  // CAGR is undefined for a starting value of 0 or a 0-year period — both
  // are one keystroke away in the number fields and used to print
  // "Infinity%". Show a dash instead of a number that isn't one.
  const cagr =
    initialValue > 0 && years > 0
      ? ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(2)
      : null;

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="CAGR Calculator – Compound Annual Growth Rate"
        description="Free CAGR calculator: find the compound annual growth rate from a starting value, ending value and years. Formula, worked examples and how to read it."
        path="/cagr-calculator"
        keywords="CAGR calculator, what is CAGR, CAGR meaning, compound annual growth rate, CAGR formula, CAGR calculator for stocks, mutual fund CAGR"
        jsonLd={[
        calculatorSchema({
          name: "CAGR Calculator",
          description: "Free CAGR calculator: find the compound annual growth rate from a starting value, ending value and years. Formula, worked examples and how to read it.",
          path: "/cagr-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="CAGR Calculator"
            description="Calculate Compound Annual Growth Rate (CAGR) for investments, stocks, mutual funds, and business growth."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Initial Investment" value={initialValue} onChange={setInitialValue} min={1000} max={1000000} step={1000} format={fmt} />
              <CalcField label="Final Value" value={finalValue} onChange={setFinalValue} min={1000} max={5000000} step={1000} format={fmt} />
              <CalcField label="Investment Duration (Years)" value={years} onChange={setYears} min={1} max={30} suffix=" Years" />
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel label="Compound Annual Growth Rate" value={cagr === null ? "—" : `${cagr}%`} />

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Initial Value" value={fmt(initialValue)} />
                <CalcStat
                  label="Final Value"
                  value={fmt(finalValue)}
                  share={initialValue > 0 ? Math.min(((finalValue - initialValue) / initialValue) * 100, 100) : 0}
                  tone="signal"
                />
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                CAGR calculations are based on the inputs provided and are for
                illustrative purposes only. Past performance does not guarantee
                future returns. Actual investment returns may vary. CAGR does
                not account for volatility or risk. Please consult a financial
                advisor for personalised investment advice.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="cagr_calc_mid" />

            <CalcSection title="What Is CAGR?">
              <p>
                CAGR (Compound Annual Growth Rate) measures the average
                annual growth rate of an investment over a specific time
                period. It helps investors understand long-term investment
                performance more accurately than simple returns, smoothing
                out volatility and providing a clear annualised figure.
              </p>
              <p>
                CAGR answers one specific question: "what constant annual return,
                compounded every year, would have produced this same total result?"
                It's a smoothing tool, not a description of the actual ride — two
                investments can have identical CAGR over five years while one swung
                wildly year to year and the other grew steadily, so CAGR alone
                doesn't tell you anything about volatility or risk along the way.
              </p>
            </CalcSection>

            <CalcSection title="How Is CAGR Calculated?">
              <p>CAGR uses this formula:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                CAGR = [(Final Value / Initial Value)^(1/N) − 1] × 100
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the number of years between the two values.
                An investment that grew from ₹1,00,000 to ₹2,00,000 over 6 years has
                a CAGR of about 12.2% — even though the actual year-by-year path
                could have included both sharp gains and losing years along the way.
                Always check what start and end dates a CAGR figure uses before
                comparing it across sources — a CAGR measured from a market bottom
                to a peak will look far better than the same period measured
                peak-to-peak.
              </p>
            </CalcSection>

            <CalcSection title="CAGR example: what a return really means">
              <p>
                Suppose you bought a stock or fund for ₹50,000 and it's worth ₹1,00,000 five years later. The total
                gain is 100%, but the more useful number is the yearly rate: (1,00,000 ÷ 50,000)^(1/5) − 1 = 14.87%
                a year. That's the figure to compare against a fixed deposit at 7% or an index fund's long-run
                return — the 100% total alone can't be compared with anything held for a different length of time.
              </p>
              <p>
                CAGR also shows why average returns mislead. A fall of 50% needs a gain of 100% to recover, so
                volatile investments compound slower than their average suggests. When you compare funds or stocks,
                use the same start and end dates for each, and treat CAGR as the summary of the outcome — not a
                forecast of the next five years.
              </p>
            </CalcSection>

            <CalcSection title="Benefits Of CAGR Analysis">
              <CalcBenefitGrid
                items={[
                  { title: "Compare Investments", text: "CAGR helps compare investment performance across stocks, mutual funds, businesses, and assets on a consistent annualised basis." },
                  { title: "Long-Term Analysis", text: "Investors can evaluate long-term wealth growth more effectively using annualized returns rather than absolute returns." },
                  { title: "Goal Setting", text: "CAGR helps set realistic return expectations and plan future investment goals." },
                  { title: "Performance Tracking", text: "Track investment performance over multiple years to assess strategy effectiveness." },
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
