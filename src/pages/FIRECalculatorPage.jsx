import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { sipFutureValue } from "@/utils/projections";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDefaultableObjectCustom, useFieldBounds } from "@/hooks/useDefaultableField";
import { defaultFor, assumptionsFor } from "@/data/calculatorDefaults";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import CalcStat from "@/components/calculators/CalcStat";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import GrowthChart from "@/components/calculators/GrowthChart";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "Is the 4% rule still valid today?", a: "It remains a widely used starting point, though some planners now suggest a more conservative 3.25-3.5% for very long retirements (40+ years) given today's valuations and lower expected bond returns compared to when the original research was done." },
  { q: "Does this account for taxes on withdrawals?", a: "No — this is a pre-tax projection. Depending on which account types your investments sit in, actual withdrawals may be taxed, meaning your real-world FIRE number could need to be somewhat higher than shown here." },
  { q: "What if my freedom score is below 100%?", a: "You have three levers: increase your monthly investment, push back your target retirement age, or reduce your target annual expenses (which also lowers your FIRE number, since it's 25× annual expenses)." },
  { q: "Is 25 times expenses enough in India?", a: "It's a common starting point, but many Indian planners use 30 to 35 times, because inflation has been higher than in the US where the 4% rule was studied, retirements that start early last longer, and healthcare costs rise quickly. Running the numbers at 30× gives you a margin of safety." },
  { q: "What is Coast FIRE?", a: "Coast FIRE means you've already saved enough that, left invested, it will grow to your FIRE number by your target retirement age without any further contributions. After that point you only need to earn enough to cover your living costs, which lets you work less or take a lower-paid job you prefer." },
  { q: "How does my savings rate affect when I can retire?", a: "Much more than your income does. Saving more both grows your investments faster and shows you can live on less, which lowers the FIRE number you need. The savings-rate table on this page shows how the years to financial independence fall as the rate rises." },
];

// Years until savings at rate `s` (as a share of income), invested at a
// real return `rr`, reach 25× the yearly spending they leave behind.
// Works in today's money, so income growth and inflation cancel out.
function yearsToFire(s, rr) {
  if (s >= 1) return 0;
  const target = 25 * (1 - s);
  let wealth = 0;
  for (let year = 1; year <= 80; year++) {
    wealth = wealth * (1 + rr) + s;
    if (wealth >= target) return year;
  }
  return null;
}

