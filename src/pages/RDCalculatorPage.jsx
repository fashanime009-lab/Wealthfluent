import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How is RD maturity calculated?", a: "Each monthly deposit compounds from the month it's made until maturity, the same way a SIP does — so the first deposit earns interest for the longest and the last deposit earns almost none. The total maturity value is the sum of all deposits plus all the interest they've individually earned." },
  { q: "Is RD interest compounded quarterly or monthly?", a: "Most Indian banks compound RD interest quarterly, which gives a very slightly different result from the monthly-compounding figure this calculator shows — usually within a few hundred rupees on a typical RD. Check your bank's specific compounding frequency for an exact figure; this calculator is accurate enough for comparing RD against other options." },
  { q: "Is RD interest taxable?", a: "Yes — RD interest is added to your taxable income and taxed at your slab rate, the same as FD interest. Banks deduct TDS once interest crosses the threshold set for the year, but tax is owed on the full interest regardless of TDS." },
  { q: "RD or FD — which is better?", a: "An FD suits a lump sum you already have; an RD suits building one up through monthly savings you don't yet have in hand. For the same total amount invested over the same period, FD generally earns slightly more, since the full sum compounds from day one rather than arriving gradually." },
  { q: "What happens if I miss an RD installment?", a: "Most banks charge a small penalty per missed installment, and missing several can lead to the account being closed early on some banks' terms. Check your specific bank's policy before committing to a monthly amount you might not sustain." },
];

export default function RDCalculatorPage() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const { settings } = useSettings();

  // Same future-value-of-an-annuity formula the SIP calculator uses —
  // an RD is mechanically identical to a SIP (a fixed deposit made every
  // month that compounds until maturity), just conventionally offered by
  // banks at a fixed rate instead of market-linked. Most banks actually
  // compound RD interest quarterly rather than monthly, which gives a
  // slightly different number — see the FAQ below.
  const months = years * 12;
  const monthlyRate = rate / 1200;
  const maturityAmount = Math.round(
    monthlyRate === 0
      ? monthlyDeposit * months
      : monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const totalDeposited = monthlyDeposit * months;
  const interestEarned = maturityAmount - totalDeposited;

  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="RD Calculator – Recurring Deposit Maturity Value"
        description="Calculate your recurring deposit's maturity value and interest earned from your monthly deposit, interest rate and tenure. Free, no signup."
        path="/rd-calculator"
        keywords="RD calculator, recurring deposit calculator, RD maturity calculator, RD interest calculator"
        jsonLd={[
        calculatorSchema({
          name: "RD Calculator",
          description: "Calculate your recurring deposit's maturity value and interest earned from your monthly deposit, interest rate and tenure.",
          path: "/rd-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="RD Calculator"
            description="Estimate your recurring deposit's maturity value and interest earned from a fixed monthly deposit."
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
                Illustrative only — most banks compound RD interest quarterly rather than monthly, which can give a
                slightly different figure. Check your bank's actual terms before relying on this for a real decision.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="rd_calc_mid" />

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
                Maturity Value = R × [(1 + i)^n − 1] / i × (1 + i)
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">R</strong> is the monthly deposit,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">i</strong> is the monthly interest rate (annual
                rate ÷ 12), and <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is the number of
                months. A ₹5,000 monthly deposit at 7% for 5 years (60 months) matures at about ₹3,60,053 — ₹3,00,000
                deposited and about ₹60,053 earned in interest.
              </p>
              <p>
                This calculator compounds monthly for simplicity; most Indian banks actually compound RD interest
                quarterly, which gives a slightly different number on the same inputs — close enough for comparing
                options, but check your bank's exact terms before relying on it for a real decision.
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
