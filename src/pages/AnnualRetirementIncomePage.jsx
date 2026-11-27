import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useMemo } from "react";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import { assumptionsFor } from "@/data/calculatorDefaults";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
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
import useTilt from "@/hooks/useTilt";

const FAQ_ITEMS = [
  { q: "What is a realistic pre-retirement growth rate?", a: "Expected long-term investment returns vary depending on your portfolio, asset allocation, and market conditions. Stocks have historically delivered higher long-term returns than bonds or cash, but they also involve greater risk. Choose an assumption that matches your actual mix of investments, and test a lower one to see how much the result depends on it." },
  { q: "What should I enter for \"Years to Pay Out\"?", a: "Estimate your life expectancy minus your retirement age. A common approach is to plan for 25-30 years post-retirement." },
  { q: "Can I withdraw more than the calculated amount?", a: "Withdrawing more may deplete your corpus sooner. The calculator provides a sustainable annual income assuming the corpus earns the given rate and lasts the specified years. Adjust the parameters to see different scenarios." },
  { q: "Does this account for inflation during retirement?", a: "The main figure is a level income, the same amount every year, so its buying power shrinks as prices rise. The results also show the smaller starting income you could take if you raise it with inflation each year, which keeps your standard of living steady." },
  { q: "What is the 4% rule?", a: "A rule of thumb from US research: withdraw 4% of your corpus in the first year of retirement, raise it with inflation every year after, and the money has historically had a good chance of lasting about 30 years. With higher inflation or a longer retirement, a lower starting rate is safer." },
  { q: "How should I invest my corpus in retirement?", a: "Many retirees keep the next few years of withdrawals in safe, easy-to-reach options such as deposits or debt funds, and leave the rest invested for growth, refilling the safe bucket as they go. A systematic withdrawal plan (SWP) from a mutual fund is a common way to draw a regular income." },
];

// Years a corpus lasts when the first year's withdrawal is `firstWithdrawal`
// and each later withdrawal rises by `growth`%, while the remaining balance
// earns `rate`% a year. Withdrawals at the end of each year. Capped at 60.
function yearsCorpusLasts(corpus, firstWithdrawal, rate, growth) {
  let balance = corpus;
  let withdrawal = firstWithdrawal;
  for (let year = 1; year <= 60; year++) {
    balance = balance * (1 + rate / 100) - withdrawal;
    if (balance < 0) return year - 1 + (balance + withdrawal) / withdrawal;
    withdrawal *= 1 + growth / 100;
  }
  return Infinity;
}

