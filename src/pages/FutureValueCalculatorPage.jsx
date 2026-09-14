import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
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
  { q: "What is the difference between simple and compound interest?", a: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest, leading to exponential growth." },
  { q: "How often does compound interest compound?", a: "In this calculator, we assume annual compounding. Real-world investments may compound daily, monthly, quarterly, or annually. More frequent compounding results in slightly higher returns." },
  { q: "What is a good rate of return for long-term investments?", a: "Historically, stock markets have provided positive long-term returns, while bonds and fixed-income investments generally offer lower but more stable returns. Actual results vary by country, market conditions, and investment type. Your ideal rate depends on your risk tolerance and investment goals." },
  { q: "Does this account for inflation?", a: "No — the future value shown is in nominal terms. To see what that amount is worth in today's purchasing power, discount it by your assumed inflation rate separately, or use the Inflation Calculator alongside this one." },
];

export default function FutureValueCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useState(100000);
  const [annualAddition, setAnnualAddition] = useState(12000);
  const [yearsToGrow, setYearsToGrow] = useState(20);
  const [growthRate, setGrowthRate] = useState(12);
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const rate = growthRate / 100;
    let futureValue = currentPrincipal * Math.pow(1 + rate, yearsToGrow);

    // If there are annual additions, calculate their future value
    if (annualAddition > 0 && rate > 0) {
      // Future value of growing annuity (annual additions at the end of each year)
      const fvAdditions = annualAddition * ((Math.pow(1 + rate, yearsToGrow) - 1) / rate);
      futureValue += fvAdditions;
    } else if (annualAddition > 0) {
      // If rate is 0, just add the total additions
      futureValue += annualAddition * yearsToGrow;
    }

    const totalInvested = currentPrincipal + annualAddition * yearsToGrow;
    const totalReturns = futureValue - totalInvested;

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
    };
  }, [currentPrincipal, annualAddition, yearsToGrow, growthRate]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const fmt = (value) => `${currency}${formatCurrency(value)}`;

  // ─── Calculate return percentage ─────────────────────────────
  const returnPercentage = useMemo(() => {
    if (results.totalInvested > 0) {
      return ((results.futureValue - results.totalInvested) / results.totalInvested) * 100;
    }
    return 0;
  }, [results]);

  return (
    <>
      <Seo
        title="Future Value Calculator – Compound Interest Growth"
        description="Calculate the future value of your investments with compound interest. See how your money grows with annual additions and compounding."
        path="/future-value-calculator"
        keywords="future value calculator, compound interest, investment growth, wealth calculator"
        jsonLd={[
        calculatorSchema({
          name: "Future Value Calculator",
          description: "Calculate the future value of your investments with compound interest. See how your money grows with annual additions and compounding.",
          path: "/future-value-calculator",
        }),
        faqSchema([
          {
            "question": "What is the difference between simple and compound interest?",
            "answer": "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest, leading to exponential growth."
          },
          {
            "question": "How often does compound interest compound?",
            "answer": "In this calculator, we assume annual compounding. Real-world investments may compound daily, monthly, quarterly, or annually. More frequent compounding results in slightly higher returns."
          },
          {
            "question": "What is a good rate of return for long-term investments?",
            "answer": "Historically, stock markets have provided positive long-term returns, while bonds and fixed-income investments generally offer lower but more stable returns. Actual results vary by country, market conditions, and investment type. Your ideal rate depends on your risk tolerance and investment goals."
          },
          {
            "question": "Does this account for inflation?",
            "answer": "No — the future value shown is in nominal terms. To see what that amount is worth in today's purchasing power, discount it by your assumed inflation rate separately, or use the Inflation Calculator alongside this one."
          }
        ]),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Future Value (Compound Interest) Calculator"
            description="Calculate the future value of your investments with compound interest and annual additions."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Current principal" value={currentPrincipal} onChange={setCurrentPrincipal} min={0} max={10000000} step={1000} format={fmt} />
              <CalcField label="Annual addition" value={annualAddition} onChange={setAnnualAddition} min={0} max={1000000} step={500} format={fmt} />
              <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} min={1} max={50} step={1} suffix=" Years" />
              <CalcField label="Growth rate (%)" value={growthRate} onChange={setGrowthRate} min={0} max={30} step={0.5} suffix="%" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Future value" value={fmt(results.futureValue)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Growth rate" value={`${growthRate}%`} />
                <CalcStat label="Total invested" value={fmt(results.totalInvested)} share={(results.totalInvested / results.futureValue) * 100} tone="signal" />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total returns</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${results.totalReturns >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {fmt(results.totalReturns)}
                    </span>
                  </div>
                </div>
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Return percentage</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${returnPercentage >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {returnPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="futurevalue_calc_mid" />

            <CalcSection title="What Is a Future Value (Compound Interest) Calculator?">
              <p>
                A Future Value Calculator helps you estimate the value of your investments at a future date, accounting
                for compound interest and annual additions. It shows how your money grows over time, helping you plan
                for long-term financial goals like retirement, education, or wealth building.
              </p>
            </CalcSection>

            <CalcSection title="How Is Future Value Calculated?">
              <p>For a lump sum with no further additions:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = P × (1 + r)^N
              </p>
              <p>
                Where <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the principal,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is the annual growth rate, and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the number of years. If you also
                add a fixed amount every year, this calculator adds the future value of those contributions as a
                growing annuity on top of the lump-sum result — which is why increasing your annual contribution has
                a compounding effect of its own, not just a linear one, over a long enough horizon.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter your current principal amount (initial investment).</li>
                <li>Add any annual contributions you plan to make.</li>
                <li>Set the number of years you want your money to grow.</li>
                <li>Enter the expected annual growth rate (rate of return).</li>
                <li>The calculator will show your future value and investment summary.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding Compound Interest">
              <CalcBenefitGrid
                items={[
                  { title: "Power of Compounding", text: "Compound interest earns returns on both your principal and previously earned returns. This creates exponential growth over time." },
                  { title: "Regular Contributions", text: "Adding to your investments regularly (annual additions) significantly accelerates wealth accumulation through the power of compounding." },
                  { title: "Time Horizon", text: "The longer your investment horizon, the more time your money has to compound and grow. Starting early is one of the most effective wealth-building strategies." },
                  { title: "Rate of Return", text: "Higher returns lead to faster growth, but they come with higher risk. Find a balance that matches your risk tolerance and financial goals." },
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
