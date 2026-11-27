import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import { Link } from "react-router-dom";
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

// Tax-exempt gratuity ceiling for private-sector employees under the
// Payment of Gratuity Act, in effect since the last government
// notification raising it from ₹10 lakh — confirm the current limit
// before relying on this for a tax decision, since it's set by
// government notification and can change.
const EXEMPTION_LIMIT = 2000000;

function buildFaqItems(fmt) {
  return [
    { q: "What is the gratuity formula in India?", a: "Gratuity = last drawn wages (basic pay + DA) × 15 × completed years of service ÷ 26. The 26 is the working days in a month by convention, and 15 means 15 days' wages for each year of service. The formula comes from the Payment of Gratuity Act, 1972, which has been part of the Code on Social Security, 2020 since 21 November 2025." },
    { q: "Am I eligible for gratuity?", a: "Generally, yes, after 5 years of continuous service with the same employer, at establishments with 10 or more employees. The 5-year requirement is waived in cases of death or disability. Since India's new labour codes took effect in November 2025, fixed-term employees are also eligible for gratuity on a pro-rata basis after just 1 year of continuous service — a separate, shorter path from the 5-year rule for permanent employees. Check your specific employment terms and the latest notified rules, since some details were still being finalized at the time of writing." },
    { q: "How are years of service rounded?", a: "A completed year with more than 6 months of service in the final year rounds up to the next full year; 6 months or less rounds down. Someone with 7 years 8 months of service is treated as 8 years; someone with 7 years 4 months is treated as 7." },
    { q: "Is gratuity taxable?", a: `For private-sector employees covered under the Act, gratuity is tax-exempt up to ${fmt(EXEMPTION_LIMIT)} (the limit is set by government notification and has changed before, so confirm the current figure). Government employees receive full tax exemption. Any amount above the exemption limit is taxed as salary income.` },
    { q: "What if my employer isn't covered under the Gratuity Act?", a: "A different formula applies: (Last drawn salary × 15 × completed years of service) ÷ 30, using actual days in a month rather than the Act's 26-day convention, and years of service aren't rounded the same way. This calculator uses the Act's formula, which covers most organized-sector employers." },
    { q: "Did the new labour codes change gratuity?", a: "Yes, in two main ways, from 21 November 2025. Fixed-term employees became eligible after one year of service instead of five. And 'wages' now has a wider definition: if allowances make up more than half of your total pay, the excess is added back to wages, which can raise the salary figure gratuity is based on. Check with your employer how they apply it to your service." },
  ];
}

