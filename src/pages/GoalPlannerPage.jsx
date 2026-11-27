import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import { sipFutureValue } from "@/utils/projections";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How much retirement corpus do I need?", a: "Enough to pay your expenses, rising with inflation, for every year from retirement to the end of your life, while the money left keeps earning. This planner works that out from your expenses today, inflation, your retirement age, life expectancy and the return you expect on the corpus in retirement." },
  { q: "What life expectancy should I plan for?", a: "Plan for longer than average. Running out of money at 85 is a far bigger problem than having some left at 95, so many planners use 85 to 90, or older if your family tends to live long." },
  { q: "What should I enter as retirement benefits?", a: "Lump sums you expect to receive on the day you retire that aren't counted elsewhere, such as gratuity or a pension commutation, in the amount you expect at that time. Don't include your provident fund balance here if you've entered your monthly contribution below, or it will be counted twice." },
  { q: "Why is the corpus so much larger than my expenses suggest?", a: "Because of inflation. Expenses keep rising for decades before you retire and for the decades you're retired. At 6% inflation, prices roughly double every 12 years, so a 25-year wait before retiring multiplies your monthly costs about four times." },
  { q: "What if the gap is too large to close?", a: "Use the levers in order of impact: start or raise a monthly SIP and step it up each year, retire a few years later, and reduce the expenses you plan to carry into retirement. Each year you work longer both adds savings and shortens the period the corpus has to last." },
];

// Monthly contributions that rise by `annualIncrease`% once a year (it used
// to raise them a little every month), invested at `annualReturn`% a year.
function growingContributionsFV(monthly, annualIncrease, annualReturn, years) {
  const r = annualReturn / 100 / 12;
  let fv = 0;
  let contribution = monthly;
  for (let month = 1; month <= years * 12; month++) {
    fv = (fv + contribution) * (1 + r);
    if (month % 12 === 0) contribution *= 1 + annualIncrease / 100;
  }
  return fv;
}


