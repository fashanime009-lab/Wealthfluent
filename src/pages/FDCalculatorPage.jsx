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
  { q: "How is FD maturity amount calculated?", a: "FD maturity amount depends on principal investment, interest rate, compounding frequency, and investment duration." },
  { q: "Are fixed deposits risk-free?", a: "Fixed deposits are generally considered low-risk investments, especially when offered by regulated banks and institutions." },
  { q: "Which is better: Fixed Deposit or Recurring Investment?", a: "Fixed deposits provide stable returns, while recurring investments in diversified portfolios may offer higher long-term growth but with greater risk." },
  { q: "Is FD interest taxable?", a: "Yes — FD interest is added to your taxable income and taxed at your slab rate. Banks deduct TDS if interest earned crosses the threshold set for the year, but you still owe tax on the full interest amount regardless of TDS deduction." },
  { q: "What happens if I withdraw an FD before maturity?", a: "Most banks apply a penalty — commonly 0.5–1% lower interest than the rate you'd have earned for the period actually held — rather than forfeiting all interest. Terms vary by bank, so check the specific premature-withdrawal clause before investing." },
];

// Periods per year. The page's own metadata promises "different compounding
// frequencies", but the calculator only ever compounded annually — which also
// made its default result (₹2.81L on the listing's ₹2L / 7% / 5-year example)
// disagree with the ₹2.83L shown on /calculators. Quarterly is the default
// because it's the convention many banks use for FDs, and it's what that
// listing example was computed with.
const COMPOUNDING = [
  { label: "Annually", n: 1 },
  { label: "Half-yearly", n: 2 },
  { label: "Quarterly", n: 4 },
  { label: "Monthly", n: 12 },
];

export default function FDCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(4);
  const { settings } = useSettings();

  const maturityAmount = Math.round(
    principal * Math.pow(1 + rate / 100 / compounding, compounding * years)
  );
  const interestEarned = maturityAmount - principal;

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);

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
              <div>
                <p className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">Interest compounded</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {COMPOUNDING.map((opt) => (
                    <button
                      key={opt.n}
                      type="button"
                      aria-pressed={compounding === opt.n}
                      onClick={() => setCompounding(opt.n)}
                      className={`border px-2 py-2 text-[12.5px] font-semibold transition ${
                        compounding === opt.n
                          ? "border-[#047857] bg-[#047857]/[0.08] text-[#047857] dark:border-[#34d399] dark:bg-[#34d399]/10 dark:text-[#34d399]"
                          : "border-[#111814]/15 text-[#111814]/60 hover:border-[#111814]/40 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/60 dark:hover:border-[#eef1ec]/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Maturity amount" value={fmt(maturityAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Interest earned" value={fmt(interestEarned)} share={maturityAmount > 0 ? (interestEarned / maturityAmount) * 100 : 0} tone="signal" />
                <CalcStat label="Initial deposit" value={fmt(principal)} share={maturityAmount > 0 ? (principal / maturityAmount) * 100 : 0} />
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
              <p>Interest is added to the deposit at a set frequency and then earns interest itself:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Maturity Value = P × (1 + R / (100 × m))^(m × N)
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the principal deposited,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">R</strong> is the annual interest rate,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the tenure in years and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">m</strong> is how many times a year interest is
                compounded — 1 for annual, 2 for half-yearly, 4 for quarterly, 12 for monthly. The calculator
                defaults to quarterly, the convention many banks use for fixed deposits.
              </p>
              <p>
                The same quoted rate produces different maturity values depending on the frequency. A ₹1,00,000
                deposit at 7% for 5 years grows to ₹1,40,255 with annual compounding, ₹1,41,060 half-yearly,
                ₹1,41,478 quarterly and ₹1,41,763 monthly. The gap is small on a short deposit and widens with a
                larger amount, a higher rate or a longer tenure, so check your bank's actual compounding frequency
                before comparing FD offers side by side.
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

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
