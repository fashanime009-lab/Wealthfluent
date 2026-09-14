import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
import { useState } from "react";
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
  { q: "How is FD maturity amount calculated?", a: "FD maturity amount depends on principal investment, interest rate, compounding frequency, and investment duration." },
  { q: "Are fixed deposits risk-free?", a: "Fixed deposits are generally considered low-risk investments, especially when offered by regulated banks and institutions." },
  { q: "Which is better: Fixed Deposit or Recurring Investment?", a: "Fixed deposits provide stable returns, while recurring investments in diversified portfolios may offer higher long-term growth but with greater risk." },
  { q: "Is FD interest taxable?", a: "Yes — FD interest is added to your taxable income and taxed at your slab rate. Banks deduct TDS if interest earned crosses the threshold set for the year, but you still owe tax on the full interest amount regardless of TDS deduction." },
  { q: "What happens if I withdraw an FD before maturity?", a: "Most banks apply a penalty — commonly 0.5–1% lower interest than the rate you'd have earned for the period actually held — rather than forfeiting all interest. Terms vary by bank, so check the specific premature-withdrawal clause before investing." },
];

export default function FDCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  const maturityAmount = Math.round(
    principal * Math.pow(1 + rate / 100, years)
  );
  const interestEarned = maturityAmount - principal;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  };
  const fmt = (value) => `${currency}${formatCurrency(value)}`;

  return (
    <>
      <Seo
        title="Fixed Deposit Calculator – Deposit Growth & Returns"
        description="Enter your deposit amount, interest rate, and tenure to see your fixed deposit's maturity value and total interest earned, with support for different compounding frequencies."
        path="/fd-calculator"
        keywords="Fixed Deposit Calculator, fixed deposit calculator, FD returns, investment calculator"
        jsonLd={[
        calculatorSchema({
          name: "Fixed Deposit Calculator",
          description: "Enter your deposit amount, interest rate, and tenure to see your fixed deposit's maturity value and total interest earned, with support for different compounding frequencies.",
          path: "/fd-calculator",
        }),
        faqSchema([
          {
            "question": "How is FD maturity amount calculated?",
            "answer": "FD maturity amount depends on principal investment, interest rate, compounding frequency, and investment duration."
          },
          {
            "question": "Are fixed deposits risk-free?",
            "answer": "Fixed deposits are generally considered low-risk investments, especially when offered by regulated banks and institutions."
          },
          {
            "question": "Which is better: Fixed Deposit or Recurring Investment?",
            "answer": "Fixed deposits provide stable returns, while recurring investments in diversified portfolios may offer higher long-term growth but with greater risk."
          },
          {
            "question": "Is FD interest taxable?",
            "answer": "Yes — FD interest is added to your taxable income and taxed at your slab rate. Banks deduct TDS if interest earned crosses the threshold set for the year, but you still owe tax on the full interest amount regardless of TDS deduction."
          },
          {
            "question": "What happens if I withdraw an FD before maturity?",
            "answer": "Most banks apply a penalty — commonly 0.5–1% lower interest than the rate you'd have earned for the period actually held — rather than forfeiting all interest. Terms vary by bank, so check the specific premature-withdrawal clause before investing."
          }
        ]),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Fixed Deposit Calculator"
            description="Estimate fixed deposit maturity value and interest earnings with different investment durations and interest rates."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Deposit amount" value={principal} onChange={setPrincipal} min={1000} max={5000000} step={1000} format={fmt} />
              <CalcField label="Interest rate (p.a.) %" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" />
              <CalcField label="Duration (Years)" value={years} onChange={setYears} min={1} max={20} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Maturity amount" value={fmt(maturityAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Interest earned" value={fmt(interestEarned)} share={(interestEarned / maturityAmount) * 100} tone="signal" />
                <CalcStat label="Initial deposit" value={fmt(principal)} share={(principal / maturityAmount) * 100} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Interest rates may vary across banks and financial institutions, and actual returns depend on
                applicable rates and compounding frequency.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="fd_calc_mid" />

            <CalcSection title="What Is Fixed Deposit Calculator?">
              <p>
                An Fixed Deposit Calculator helps investors estimate fixed deposit maturity value and total interest
                earnings based on investment amount, interest rate, and investment duration. Fixed deposits, term
                deposits, certificates of deposit, and similar savings products are popular low-risk investment
                options offered by banks and financial institutions worldwide.
              </p>
              <p>
                Unlike a savings account, a fixed deposit locks in both your money and your interest rate for a
                chosen tenure — in exchange, banks typically pay a meaningfully higher rate than a regular savings
                account. Breaking an FD before maturity usually forfeits some interest (a "premature withdrawal
                penalty"), so FD tenure should generally match a genuine time horizon, not just chase whichever bank
                is advertising the highest headline rate that week.
              </p>
            </CalcSection>

            <CalcSection title="How Is FD Maturity Calculated?">
              <p>This calculator uses annual compounding:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Maturity Value = P × (1 + R/100)^N
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the principal deposited,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">R</strong> is the annual interest rate, and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the tenure in years. A ₹1,00,000
                deposit at 7% for 5 years grows to roughly ₹1,40,255 — ₹40,255 in interest — under annual
                compounding. Many banks actually compound quarterly rather than annually, which produces a slightly
                higher effective return than this simplified annual formula for the same quoted rate; check your
                bank's specific compounding frequency before comparing FD offers side by side.
              </p>
            </CalcSection>

            <CalcSection title="Benefits Of Fixed Deposits">
              <CalcBenefitGrid
                items={[
                  { title: "Safe Investment", text: "Fixed deposits are considered one of the safest investment options with predictable returns and low financial risk." },
                  { title: "Guaranteed Returns", text: "FD returns are fixed at the time of investment and are not directly affected by stock market volatility." },
                  { title: "Flexible Duration", text: "Investors can choose short-term or long-term deposit periods based on financial goals and liquidity needs." },
                  { title: "Better Savings Planning", text: "Fixed Deposit Calculator help estimate future maturity value for retirement planning, emergency funds, and wealth preservation." },
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
