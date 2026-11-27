import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useMemo } from "react";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What is the difference between simple and compound interest?", a: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest, leading to exponential growth." },
  { q: "How often does compound interest compound?", a: "In this calculator, we assume annual compounding. Real-world investments may compound daily, monthly, quarterly, or annually. More frequent compounding results in slightly higher returns." },
  { q: "What is a good rate of return for long-term investments?", a: "Historically, stock markets have provided positive long-term returns, while bonds and fixed-income investments generally offer lower but more stable returns. Actual results vary by country, market conditions, and investment type. Your ideal rate depends on your risk tolerance and investment goals." },
  { q: "Does this account for inflation?", a: "No — the future value shown is in nominal terms. To see what that amount is worth in today's purchasing power, discount it by your assumed inflation rate separately, or use the Inflation Calculator alongside this one." },
  { q: "What is the rule of 72?", a: "A quick way to estimate how long money takes to double: divide 72 by the yearly growth rate. At 8% a year, money doubles in about 9 years; at 12%, in about 6. It's an approximation that works best for rates between about 4% and 15%." },
  { q: "Are annual additions made at the start or the end of each year?", a: "This calculator assumes each addition is made at the end of the year, so the first one has one year less to grow than the starting amount. Adding at the start of each year instead gives a slightly higher result." },
];

export default function FutureValueCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useDefaultableField("futureValue", "principal");
  const [annualAddition, setAnnualAddition] = useDefaultableField("futureValue", "annualAddition");
  const [yearsToGrow, setYearsToGrow] = useDefaultableField("futureValue", "years");
  const [growthRate, setGrowthRate] = useAssumptionField("equityReturn");
  const principalBounds = useFieldBounds("futureValue", "principal");
  const annualAdditionBounds = useFieldBounds("futureValue", "annualAddition");
  const yearsBounds = useFieldBounds("futureValue", "years");
  const growthRateBounds = useFieldBounds("futureValue", "growthRate");
  const { settings } = useSettings();

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

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);
  const { inflation } = assumptionsFor(settings.currency);

  // Worked examples, from this currency's default starting amount.
  const examplePrincipal = defaultFor("futureValue", "principal", settings.currency);
  const tableRates = [4, 8, 12];
  const tableYears = [5, 10, 20, 30];
  const growthRows = tableYears.map((y) => [
    `${y} years`,
    ...tableRates.map((rate) => fmt(Math.round(examplePrincipal * Math.pow(1 + rate / 100, y)))),
  ]);
  const annualCompounded = examplePrincipal * Math.pow(1.08, 10);
  const monthlyCompounded = examplePrincipal * Math.pow(1 + 0.08 / 12, 120);
  const realFutureValue = Math.round(results.futureValue / Math.pow(1 + inflation / 100, yearsToGrow));

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
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Future Value Calculator",
          description: "Calculate the future value of an investment with compound interest and optional annual additions.",
          steps: [
            { name: "Enter your current principal", text: "Enter your starting investment amount in the Current principal field." },
            { name: "Enter an annual addition", text: "Optionally enter a fixed amount you'll add every year in the Annual addition field." },
            { name: "Enter the years to grow", text: "Enter how many years the investment will grow in the Years to grow field." },
            { name: "Enter the growth rate", text: "Enter your expected annual growth rate as a percentage in the Growth rate field." },
            { name: "View your result instantly", text: "The calculator instantly shows the future value and total returns." },
          ],
        }),
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
              <CalcField label="Current principal" value={currentPrincipal} onChange={setCurrentPrincipal} {...principalBounds} format={fmt} />
              <CalcField label="Annual addition" value={annualAddition} onChange={setAnnualAddition} {...annualAdditionBounds} format={fmt} />
              <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} {...yearsBounds} suffix=" Years" />
              <CalcField label="Growth rate (%)" value={growthRate} onChange={setGrowthRate} {...growthRateBounds} suffix="%" hint="Sample value. Enter your own." />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Future value" value={fmt(results.futureValue)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Growth rate" value={`${growthRate}%`} />
                <CalcStat label="Total invested" value={fmt(results.totalInvested)} share={results.futureValue > 0 ? (results.totalInvested / results.futureValue) * 100 : 0} tone="signal" />
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
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          <div className="mt-16">

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

            <CalcSection title="What a lump sum grows to">
              <p>
                Here's how {fmt(examplePrincipal)} invested once grows at three different yearly rates, with nothing
                added. The gap between the columns widens every decade: at 12%, the 30-year result is many times the
                4% result, even though the rate is only three times higher. That's compounding, where each year's
                growth is earned on all the growth before it.
              </p>
              <CalcTable
                caption={`${fmt(examplePrincipal)} invested once, by years and yearly return`}
                columns={["Years", ...tableRates.map((rate) => `At ${rate}%`)]}
                rows={growthRows}
              />
            </CalcSection>

            <CalcSection title="The rule of 72: how fast money doubles">
              <p>
                Divide 72 by the yearly growth rate to estimate how many years it takes for money to double. At 4%
                that's about 18 years, at 8% about 9 years and at 12% about 6 years. It's a handy check on any
                result above: at 8% over 18 years, a lump sum should roughly quadruple, because it doubles twice.
              </p>
              <p>
                The same rule works in reverse for inflation. At {inflation}% inflation, prices double in about{" "}
                {Math.round(72 / inflation)} years, so money that isn't growing faster than that is losing value.
              </p>
            </CalcSection>

            <CalcSection title="Annual vs monthly compounding">
              <p>
                This calculator compounds once a year. Many deposits and funds compound more often, which adds a
                little more. {fmt(examplePrincipal)} at 8% for 10 years grows to {fmt(Math.round(annualCompounded))} with
                yearly compounding and {fmt(Math.round(monthlyCompounded))} with monthly compounding. The difference is
                real but small; the rate and the number of years matter far more than how often interest is added.
                The{" "}
                <Link to="/fd-calculator" className={calcLinkClass}>
                  FD Calculator
                </Link>{" "}
                lets you choose the compounding frequency.
              </p>
            </CalcSection>

            <CalcSection title="Nominal vs real future value">
              <p>
                The result above is a nominal amount: what your account will actually show in {yearsToGrow} years.
                Prices will have risen by then. At {inflation}% inflation, your result of {fmt(results.futureValue)} would
                buy about as much as <strong className={calcStrongClass}>{fmt(realFutureValue)}</strong> does today. Planning
                in today's money keeps long-term goals honest; the{" "}
                <Link to="/inflation-calculator" className={calcLinkClass}>
                  Inflation Calculator
                </Link>{" "}
                does the conversion for any amount.
              </p>
              <p>
                If you invest monthly rather than yearly, the{" "}
                <Link to="/sip-calculator" className={calcLinkClass}>
                  SIP Calculator
                </Link>{" "}
                compounds each monthly payment, and the{" "}
                <Link to="/power-of-compounding" className={calcLinkClass}>
                  Power of Compounding Calculator
                </Link>{" "}
                puts compound and simple interest side by side.
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

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
