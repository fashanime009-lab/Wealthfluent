import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What is a good rate of return?", a: "Historically, stock markets have delivered positive long-term returns, but performance varies by country, asset class, and time period. A good rate of return depends on your goals, risk tolerance, and investment horizon. Debt instruments typically offer 6-9% returns. The ideal return depends on your risk tolerance and investment goals." },
  { q: "How is rate of return different from simple interest?", a: "Rate of return (CAGR) accounts for compound growth, while simple interest is calculated only on the principal. CAGR provides a more accurate picture of investment performance over time." },
  { q: "Can the rate of return be negative?", a: "Yes, if the future value is less than the present value, the rate of return will be negative, indicating a loss on the investment." },
  { q: "Is this the same as CAGR?", a: "Yes — annualized rate of return and CAGR describe the same calculation: the constant yearly growth rate that would take a present value to a future value over a given number of years." },
];

export default function RateOfReturnCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [presentValue, setPresentValue] = useState(10000);
  const [futureValue, setFutureValue] = useState(50000);
  const [yearsToGrow, setYearsToGrow] = useState(5);
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const rateOfReturn = useMemo(() => {
    if (presentValue <= 0 || futureValue <= 0 || yearsToGrow <= 0) return 0;
    const rate = (Math.pow(futureValue / presentValue, 1 / yearsToGrow) - 1) * 100;
    return rate;
  }, [presentValue, futureValue, yearsToGrow]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);

  // ─── Format percentage ──────────────────────────────────────────
  const formatPercentage = (value) => {
    return value.toFixed(2);
  };

  // ─── Calculate gain ──────────────────────────────────────────
  const totalGain = futureValue - presentValue;
  const totalGainPercentage = presentValue > 0 ? (totalGain / presentValue) * 100 : 0;

  return (
    <>
      <Seo
        title="Rate of Return Calculator – Find Your Annualized Return"
        description="Calculate the annualized rate of return (CAGR) for your investments. Find out how much your money has grown over time."
        path="/rate-of-return-calculator"
        keywords="rate of return calculator, CAGR calculator, investment returns, annualized return"
        jsonLd={[
        calculatorSchema({
          name: "Rate of Return Calculator",
          description: "Calculate the annualized rate of return (CAGR) for your investments. Find out how much your money has grown over time.",
          path: "/rate-of-return-calculator",
        }),
        faqSchema([
          {
            "question": "What is a good rate of return?",
            "answer": "Historically, stock markets have delivered positive long-term returns, but performance varies by country, asset class, and time period. A good rate of return depends on your goals, risk tolerance, and investment horizon. Debt instruments typically offer 6-9% returns. The ideal return depends on your risk tolerance and investment goals."
          },
          {
            "question": "How is rate of return different from simple interest?",
            "answer": "Rate of return (CAGR) accounts for compound growth, while simple interest is calculated only on the principal. CAGR provides a more accurate picture of investment performance over time."
          },
          {
            "question": "Can the rate of return be negative?",
            "answer": "Yes, if the future value is less than the present value, the rate of return will be negative, indicating a loss on the investment."
          },
          {
            "question": "Is this the same as CAGR?",
            "answer": "Yes — annualized rate of return and CAGR describe the same calculation: the constant yearly growth rate that would take a present value to a future value over a given number of years."
          }
        ]),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Rate of Return Calculator"
            description="Calculate the annualized rate of return (CAGR) based on present value, future value, and time period."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Present value" value={presentValue} onChange={setPresentValue} min={100} max={10000000} step={100} format={fmt} />
              <CalcField label="Future value" value={futureValue} onChange={setFutureValue} min={100} max={100000000} step={100} format={fmt} />
              <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} min={1} max={50} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Rate of return (CAGR)" value={`${formatPercentage(rateOfReturn)}%`} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Present value" value={fmt(presentValue)} />
                <CalcStat label="Future value" value={fmt(futureValue)} tone="signal" />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total gain</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${totalGain >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {fmt(totalGain)}
                    </span>
                  </div>
                </div>
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total gain percentage</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${totalGainPercentage >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {totalGainPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <CalcStat label="Time period" value={`${yearsToGrow} Years`} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="rateofreturn_calc_mid" />

            <CalcSection title="What Is a Rate of Return Calculator?">
              <p>
                A Rate of Return Calculator helps you determine the annualized return (CAGR) of your investments. By
                entering the present value, future value, and time period, you can understand how well your
                investments have performed over time.
              </p>
            </CalcSection>

            <CalcSection title="How Is Annualized Return Calculated?">
              <p>This calculator solves the compound growth formula for the rate itself, given a known start and end value:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Rate = [(Future Value / Present Value)^(1/Years) − 1] × 100
              </p>
              <p>
                For example, ₹10,000 growing to ₹50,000 over 5 years works out to an annualized return of about
                37.97% — a single number that describes the average annual growth needed to turn the first figure
                into the second, regardless of how bumpy the actual year-by-year path was.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter the present value (initial investment amount).</li>
                <li>Enter the future value (final investment amount).</li>
                <li>Set the number of years the investment has grown.</li>
                <li>The calculator will show the annualized rate of return (CAGR).</li>
                <li>Use the results to compare different investment opportunities.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding Rate of Return">
              <CalcBenefitGrid
                items={[
                  { title: "CAGR (Compound Annual Growth Rate)", text: "CAGR measures the average annual growth rate of an investment over a specific period. It smooths out volatility to show a consistent annual return." },
                  { title: "Absolute vs. Annualized Returns", text: "Absolute return is the total percentage gain over the entire period. Annualized return (CAGR) shows the average annual gain, making it easier to compare investments with different time horizons." },
                  { title: "Risk and Return", text: "Higher returns generally come with higher risk. Understanding your rate of return helps you assess whether the risk you're taking is justified." },
                  { title: "Inflation-Adjusted Returns", text: "To calculate real returns, subtract the inflation rate from your rate of return. This shows the actual increase in purchasing power." },
                ]}
              />
            </CalcSection>

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
