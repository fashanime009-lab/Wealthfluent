import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo } from "react";
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

const FAQ_ITEMS = [
  { q: "What is a typical inflation rate?", a: "Inflation rates vary by country and over time. Many developed economies have historically targeted around 2%, while emerging economies may experience higher inflation rates. However, inflation can vary significantly based on economic conditions." },
  { q: "How does inflation affect my savings?", a: "Inflation reduces the purchasing power of your savings. If your savings earn a return lower than inflation, your real wealth decreases over time. This is why it's important to invest in assets that beat inflation." },
  { q: "Which investments beat inflation?", a: "Historically, equities (stocks), real estate, and gold have beaten inflation over the long term. Fixed deposits and bonds typically offer returns that may or may not beat inflation depending on the interest rate environment." },
  { q: "Should I use the same inflation rate for every goal?", a: "No — healthcare and education costs have historically risen faster than general inflation in many economies. Use a higher rate for those specific goals rather than one blanket assumption across your entire plan." },
];

export default function InflationCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentExpenses, setCurrentExpenses] = useState(10000);
  const [inflationRate, setInflationRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(30);
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const futureCost = useMemo(() => {
    return Math.round(
      currentExpenses * Math.pow(1 + inflationRate / 100, timePeriod)
    );
  }, [currentExpenses, inflationRate, timePeriod]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency, false, 2);

  // Calculate purchasing power loss
  const purchasingPowerLoss = useMemo(() => {
    if (futureCost > 0 && currentExpenses > 0) {
      return Math.round(((futureCost - currentExpenses) / futureCost) * 100);
    }
    return 0;
  }, [futureCost, currentExpenses]);

  return (
    <>
      <Seo
        title="Inflation Calculator – Understand the Impact of Inflation"
        description="Calculate the impact of inflation on your money. Find out how much you will need in the future to meet your current expenses whilst keeping up with inflation."
        path="/inflation-calculator"
        keywords="inflation calculator, purchasing power, future cost, inflation impact, financial planning"
        jsonLd={[
        calculatorSchema({
          name: "Inflation Calculator",
          description: "Calculate the impact of inflation on your money. Find out how much you will need in the future to meet your current expenses whilst keeping up with inflation.",
          path: "/inflation-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Inflation Calculator"
            description="Calculate the impact of inflation on your money. Find out how much you will need in the future to meet your current expenses whilst keeping up with inflation."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Current Expense Amount" value={currentExpenses} onChange={setCurrentExpenses} min={100} max={1000000} step={100} format={fmt} />
              <CalcField label="Annual Inflation Rate (%)" value={inflationRate} onChange={setInflationRate} min={1} max={20} step={0.5} suffix="%" />
              <CalcField label="Time Period (In Years)" value={timePeriod} onChange={setTimePeriod} min={1} max={50} suffix=" Years" />
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel label="Future Cost" value={fmt(futureCost)} />

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#111814]/12 bg-[#ffffff] p-4 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/55">Current Expenses</p>
                  <p className="font-mono-tech mt-1 text-[17px] font-semibold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {fmt(currentExpenses)}
                  </p>
                </div>
                <div className="border border-[#111814]/12 bg-[#ffffff] p-4 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/55">Time Period</p>
                  <p className="font-mono-tech mt-1 text-[17px] font-semibold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {timePeriod} Years
                  </p>
                </div>
              </div>

              {/* Inflation Impact Breakdown */}
              <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <h2 className="text-[13.5px] font-semibold text-[#111814] dark:text-[#eef1ec]">Inflation Impact</h2>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between text-[13.5px]">
                    <span className="text-[#111814]/65 dark:text-[#eef1ec]/65">Increase in Cost</span>
                    <span className="font-mono-tech tabular-nums text-amber-800 dark:text-amber-400">
                      +{fmt(futureCost - currentExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13.5px]">
                    <span className="text-[#111814]/65 dark:text-[#eef1ec]/65">Purchasing Power Lost</span>
                    <span className="font-mono-tech tabular-nums text-red-600 dark:text-red-400">
                      {purchasingPowerLoss}%
                    </span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
                    <div
                      className="h-full rounded-full bg-red-600 opacity-70 dark:bg-red-400 dark:opacity-80"
                      style={{
                        width: `${Math.min(purchasingPowerLoss, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                    {purchasingPowerLoss}% of your money's purchasing power will be eroded by inflation
                  </p>
                </div>
              </div>

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
            <AdSlot slotId="inflation_calc_mid" />

            <CalcSection title="What Is an Inflation Calculator?">
              <p>
                An Inflation Calculator helps you understand how inflation erodes the purchasing power of your money over time. It calculates the future cost of today's expenses based on the expected annual inflation rate and time period, helping you plan your finances more effectively.
              </p>
            </CalcSection>

            <CalcSection title="How Is Future Cost Calculated?">
              <p>
                This calculator applies the same compounding formula used for
                investment growth, just in reverse — prices grow instead of money:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Future Cost = Current Cost × (1 + Inflation Rate/100)^Years
              </p>
              <p>
                At just 6% annual inflation, something costing ₹10,000 today costs
                roughly ₹17,900 in 10 years and ₹32,000 in 20 years — which is why
                a "safe" savings account earning 3-4% is actually losing real value
                every year, even while the rupee balance keeps growing. Healthcare
                and education costs in particular have historically outpaced
                general inflation, so goals tied to either deserve a higher
                assumed rate than everyday expenses.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your current monthly or annual expenses.</li>
                <li>Set the expected annual inflation rate (historical inflation rates vary by country and economic conditions).</li>
                <li>Choose the time period (years) for which you want to calculate the future cost.</li>
                <li>The calculator will show the future cost and the impact of inflation on your purchasing power.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Why Inflation Planning Matters">
              <CalcBenefitGrid
                items={[
                  { title: "Retirement Planning", text: "Inflation significantly impacts retirement savings. What seems adequate today may not be sufficient in 20-30 years." },
                  { title: "Goal-Based Investing", text: "When saving for long-term goals like children's education or buying a home, always account for inflation to avoid shortfalls." },
                  { title: "Investment Strategy", text: "Understanding inflation helps you choose investments that can beat inflation and grow your real wealth." },
                  { title: "Budgeting", text: "Regular expense reviews and inflation adjustments help maintain your standard of living over time." },
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