export default function AnnualRetirementIncomePage() {
  const { ref: corpusRef, style: corpusStyle, onPointerMove: onCorpusMove, onPointerLeave: onCorpusLeave } = useTilt();
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useDefaultableField("annualRetirementIncome", "principal");
  const [annualAddition, setAnnualAddition] = useDefaultableField("annualRetirementIncome", "annualAddition");
  const [yearsToGrow, setYearsToGrow] = useDefaultableField("annualRetirementIncome", "yearsToGrow");
  const [preRetGrowthRate, setPreRetGrowthRate] = useAssumptionField("equityReturn");
  const [yearsToPayOut, setYearsToPayOut] = useDefaultableField("annualRetirementIncome", "yearsToPayOut");
  const [postRetGrowthRate, setPostRetGrowthRate] = useAssumptionField("retirementReturn");
  const principalBounds = useFieldBounds("annualRetirementIncome", "principal");
  const annualAdditionBounds = useFieldBounds("annualRetirementIncome", "annualAddition");
  const yearsToGrowBounds = useFieldBounds("annualRetirementIncome", "yearsToGrow");
  const preRetGrowthRateBounds = useFieldBounds("annualRetirementIncome", "preRetGrowthRate");
  const yearsToPayOutBounds = useFieldBounds("annualRetirementIncome", "yearsToPayOut");
  const postRetGrowthRateBounds = useFieldBounds("annualRetirementIncome", "postRetGrowthRate");
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const r1 = preRetGrowthRate / 100;
    const r2 = postRetGrowthRate / 100;
    const n1 = yearsToGrow;
    const n2 = yearsToPayOut;

    // Pre-retirement accumulation
    // Future value of current principal
    const fvPrincipal = currentPrincipal * Math.pow(1 + r1, n1);

    // Future value of annual additions (ordinary annuity)
    let fvAdditions = 0;
    if (annualAddition > 0) {
      if (r1 === 0) {
        fvAdditions = annualAddition * n1;
      } else {
        fvAdditions = annualAddition * ((Math.pow(1 + r1, n1) - 1) / r1);
      }
    }

    const corpusAtRetirement = fvPrincipal + fvAdditions;

    // Post-retirement payout: compute annual income (annuity)
    let annualIncome = 0;
    if (n2 > 0 && corpusAtRetirement > 0) {
      if (r2 === 0) {
        annualIncome = corpusAtRetirement / n2;
      } else {
        // PMT = PV * r / (1 - (1+r)^-n)
        annualIncome = corpusAtRetirement * r2 / (1 - Math.pow(1 + r2, -n2));
      }
    }

    return {
      corpusAtRetirement: Math.round(corpusAtRetirement),
      annualIncome: Math.round(annualIncome),
      totalInvested: currentPrincipal + annualAddition * n1,
    };
  }, [currentPrincipal, annualAddition, yearsToGrow, preRetGrowthRate, yearsToPayOut, postRetGrowthRate]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);
  const { inflation } = assumptionsFor(settings.currency);

  // The same corpus paid out as an income that rises with inflation each
  // year: the first-year amount of a growing annuity over the payout period.
  const risingIncome = useMemo(() => {
    const C = results.corpusAtRetirement;
    const r = postRetGrowthRate / 100;
    const g = inflation / 100;
    const n = yearsToPayOut;
    if (C <= 0 || n <= 0) return 0;
    if (Math.abs(r - g) < 1e-9) return (C * (1 + r)) / n;
    return (C * (r - g)) / (1 - Math.pow((1 + g) / (1 + r), n));
  }, [results.corpusAtRetirement, postRetGrowthRate, inflation, yearsToPayOut]);

  // Today's-money value of the first year's level income.
  const incomeTodaysMoney = Math.round(results.annualIncome / Math.pow(1 + inflation / 100, yearsToGrow));
  const fourPercent = Math.round(results.corpusAtRetirement * 0.04);

  const lastsRows = [3, 4, 5, 6, 8].map((pct) => {
    const years = yearsCorpusLasts(results.corpusAtRetirement, (results.corpusAtRetirement * pct) / 100, postRetGrowthRate, inflation);
    return [
      `${pct}% of the corpus`,
      fmt(Math.round((results.corpusAtRetirement * pct) / 100)),
      Number.isFinite(years) ? `About ${Math.floor(years)} years` : "60+ years",
    ];
  });

  return (
    <>
      <Seo
        title="Annual Retirement Income Calculator"
        description="Calculate your retirement corpus and annual retirement income based on your pre-retirement savings and post-retirement payout period."
        path="/annual-retirement-income"
        keywords="retirement income calculator, annual retirement income, retirement planning, corpus calculator"
        jsonLd={[
        calculatorSchema({
          name: "Annual Retirement Income Calculator",
          description: "Calculate your retirement corpus and annual retirement income based on your pre-retirement savings and post-retirement payout period.",
          path: "/annual-retirement-income",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Annual Retirement Income Calculator"
            description="Estimate your retirement corpus and the annual income you can expect during retirement."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-8 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <div className="space-y-7 border-b border-[#111814]/10 pb-8 dark:border-[#eef1ec]/10">
                <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Pre-retirement</p>
                <CalcField label="Current principal" value={currentPrincipal} onChange={setCurrentPrincipal} {...principalBounds} format={fmt} />
                <CalcField label="Annual addition" value={annualAddition} onChange={setAnnualAddition} {...annualAdditionBounds} format={fmt} />
                <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} {...yearsToGrowBounds} suffix=" yrs" />
                <CalcField label="Growth rate" value={preRetGrowthRate} onChange={setPreRetGrowthRate} {...preRetGrowthRateBounds} suffix="%" hint="Sample value. Enter your own." />
              </div>

              <div className="space-y-7">
                <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">In retirement</p>
                <CalcField label="Years to pay out" value={yearsToPayOut} onChange={setYearsToPayOut} {...yearsToPayOutBounds} suffix=" yrs" />
                <CalcField label="Growth rate" value={postRetGrowthRate} onChange={setPostRetGrowthRate} {...postRetGrowthRateBounds} suffix="%" hint="Sample value. Enter your own." />
              </div>
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Annual retirement income" value={fmt(results.annualIncome)} />
              <div
                ref={corpusRef}
                onPointerMove={onCorpusMove}
                onPointerLeave={onCorpusLeave}
                style={corpusStyle}
                className="rounded-lg bg-[#0e1512] p-6 sm:p-7"
              >
                <p className="text-[13px] text-[#eef1ec]/55">Corpus at retirement</p>
                <p className="font-mono-tech mt-1 text-[26px] font-medium leading-none tabular-nums text-[#eef1ec] sm:text-[30px]">
                  {fmt(results.corpusAtRetirement)}
                </p>
              </div>
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Monthly equivalent" value={fmt(Math.round(results.annualIncome / 12))} tone="signal" />
                <CalcStat label={`First year's income in today's money (${inflation}% inflation)`} value={fmt(incomeTodaysMoney)} />
                <CalcStat label={`Or a starting income that rises ${inflation}% a year`} value={fmt(Math.round(risingIncome))} />
                <CalcStat label="Total invested (pre-retirement)" value={fmt(results.totalInvested)} />
                <CalcStat label="Pre-retirement growth rate" value={`${preRetGrowthRate}%`} />
                <CalcStat label="Years to grow" value={`${yearsToGrow} yrs`} />
                <CalcStat label="Post-retirement growth rate" value={`${postRetGrowthRate}%`} />
                <CalcStat label="Payout period" value={`${yearsToPayOut} yrs`} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Investment returns are not guaranteed. Actual retirement income depends on investment performance,
                inflation, taxes, fees, and future market conditions.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is an annual retirement income calculator?">
              <p>
                This calculator helps you estimate how much annual income you can expect during retirement based on
                your current savings, regular contributions, and expected returns. It projects your corpus at
                retirement and then calculates a sustainable annual withdrawal over your retirement years.
              </p>
            </CalcSection>

            <CalcSection title="How is this calculated?">
              <p>
                The calculation runs in two stages. First, your pre-retirement corpus grows using compound growth
                on your current principal plus the future value of your annual additions. Second, that corpus is
                treated as a fixed pool earning the post-retirement growth rate, and the calculator solves for the
                level annual withdrawal that exactly exhausts it after your chosen payout period — similar to how a
                loan amortizes, just running in reverse from a lump sum down to zero instead of from zero up to a
                payoff.
              </p>
              <p>
                This means your post-retirement growth rate assumption matters enormously: a corpus that keeps
                earning even a modest return during retirement can sustain meaningfully higher withdrawals than one
                assumed to sit in cash, since the remaining balance keeps growing between withdrawals rather than
                only shrinking.
              </p>
            </CalcSection>

            <CalcSection title="Level income or an income that keeps up with inflation?">
              <p>
                The headline figure, {fmt(results.annualIncome)} a year, stays the same every year until the money runs
                out. That's simple, but prices keep rising: at {inflation}% inflation, a level income buys about half as
                much after {Math.round(72 / inflation)} years.
              </p>
              <p>
                The alternative is to start lower and raise the withdrawal with inflation each year. With your
                numbers, that means starting at about <strong className={calcStrongClass}>{fmt(Math.round(risingIncome))}</strong>{" "}
                and increasing it {inflation}% a year, which spends the same corpus over the same {yearsToPayOut} years
                but keeps your standard of living steady. Most retirement plans should use this version.
              </p>
            </CalcSection>

            <CalcSection title="How long will your money last?">
              <p>
                Here's how long a corpus of {fmt(results.corpusAtRetirement)} lasts for different first-year
                withdrawals, raised with {inflation}% inflation every year, while the rest earns{" "}
                {postRetGrowthRate}% a year:
              </p>
              <CalcTable
                caption={`Corpus of ${fmt(results.corpusAtRetirement)}, earning ${postRetGrowthRate}% a year`}
                columns={["First-year withdrawal", "Amount", "Lasts"]}
                rows={lastsRows}
              />
              <p>
                The well-known <strong className={calcStrongClass}>4% rule</strong> suggests starting at 4% of the corpus,
                here {fmt(fourPercent)} a year, and raising it with inflation. It comes from US market history and
                aims for about 30 years. With higher inflation, lower returns or a longer retirement, a lower
                starting rate is safer.
              </p>
            </CalcSection>

            <CalcSection title="Making retirement income safer">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Keep a safe bucket:</strong> hold the next three to five years of
                  withdrawals in deposits or debt funds, so a market fall never forces you to sell investments at a
                  loss.
                </li>
                <li>
                  <strong className={calcStrongClass}>Draw a regular income:</strong> a systematic withdrawal plan from a
                  mutual fund pays a fixed amount each month. The{" "}
                  <Link to="/swp-calculator" className={calcLinkClass}>
                    SWP Calculator
                  </Link>{" "}
                  shows how long a monthly withdrawal lasts.
                </li>
                <li>
                  <strong className={calcStrongClass}>Plan for a long life:</strong> use a payout period that runs to age
                  85–90 or beyond. Running out too early is the bigger risk.
                </li>
                <li>
                  <strong className={calcStrongClass}>Review every year:</strong> cut back a little after a bad year for
                  markets, and you can spend more after good ones.
                </li>
              </ul>
              <p>
                To build the corpus in the first place, the{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>{" "}
                projects a monthly investment, and{" "}
                <Link to="/blog/how-much-to-save-for-retirement-by-age" className={calcLinkClass}>
                  how much to save for retirement by age
                </Link>{" "}
                shows what to invest at each age.
              </p>
            </CalcSection>

            <CalcSection title="How to use this calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your current principal (savings earmarked for retirement).</li>
                <li>Enter your annual addition (how much you'll add each year until retirement).</li>
                <li>Set the years to grow (remaining working years).</li>
                <li>Choose a pre-retirement growth rate (expected return on investments).</li>
                <li>Specify the years to pay out (your expected retirement duration).</li>
                <li>Choose a post-retirement growth rate (return on remaining corpus).</li>
                <li>The calculator will show your annual retirement income and corpus.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding the results">
              <CalcBenefitGrid
                items={[
                  { title: "Corpus at retirement", text: "This is the total amount you'll have saved by the time you retire, considering your current savings, annual additions, and investment growth." },
                  { title: "Annual retirement income", text: "This is the amount you can withdraw each year during retirement, assuming the remaining corpus continues to earn the post-retirement growth rate." },
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