export default function FIRECalculatorPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useDefaultableObjectCustom((currency) => ({
    currentAge: defaultFor("fire", "currentAge", currency),
    retirementAge: defaultFor("fire", "retirementAge", currency),
    monthlyExpenses: defaultFor("fire", "monthlyExpenses", currency),
    currentSavings: defaultFor("fire", "currentSavings", currency),
    monthlyInvestment: defaultFor("fire", "monthlyInvestment", currency),
    expectedReturn: assumptionsFor(currency).equityReturn,
    inflationRate: assumptionsFor(currency).inflation,
  }));

  const results = useMemo(() => {
    // A retirement age at or below the current age used to produce a
    // negative number of years; treat it as retiring now.
    const years = Math.max(0, formData.retirementAge - formData.currentAge);

    // Shared helper — handles a 0% return, which the inline annuity formula
    // turned into NaN (the slider's minimum is 0).
    const futureInvestments = sipFutureValue(formData.monthlyInvestment, years, formData.expectedReturn);

    const futureSavings =
      formData.currentSavings *
      Math.pow(1 + formData.expectedReturn / 100, years);

    const totalWealth = futureInvestments + futureSavings;

    const futureExpenses =
      formData.monthlyExpenses *
      Math.pow(1 + formData.inflationRate / 100, years);

    const fireNumber = futureExpenses * 12 * 25;

    const freedomScore =
      fireNumber > 0 ? Math.min(100, Math.round((totalWealth / fireNumber) * 100)) : 100;

    const chartData = [];
    // Same maths as totalWealth above, evaluated year by year, so the final
    // point of the chart equals the headline figure. The old version grew
    // every rupee ever contributed from day one — at the defaults that put
    // the last point at ₹6.08 crore against a headline result of ₹2.79 crore.
    for (let i = 0; i <= years; i++) {
      const growth =
        sipFutureValue(formData.monthlyInvestment, i, formData.expectedReturn) +
        formData.currentSavings * Math.pow(1 + formData.expectedReturn / 100, i);
      chartData.push({
        age: formData.currentAge + i,
        wealth: Math.round(growth),
      });
    }

    // The age at which projected wealth first covers 25× that year's
    // (inflated) expenses. The old "you could achieve financial freedom in
    // N years" just repeated retirement age − current age.
    let fireAge = null;
    for (let i = 0; i <= 60; i++) {
      const wealth =
        sipFutureValue(formData.monthlyInvestment, i, formData.expectedReturn) +
        formData.currentSavings * Math.pow(1 + formData.expectedReturn / 100, i);
      const target = formData.monthlyExpenses * Math.pow(1 + formData.inflationRate / 100, i) * 12 * 25;
      if (wealth >= target) {
        fireAge = formData.currentAge + i;
        break;
      }
    }

    // Coast FIRE: what you'd need invested today to reach the FIRE number by
    // the target age with no further contributions.
    const coastNumber = fireNumber / Math.pow(1 + formData.expectedReturn / 100, years);

    return {
      years,
      totalWealth,
      futureExpenses,
      fireNumber,
      freedomScore,
      chartData,
      fireAge,
      coastNumber,
    };
  }, [formData]);

  // Shared, currency-aware formatting (lakh/crore for INR) instead of the
  // hardcoded en-US grouping this page used to apply after a bare symbol.
  const fmt = (v) => formatCurrency(v, settings.currency);

  const currentAgeBounds = useFieldBounds("fire", "currentAge");
  const retirementAgeBounds = useFieldBounds("fire", "retirementAge");
  const monthlyExpensesBounds = useFieldBounds("fire", "monthlyExpenses");
  const currentSavingsBounds = useFieldBounds("fire", "currentSavings");
  const monthlyInvestmentBounds = useFieldBounds("fire", "monthlyInvestment");
  const expectedReturnBounds = useFieldBounds("fire", "expectedReturn");
  const inflationRateBounds = useFieldBounds("fire", "inflationRate");

  const realReturn = (1 + formData.expectedReturn / 100) / (1 + formData.inflationRate / 100) - 1;
  const savingsRows = [10, 20, 30, 40, 50, 60].map((pct) => {
    const n = yearsToFire(pct / 100, realReturn);
    return [`${pct}% of income`, n === null ? "80+ years" : `About ${n} years`];
  });
  const expenseRows = [0.5, 1, 1.5, 2].map((k) => {
    const monthly = Math.round(formData.monthlyExpenses * k);
    return [`${fmt(monthly)} a month`, fmt(monthly * 12 * 25), fmt(monthly * 12 * 30)];
  });

  const FIELDS = [
    { label: "Current age", name: "currentAge", ...currentAgeBounds, suffix: "" },
    { label: "Retirement age", name: "retirementAge", ...retirementAgeBounds, suffix: "" },
    { label: "Monthly expenses", name: "monthlyExpenses", ...monthlyExpensesBounds, format: fmt },
    { label: "Current savings", name: "currentSavings", ...currentSavingsBounds, format: fmt },
    { label: "Monthly investment", name: "monthlyInvestment", ...monthlyInvestmentBounds, format: fmt },
    { label: "Expected return (p.a.)", name: "expectedReturn", ...expectedReturnBounds, suffix: "%", hint: "Sample value. Enter your own." },
    { label: "Inflation rate (p.a.)", name: "inflationRate", ...inflationRateBounds, suffix: "%", hint: "Sample value. Enter your own." },
  ];

  return (
    <>
      <Seo
        title="FIRE Calculator: Your Financial Independence Number"
        description="Plan your financial independence with our FIRE Calculator. Estimate wealth, FIRE number, and retirement timeline with inflation-adjusted projections."
        path="/fire-calculator"
        keywords="FIRE calculator, financial independence, retire early, wealth planning, retirement calculator"
        jsonLd={[
        calculatorSchema({
          name: "FIRE Calculator",
          description: "Plan your financial independence with our FIRE Calculator. Estimate wealth, FIRE number, and retirement timeline with inflation-adjusted projections.",
          path: "/fire-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the FIRE Calculator",
          description: "Plan your Financial Independence, Retire Early journey by estimating your wealth, FIRE number, and freedom score.",
          steps: [
            { name: "Enter your current age", text: "Enter your current age in the Current age field." },
            { name: "Enter your target retirement age", text: "Enter the age you'd like to retire by in the Retirement age field." },
            { name: "Enter your monthly expenses", text: "Enter your current monthly expenses in the Monthly expenses field." },
            { name: "Enter your current savings", text: "Enter how much you've already saved in the Current savings field." },
            { name: "Enter your monthly investment", text: "Enter how much you invest every month in the Monthly investment field." },
            { name: "Enter the expected return", text: "Enter your expected annual rate of return as a percentage in the Expected return field." },
            { name: "Enter the inflation rate", text: "Enter your assumed annual inflation rate as a percentage in the Inflation rate field." },
            { name: "View your result instantly", text: "The calculator instantly shows your freedom score, estimated wealth and FIRE number." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="FIRE Calculator"
            description="Discover how long it may take to achieve Financial Independence and Retire Early using wealth projections and inflation-adjusted planning."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              {FIELDS.map((field) => (
                <CalcField
                  key={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  suffix={field.suffix}
                  format={field.format}
                  hint={field.hint}
                />
              ))}
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Freedom score" value={`${results.freedomScore}%`} note={`Your current plan reaches ${results.freedomScore}% of your FIRE number by age ${formData.retirementAge}.`} />
              <div className="grid grid-cols-2 divide-x divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <div className="p-5">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Estimated wealth</p>
                  <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {fmt(results.totalWealth)}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">FIRE number</p>
                  <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {fmt(results.fireNumber)}
                  </p>
                </div>
              </div>
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat
                  label="Age you'd reach your FIRE number"
                  value={results.fireAge === null ? "Not within 60 years" : `${results.fireAge}`}
                  tone="signal"
                />
                <CalcStat label="Coast FIRE: needed invested today" value={fmt(Math.round(results.coastNumber))} />
              </div>
              {formData.retirementAge <= formData.currentAge && (
                <p className="text-[12.5px] text-amber-800 dark:text-amber-400">
                  Your retirement age is at or below your current age, so the figures above assume you retire now.
                </p>
              )}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                These projections are for illustrative purposes only and do not guarantee actual returns. Market
                returns are subject to volatility and past performance does not indicate future results. Please
                consult a certified financial advisor for personalised advice. The FIRE number assumes the 4%
                withdrawal rule and is based on inflation-adjusted expenses. Actual retirement needs may vary.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              Wealth projection
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
              Projected wealth growth over time based on your inputs.
            </p>
            <div className="mt-6 h-[300px] w-full border border-[#111814]/12 bg-[#ffffff] p-4 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] md:h-[380px] md:p-6">
              <GrowthChart
                data={results.chartData}
                xKey="age"
                yKey="wealth"
                formatAxis={(value) => formatCurrency(value, settings.currency, true)}
                formatValue={fmt}
                formatLabel={(age) => `Age: ${age}`}
                ariaLabel={`Projected wealth by age: ${fmt(results.chartData[0]?.wealth ?? 0)} at age ${results.chartData[0]?.age} rising to ${fmt(results.totalWealth)} at age ${formData.retirementAge}`}
              />
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="Financial insights">
              <CalcBenefitGrid
                items={[
                  {
                    title: "Retirement timeline",
                    text:
                      results.fireAge === null
                        ? "At your current investment and spending, your projected wealth doesn't reach your FIRE number within 60 years. Investing more or spending less are the two levers."
                        : `At your current pace, your projected wealth first covers 25× your expenses at age ${results.fireAge}${results.fireAge <= formData.retirementAge ? `, on or before your target of ${formData.retirementAge}` : `, ${results.fireAge - formData.retirementAge} years after your target of ${formData.retirementAge}`}.`,
                  },
                  { title: "Inflation impact", text: `Future monthly expenses after inflation may be approximately ${fmt(results.futureExpenses)}.` },
                  { title: "Wealth optimization", text: "Increasing your monthly investments by even 10–15% can significantly accelerate your path to independence." },
                  { title: "FIRE readiness", text: `Your current trajectory gives a ${results.freedomScore}% freedom score, indicating the progress toward your FIRE goal.` },
                ]}
              />
            </CalcSection>

            <CalcSection title="What is a FIRE calculator?">
              <p>
                FIRE stands for Financial Independence, Retire Early — a movement centered on saving and investing
                aggressively enough to cover your living expenses from investment returns alone, independent of a
                traditional retirement age. This calculator projects your investment growth against your target
                "FIRE number" and shows a freedom score: how close your current savings trajectory gets you to that
                number by your chosen age.
              </p>
              <p>
                FIRE isn't only about retiring at 35 — for most people it's really about optionality: reaching a
                savings rate and net worth where working becomes a choice rather than a necessity, whether or not
                you actually stop working at that point.
              </p>
            </CalcSection>

            <CalcSection title="How is your FIRE number calculated?">
              <p>
                Your FIRE number is based on the widely-used 4% rule — the idea that withdrawing 4% of a
                well-diversified portfolio annually has historically had a high probability of lasting 30+ years:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FIRE Number = Annual Expenses × 25
              </p>
              <p>
                Multiplying by 25 is mathematically the same as dividing by 4% — it's the portfolio size at which a
                4% withdrawal covers a full year of expenses. This calculator first inflates your current monthly
                expenses forward to your target retirement age, then multiplies the annualized result by 25 to get
                your FIRE number, and separately projects your actual investment growth (current savings plus
                ongoing monthly investments, compounded at your expected return) to calculate your freedom score —
                what percentage of that FIRE number your current plan reaches.
              </p>
            </CalcSection>

            <CalcSection title="Your savings rate decides when">
              <p>
                The single biggest driver of when you reach financial independence is the share of your income you
                save. Here's roughly how long it takes, starting from nothing, at a real return of{" "}
                {(realReturn * 100).toFixed(1)}% a year ({formData.expectedReturn}% return minus {formData.inflationRate}% inflation):
              </p>
              <CalcTable caption="Years to save 25× your yearly spending, from zero" columns={["You save", "Time to FIRE"]} rows={savingsRows} />
              <p>
                Saving more works twice: your investments grow faster, and you prove you can live on less, which
                shrinks the number you need. Existing savings shorten every row.
              </p>
            </CalcSection>

            <CalcSection title="FIRE number by monthly spending">
              <CalcTable
                caption="In today's money, before inflation"
                columns={["Monthly spending", "FIRE number (25×)", "Cautious (30×)"]}
                rows={expenseRows}
              />
              <p>
                In India, where inflation has run higher than in the US and an early retirement can last 40 years
                or more, many planners use 30× or more. Your FIRE number in the results above is higher than this
                table because it inflates your expenses to your target age first.
              </p>
            </CalcSection>

            <CalcSection title="Coast FIRE: the halfway milestone">
              <p>
                Coast FIRE is the point where you've saved enough that, left alone, it will grow to your FIRE number
                by your target age. With your inputs, that's about{" "}
                <strong className={calcStrongClass}>{fmt(Math.round(results.coastNumber))}</strong> invested today. Once
                you're there, you only need to earn enough to cover your living costs, which lets you work less or
                choose a job for reasons other than pay.
              </p>
              <p>
                Once you reach FIRE, the{" "}
                <Link to="/swp-calculator" className={calcLinkClass}>
                  SWP Calculator
                </Link>{" "}
                and the{" "}
                <Link to="/annual-retirement-income" className={calcLinkClass}>
                  Annual Retirement Income Calculator
                </Link>{" "}
                show how long withdrawals last. Our lesson on{" "}
                <Link to="/learn/fire-movement-basics" className={calcLinkClass}>
                  FIRE movement basics
                </Link>{" "}
                covers the ideas behind it.
              </p>
            </CalcSection>

            <CalcSection title="Key FIRE concepts">
              <CalcBenefitGrid
                items={[
                  { title: "The 4% rule", text: "Based on historical U.S. market data (the \"Trinity Study\"), a 4% initial withdrawal rate, adjusted for inflation each year, has historically survived most 30-year periods — though it's a guideline, not a guarantee, especially for retirements longer than 30 years." },
                  { title: "Savings rate over income", text: "Time to FIRE depends far more on what percentage of income you save than on how much you earn — a high earner who spends most of it reaches FIRE later than a moderate earner saving 40-50% of income." },
                  { title: "Lean, Fat, and Coast FIRE", text: "Variants exist for different lifestyles: Lean FIRE targets a minimal expense base, Fat FIRE targets a more comfortable one, and Coast FIRE means you've saved enough that compounding alone will reach your number without further contributions — even if you keep working." },
                  { title: "Sequence of returns risk", text: "Retiring right before a market downturn is far riskier than retiring right before an upturn, even with an identical average return over time — a real risk this calculator's straight-line projection doesn't capture." },
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
