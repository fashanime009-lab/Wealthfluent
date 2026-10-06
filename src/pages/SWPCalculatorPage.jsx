import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo } from "react";
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

const CAP_YEARS = 75; // a withdrawal plan lasting longer than this is shown as "sustainable indefinitely"

const FAQ_ITEMS = [
  { q: "How is SWP lifespan calculated?", a: "Each month, the withdrawal comes out and the remaining balance earns a month of returns — the same balance compounds and shrinks at once. The calculator simulates this month by month until the balance reaches zero, rather than using a single formula, because the balance itself changes every month." },
  { q: "What does 'sustainable indefinitely' mean?", a: "If your monthly withdrawal is less than or equal to what the corpus earns in an average month, the balance never trends toward zero — withdrawing less than the corpus earns means it can, in principle, keep paying out forever at that rate. Markets don't return a smooth rate every month in reality, so treat this as a best-case read, not a guarantee." },
  { q: "SWP or just leaving the money invested and selling as needed?", a: "They're mathematically similar — SWP just automates a fixed, regular sale instead of ad-hoc ones. SWP's main advantage is discipline and predictable monthly income; its main risk is the same as any withdrawal plan: a poor sequence of returns early on depletes the corpus faster than the average return would suggest." },
  { q: "Does this account for tax on the withdrawals?", a: "No — withdrawals from mutual funds via SWP are taxed as capital gains (short or long-term depending on how long each unit was held), not as income, which is often more tax-efficient than an equivalent fixed-income payout. This calculator shows the pre-tax corpus mechanics only; your actual take-home from each withdrawal will be lower after tax." },
  { q: "What return rate should I use for retirement withdrawals?", a: "A more conservative rate than your accumulation-phase assumption is common practice, since a retirement corpus is often shifted toward a more conservative mix to protect against a bad sequence of returns early in retirement. Try the calculator at a couple of rates to see how sensitive the result is." },
];

export default function SWPCalculatorPage() {
  const [corpus, setCorpus] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(35000);
  const [rate, setRate] = useState(8);
  const { settings } = useSettings();

  const result = useMemo(() => {
    const r = rate / 1200;
    const steadyStateEarnings = corpus * r;
    if (monthlyWithdrawal <= steadyStateEarnings) {
      return { sustainable: true };
    }
    let balance = corpus;
    let months = 0;
    const capMonths = CAP_YEARS * 12;
    let totalWithdrawn = 0;
    while (balance > 0 && months < capMonths) {
      balance = balance * (1 + r) - monthlyWithdrawal;
      months++;
      totalWithdrawn += monthlyWithdrawal;
    }
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const interestEarned = totalWithdrawn - corpus;
    return { sustainable: false, months, years, remMonths, totalWithdrawn, interestEarned, cappedOut: months >= capMonths };
  }, [corpus, monthlyWithdrawal, rate]);

  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="SWP Calculator – How Long Will Your Withdrawals Last?"
        description="See how long a lump sum lasts with a fixed monthly withdrawal (SWP), or whether it can sustain that payout indefinitely. Free, no signup."
        path="/swp-calculator"
        keywords="SWP calculator, systematic withdrawal plan calculator, retirement withdrawal calculator, how long will my corpus last"
        jsonLd={[
        calculatorSchema({
          name: "SWP Calculator",
          description: "See how long a lump sum lasts with a fixed monthly withdrawal (SWP), or whether it can sustain that payout indefinitely.",
          path: "/swp-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="SWP Calculator"
            description="See how long a lump sum lasts with a fixed monthly withdrawal — or whether it can keep paying out indefinitely."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Starting corpus" value={corpus} onChange={setCorpus} min={100000} max={50000000} step={100000} format={fmt} />
              <CalcField label="Monthly withdrawal" value={monthlyWithdrawal} onChange={setMonthlyWithdrawal} min={1000} max={500000} step={1000} format={fmt} />
              <CalcField label="Expected return (p.a.) %" value={rate} onChange={setRate} min={1} max={15} step={0.5} suffix="%" />
            </div>

            <div className="space-y-6">
              {result.sustainable ? (
                <>
                  <CalcResultPanel label="How long it lasts" value="Sustainable indefinitely" />
                  <div className="border border-[#047857]/25 bg-[#047857]/5 px-6 py-5 dark:border-[#34d399]/25 dark:bg-[#34d399]/5">
                    <p className="text-[13px] text-[#047857] dark:text-[#34d399]">
                      Your withdrawal ({fmt(monthlyWithdrawal)}/mo) is at or below what this corpus earns in an
                      average month at {rate}% — the balance doesn't trend toward zero.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CalcResultPanel
                    label="How long it lasts"
                    value={result.cappedOut ? `${CAP_YEARS}+ years` : `${result.years} yrs ${result.remMonths} mo`}
                  />
                  <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                    <CalcStat label="Total withdrawn over that time" value={fmt(Math.round(result.totalWithdrawn))} share={100} tone="signal" />
                    <CalcStat label="Of which, starting corpus" value={fmt(corpus)} share={(corpus / result.totalWithdrawn) * 100} />
                    <CalcStat label="Of which, interest earned" value={fmt(Math.round(result.interestEarned))} share={(result.interestEarned / result.totalWithdrawn) * 100} />
                  </div>
                </>
              )}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — assumes a smooth, constant return every month and a withdrawal that doesn't
                increase with inflation. Real markets don't return the same rate every month; a bad sequence of
                returns early on can deplete the corpus faster than this shows.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="swp_calc_mid" />

            <CalcSection title="What is an SWP calculator?">
              <p>
                A Systematic Withdrawal Plan takes a lump sum — often a retirement corpus — and pays out a fixed
                amount every month, while the remaining balance stays invested and keeps earning returns. It's the
                mirror image of a SIP: instead of building up a corpus with regular contributions, you're drawing
                one down with regular withdrawals.
              </p>
              <p>
                This calculator answers the question an SWP plan actually needs answered before you commit to one:
                given a starting amount, a withdrawal size, and an expected return, does the money run out — and
                if so, when?
              </p>
            </CalcSection>

            <CalcSection title="How is SWP lifespan calculated?">
              <p>Each month, two things happen to the balance at once:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Balance = Balance × (1 + monthly rate) − Withdrawal
              </p>
              <p>
                On a ₹50 lakh corpus with a ₹35,000 monthly withdrawal at 8%, the balance lasts about 38 years and
                3 months — over that time ₹1.61 crore is withdrawn in total, of which ₹1.11 crore comes from
                interest and only the original ₹50 lakh from the corpus itself. Drop the withdrawal to ₹30,000 a
                month on the same corpus and rate, and it becomes sustainable indefinitely — ₹30,000 is below what
                the corpus earns in an average month, so the balance never trends toward zero.
              </p>
              <p>
                That gap — between a withdrawal the corpus can sustain forever and one that slowly depletes it —
                is usually narrower than people expect, which is exactly why it's worth calculating rather than
                guessing.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of planning an SWP">
              <CalcBenefitGrid
                items={[
                  { title: "A real retirement-income check", text: "Turns a lump-sum corpus into a concrete monthly number, and tells you honestly whether that number is sustainable." },
                  { title: "Tax efficiency", text: "SWP withdrawals are typically taxed as capital gains, not income, which is often more favourable than an equivalent fixed-income payout." },
                  { title: "Keeps the rest invested", text: "Unlike withdrawing a lump sum and holding cash, the untouched balance keeps compounding, which is what makes a long payout period possible at all." },
                  { title: "Flexible and reversible", text: "Unlike an annuity, the withdrawal amount and the underlying investment can usually be changed or stopped, rather than being locked in for life." },
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
