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

const FAQ_ITEMS = [
  { q: "How is RD maturity calculated?", a: "Each monthly deposit compounds from the month it's made until maturity, the same way a SIP does — so the first deposit earns interest for the longest and the last deposit earns almost none. The total maturity value is the sum of all deposits plus all the interest they've individually earned." },
  { q: "Is RD interest compounded quarterly or monthly?", a: "Most Indian banks compound RD interest quarterly, and this calculator does the same, using the standard bank formula. Each monthly deposit earns quarterly-compounded interest for the time it stays in the account, so the result should be close to your bank's maturity figure for the same rate and tenure." },
  { q: "Is RD interest taxable?", a: "Yes — RD interest is added to your taxable income and taxed at your slab rate, the same as FD interest. Banks deduct TDS once interest crosses the threshold set for the year, but tax is owed on the full interest regardless of TDS." },
  { q: "RD or FD — which is better?", a: "An FD suits a lump sum you already have; an RD suits building one up through monthly savings you don't yet have in hand. For the same total amount invested over the same period, FD generally earns slightly more, since the full sum compounds from day one rather than arriving gradually." },
  { q: "What happens if I miss an RD installment?", a: "Most banks charge a small penalty per missed installment, and missing several can lead to the account being closed early on some banks' terms. Check your specific bank's policy before committing to a monthly amount you might not sustain." },
  { q: "Can I close an RD early?", a: "Usually yes, but banks pay a lower rate on early closure, often the rate for the period the money actually stayed, minus a penalty of around 1%. Some banks don't allow partial withdrawals from an RD at all, so pick an amount and tenure you can keep up." },
];

// Maturity of an RD with interest compounded quarterly — the formula most
// Indian banks use. Deposit m (1-based) stays for n − m + 1 months, i.e.
// (n − m + 1)/3 quarters, at i = rate/400 per quarter. Summing that
// geometric series gives M = R × ((1+i)^(n/3) − 1) / (1 − (1+i)^(−1/3)).
function rdMaturity(monthly, annualRate, months) {
  if (months <= 0) return 0;
  const i = annualRate / 400;
  if (i === 0) return monthly * months;
  return (monthly * (Math.pow(1 + i, months / 3) - 1)) / (1 - Math.pow(1 + i, -1 / 3));
}

