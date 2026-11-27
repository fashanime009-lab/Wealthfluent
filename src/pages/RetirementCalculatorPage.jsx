import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { sipFutureValue } from "@/utils/projections";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcButtonClass, calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "When should I start retirement planning?", a: "As early as you can. Money invested in your twenties has decades longer to compound than money invested in your forties, so starting early means a much smaller monthly amount reaches the same corpus. Even a small start, increased each year, beats waiting until you can afford a large amount." },
  { q: "How much retirement corpus is enough?", a: "A common rule is 25 times your yearly expenses at retirement, which comes from the 4% rule. Where inflation is higher, as in India, a more cautious 30 times or more is often used. Work out your expenses in future money first, because prices will be much higher by the time you retire." },
  { q: "What is the 4% rule in retirement?", a: "The 4% rule comes from US research on historical market returns. It suggests withdrawing 4% of your corpus in the first year of retirement and raising that amount with inflation each year, with a good chance the money lasts about 30 years. It's a starting point, not a guarantee, and a lower rate is safer for longer retirements or higher inflation." },
  { q: "Does this calculator account for inflation?", a: "The main result is in nominal terms: the actual amount your account will show in the future, not today's money. The line below it converts that amount into today's money at the inflation rate shown, so you can see what it will really buy." },
  { q: "Should my SIP amount stay fixed until retirement?", a: "Not necessarily. A step-up SIP that rises with your income each year usually reaches a much larger corpus than a flat SIP of the same starting amount, because each increase still gets years of compounding before you retire." },
  { q: "What return should I assume for retirement planning?", a: "Use a long-term average for your actual mix of investments, and stay conservative. An all-equity portfolio has historically earned more than a mix with bonds or fixed deposits, but with bigger swings, and most people shift towards safer assets as retirement approaches. Try a rate one or two points lower than your best guess to see how much the plan depends on it." },
];

