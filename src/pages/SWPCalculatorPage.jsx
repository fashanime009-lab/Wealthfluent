import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { Link } from "react-router-dom";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import { useMemo } from "react";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
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

const CAP_YEARS = 75; // a withdrawal plan lasting longer than this is shown as "sustainable indefinitely"

// Shared by the worked example in the body copy below, mirroring the live
// calculator's own month-by-month simulation so the figures render in
// whichever currency formatCurrency() is given.
function swpSimulate(corpus, monthlyWithdrawal, annualRate) {
  const r = annualRate / 1200;
  const steadyStateEarnings = corpus * r;
  if (monthlyWithdrawal <= steadyStateEarnings) return { sustainable: true };
  let balance = corpus;
  let months = 0;
  const capMonths = CAP_YEARS * 12;
  let totalWithdrawn = 0;
  while (balance > 0 && months < capMonths) {
    balance = balance * (1 + r) - monthlyWithdrawal;
    months++;
    totalWithdrawn += monthlyWithdrawal;
  }
  return {
    sustainable: false,
    years: Math.floor(months / 12),
    remMonths: months % 12,
    totalWithdrawn,
    interestEarned: totalWithdrawn - corpus,
  };
}

// Months a corpus lasts when the monthly withdrawal rises by `inflation`%
// once a year. Infinity if it's still going after CAP_YEARS.
function swpLastsRising(corpus, monthlyWithdrawal, annualRate, inflation) {
  const r = annualRate / 1200;
  let balance = corpus;
  let withdrawal = monthlyWithdrawal;
  for (let month = 1; month <= CAP_YEARS * 12; month++) {
    balance = balance * (1 + r) - withdrawal;
    if (balance <= 0) return month;
    if (month % 12 === 0) withdrawal *= 1 + inflation / 100;
  }
  return Infinity;
}

const describeMonths = (months) =>
  !Number.isFinite(months) ? `${CAP_YEARS}+ years` : `${Math.floor(months / 12)} yrs ${months % 12} mo`;

// Round to two significant figures, for tidy example amounts.
const tidy = (v) => Number(v.toPrecision(2));

const FAQ_ITEMS = [
  { q: "How is SWP lifespan calculated?", a: "Each month, the withdrawal comes out and the remaining balance earns a month of returns — the same balance compounds and shrinks at once. The calculator simulates this month by month until the balance reaches zero, rather than using a single formula, because the balance itself changes every month." },
  { q: "What does 'sustainable indefinitely' mean?", a: "If your monthly withdrawal is less than or equal to what the corpus earns in an average month, the balance never trends toward zero — withdrawing less than the corpus earns means it can, in principle, keep paying out forever at that rate. Markets don't return a smooth rate every month in reality, so treat this as a best-case read, not a guarantee." },
  { q: "SWP or just leaving the money invested and selling as needed?", a: "They're mathematically similar — SWP just automates a fixed, regular sale instead of ad-hoc ones. SWP's main advantage is discipline and predictable monthly income; its main risk is the same as any withdrawal plan: a poor sequence of returns early on depletes the corpus faster than the average return would suggest." },
  { q: "Does this account for tax on the withdrawals?", a: "No. With a mutual fund SWP, only the gain inside each withdrawal is taxed, as capital gains, not the whole amount, which is often more tax-efficient than interest from a deposit. In India, equity fund gains on units held over a year are taxed at 12.5% above ₹1.25 lakh a year, and gains on debt funds bought after April 2023 are taxed at your slab rate. Tax rules change, so check the current treatment. This calculator shows pre-tax figures." },
  { q: "What return rate should I use for retirement withdrawals?", a: "A more conservative rate than your accumulation-phase assumption is common practice, since a retirement corpus is often shifted toward a more conservative mix to protect against a bad sequence of returns early in retirement. Try the calculator at a couple of rates to see how sensitive the result is." },
];

