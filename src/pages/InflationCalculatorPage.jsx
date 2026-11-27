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
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What is a typical inflation rate?", a: "Inflation rates vary by country and over time. Many developed economies have historically targeted around 2%, while emerging economies may experience higher inflation rates. However, inflation can vary significantly based on economic conditions." },
  { q: "How does inflation affect my savings?", a: "Inflation reduces the purchasing power of your savings. If your savings earn a return lower than inflation, your real wealth decreases over time. This is why it's important to invest in assets that beat inflation." },
  { q: "Which investments beat inflation?", a: "Historically, equities (stocks), real estate, and gold have beaten inflation over the long term. Fixed deposits and bonds typically offer returns that may or may not beat inflation depending on the interest rate environment." },
  { q: "Should I use the same inflation rate for every goal?", a: "No — healthcare and education costs have historically risen faster than general inflation in many economies. Use a higher rate for those specific goals rather than one blanket assumption across your entire plan." },
  { q: "What is India's inflation target?", a: "The Reserve Bank of India targets consumer price inflation of 4%, with a tolerance band of 2% to 6%. Actual inflation moves around that target from year to year, and many long-term financial plans in India assume about 6% to stay on the safe side." },
  { q: "How do I protect my money from inflation?", a: "Keep only what you need for emergencies and near-term spending in cash and deposits, and invest money for goals more than five years away in assets that have historically outpaced inflation, such as a diversified equity fund. Check your plan every year and raise savings as your income grows." },
];

