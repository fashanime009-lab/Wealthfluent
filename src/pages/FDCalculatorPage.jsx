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
  { q: "How is FD maturity amount calculated?", a: "Maturity value = P × (1 + R / (100 × m))^(m × N), where P is the deposit, R the annual rate, N the years and m the number of times interest compounds a year. A ₹1,00,000 deposit at 7% for 5 years, compounded quarterly, matures at about ₹1,41,478 — ₹41,478 of interest." },
  { q: "How do I calculate FD interest for a monthly payout?", a: "With a monthly-payout FD the interest is paid out instead of reinvested, so it doesn't compound: monthly interest ≈ deposit × annual rate ÷ 12. On ₹1,00,000 at 7% that's roughly ₹583 a month, and the ₹1,00,000 comes back at maturity. Banks often quote a slightly lower rate for payout FDs than for cumulative ones, so use your bank's actual payout rate. This calculator shows the cumulative (reinvested) case." },
  { q: "How much should I invest in a fixed deposit?", a: "There's no single right amount. A common way to decide: first build an emergency fund, then put money you'll need within the next 1–5 years — a house down payment, tuition, a wedding — into FDs, because they don't fall in value. Money you won't need for 5+ years often earns more elsewhere, but only you can weigh that against your risk comfort. Try the deposit amount and tenure above to see what different sums earn." },
  { q: "Is a term deposit the same as a fixed deposit?", a: "Yes. \"Fixed deposit\" is the usual name in India; \"term deposit\" is the same product in the UK, Australia and elsewhere — a lump sum locked for a fixed tenure at a fixed rate. This calculator works for either; just enter your bank's rate, tenure and compounding frequency." },
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
        title="Fixed Deposit (FD) Calculator – Maturity & Interest"
        description="Calculate FD maturity value and interest from your deposit, rate and tenure. Compare annual to monthly compounding and payout vs cumulative FDs. Free."
        path="/fd-calculator"
        keywords="fixed deposit calculator, FD calculator, FD return calculator, fixed deposit interest calculator, FD monthly payout, term deposit calculator"
        jsonLd={[
        calculatorSchema({
          name: "Fixed Deposit Calculator",
          description: "Calculate FD maturity value and interest from your deposit, rate and tenure. Compare annual to monthly compounding and payout vs cumulative FDs. Free.",
          path: "/fd-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
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
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Interest rates may vary across banks and financial institutions, and actual returns depend on
                applicable rates and compounding frequency.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="fd_calc_mid" />

            <CalcSection title="What is a fixed deposit (FD) calculator?">
              <p>
                A fixed deposit calculator helps investors estimate fixed deposit maturity value and total interest
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

            <CalcSection title="Cumulative FD vs monthly payout FD">
              <p>
                Banks let you take FD interest in two ways. In a <strong className="text-[#111814] dark:text-[#eef1ec]">cumulative</strong>{" "}
                (reinvestment) FD, interest stays in the deposit and compounds, and you receive everything at
                maturity — that's what the calculator above shows. In a{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">payout</strong> FD, interest is paid out every
                month, quarter or year instead, so the deposit itself doesn't compound and the principal comes back
                unchanged.
              </p>
              <p>
                For a monthly payout, the interest is roughly deposit × annual rate ÷ 12: a ₹1,00,000 deposit at 7%
                pays about ₹583 a month, ₹7,000 a year. The same deposit compounded quarterly for a year would grow to
                about ₹1,07,186 instead. Payout FDs suit people who need regular income, such as retirees covering
                expenses; cumulative FDs suit a goal with a fixed date. Banks often quote a slightly lower rate for
                payouts, so compare the effective return, not just the headline rate.
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