export default function RetirementCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useDefaultableField("retirement", "monthly");
  const [annualReturn, setAnnualReturn] = useAssumptionField("equityReturn");
  const [years, setYears] = useDefaultableField("retirement", "years");
  const monthlyBounds = useFieldBounds("retirement", "monthly");
  const annualReturnBounds = useFieldBounds("retirement", "annualReturn");
  const yearsBounds = useFieldBounds("retirement", "years");
  const { settings } = useSettings();
  const { inflation, equityReturn } = assumptionsFor(settings.currency);

  const months = years * 12;

  // Shared helper — handles a 0% return (the annuity formula divides by the
  // rate, so the inline version returned NaN whenever the slider hit 0%).
  const futureValue = Math.round(sipFutureValue(monthlyInvestment, years, annualReturn));

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = futureValue - investedAmount;
  // What the corpus would buy at today's prices.
  const todaysMoney = Math.round(futureValue / Math.pow(1 + inflation / 100, years));

  // Shared, currency-aware formatter (lakh/crore grouping for INR).
  const fmt = (v) => formatCurrency(v, settings.currency);
  // Worked examples start from this currency's own default monthly amount
  // (₹15,000, $1,000, ...), so every figure is a realistic size locally.
  const exampleMonthly = defaultFor("retirement", "monthly", settings.currency);
  const exampleCorpus = Math.round(sipFutureValue(exampleMonthly, 25, equityReturn));

  // "How much do you need": today's monthly expenses grown by inflation.
  // Expenses of about 3⅓ times the monthly investment (₹50,000 against
  // ₹15,000), rounded to two significant figures.
  const exampleExpenses = Number((exampleMonthly * (10 / 3)).toPrecision(2));
  const futureMonthlyExpenses = exampleExpenses * Math.pow(1 + inflation / 100, 25);
  const target25x = Math.round(futureMonthlyExpenses * 12 * 25);
  const target30x = Math.round(futureMonthlyExpenses * 12 * 30);

  // Growth table, at this currency's long-run equity assumption.
  const tableYears = [15, 20, 25, 30];
  const tableAmounts = [exampleMonthly / 2, exampleMonthly, exampleMonthly * 2];
  const growthRows = tableAmounts.map((amount) => [
    `${fmt(amount)} a month`,
    ...tableYears.map((y) => fmt(Math.round(sipFutureValue(amount, y, equityReturn)))),
  ]);

  // Starting five years later with the same monthly amount.
  const onTimeCorpus = sipFutureValue(exampleMonthly, 25, equityReturn);
  const lateCorpus = sipFutureValue(exampleMonthly, 20, equityReturn);
  const lateMonthlyNeeded = Math.round(onTimeCorpus / sipFutureValue(1, 20, equityReturn));

  return (
    <>
      <Seo
        title="Retirement Calculator – Retirement Planning Tool"
        description="Project the corpus a monthly investment builds by retirement — enter the amount, expected return and years invested to see contributions vs returns."
        path="/retirement-calculator"
        keywords="retirement calculator, retirement planning, retirement corpus, pension planning"
        jsonLd={[
          calculatorSchema({
            name: "Retirement Calculator",
            description: "Project the corpus a monthly investment builds by retirement — enter the amount, expected return and years invested to see contributions vs returns.",
            path: "/retirement-calculator",
          }),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
          howToSchema({
            name: "How to Use the Retirement Calculator",
            description: "Project the retirement corpus a monthly investment builds, based on your expected return and years invested.",
            steps: [
              { name: "Enter your monthly investment", text: "Enter how much you plan to invest every month in the Monthly investment field." },
              { name: "Enter the expected annual return", text: "Enter your expected annual rate of return as a percentage in the Expected annual return field." },
              { name: "Enter the investment duration", text: "Enter how many years you'll invest for in the Investment duration field." },
              { name: "View your result instantly", text: "The calculator instantly shows your estimated retirement corpus, total investment, estimated returns and what the corpus is worth in today's money." },
            ],
          }),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Retirement Calculator"
            description="Estimate retirement corpus growth and future wealth accumulation through long-term investments and compounding."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Monthly investment" value={monthlyInvestment} onChange={setMonthlyInvestment} {...monthlyBounds} format={fmt} />
              <CalcField label="Expected annual return" value={annualReturn} onChange={setAnnualReturn} {...annualReturnBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Investment duration" value={years} onChange={setYears} {...yearsBounds} suffix=" yrs" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Estimated retirement corpus" value={fmt(futureValue)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Total investment" value={fmt(investedAmount)} share={futureValue > 0 ? (investedAmount / futureValue) * 100 : 0} tone="signal" />
                <CalcStat
                  label="Estimated returns"
                  value={`${estimatedReturns >= 0 ? "+" : "-"}${fmt(Math.abs(estimatedReturns))}`}
                  share={investedAmount > 0 ? Math.min(100, Math.abs((estimatedReturns / investedAmount) * 100)) : 0}
                />
                <CalcStat label={`Worth in today's money (at ${inflation}% inflation)`} value={fmt(todaysMoney)} />
              </div>
              <Link to="/annual-retirement-income" className={calcButtonClass}>
                See the yearly income this corpus can pay →
              </Link>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock market returns are not fixed and cannot be predicted with certainty.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is retirement planning?">
              <p>
                Retirement planning means working out how much money you'll need once your salary stops, and
                building that amount while you're still earning. It comes down to three numbers: what you'll spend
                each year in retirement, how many years that money has to last, and how much you need to invest
                each month to get there.
              </p>
              <p>
                This calculator answers the third question: what a fixed monthly investment grows to by the time
                you retire. To check whether that's enough, compare it with the corpus you'll need, which the
                section below explains how to estimate.
              </p>
            </CalcSection>

            <CalcSection title="How is your retirement corpus calculated?">
              <p>This calculator projects a monthly SIP forward using the future value of an annuity, with each payment made at the start of the month:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = SIP × [((1 + r)^n − 1) / r] × (1 + r)
              </p>
              <p>
                Here <strong className={calcStrongClass}>SIP</strong> is your monthly
                investment, <strong className={calcStrongClass}>r</strong> is the monthly
                expected return, and <strong className={calcStrongClass}>n</strong> is the total
                number of months until retirement. A {fmt(exampleMonthly)} monthly SIP at {equityReturn}% annual return over 25 years grows
                to about {fmt(exampleCorpus)}. Most of that comes from compounding on earlier contributions, not the
                contributions themselves, which is why starting a decade earlier matters more than investing a
                larger amount later.
              </p>
            </CalcSection>

            <CalcSection title="How much do you need to retire?">
              <p>
                A common starting point is <strong className={calcStrongClass}>25 times your yearly expenses</strong> at
                retirement. It comes from the 4% rule: withdraw 4% of your corpus in the first year, raise the amount
                with inflation each year after that, and the money has historically had a good chance of lasting
                about 30 years. Where inflation runs higher, as it has in India, planners often use a more cautious
                30 times or more.
              </p>
              <p>
                The catch is that your expenses must be in future money. If your household spends {fmt(exampleExpenses)} a
                month today, at {inflation}% inflation that becomes about{" "}
                <strong className={calcStrongClass}>{fmt(Math.round(futureMonthlyExpenses))}</strong> a month in 25 years.
                At 25 times yearly expenses, that's a corpus of about {fmt(target25x)}; at 30 times, about{" "}
                {fmt(target30x)}. Compare that with your result above, and if there's a gap, increase the monthly
                amount, invest for longer, or step the SIP up each year with the{" "}
                <Link to="/step-up-sip-calculator" className={calcLinkClass}>
                  Step-Up SIP Calculator
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="What a monthly investment grows to">
              <p>
                The table shows the corpus a fixed monthly investment builds at {equityReturn}% a year, a long-run
                assumption for a mostly equity portfolio. Notice how the last five years add more than the first
                ten: that's compounding doing most of the work late in the plan.
              </p>
              <CalcTable
                caption={`Corpus at ${equityReturn}% a year, by monthly amount and years invested`}
                columns={["Monthly investment", ...tableYears.map((y) => `${y} years`)]}
                rows={growthRows}
              />
              <p>
                For the amount to invest at each age to stay on track, see{" "}
                <Link to="/blog/how-much-to-save-for-retirement-by-age" className={calcLinkClass}>
                  how much to save for retirement by age
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="Why starting five years earlier matters">
              <p>
                Invest {fmt(exampleMonthly)} a month for 25 years at {equityReturn}% and you'd have about{" "}
                {fmt(Math.round(onTimeCorpus))}. Start five years later with the same amount and you'd have about{" "}
                {fmt(Math.round(lateCorpus))}, roughly {Math.round((1 - lateCorpus / onTimeCorpus) * 100)}% less. To
                catch up in 20 years, you'd need to invest about <strong className={calcStrongClass}>{fmt(lateMonthlyNeeded)}</strong>{" "}
                a month instead. The{" "}
                <Link to="/cost-of-delay-calculator" className={calcLinkClass}>
                  Cost of Delay Calculator
                </Link>{" "}
                shows this for your own numbers.
              </p>
            </CalcSection>

            <CalcSection title="Inflation: what your corpus will really buy">
              <p>
                The corpus this calculator shows is the amount your account will hold in the future. Prices will
                have risen by then, so it buys less than the same amount would today. At {inflation}% inflation,
                prices roughly double every {Math.round(72 / inflation)} years. That's why the result panel also shows
                the corpus in today's money, and why your retirement target should be worked out in future money.
                The{" "}
                <Link to="/inflation-calculator" className={calcLinkClass}>
                  Inflation Calculator
                </Link>{" "}
                shows what any expense will cost in the future.
              </p>
              <p>
                Once you know your corpus, the{" "}
                <Link to="/annual-retirement-income" className={calcLinkClass}>
                  Annual Retirement Income Calculator
                </Link>{" "}
                shows how much it can pay you each year, and the{" "}
                <Link to="/fire-calculator" className={calcLinkClass}>
                  FIRE Calculator
                </Link>{" "}
                checks whether you could stop working early.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of retirement planning">
              <CalcBenefitGrid
                items={[
                  { title: "Financial independence", text: "Retirement planning helps create sustainable long-term financial security and stability." },
                  { title: "Wealth growth", text: "Long-term compounding can significantly increase retirement savings over time." },
                  { title: "Inflation protection", text: "Planning ensures your retirement corpus accounts for rising cost of living and inflation." },
                  { title: "Peace of mind", text: "A well-structured plan reduces financial stress and provides clarity for the future." },
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
