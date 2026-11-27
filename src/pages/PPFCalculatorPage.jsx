import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import { Link } from "react-router-dom";
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

// Government-declared PPF rate, reset quarterly — an assumption you can
// change, not a promise. 7.1% for October–December 2026 (unchanged for
// more than two years); confirm the current quarter's rate when updating.
const DEFAULT_RATE = 7.1;
const ANNUAL_LIMIT = 150000;

// Shared by the worked example in the body copy below, mirroring the live
// calculator's own year-by-year compounding loop.
function ppfMaturityOf(annualContribution, rate, years) {
  let balance = 0;
  for (let i = 0; i < years; i++) {
    balance = (balance + annualContribution) * (1 + rate / 100);
  }
  return Math.round(balance);
}

function buildFaqItems(fmt) {
  return [
    { q: "How is PPF interest calculated?", a: "PPF interest is actually computed monthly on the lowest balance between the 5th and the last day of the month, then credited to the account once a year. This calculator simplifies that to annual compounding on your yearly contribution, which is accurate enough for planning but won't match your passbook exactly — deposit before the 5th of the month to earn interest on that month's contribution for real." },
    { q: "What is the PPF contribution limit?", a: `${fmt(150000)} per financial year is the maximum that earns interest and counts towards the tax deduction; depositing more doesn't earn additional interest and may be refunded without interest. The minimum is ${fmt(500)} a year to keep the account active.` },
    { q: "Can I withdraw from PPF before 15 years?", a: "Partly. From the 7th financial year you can withdraw up to 50% of the balance at the end of the 4th preceding year (or the preceding year, if lower), once a year. From the 3rd to the 6th year you can take a loan of up to 25% of an earlier year's balance instead. Closing the account early is allowed after 5 years only for specific reasons, such as serious illness or higher education, with a 1% interest penalty." },
    { q: "Is PPF really fully tax-free?", a: "Yes. PPF has exempt-exempt-exempt (EEE) status: deposits qualify for the ₹1.5 lakh deduction under the old tax regime (Section 80C until March 2026, section 123 of the Income-tax Act, 2025 from April 2026), and the interest and maturity amount are tax-free under both regimes. On the new regime you don't get the deduction, but the tax-free interest still makes PPF attractive for safe, long-term money." },
    { q: "Can I have more than one PPF account?", a: `No — only one PPF account per person is allowed (a separate account can be opened for a minor child, with a combined ${fmt(150000)} limit across both if you're the guardian). Opening a second account in your own name is against the rules and can forfeit the interest on it.` },
  ];
}

