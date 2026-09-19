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
  { q: "What is a good CAGR?", a: "A good CAGR depends on asset type, market conditions, and investment risk levels. A good CAGR depends on the investment type, market conditions, and level of risk. Historically, stock markets have delivered strong long-term returns, while fixed-income investments generally provide lower but more stable returns." },
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
        title="CAGR Calculator – Investment Growth Rate"
        description="Work out the annualized growth rate (CAGR) of any investment from its starting value, ending value, and holding period — useful for comparing returns across different investments."
        path="/cagr-calculator"
        keywords="CAGR calculator, compound annual growth rate, investment growth, mutual fund returns"
        jsonLd={[
        calculatorSchema({
          name: "CAGR Calculator",
          description: "Work out the annualized growth rate (CAGR) of any investment from its starting value, ending value, and holding period — useful for comparing returns across different investments.",
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
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
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