// The whole plan for one set of inputs (also used to compare retirement
// ages in the table below).
function computePlan(inputs) {
  const {
    monthlyExpenses,
    annualExpenses,
    inflationBeforeRetirement,
    currentAge,
    retirementAge,
    lifeExpectancy,
    inflationDuringRetirement,
    postTaxReturnCorpus,
    postTaxReturnEquity,
    postTaxReturnTaxableFixed,
    postTaxReturnTaxFreeFixed,
    currentEquityInvestments,
    currentTaxableFixedIncome,
    currentTaxFreeFixedIncome,
    lumpSumBenefitsAtRetirement,
    monthlyEPFContribution,
    annualEPFIncrease,
    epfReturnRate,
  } = inputs;



  // Step 3: Total average monthly expenses (annual/12)
  const totalMonthlyExpenses = monthlyExpenses + annualExpenses / 12;

  // Step 7: Years to retirement
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);

  // Step 8: Monthly expenses in first year of retirement
  const monthlyExpensesFirstRetirement =
    totalMonthlyExpenses * Math.pow(1 + inflationBeforeRetirement / 100, yearsToRetirement);

  // Step 9: Years in retirement
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

  // Step 12: Total Corpus required (PV of annuity)
  const monthlyReturnCorpus = postTaxReturnCorpus / 100 / 12;
  const totalMonthsRetirement = yearsInRetirement * 12;

  let totalCorpusRequired = 0;
  if (monthlyReturnCorpus > 0 && totalMonthsRetirement > 0) {
    // PV of growing annuity (inflation-adjusted expenses)
    const monthlyInflationRetirement = inflationDuringRetirement / 100 / 12;
    const growthRate = (1 + monthlyReturnCorpus) / (1 + monthlyInflationRetirement) - 1;

    if (Math.abs(growthRate) < 0.0001) {
      totalCorpusRequired = monthlyExpensesFirstRetirement * totalMonthsRetirement;
    } else {
      totalCorpusRequired =
        monthlyExpensesFirstRetirement *
        (1 - Math.pow(1 + growthRate, -totalMonthsRetirement)) /
        growthRate;
    }
  }

  // Future value of current investments
  const fvCurrentEquity =
    currentEquityInvestments * Math.pow(1 + postTaxReturnEquity / 100, yearsToRetirement);
  const fvCurrentTaxableFixed =
    currentTaxableFixedIncome * Math.pow(1 + postTaxReturnTaxableFixed / 100, yearsToRetirement);
  const fvCurrentTaxFreeFixed =
    currentTaxFreeFixedIncome * Math.pow(1 + postTaxReturnTaxFreeFixed / 100, yearsToRetirement);

  const fvCurrentInvestments =
    fvCurrentEquity + fvCurrentTaxableFixed + fvCurrentTaxFreeFixed;

  // The blended yearly return those holdings actually earn, given their
  // mix (it used to show a fixed 50/30/20 "weighted return" that the page
  // called adjustable but wasn't).
  const currentTotal = currentEquityInvestments + currentTaxableFixedIncome + currentTaxFreeFixedIncome;
  const blendedReturn =
    currentTotal > 0 && yearsToRetirement > 0
      ? (Math.pow(fvCurrentInvestments / currentTotal, 1 / yearsToRetirement) - 1) * 100
      : 0;

  // Benefits received on the day you retire are already in retirement-day
  // money. They used to be compounded for every year until retirement,
  // as if invested today, which overstated the corpus.
  const fvLumpSumBenefits = lumpSumBenefitsAtRetirement;

  // Retirement contributions, raised once a year (handles a 0% return,
  // which used to ignore every contribution).
  const fvEPF = growingContributionsFV(monthlyEPFContribution, annualEPFIncrease, epfReturnRate, yearsToRetirement);

  // Total accumulated corpus at retirement
  const totalAccumulated = fvCurrentInvestments + fvLumpSumBenefits + fvEPF;

  // Net corpus to be accumulated (if shortfall)
  const netCorpusToAccumulate = Math.max(0, totalCorpusRequired - totalAccumulated);

  // Monthly SIP in equity that would close the gap by retirement.
  const sipToCloseGap =
    netCorpusToAccumulate > 0 && yearsToRetirement > 0
      ? netCorpusToAccumulate / sipFutureValue(1, yearsToRetirement, postTaxReturnEquity)
      : 0;

  return {
    totalMonthlyExpenses: Math.round(totalMonthlyExpenses),
    yearsToRetirement,
    monthlyExpensesFirstRetirement: Math.round(monthlyExpensesFirstRetirement),
    yearsInRetirement,
    totalCorpusRequired: Math.round(totalCorpusRequired),
    blendedReturn: blendedReturn.toFixed(2),
    sipToCloseGap: Math.round(sipToCloseGap),
    fvCurrentInvestments: Math.round(fvCurrentInvestments),
    fvLumpSumBenefits: Math.round(fvLumpSumBenefits),
    fvEPF: Math.round(fvEPF),
    totalAccumulated: Math.round(totalAccumulated),
    netCorpusToAccumulate: Math.round(netCorpusToAccumulate),
  };
}