export default function RDCalculatorPage() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  // Quarterly compounding, as most Indian banks do it (this page used to
  // compound monthly and warn that the bank's figure would differ).
  const months = years * 12;
  const maturityAmount = Math.round(rdMaturity(monthlyDeposit, rate, months));
  const totalDeposited = monthlyDeposit * months;
  const interestEarned = maturityAmount - totalDeposited;

  // RD (Recurring Deposit) is a specifically Indian banking product — unlike
  // the general calculators on this site, this one intentionally ignores
  // the global currency setting and always displays INR.
  const fmt = (v) => formatCurrency(v, "INR");

  const exampleDeposited = 5000 * 60;
  const exampleMaturity = Math.round(rdMaturity(5000, 7, 60));

  const tableYears = [1, 3, 5];
  const maturityRows = [1000, 5000, 10000].map((amount) => [
    `${fmt(amount)} a month`,
    ...tableYears.map((y) => fmt(Math.round(rdMaturity(amount, rate, y * 12)))),
  ]);

  return (
    <>
      <Seo
        title="RD Calculator India – Recurring Deposit Maturity"
        description="Calculate your Indian recurring deposit's maturity value and interest earned from your monthly deposit, interest rate and tenure. Free, no signup."
        path="/rd-calculator"
        keywords="RD calculator, recurring deposit calculator, RD maturity calculator, RD interest calculator"
        jsonLd={[
        calculatorSchema({
          name: "RD Calculator",
          description: "Calculate your recurring deposit's maturity value and interest earned from your monthly deposit, interest rate and tenure.",
          path: "/rd-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the RD Calculator",
          description: "Calculate your recurring deposit's maturity value and interest earned from your monthly deposit, rate and tenure.",
          steps: [
            { name: "Enter the monthly deposit", text: "Enter the fixed amount you'll deposit every month in the Monthly deposit field." },
            { name: "Enter the interest rate", text: "Enter the annual interest rate as a percentage in the Interest rate field." },
            { name: "Enter the duration", text: "Enter the RD's tenure in years in the Duration field." },
            { name: "View your result instantly", text: "The calculator instantly shows the maturity amount and interest earned." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            scope="india"
            title="RD Calculator"
            description="Estimate your recurring deposit's maturity value and interest earned, for an Indian bank RD with a fixed monthly deposit."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Monthly deposit" value={monthlyDeposit} onChange={setMonthlyDeposit} min={500} max={200000} step={500} format={fmt} />
              <CalcField label="Interest rate (p.a.) %" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" />
              <CalcField label="Duration (Years)" value={years} onChange={setYears} min={1} max={10} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Maturity amount" value={fmt(maturityAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Interest earned" value={fmt(interestEarned)} share={maturityAmount > 0 ? (interestEarned / maturityAmount) * 100 : 0} tone="signal" />
                <CalcStat label="Total deposited" value={fmt(totalDeposited)} share={maturityAmount > 0 ? (totalDeposited / maturityAmount) * 100 : 0} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Calculated with quarterly compounding, as most Indian banks do. Rates differ by bank and tenure, and
                senior citizens often get a higher rate, so check your bank's current rate before you open an RD.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is a recurring deposit (RD) calculator?">
              <p>
                A recurring deposit lets you build up savings by depositing a fixed amount every month, at a fixed
                interest rate set when you open the account — unlike a fixed deposit, which needs the full sum
                upfront. An RD calculator estimates the maturity value: what all those monthly deposits plus their
                accumulated interest add up to by the end of the tenure.
              </p>
              <p>
                Mechanically, an RD is the same idea as a SIP: a fixed amount invested every month, compounding
                until a target date. The difference is that an RD's rate is fixed by the bank at opening, like an
                FD, rather than depending on market returns.
              </p>
            </CalcSection>

            <CalcSection title="How is RD maturity calculated?">
              <p>Each monthly deposit compounds from the month it's made until maturity:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                M = R × [(1 + i)^n − 1] / [1 − (1 + i)^(−1/3)]
              </p>
              <p>
                Here <strong className={calcStrongClass}>R</strong> is the monthly deposit,{" "}
                <strong className={calcStrongClass}>i</strong> is the quarterly interest rate (annual rate ÷ 400), and{" "}
                <strong className={calcStrongClass}>n</strong> is the number of quarters. It's the standard formula Indian
                banks use: each deposit earns quarterly-compounded interest for the time it stays in. A {fmt(5000)} monthly
                deposit at 7% for 5 years (60 months) matures at about {fmt(exampleMaturity)}: {fmt(exampleDeposited)}{" "}
                deposited and about {fmt(exampleMaturity - exampleDeposited)} earned in interest.
              </p>
            </CalcSection>

            <CalcSection title="RD maturity at a glance">
              <CalcTable
                caption={`Maturity value at ${rate}% a year, compounded quarterly`}
                columns={["Monthly deposit", ...tableYears.map((y) => `${y} year${y > 1 ? "s" : ""}`)]}
                rows={maturityRows}
              />
              <p>Change the interest rate above and the table updates with it.</p>
            </CalcSection>

            <CalcSection title="RD vs FD vs SIP">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>RD:</strong> a fixed monthly amount at a guaranteed rate. Best for a
                  goal one to five years away that you're saving towards from your salary.
                </li>
                <li>
                  <strong className={calcStrongClass}>FD:</strong> a lump sum at a guaranteed rate. For the same total
                  money, an FD earns more, because all of it earns interest from day one. Use the{" "}
                  <Link to="/fd-calculator" className={calcLinkClass}>
                    FD Calculator
                  </Link>{" "}
                  for a lump sum.
                </li>
                <li>
                  <strong className={calcStrongClass}>SIP:</strong> a fixed monthly amount in a mutual fund. Returns aren't
                  guaranteed and can fall in the short run, but equity SIPs have historically beaten deposit rates
                  over five years or more. The{" "}
                  <Link to="/sip-calculator" className={calcLinkClass}>
                    SIP Calculator
                  </Link>{" "}
                  shows what a monthly SIP could grow to.
                </li>
              </ul>
              <p>
                A common split: RDs or FDs for goals within a few years and for your emergency fund, SIPs for goals
                five or more years away.
              </p>
            </CalcSection>

            <CalcSection title="Bank RD or Post Office RD?">
              <p>
                Banks offer RDs from 6 months to 10 years, with rates set by each bank. The Post Office RD runs for a
                fixed 5 years at a rate set by the government each quarter (6.7% for October–December 2026), and is
                backed by the government. Bank deposits are insured by DICGC up to ₹5 lakh per depositor per bank,
                including interest.
              </p>
              <p>
                RD interest is taxed at your income-tax slab rate in the year it's earned, even though you only
                receive it at maturity, and banks may deduct TDS once your interest crosses the yearly threshold.
                Senior citizens usually get a higher rate.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of a recurring deposit">
              <CalcBenefitGrid
                items={[
                  { title: "Builds a savings habit", text: "A fixed monthly commitment makes saving automatic rather than whatever's left over at month-end." },
                  { title: "Low minimum", text: "Most banks let you start an RD with a few hundred rupees a month, far below an FD's typical minimum." },
                  { title: "Predictable return", text: "The rate is fixed at opening, so the maturity value doesn't move with the market." },
                  { title: "Doesn't need a lump sum", text: "Useful for a goal you're saving toward, not one you already have the money for." },
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