export default function PPFCalculatorPage() {
  const [annualContribution, setAnnualContribution] = useState(150000);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(15);

  let balance = 0;
  for (let i = 0; i < years; i++) {
    balance = (balance + annualContribution) * (1 + rate / 100);
  }
  const maturityAmount = Math.round(balance);
  const totalInvested = annualContribution * years;
  const interestEarned = maturityAmount - totalInvested;

  // PPF is a specific Indian government savings scheme with a statutory
  // ₹1.5L/year contribution limit — not a figure that means anything
  // converted to another currency. Always displays INR.
  const fmt = (v) => formatCurrency(v, "INR");
  const FAQ_ITEMS = buildFaqItems(fmt);

  const example15yr = ppfMaturityOf(150000, 7.1, 15);
  const example15yrInvested = 150000 * 15;
  const example20yr = ppfMaturityOf(150000, 7.1, 20);

  const tableYears = [15, 20, 25];
  const maturityRows = [50000, 100000, 150000].map((amount) => [
    `${fmt(amount)} a year`,
    ...tableYears.map((y) => fmt(ppfMaturityOf(amount, rate, y))),
  ]);

  return (
    <>
      <Seo
        title="PPF Calculator: Maturity Value & Interest (India)"
        description="Calculate your Indian PPF maturity value and interest earned from your yearly contribution, interest rate and tenure. Free, no signup."
        path="/ppf-calculator"
        keywords="PPF calculator, public provident fund calculator, PPF maturity calculator, PPF interest calculator"
        jsonLd={[
        calculatorSchema({
          name: "PPF Calculator",
          description: "Calculate your PPF maturity value and interest earned from your yearly contribution, interest rate and tenure.",
          path: "/ppf-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the PPF Calculator",
          description: "Calculate your Public Provident Fund maturity value and interest earned from your yearly contribution and tenure.",
          steps: [
            { name: "Enter your yearly contribution", text: "Enter how much you plan to contribute each year in the Yearly contribution field." },
            { name: "Enter the interest rate", text: "Enter the current government-declared PPF rate as a percentage in the Interest rate field." },
            { name: "Enter the duration", text: "Enter your PPF tenure in years in the Duration field." },
            { name: "View your result instantly", text: "The calculator instantly shows the maturity amount and interest earned." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            scope="india"
            title="PPF Calculator"
            description="Estimate your Indian Public Provident Fund maturity value from your yearly contribution and the current interest rate."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Yearly contribution" value={annualContribution} onChange={setAnnualContribution} min={500} max={ANNUAL_LIMIT} step={500} format={fmt} />
              <CalcField label="Interest rate (p.a.) %" value={rate} onChange={setRate} min={5} max={10} step={0.1} suffix="%" />
              <CalcField label="Duration (Years)" value={years} onChange={setYears} min={15} max={50} step={5} suffix=" Years" />
              {annualContribution >= ANNUAL_LIMIT && (
                <p className="text-[12px] text-[#111814]/55 dark:text-[#eef1ec]/50">
                  {fmt(ANNUAL_LIMIT)} is the annual limit that earns interest and counts towards the tax
                  deduction.
                </p>
              )}
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Maturity amount" value={fmt(maturityAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Interest earned" value={fmt(interestEarned)} share={maturityAmount > 0 ? (interestEarned / maturityAmount) * 100 : 0} tone="signal" />
                <CalcStat label="Total invested" value={fmt(totalInvested)} share={maturityAmount > 0 ? (totalInvested / maturityAmount) * 100 : 0} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — the government-declared rate resets quarterly, so your actual return over 15+
                years will differ from a single rate held constant throughout.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is a PPF calculator?">
              <p>
                The Public Provident Fund is a long-term, government-backed savings scheme open to any Indian
                resident, with a 15-year lock-in (extendable afterward in blocks of 5 years) and an interest rate
                set by the government each quarter. A PPF calculator estimates what your yearly contributions grow
                to by maturity, factoring in that compounding.
              </p>
              <p>
                It's one of the few instruments available to anyone, not just salaried employees with access to
                EPF — and its exempt-exempt-exempt tax treatment (see the FAQ below) makes it genuinely rare among
                deduction-eligible options.
              </p>
            </CalcSection>

            <CalcSection title="How is PPF maturity calculated?">
              <p>Each year's contribution compounds annually until maturity:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Each year: Balance = (Balance + Contribution) × (1 + Rate)
              </p>
              <p>
                Contributing the full {fmt(150000)} a year for 15 years at 7.1% grows to roughly {fmt(example15yr)}, from
                {" "}{fmt(example15yrInvested)} actually deposited — about {fmt(example15yr - example15yrInvested)} in interest, all of it tax-free. Extending the
                same contribution for a further 5-year block (20 years total) grows it to roughly {fmt(example20yr)},
                showing how much of PPF's real value comes from staying in past the initial 15-year lock-in rather
                than withdrawing at the earliest date.
              </p>
            </CalcSection>

            <CalcSection title="PPF maturity at a glance">
              <CalcTable
                caption={`Maturity value at ${rate}% a year, deposited at the start of each year`}
                columns={["Yearly deposit", ...tableYears.map((y) => `${y} years`)]}
                rows={maturityRows}
              />
              <p>
                The extra five-year blocks add more than the first five years did, because interest is now being
                earned on a large, tax-free balance. If you don't need the money at 15 years, extending is usually
                worth it.
              </p>
            </CalcSection>

            <CalcSection title="Deposit by 5 April to earn the most">
              <p>
                PPF interest for each month is worked out on the lowest balance between the 5th and the last day of
                that month. So money deposited after the 5th earns nothing for that month. If you invest a lump sum,
                put it in <strong className={calcStrongClass}>by 5 April</strong>, at the start of the financial year, and
                it earns interest for all twelve months. If you invest monthly, deposit by the 5th of each month.
              </p>
            </CalcSection>

            <CalcSection title="Getting money out before 15 years">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Loan, years 3 to 6:</strong> up to 25% of the balance at the end of the
                  second year before the loan, repaid with interest.
                </li>
                <li>
                  <strong className={calcStrongClass}>Partial withdrawal, from year 7:</strong> once a year, up to 50% of the
                  balance at the end of the fourth preceding year, or the preceding year if that's lower. It's
                  tax-free.
                </li>
                <li>
                  <strong className={calcStrongClass}>Early closure, after 5 years:</strong> only for specific reasons, such
                  as serious illness or higher education, with 1% less interest for the whole period.
                </li>
              </ul>
              <p>
                After 15 years you can withdraw everything, or extend in five-year blocks with or without new
                deposits. Rules are set by the government and can change, so check the latest before acting.
              </p>
            </CalcSection>

            <CalcSection title="PPF vs other long-term options">
              <p>
                PPF's appeal is a guaranteed, government-backed and tax-free return. Its limits are the 15-year
                lock-in and a return that roughly matches long-run inflation rather than beating it by much. That
                makes it a good home for the safe part of long-term savings, next to equity for growth. Our lesson
                on{" "}
                <Link to="/learn/nps-vs-ppf-vs-epf" className={calcLinkClass}>
                  NPS vs PPF vs EPF
                </Link>{" "}
                compares the three retirement options, and the{" "}
                <Link to="/sip-calculator" className={calcLinkClass}>
                  SIP Calculator
                </Link>{" "}
                shows what the same yearly amount could grow to in an equity fund.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of PPF">
              <CalcBenefitGrid
                items={[
                  { title: "Fully tax-free", text: "Deposits qualify for a deduction under the old tax regime, and interest and maturity are tax-free under both regimes — a rare combination." },
                  { title: "Government-backed", text: "Among the lowest-risk long-term investments available, with returns set and guaranteed by the government." },
                  { title: "Open to anyone", text: "Unlike EPF, PPF doesn't require a salaried job — self-employed and non-earning individuals can open an account too." },
                  { title: "Partial liquidity after year 7", text: "Despite the 15-year lock-in, limited withdrawals and loans against the balance are allowed from the 7th year." },
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