export default function GratuityCalculatorPage() {
  const [lastSalary, setLastSalary] = useState(50000);
  const [years, setYears] = useState(8);

  const gratuityAmount = Math.round((lastSalary * 15 * years) / 26);
  const taxableAmount = Math.max(0, gratuityAmount - EXEMPTION_LIMIT);
  const isEligible = years >= 5;

  // This is an India-specific statutory calculation under the Payment of
  // Gratuity Act — the formula, inputs and the exemption limit are all
  // fixed in rupees by Indian law, not a figure that means anything
  // converted to another currency. Unlike every other calculator on this
  // site, this one intentionally ignores the global currency setting and
  // always displays INR.
  const fmt = (v) => formatCurrency(v, "INR");
  const FAQ_ITEMS = buildFaqItems(fmt);

  const exampleSalary = 50000;
  const exampleYears = 8;
  const exampleGratuity = Math.round((exampleSalary * 15 * exampleYears) / 26);

  const tableYears = [5, 10, 20, 30];
  const gratuityRows = [25000, 50000, 100000].map((salary) => [
    `${fmt(salary)} a month`,
    ...tableYears.map((y) => fmt(Math.round((salary * 15 * y) / 26))),
  ]);
  // Salary at which 30 years of service reaches the exemption limit.
  const salaryAtLimit = Math.round((EXEMPTION_LIMIT * 26) / (15 * 30));

  return (
    <>
      <Seo
        title="Gratuity Calculator India – Estimate Your Gratuity"
        description="Calculate your Indian gratuity amount from your last drawn salary and years of service, using the Payment of Gratuity Act formula. Free, no signup."
        path="/gratuity-calculator"
        keywords="gratuity calculator, gratuity calculator India, gratuity formula, payment of gratuity act"
        jsonLd={[
        calculatorSchema({
          name: "Gratuity Calculator",
          description: "Calculate your gratuity amount from your last drawn salary and years of service, using the Payment of Gratuity Act formula.",
          path: "/gratuity-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Gratuity Calculator",
          description: "Estimate your gratuity amount under India's Payment of Gratuity Act from your last drawn salary and years of service.",
          steps: [
            { name: "Enter your last drawn basic salary + DA", text: "Enter your last drawn basic salary plus dearness allowance in the Last drawn basic salary + DA field." },
            { name: "Enter your completed years of service", text: "Enter your completed years of service in the Completed years of service field." },
            { name: "View your result instantly", text: "The calculator instantly shows your estimated gratuity amount and the taxable portion, if any." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            scope="india"
            title="Gratuity Calculator"
            description="Estimate the gratuity you're entitled to under India's Payment of Gratuity Act, from your last drawn salary and years of service."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Last drawn basic salary + DA (monthly)" value={lastSalary} onChange={setLastSalary} min={5000} max={1000000} step={1000} format={fmt} />
              <CalcField label="Completed years of service" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              {isEligible ? (
                <>
                  <CalcResultPanel label="Gratuity amount" value={fmt(gratuityAmount)} />
                  {taxableAmount > 0 ? (
                    <div className="border border-[#111814]/12 bg-[#ffffff] px-6 py-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                      <p className="text-[13px] text-[#111814]/70 dark:text-[#eef1ec]/70">
                        Tax-exempt up to {fmt(EXEMPTION_LIMIT)}; the remaining {fmt(taxableAmount)} is taxable as
                        salary income.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-[#047857]/25 bg-[#047857]/5 px-6 py-5 dark:border-[#34d399]/25 dark:bg-[#34d399]/5">
                      <p className="text-[13px] text-[#047857] dark:text-[#34d399]">
                        Fully tax-exempt under the current {fmt(EXEMPTION_LIMIT)} limit.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-[#111814]/12 bg-[#ffffff] px-6 py-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/70 dark:text-[#eef1ec]/70">
                    Under 5 years of service generally isn't eligible for gratuity under the Act (except in cases of
                    death or disability). The amount shown below is illustrative only.
                  </p>
                  <p className="font-mono-tech mt-3 text-[22px] font-medium tabular-nums text-[#111814]/50 dark:text-[#eef1ec]/50">
                    {fmt(gratuityAmount)}
                  </p>
                </div>
              )}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                For employees covered by gratuity law (the Payment of Gratuity Act, 1972, now part of the Code on
                Social Security, 2020). The exemption limit is set by government notification and can change —
                confirm the current figure before relying on this for a tax decision.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is a gratuity calculator?">
              <p>
                Gratuity is a lump-sum payment an employer makes to an employee as a reward for long, continuous
                service — typically paid at resignation, retirement, or termination after at least 5 years with the
                same employer. A gratuity calculator estimates this amount from your last drawn salary and years of
                service, using the formula set out in the Payment of Gratuity Act, 1972.
              </p>
              <p>
                It isn't a savings account you contribute to — it's a statutory entitlement funded by the employer
                (often through a gratuity insurance policy), separate from your EPF balance, your own investments
                and any bonus.
              </p>
            </CalcSection>

            <CalcSection title="How is gratuity calculated?">
              <p>For employees covered under the Act:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Gratuity = (Last drawn salary × 15 × Years of service) ÷ 26
              </p>
              <p>
                "Last drawn salary" means basic pay plus dearness allowance, not your full CTC. A {fmt(exampleSalary)} monthly
                basic+DA with {exampleYears} completed years of service works out to about {fmt(exampleGratuity)}. Years of service are
                rounded: more than 6 months in the final year rounds up to the next full year, 6 months or less
                rounds down — 12 years 7 months is treated as 13 years, 12 years 4 months as 12.
              </p>
            </CalcSection>

            <CalcSection title="Gratuity at a glance">
              <CalcTable
                caption="Gratuity by monthly basic pay + DA and completed years of service"
                columns={["Basic + DA", ...tableYears.map((y) => `${y} years`)]}
                rows={gratuityRows}
              />
              <p>
                Gratuity grows in a straight line with salary and years. It's tax-free for private-sector employees
                up to {fmt(EXEMPTION_LIMIT)}; with 30 years of service, you'd cross that limit only on a last drawn
                basic + DA above about {fmt(salaryAtLimit)} a month.
              </p>
            </CalcSection>

            <CalcSection title="What changed with the labour codes">
              <p>
                From <strong className={calcStrongClass}>21 November 2025</strong>, gratuity rules sit in the Code on
                Social Security, 2020, which replaced the Payment of Gratuity Act. The formula above is unchanged,
                but two things are new:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Fixed-term employees</strong> are eligible after one year of
                  continuous service, on a pro-rata basis, instead of five.
                </li>
                <li>
                  <strong className={calcStrongClass}>A wider definition of wages.</strong> If allowances (everything
                  except basic pay, DA and retaining allowance) are more than half of your total pay, the excess
                  counts as wages. For salaries built on a small basic and large allowances, that raises the
                  figure gratuity is calculated on. If that applies to you, enter the higher wage figure above.
                </li>
              </ul>
              <p>
                Some details, such as how the new wage definition applies to service before November 2025, depend
                on official guidance and your employer's approach, so confirm with your HR team.
              </p>
            </CalcSection>

            <CalcSection title="Leaving, getting paid and tax">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Before five years:</strong> permanent employees usually get no
                  gratuity, except on death or disability. If you're close to five years, the timing of a job change
                  can be worth a lot.
                </li>
                <li>
                  <strong className={calcStrongClass}>When it's paid:</strong> the employer must pay within 30 days of it
                  becoming due, or pay interest on the delay.
                </li>
                <li>
                  <strong className={calcStrongClass}>Tax:</strong> government employees' gratuity is fully tax-free;
                  for others, it's tax-free up to {fmt(EXEMPTION_LIMIT)} across their whole career, and any excess is
                  taxed as salary.
                </li>
                <li>
                  <strong className={calcStrongClass}>Nominate someone:</strong> fill in your employer's gratuity
                  nomination form so the money reaches your family without delay.
                </li>
              </ul>
              <p>
                Gratuity is one part of your retirement money, alongside EPF and your own investments. The{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>{" "}
                shows what your own monthly investing adds, and the{" "}
                <Link to="/hra-calculator" className={calcLinkClass}>
                  HRA Calculator
                </Link>{" "}
                helps with another part of your salary's tax.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of knowing your gratuity">
              <CalcBenefitGrid
                items={[
                  { title: "Plan a job change", text: "Knowing what you'd leave behind in unvested gratuity helps weigh the real cost of switching employers before 5 years." },
                  { title: "Retirement planning input", text: "Gratuity is a real, predictable lump sum — worth including alongside EPF and your own investments when estimating your retirement corpus." },
                  { title: "Negotiation context", text: "Understanding how gratuity accrues with tenure clarifies what a counteroffer with a shorter notice period or tenure actually costs you." },
                  { title: "Tax planning", text: "Knowing whether your gratuity will exceed the exemption limit helps you plan for the tax on the amount above it." },
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
