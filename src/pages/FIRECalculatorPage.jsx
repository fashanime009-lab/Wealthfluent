import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { sipFutureValue } from "@/utils/projections";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "Is the 4% rule still valid today?", a: "It remains a widely used starting point, though some planners now suggest a more conservative 3.25-3.5% for very long retirements (40+ years) given today's valuations and lower expected bond returns compared to when the original research was done." },
  { q: "Does this account for taxes on withdrawals?", a: "No — this is a pre-tax projection. Depending on which account types your investments sit in, actual withdrawals may be taxed, meaning your real-world FIRE number could need to be somewhat higher than shown here." },
  { q: "What if my freedom score is below 100%?", a: "You have three levers: increase your monthly investment, push back your target retirement age, or reduce your target annual expenses (which also lowers your FIRE number, since it's 25× annual expenses)." },
];

export default function FIRECalculatorPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    currentAge: 25,
    retirementAge: 45,
    monthlyExpenses: 50000,
    currentSavings: 300000,
    monthlyInvestment: 25000,
    expectedReturn: 12,
    inflationRate: 6,
  });

  const results = useMemo(() => {
    const years = formData.retirementAge - formData.currentAge;

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

    return {
      years,
      totalWealth,
      futureExpenses,
      fireNumber,
      freedomScore,
      chartData,
    };
  }, [formData]);

  // Shared, currency-aware formatting (lakh/crore for INR) instead of the
  // hardcoded en-US grouping this page used to apply after a bare symbol.
  const fmt = (v) => formatCurrency(v, settings.currency);

  const FIELDS = [
    { label: "Current age", name: "currentAge", min: 18, max: 80, step: 1, suffix: "" },
    { label: "Retirement age", name: "retirementAge", min: 20, max: 80, step: 1, suffix: "" },
    { label: "Monthly expenses", name: "monthlyExpenses", min: 1000, max: 500000, step: 1000, format: fmt },
    { label: "Current savings", name: "currentSavings", min: 0, max: 10000000, step: 1000, format: fmt },
    { label: "Monthly investment", name: "monthlyInvestment", min: 0, max: 500000, step: 1000, format: fmt },
    { label: "Expected return (p.a.)", name: "expectedReturn", min: 0, max: 30, step: 0.5, suffix: "%" },
    { label: "Inflation rate (p.a.)", name: "inflationRate", min: 0, max: 15, step: 0.5, suffix: "%" },
  ];

  return (
    <>
      <Seo
        title="FIRE Calculator – Financial Independence & Retire Early Planning"
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
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#111814]/10 dark:text-[#eef1ec]/10" />
                  <XAxis dataKey="age" stroke="currentColor" className="text-[#111814]/45 dark:text-[#eef1ec]/45" tick={{ fontSize: 12 }} />
                  <YAxis
                    stroke="currentColor"
                    className="text-[#111814]/45 dark:text-[#eef1ec]/45"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value, settings.currency, true)}
                  />
                  <Tooltip
                    formatter={(value) => fmt(value)}
                    labelFormatter={(label) => `Age: ${label}`}
                  />
                  <Line type="monotone" dataKey="wealth" stroke="#047857" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="fire_calc_mid" />

            <CalcSection title="Financial insights">
              <CalcBenefitGrid
                items={[
                  { title: "Retirement timeline", text: `Based on your current strategy, you could potentially achieve financial freedom in ${results.years} years.` },
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

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
