import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";
import { useSettings } from "../context/SettingsContext";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How is EMI calculated?", a: "EMI depends on loan amount, interest rate, and repayment duration using standard amortization formulas." },
  { q: "Does longer loan tenure reduce EMI?", a: "Longer tenure generally reduces monthly EMI but may increase total interest paid." },
  { q: "Which loan has lowest EMI?", a: "Lower EMIs depend on lower interest rates, smaller loan amounts, and longer repayment periods." },
  { q: "Does prepaying a loan reduce EMI or tenure?", a: "Most lenders let you choose: reduce the tenure while keeping the EMI the same (saves the most total interest), or reduce the EMI while keeping the original tenure. Shortening the tenure is usually the better move if you can afford the current EMI." },
  { q: "Is a fixed or floating interest rate better for EMI?", a: "Fixed rates keep your EMI unchanged for the loan's life but are usually priced higher upfront. Floating rates track a benchmark and can rise or fall, which changes your EMI (or tenure) over time — most long-tenure loans like home loans are floating." },
];

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanYears, setLoanYears] = useState(5);

  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const monthlyRate = interestRate / 12 / 100;
  const months = loanYears * 12;

  // A 0% loan (an interest-free EMI offer) makes the standard formula 0/0.
  // The limit as the rate reaches zero is simply principal / months.
  const emi = Math.round(
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
  );

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  const principalShare = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestShare = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <>
      <Seo
        title="Loan EMI Calculator – Calculate Monthly Loan Payments"
        description="See your monthly EMI, total interest, and total repayment for home, personal, car, or education loans — just enter the loan amount, rate, and tenure."
        path="/emi-calculator"
        keywords="EMI calculator, loan EMI calculator, home loan EMI, personal loan EMI, car loan EMI"
        jsonLd={[
          calculatorSchema({
            name: "Loan EMI Calculator",
            description: "See your monthly EMI, total interest, and total repayment for home, personal, car, or education loans — just enter the loan amount, rate, and tenure.",
            path: "/emi-calculator",
          }),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Loan EMI Calculator"
            description="Calculate monthly EMI payments for home loans, personal loans, car loans, and other financing options instantly."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Loan amount" value={loanAmount} onChange={setLoanAmount} min={10000} max={10000000} step={10000} format={fmt} />
              <CalcField label="Interest rate (p.a.)" value={interestRate} onChange={setInterestRate} min={1} max={30} step={0.1} suffix="%" />
              <CalcField label="Loan duration" value={loanYears} onChange={setLoanYears} min={1} max={30} suffix=" yrs" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Monthly EMI" value={fmt(emi)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Principal amount" value={fmt(loanAmount)} share={principalShare} tone="signal" />
                <CalcStat label="Total interest" value={fmt(totalInterest)} share={interestShare} />
                <CalcStat label="Total payment" value={fmt(totalPayment)} share={100} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                These figures are illustrative only and don't represent actual loan terms or guaranteed approvals.
                Interest rates and loan terms vary by lender policy and borrower eligibility.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="emi_calc_mid" />

            <CalcSection title="What is a loan EMI calculator?">
              <p>
                An EMI calculator helps borrowers estimate monthly loan repayments based on loan amount, interest
                rate, and repayment duration. It's commonly used for home loans, personal loans, education loans,
                and vehicle financing.
              </p>
              <p>
                EMI stands for Equated Monthly Installment — a fixed payment amount a borrower makes to a lender at
                a specified date each month. Every EMI splits into two parts: interest (the lender's charge for
                lending the money) and principal (the actual loan amount being repaid). In the early years of a
                loan, a larger share of each EMI goes toward interest; as the loan matures, more of it goes toward
                principal, even though the EMI amount itself stays constant throughout the tenure.
              </p>
            </CalcSection>

            <CalcSection title="How is EMI calculated?">
              <p>EMI is calculated using the standard reducing-balance formula:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]
              </p>
              <p>
                Here, <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the principal loan
                amount, <strong className="text-[#111814] dark:text-[#eef1ec]">R</strong> is the monthly interest
                rate (annual rate divided by 12, then by 100), and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the total number of monthly
                installments (loan tenure in years × 12). For example, a ₹5,00,000 loan at 10% annual interest over
                5 years has R = 0.008333 and N = 60, which works out to an EMI of roughly ₹10,624/month — the same
                figure the calculator above produces for those inputs.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of EMI calculation">
              <CalcBenefitGrid
                items={[
                  { title: "Better budget planning", text: "EMI calculators help estimate monthly repayment obligations before taking a loan." },
                  { title: "Loan comparison", text: "Borrowers can compare different loan amounts, durations, and interest rates easily." },
                  { title: "Financial clarity", text: "EMI estimation helps avoid unexpected repayment burdens." },
                  { title: "Smarter borrowing", text: "Users can choose more manageable repayment structures." },
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