export default function InflationCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentExpenses, setCurrentExpenses] = useDefaultableField("inflation", "cost");
  const [inflationRate, setInflationRate] = useAssumptionField("inflation");
  const [timePeriod, setTimePeriod] = useDefaultableField("inflation", "years");
  const costBounds = useFieldBounds("inflation", "cost");
  const inflationRateBounds = useFieldBounds("inflation", "inflationRate");
  const yearsBounds = useFieldBounds("inflation", "years");
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
  const fmt0 = (v) => formatCurrency(v, settings.currency);
  const { inflation } = assumptionsFor(settings.currency);

  // Calculate purchasing power loss
  const purchasingPowerLoss = useMemo(() => {
    if (futureCost > 0 && currentExpenses > 0) {
      return Math.round(((futureCost - currentExpenses) / futureCost) * 100);
    }
    return 0;
  }, [futureCost, currentExpenses]);

  // Worked examples, at this currency's own default amount and inflation
  // assumption (the copy used to say 6% for every currency).
  const exampleToday = defaultFor("inflation", "cost", settings.currency);
  const example10yr = Math.round(exampleToday * Math.pow(1 + inflation / 100, 10));
  const example20yr = Math.round(exampleToday * Math.pow(1 + inflation / 100, 20));
  // What today's amount will buy at the end of the period, in today's prices.
  const futureBuyingPower = Math.round(currentExpenses / Math.pow(1 + inflationRate / 100, timePeriod));

  const tableRates = [3, 6, 9];
  const tableYears = [5, 10, 20, 30];
  const costRows = tableYears.map((y) => [
    `${y} years`,
    ...tableRates.map((rate) => fmt0(Math.round(exampleToday * Math.pow(1 + rate / 100, y)))),
  ]);

  return (
    <>
      <Seo
        title="Inflation Calculator: What Your Money Will Be Worth"
        description="Calculate the impact of inflation on your money: how much you'll need in future to cover today's expenses, and what your savings will really be worth."
        path="/inflation-calculator"
        keywords="inflation calculator, purchasing power, future cost, inflation impact, financial planning"
        jsonLd={[
        calculatorSchema({
          name: "Inflation Calculator",
          description: "Calculate the impact of inflation on your money: how much you'll need in future to cover today's expenses, and what your savings will really be worth.",
          path: "/inflation-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Inflation Calculator",
          description: "See how inflation erodes the purchasing power of your money and what today's expenses will cost in the future.",
          steps: [
            { name: "Enter your current expense amount", text: "Enter today's cost in the Current Expense Amount field." },
            { name: "Enter the annual inflation rate", text: "Enter your assumed annual inflation rate as a percentage in the Annual Inflation Rate field." },
            { name: "Enter the time period", text: "Enter how many years ahead you want to project in the Time Period field." },
            { name: "View your result instantly", text: "The calculator instantly shows the future cost and how much purchasing power is lost." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Inflation Calculator"
            description="Calculate the impact of inflation on your money: how much you'll need in future to cover today's expenses, and what your savings will really be worth."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Current Expense Amount" value={currentExpenses} onChange={setCurrentExpenses} {...costBounds} format={fmt} />
              <CalcField label="Annual Inflation Rate (%)" value={inflationRate} onChange={setInflationRate} {...inflationRateBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Time Period (In Years)" value={timePeriod} onChange={setTimePeriod} {...yearsBounds} suffix=" Years" />
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
                  <div className="flex justify-between text-[13.5px]">
                    <span className="text-[#111814]/65 dark:text-[#eef1ec]/65">Today's {fmt0(currentExpenses)} will buy, in {timePeriod} years</span>
                    <span className="font-mono-tech tabular-nums text-[#111814] dark:text-[#eef1ec]">{fmt0(futureBuyingPower)} worth</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                These figures assume the same inflation rate every year. Real inflation varies from year to year and
                differs by what you buy, so treat the result as an estimate.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">

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
                At {inflation}% annual inflation, something costing {fmt0(exampleToday)} today costs
                roughly {fmt0(example10yr)} in 10 years and {fmt0(example20yr)} in 20 years — which is why
                money in a savings account earning less than inflation is losing real value
                every year, even while the account balance keeps growing. Healthcare
                and education costs in particular have historically outpaced
                general inflation, so goals tied to either deserve a higher
                assumed rate than everyday expenses.
              </p>
            </CalcSection>

            <CalcSection title="Future cost at different inflation rates">
              <p>
                Small differences in the inflation rate add up over decades. Here's what {fmt0(exampleToday)} of
                spending today would cost later:
              </p>
              <CalcTable
                caption={`Future cost of ${fmt0(exampleToday)} of today's spending`}
                columns={["Years from now", ...tableRates.map((rate) => `At ${rate}% a year`)]}
                rows={costRows}
              />
              <p>
                A quick check: divide 72 by the inflation rate to see how many years it takes prices to double. At
                3% it's about 24 years, at 6% about 12, and at 9% about 8.
              </p>
            </CalcSection>

            <CalcSection title="What inflation rate should you use?">
              <p>
                Central banks publish targets that make a sensible starting point. The Reserve Bank of India
                targets consumer price inflation of <strong className={calcStrongClass}>4%, within a band of 2% to 6%</strong>,
                and the US Federal Reserve, the European Central Bank and the Bank of England target about 2%.
                Actual inflation moves around these targets, and long-term plans often assume a little more to stay
                on the safe side.
              </p>
              <p>
                Your personal inflation can differ from the official figure, because it depends on what you buy.
                School and college fees and medical costs have tended to rise faster than general prices, so use a
                higher rate for those goals. Lifestyle creep, spending more as you earn more, raises your costs too,
                even though it isn't inflation.
              </p>
            </CalcSection>

            <CalcSection title="How to beat inflation">
              <p>
                Money only grows in real terms if it earns more than inflation after tax. Cash and savings accounts
                usually don't, which is fine for an emergency fund but costly for long-term goals. Investments that
                have historically outpaced inflation over long periods, such as a diversified equity fund, suit goals
                more than five years away. Your real return is roughly your return minus inflation; the{" "}
                <Link to="/rate-of-return-calculator" className={calcLinkClass}>
                  Rate of Return Calculator
                </Link>{" "}
                works it out exactly.
              </p>
              <p>
                For planning, the{" "}
                <Link to="/goal-sip" className={calcLinkClass}>
                  Goal SIP Calculator
                </Link>{" "}
                turns an inflated goal into a monthly investment, and the{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>{" "}
                shows your corpus in today's money. Our lesson on{" "}
                <Link to="/learn/understanding-inflation" className={calcLinkClass}>
                  understanding inflation
                </Link>{" "}
                covers the basics.
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