export default function GoalPlannerPage() {
  const { settings } = useSettings();

const currency = settings.currency;
  // ─── State for all input fields ──────────────────────────────────

  // The sample amounts were written in rupees and used for every currency
  // ("$25,000 a month" for a dollar visitor). Scale them by how this
  // currency's typical home loan compares with India's, as the Net Worth
  // Calculator does, and take rates from the site-wide assumptions instead
  // of the old fixed 8% inflation and 14% equity return.
  const [inputs, setInputs] = useState(() => {
    const scale = defaultFor("emi", "loan", currency) / defaultFor("emi", "loan", "INR");
    const amount = (rupees) => Math.round(rupees * scale);
    const { inflation, equityReturn, retirementReturn } = assumptionsFor(currency);
    return {
      monthlyExpenses: amount(50000),
      annualExpenses: amount(100000),
      inflationBeforeRetirement: inflation,
      currentAge: 35,
      retirementAge: 60,
      lifeExpectancy: 85,
      inflationDuringRetirement: inflation,
      postTaxReturnCorpus: retirementReturn,
      postTaxReturnEquity: equityReturn,
      postTaxReturnTaxableFixed: Math.max(retirementReturn - 2, 1),
      postTaxReturnTaxFreeFixed: Math.max(retirementReturn - 1, 1),
      currentEquityInvestments: amount(500000),
      currentTaxableFixedIncome: amount(300000),
      currentTaxFreeFixedIncome: amount(300000),
      lumpSumBenefitsAtRetirement: amount(1000000),
      monthlyEPFContribution: amount(8000),
      annualEPFIncrease: 5,
      epfReturnRate: retirementReturn,
    };
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };
  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => computePlan(inputs), [inputs]);

  const fmt = (v) => formatCurrency(v, currency);

  // Retiring at different ages, everything else as entered.
  const ageRows = [55, 60, 65]
    .filter((age) => age > inputs.currentAge && age < inputs.lifeExpectancy)
    .map((age) => {
      const plan = computePlan({ ...inputs, retirementAge: age });
      return [
        `Retire at ${age}`,
        fmt(plan.totalCorpusRequired),
        fmt(plan.totalAccumulated),
        plan.netCorpusToAccumulate > 0 ? fmt(plan.sipToCloseGap) : "On track",
      ];
    });

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      <Seo
        title="Retirement Corpus Calculator: Goal-Based Planner"
        description="Plan the corpus you need to retire, with variable asset allocation and inflation-adjusted expenses. Free retirement goal planner, no signup."
        path="/goal-planner"
        keywords="retirement corpus planner, goal planner, retirement planning, corpus calculator, financial planning, asset allocation"
        jsonLd={[
          calculatorSchema({
            name: "Retirement Corpus Planner",
            description: "Plan the corpus you need to retire, with variable asset allocation and inflation-adjusted expenses.",
            path: "/goal-planner",
          }),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Wealth & Goals"
            title="Retirement Corpus Planner"
            description="Plan your retirement with variable asset allocation, inflation-adjusted expenses, and retirement contributions."
          />

          {/* Main Grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Left Panel – Inputs */}
            <div className="border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <h2 className="font-display text-[18px] font-extrabold text-[#111814] dark:text-[#eef1ec]">Goal Planner Inputs</h2>

              <div className="mt-6 space-y-8">
                {/* Section: Expenses */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Current Expenses</h3>
                  <div className="mt-4 space-y-6">
                    <CalcField label={`Current Monthly Expenses (${currency})`} value={inputs.monthlyExpenses} onChange={(v) => handleChange("monthlyExpenses", v)} min={0} max={500000} step={1000} format={fmt} />
                    <CalcField label={`Other Yearly Expenses (${currency})`} value={inputs.annualExpenses} onChange={(v) => handleChange("annualExpenses", v)} min={0} max={6000000} step={1000} format={fmt} hint="Yearly costs not in the monthly figure: insurance premiums, school fees, travel, festivals." />
                  </div>
                </div>

                {/* Section: Retirement Details */}
                <div className="border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
                  <h3 className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Retirement Details</h3>
                  <div className="mt-4 space-y-6">
                    <CalcField label="Inflation Before Retirement (%)" value={inputs.inflationBeforeRetirement} onChange={(v) => handleChange("inflationBeforeRetirement", v)} min={0} max={15} step={0.5} suffix="%" />
                    <CalcField label="Current Age" value={inputs.currentAge} onChange={(v) => handleChange("currentAge", v)} min={18} max={70} step={1} suffix=" yrs" />
                    <CalcField label="Age You Wish to Retire" value={inputs.retirementAge} onChange={(v) => handleChange("retirementAge", v)} min={40} max={75} step={1} suffix=" yrs" />
                    <CalcField label="Years You Expect to Live" value={inputs.lifeExpectancy} onChange={(v) => handleChange("lifeExpectancy", v)} min={60} max={100} step={1} suffix=" yrs" />
                    <CalcField label="Inflation During Retirement (%)" value={inputs.inflationDuringRetirement} onChange={(v) => handleChange("inflationDuringRetirement", v)} min={0} max={15} step={0.5} suffix="%" />
                    <CalcField label="Post-Tax Return from Retirement Corpus (%)" value={inputs.postTaxReturnCorpus} onChange={(v) => handleChange("postTaxReturnCorpus", v)} min={0} max={15} step={0.5} suffix="%" />
                  </div>
                </div>

                {/* Section: Asset Allocation Returns */}
                <div className="border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
                  <h3 className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Asset Allocation Returns</h3>
                  <div className="mt-4 space-y-6">
                    <CalcField label="Equity Return (%)" value={inputs.postTaxReturnEquity} onChange={(v) => handleChange("postTaxReturnEquity", v)} min={0} max={25} step={0.5} suffix="%" />
                    <CalcField label="Taxable Fixed Income Return (%)" value={inputs.postTaxReturnTaxableFixed} onChange={(v) => handleChange("postTaxReturnTaxableFixed", v)} min={0} max={15} step={0.5} suffix="%" />
                    <CalcField label="Tax-Free Fixed Income Return (%)" value={inputs.postTaxReturnTaxFreeFixed} onChange={(v) => handleChange("postTaxReturnTaxFreeFixed", v)} min={0} max={15} step={0.5} suffix="%" />
                  </div>
                </div>

                {/* Section: Current Investments */}
                <div className="border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
                  <h3 className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Current Investments</h3>
                  <div className="mt-4 space-y-6">
                    <CalcField label={`Equity Investments (${currency})`} value={inputs.currentEquityInvestments} onChange={(v) => handleChange("currentEquityInvestments", v)} min={0} max={10000000} step={5000} format={fmt} />
                    <CalcField label={`Fixed Income Investments (${currency})`} value={inputs.currentTaxableFixedIncome} onChange={(v) => handleChange("currentTaxableFixedIncome", v)} min={0} max={10000000} step={5000} format={fmt} />
                    <CalcField label={`Tax-Advantaged Investments (${currency})`} value={inputs.currentTaxFreeFixedIncome} onChange={(v) => handleChange("currentTaxFreeFixedIncome", v)} min={0} max={10000000} step={5000} format={fmt} />
                    <CalcField label={`Lump Sum Expected at Retirement (${currency})`} hint="Gratuity or other payouts on the day you retire, in the amount you expect then." value={inputs.lumpSumBenefitsAtRetirement} onChange={(v) => handleChange("lumpSumBenefitsAtRetirement", v)} min={0} max={10000000} step={5000} format={fmt} />
                  </div>
                </div>

                {/* Section: EPF / NPS */}
                <div className="border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
                  <h3 className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Retirement Contributions</h3>
                  <div className="mt-4 space-y-6">
                    <CalcField label={`Monthly Retirement Contribution (${currency})`} value={inputs.monthlyEPFContribution} onChange={(v) => handleChange("monthlyEPFContribution", v)} min={0} max={200000} step={500} format={fmt} />
                    <CalcField label="Annual Increase in Contribution (%)" value={inputs.annualEPFIncrease} onChange={(v) => handleChange("annualEPFIncrease", v)} min={0} max={15} step={0.5} suffix="%" />
                    <CalcField label="Expected Return on Retirement Contributions (%)" value={inputs.epfReturnRate} onChange={(v) => handleChange("epfReturnRate", v)} min={0} max={15} step={0.5} suffix="%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div>
              <h2 className="font-display text-[18px] font-extrabold text-[#111814] dark:text-[#eef1ec]">Results</h2>

              <div className="mt-6 space-y-6">
                <CalcResultPanel label="Total Corpus Required" value={fmt(results.totalCorpusRequired)} />

                <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Net Corpus to be Accumulated</p>
                  <p className={`font-mono-tech mt-1 text-[28px] font-bold tabular-nums ${results.netCorpusToAccumulate > 0 ? "text-[#047857] dark:text-[#34d399]" : "text-[#111814]/60 dark:text-[#eef1ec]/60"}`}>
                    {fmt(results.netCorpusToAccumulate)}
                  </p>
                  {results.yearsInRetirement === 0 ? (
                    <p className="mt-1 text-[13px] text-amber-800 dark:text-amber-400">
                      Your life expectancy is at or below your retirement age, so there's no retirement to fund. Check those two ages.
                    </p>
                  ) : results.netCorpusToAccumulate === 0 ? (
                    <p className="mt-1 text-[13px] text-[#047857] dark:text-[#34d399]">✓ You're on track!</p>
                  ) : results.sipToCloseGap > 0 ? (
                    <p className="mt-1 text-[13px] text-[#111814]/70 dark:text-[#eef1ec]/70">
                      A monthly SIP of about <strong className="text-[#111814] dark:text-[#eef1ec]">{fmt(results.sipToCloseGap)}</strong> at{" "}
                      {inputs.postTaxReturnEquity}% would close the gap by age {inputs.retirementAge}.
                    </p>
                  ) : null}
                </div>

                {/* Detailed breakdown */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Retirement Summary</h3>
                  <div className="mt-3 divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                    <CalcStat label="Years to Retirement" value={`${results.yearsToRetirement} years`} />
                    <CalcStat label="Years in Retirement" value={`${results.yearsInRetirement} years`} />
                    <CalcStat label="Monthly Expenses in First Year of Retirement" value={fmt(results.monthlyExpensesFirstRetirement)} />
                    <CalcStat label="Blended Return on Current Investments" value={`${results.blendedReturn}%`} />
                  </div>
                </div>

                {/* Accumulated Corpus Breakdown */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Accumulated Corpus at Retirement</h3>
                  <div className="mt-3 divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                    <CalcStat label="Current Investments (FV)" value={fmt(results.fvCurrentInvestments)} tone="signal" />
                    <CalcStat label="Lump Sum at Retirement" value={fmt(results.fvLumpSumBenefits)} />
                    <CalcStat label="Retirement Contributions (FV)" value={fmt(results.fvEPF)} />
                    <CalcStat label="Total Accumulated" value={fmt(results.totalAccumulated)} tone="signal" />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-6 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                An estimate only: it assumes steady inflation and returns every year, which real markets don't
                deliver. Review your plan every year and when your circumstances change.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <CalcSection title="How this planner works">
              <p>
                It answers one question: how big a retirement corpus you need, and whether what you're already
                doing will get you there. It works in five steps:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Your expenses today</strong>, monthly plus your other yearly costs
                  spread across the year.
                </li>
                <li>
                  <strong className={calcStrongClass}>Grown by inflation</strong> to the year you retire. With your inputs,
                  that's {fmt(results.monthlyExpensesFirstRetirement)} a month in your first year of retirement.
                </li>
                <li>
                  <strong className={calcStrongClass}>The corpus required</strong> to pay those expenses, rising with
                  inflation, for {results.yearsInRetirement} years while the rest earns {inputs.postTaxReturnCorpus}% a year.
                </li>
                <li>
                  <strong className={calcStrongClass}>What you'll already have</strong>: your current investments grown at
                  their own returns, retirement contributions that rise each year, and any lump sum on the day you
                  retire.
                </li>
                <li>
                  <strong className={calcStrongClass}>The gap</strong>, and the monthly SIP in equity that would close it.
                </li>
              </ol>
            </CalcSection>

            <CalcSection title="Retire at 55, 60 or 65?">
              <p>
                Retiring later helps twice: more years of saving, and fewer years the corpus has to last. With
                everything else as you've entered it:
              </p>
              {ageRows.length > 0 ? (
                <CalcTable
                  caption="Corpus needed and monthly SIP to close the gap, by retirement age"
                  columns={["Retirement age", "Corpus required", "You'll have", "Monthly SIP needed"]}
                  rows={ageRows}
                />
              ) : (
                <p>Set a current age below 55 and a life expectancy above 65 to compare retirement ages.</p>
              )}
              <p>
                The SIP figures assume a flat monthly amount. Raising it every year in line with your income
                starts you lower; the{" "}
                <Link to="/step-up-sip-calculator" className={calcLinkClass}>
                  Step-Up SIP Calculator
                </Link>{" "}
                shows how.
              </p>
            </CalcSection>

            <CalcSection title="Choosing your assumptions">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Inflation:</strong> long-term plans in India often use about 6%; use
                  more if your spending leans towards healthcare or education.
                </li>
                <li>
                  <strong className={calcStrongClass}>Return in retirement:</strong> lower than while you're saving, because
                  most people move towards safer investments once they're living off the money.
                </li>
                <li>
                  <strong className={calcStrongClass}>Life expectancy:</strong> plan for 85–90 or beyond. Outliving your
                  money is the bigger risk.
                </li>
                <li>
                  <strong className={calcStrongClass}>Retirement contributions:</strong> your provident fund or pension
                  contribution each month, including your employer's share.
                </li>
              </ul>
              <p>
                Related tools: the{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>{" "}
                projects a single monthly investment, the{" "}
                <Link to="/annual-retirement-income" className={calcLinkClass}>
                  Annual Retirement Income Calculator
                </Link>{" "}
                shows what a corpus pays each year, and the{" "}
                <Link to="/gratuity-calculator" className={calcLinkClass}>
                  Gratuity Calculator
                </Link>{" "}
                estimates one lump sum to enter above. Our lesson on{" "}
                <Link to="/learn/nps-vs-ppf-vs-epf" className={calcLinkClass}>
                  NPS vs PPF vs EPF
                </Link>{" "}
                compares the main retirement accounts in India.
              </p>
            </CalcSection>

            <CalcSection title="Key Assumptions">
              <ul className="list-disc space-y-2 pl-5">
                <li>Expenses grow with inflation until retirement, then with retirement inflation.</li>
                <li>Each current investment grows at its own return until retirement.</li>
                <li>Retirement contributions rise once a year by the percentage you enter.</li>
                <li>The lump sum at retirement is entered in the amount you expect then, so it isn't grown further.</li>
                <li>Returns are after tax and steady every year; real returns vary.</li>
              </ul>
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