export default function SWPCalculatorPage() {
  const [corpus, setCorpus] = useDefaultableField("swp", "corpus");
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useDefaultableField("swp", "withdrawal");
  const [rate, setRate] = useAssumptionField("retirementReturn");
  const corpusBounds = useFieldBounds("swp", "corpus");
  const withdrawalBounds = useFieldBounds("swp", "withdrawal");
  const rateBounds = useFieldBounds("swp", "rate");
  const { settings } = useSettings();

  const result = useMemo(() => {
    const sim = swpSimulate(corpus, monthlyWithdrawal, rate);
    return sim.sustainable ? sim : { ...sim, cappedOut: sim.years * 12 + sim.remMonths >= CAP_YEARS * 12 };
  }, [corpus, monthlyWithdrawal, rate]);

  const fmt = (v) => formatCurrency(v, settings.currency);
  const { retirementReturn, inflation } = assumptionsFor(settings.currency);

  // Worked example from this currency's default corpus and retirement
  // return: one withdrawal above what the corpus earns, one below it. (It
  // used to use FX-converted rupees at a fixed 8%, so the "sustainable"
  // example wasn't true at other currencies' assumptions.)
  const exampleCorpus = defaultFor("swp", "corpus", settings.currency);
  const exampleEarnings = (exampleCorpus * retirementReturn) / 1200;
  const exampleWithdrawal = tidy(exampleEarnings * 1.25);
  const exampleSafeWithdrawal = tidy(exampleEarnings * 0.9);
  const exampleResult = swpSimulate(exampleCorpus, exampleWithdrawal, retirementReturn);

  // How long the corpus above lasts at different yearly withdrawal rates.
  const rateRows = [3, 4, 5, 6, 8, 10].map((pct) => {
    const monthly = (corpus * pct) / 100 / 12;
    const flat = swpSimulate(corpus, monthly, rate);
    const flatText = flat.sustainable ? "Indefinitely" : describeMonths(flat.years * 12 + flat.remMonths);
    return [`${pct}% a year`, fmt(Math.round(monthly)), flatText, describeMonths(swpLastsRising(corpus, monthly, rate, inflation))];
  });

  return (
    <>
      <Seo
        title="SWP Calculator: How Long Will Withdrawals Last?"
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
        howToSchema({
          name: "How to Use the SWP Calculator",
          description: "See how long a lump sum lasts with a fixed monthly withdrawal, or whether it can sustain that payout indefinitely.",
          steps: [
            { name: "Enter your starting corpus", text: "Enter the lump sum you're starting with in the Starting corpus field." },
            { name: "Enter your monthly withdrawal", text: "Enter the fixed amount you plan to withdraw every month in the Monthly withdrawal field." },
            { name: "Enter the expected return", text: "Enter your expected annual rate of return as a percentage in the Expected return field." },
            { name: "View your result instantly", text: "The calculator instantly shows how long your withdrawals will last, or whether they're sustainable indefinitely." },
          ],
        }),
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
              <CalcField label="Starting corpus" value={corpus} onChange={setCorpus} {...corpusBounds} format={fmt} />
              <CalcField label="Monthly withdrawal" value={monthlyWithdrawal} onChange={setMonthlyWithdrawal} {...withdrawalBounds} format={fmt} />
              <CalcField label="Expected return (p.a.) %" value={rate} onChange={setRate} {...rateBounds} suffix="%" hint="Sample value. Enter your own." />
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
                On a {fmt(exampleCorpus)} corpus with a {fmt(exampleWithdrawal)} monthly withdrawal at {retirementReturn}%, the balance lasts about {exampleResult.years} years and
                {" "}{exampleResult.remMonths} months — over that time {fmt(Math.round(exampleResult.totalWithdrawn))} is withdrawn in total, of which {fmt(Math.round(exampleResult.interestEarned))} comes from
                interest and only the original {fmt(exampleCorpus)} from the corpus itself. Drop the withdrawal to {fmt(exampleSafeWithdrawal)} a
                month on the same corpus and rate, and it becomes sustainable indefinitely — {fmt(exampleSafeWithdrawal)} is below what
                the corpus earns in an average month, so the balance never trends toward zero.
              </p>
              <p>
                That gap — between a withdrawal the corpus can sustain forever and one that slowly depletes it —
                is usually narrower than people expect, which is exactly why it's worth calculating rather than
                guessing.
              </p>
            </CalcSection>

            <CalcSection title="How long it lasts at different withdrawal rates">
              <p>
                For your corpus of {fmt(corpus)} earning {rate}% a year, here's how long different withdrawals last,
                both as a fixed amount and raised with {inflation}% inflation once a year:
              </p>
              <CalcTable
                caption="Yearly withdrawal as a share of the starting corpus"
                columns={["Withdrawal rate", "Monthly amount", "Fixed amount lasts", "Rising with inflation lasts"]}
                rows={rateRows}
              />
              <p>
                A fixed withdrawal loses buying power every year; one that rises with inflation keeps your standard
                of living steady but runs out sooner. For a retirement income, plan on the right-hand column. The{" "}
                <Link to="/annual-retirement-income" className={calcLinkClass}>
                  Annual Retirement Income Calculator
                </Link>{" "}
                works out the rising income a corpus supports.
              </p>
            </CalcSection>

            <CalcSection title="Making an SWP last">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Keep a few years in safer funds.</strong> Drawing the next two to
                  three years from a debt or liquid fund means a market fall doesn't force you to sell equity at a
                  loss, which is the biggest risk to any withdrawal plan.
                </li>
                <li>
                  <strong className={calcStrongClass}>Start lower than the maximum.</strong> A withdrawal near what the
                  corpus earns leaves a buffer for bad years and rising costs.
                </li>
                <li>
                  <strong className={calcStrongClass}>Review once a year.</strong> Trim withdrawals after a poor year for
                  markets; you can raise them after good ones.
                </li>
              </ul>
              <p>
                To build the corpus first, see the{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>
                , and our lesson on{" "}
                <Link to="/learn/mutual-fund-types" className={calcLinkClass}>
                  types of mutual funds
                </Link>{" "}
                explains which funds suit each part of the plan.
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
