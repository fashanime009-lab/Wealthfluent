import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useMemo } from "react";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
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

// Monthly SIP (paid at the start of each month) that grows to `goal`.
function requiredSip(goal, years, annualRate) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  return r > 0 ? (goal * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)) : goal / n;
}

const FAQ_ITEMS = [
  { q: "What if I can't afford the required monthly SIP?", a: "Extend the duration if your goal allows it, start with what you can afford and raise it every year, or split the goal into a smaller near-term target and a larger stretch target. Don't fix the gap by assuming a higher return than your investments can realistically deliver." },
  { q: "Should I increase my SIP every year?", a: "A step-up SIP, raising your contribution each year in line with your income, can shorten how long it takes to reach a goal, or let you start with a smaller monthly amount for the same goal." },
  { q: "Is the expected return guaranteed?", a: "No. This is a planning estimate, not a promise. Market-linked investments carry real risk, and actual returns vary from year to year even if the long-term average ends up close to your assumption." },
  { q: "What expected return should I use?", a: "Match it to how far away the goal is. For goals a few years away, money usually sits in debt funds or deposits, so use a lower return. For goals more than five to seven years away, a mostly equity portfolio is common and a higher long-run return is reasonable, with bigger swings along the way." },
  { q: "Should I adjust my goal for inflation?", a: "Yes. Enter what the goal will cost when you need it, not what it costs today. A goal that costs a certain amount now will cost noticeably more in ten or fifteen years, so a SIP sized to today's price will fall short." },
  { q: "Is a lump sum better than a SIP for a goal?", a: "If you already have the money, investing it as a lump sum gives it longer to grow. If you're investing from your monthly income, a SIP is the natural way to do it, and it also spreads your purchases across market ups and downs." },
];

export default function GoalSIPCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [goalAmount, setGoalAmount] = useDefaultableField("goalSip", "target");
  const [investmentDuration, setInvestmentDuration] = useDefaultableField("goalSip", "years");
  const [expectedReturn, setExpectedReturn] = useAssumptionField("equityReturn");
  const targetBounds = useFieldBounds("goalSip", "target");
  const yearsBounds = useFieldBounds("goalSip", "years");
  const expectedReturnBounds = useFieldBounds("goalSip", "expectedReturn");
  const { settings } = useSettings();
  const currency = settings.currency;
  const { inflation, equityReturn } = assumptionsFor(currency);

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const monthlySIP = requiredSip(goalAmount, investmentDuration, expectedReturn);
    const totalInvestment = monthlySIP * investmentDuration * 12;
    return {
      monthlySIP: Math.round(monthlySIP * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
      // A goal of 0 made this 0/0 = NaN in the share bar and its caption.
      goalShare: goalAmount > 0 ? (totalInvestment / goalAmount) * 100 : 0,
    };
  }, [goalAmount, investmentDuration, expectedReturn]);

  // Shared, currency-aware formatters (lakh/crore grouping for INR). SIP
  // amounts keep two decimals; goal amounts are whole units.
  const fmt = (v) => formatCurrency(v, currency, false, 2);
  const fmt0 = (v) => formatCurrency(v, currency);

  // Worked examples, from this currency's default goal.
  const exampleGoal = defaultFor("goalSip", "target", currency);
  const exampleYears = defaultFor("goalSip", "years", currency);
  const sip10 = requiredSip(exampleGoal, 10, equityReturn);
  const sip15 = requiredSip(exampleGoal, 15, equityReturn);
  const cutPercent = Math.round((1 - sip15 / sip10) * 100);

  const tableRates = [...new Set([Math.max(equityReturn - 5, 1), equityReturn - 2, equityReturn])];
  const tableYears = [3, 5, 10, 15, 20];
  const sipRows = tableYears.map((y) => [`${y} years`, ...tableRates.map((rate) => fmt0(Math.round(requiredSip(exampleGoal, y, rate))))]);

  const inflatedGoal = Math.round(exampleGoal * Math.pow(1 + inflation / 100, exampleYears));
  const sipToday = requiredSip(exampleGoal, exampleYears, equityReturn);
  const sipInflated = requiredSip(inflatedGoal, exampleYears, equityReturn);

  return (
    <>
      <Seo
        title="Goal SIP Calculator: Monthly SIP for Any Goal"
        description="Calculate the monthly SIP investment needed to reach your financial goal. Plan your investments with our Goal SIP Calculator."
        path="/goal-sip"
        keywords="goal SIP calculator, SIP planner, mutual fund goal planner, investment calculator"
        jsonLd={[
          calculatorSchema({
            name: "Goal Investment Calculator",
            description: "Calculate the monthly SIP investment needed to reach your financial goal. Plan your investments with our Goal SIP Calculator.",
            path: "/goal-sip",
          }),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
          howToSchema({
            name: "How to Use the Goal SIP Calculator",
            description: "Calculate the monthly SIP investment needed to reach a specific financial goal.",
            steps: [
              { name: "Enter your goal amount", text: "Enter the target amount you want to reach in the Goal Amount field." },
              { name: "Enter the investment duration", text: "Enter how many years you have to invest in the Investment Duration field." },
              { name: "Enter the expected rate of return", text: "Enter your expected annual rate of return as a percentage in the Expected Rate of Return field." },
              { name: "View your result instantly", text: "The calculator instantly shows the monthly SIP amount required to reach your goal." },
            ],
          }),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Goal SIP Calculator"
            description="Determine the monthly SIP investments you need to make to reach a particular goal."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Goal Amount" value={goalAmount} onChange={setGoalAmount} {...targetBounds} format={fmt0} />
              <CalcField label="Investment Duration (In Years)" value={investmentDuration} onChange={setInvestmentDuration} {...yearsBounds} suffix=" Years" />
              <CalcField label="Expected Rate of Return (p.a.) %" value={expectedReturn} onChange={setExpectedReturn} {...expectedReturnBounds} suffix="%" hint="Sample value. Enter your own." />
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel label="Monthly SIP Amount" value={fmt(results.monthlySIP)} />

              <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat
                  label="Your Total Investment"
                  value={fmt(results.totalInvestment)}
                  share={results.goalShare}
                  tone="signal"
                />
                <p className="mt-1 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                  {results.goalShare.toFixed(1)}% of your goal amount
                </p>
              </div>

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Goal Amount" value={fmt0(goalAmount)} />
                <CalcStat label="Investment Duration" value={`${investmentDuration} years`} />
                <CalcStat label="Expected Return" value={`${expectedReturn}% p.a.`} />
                <CalcStat label="Monthly SIP Required" value={fmt(results.monthlySIP)} tone="signal" />
              </div>

              <Link to="/step-up-sip-calculator" className={calcButtonClass}>
                Start smaller with a yearly step-up →
              </Link>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="What Is a Goal SIP Calculator?">
              <p>
                A Goal SIP Calculator works backwards from a target. Instead of asking "what will my SIP grow
                to?", it asks "how much do I need to invest each month to reach this amount by this date?" You
                enter the goal, the number of years until you need the money and the return you expect, and it
                gives you the monthly Systematic Investment Plan (SIP) amount.
              </p>
              <p>
                It suits any goal with a price and a date: a home down payment, a child's education, a car, a
                wedding or a sabbatical. Running one goal at a time also makes it clear which goals your current
                savings can cover and which need more time or money.
              </p>
            </CalcSection>

            <CalcSection title="How Is the Required SIP Calculated?">
              <p>
                This calculator works backward from your goal, using the future value of a SIP formula solved for
                the monthly contribution:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Monthly SIP = FV × r / [((1 + r)^n − 1) × (1 + r)]
              </p>
              <p>
                Here <strong className={calcStrongClass}>FV</strong> is your goal amount,{" "}
                <strong className={calcStrongClass}>r</strong> is the
                monthly expected return (annual rate ÷ 12 ÷ 100), and <strong className={calcStrongClass}>n</strong> is
                the number of months. Time has an outsized effect: for a {fmt0(exampleGoal)} goal at{" "}
                {equityReturn}% a year, stretching it from 10 to 15 years cuts the monthly SIP from{" "}
                {fmt0(Math.round(sip10))} to {fmt0(Math.round(sip15))}, about {cutPercent}% less, because more of the
                goal is reached through compounding instead of your own contributions.
              </p>
            </CalcSection>

            <CalcSection title="Monthly SIP needed, by time and return">
              <p>
                The table shows the monthly SIP needed to reach {fmt0(exampleGoal)} at three different returns. The
                gap between rows is far bigger than the gap between columns: giving a goal more years does more
                than chasing a higher return.
              </p>
              <CalcTable
                caption={`Monthly SIP to reach ${fmt0(exampleGoal)}`}
                columns={["Years to goal", ...tableRates.map((rate) => `At ${rate}% a year`)]}
                rows={sipRows}
              />
            </CalcSection>

            <CalcSection title="Match the expected return to the goal's timeline">
              <p>
                The return you enter should match where the money will actually be invested, and that depends on
                how soon you need it:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Less than three years away:</strong> stability matters more than
                  growth, so the money usually sits in liquid or short-term debt funds or deposits. Use a lower,
                  deposit-like return.
                </li>
                <li>
                  <strong className={calcStrongClass}>Three to five years away:</strong> a mix of equity and debt, such as
                  a hybrid fund, is common. Use a return between the two.
                </li>
                <li>
                  <strong className={calcStrongClass}>More than five to seven years away:</strong> equity has time to
                  recover from falls, so a higher long-run return is reasonable. Plan to move the money to safer
                  options as the date gets close.
                </li>
              </ul>
              <p>
                Our lesson on{" "}
                <Link to="/learn/mutual-fund-types" className={calcLinkClass}>
                  types of mutual funds
                </Link>{" "}
                explains which fund categories suit which timelines.
              </p>
            </CalcSection>

            <CalcSection title="Inflate your goal before you plan">
              <p>
                Enter what the goal will cost when you need it, not what it costs today. Something that costs{" "}
                {fmt0(exampleGoal)} now will cost about <strong className={calcStrongClass}>{fmt0(inflatedGoal)}</strong> in{" "}
                {exampleYears} years at {inflation}% inflation. Planning for today's price, you'd invest about{" "}
                {fmt0(Math.round(sipToday))} a month; planning for the real future price, you need about{" "}
                <strong className={calcStrongClass}>{fmt0(Math.round(sipInflated))}</strong>. The{" "}
                <Link to="/inflation-calculator" className={calcLinkClass}>
                  Inflation Calculator
                </Link>{" "}
                gives the future cost of any goal.
              </p>
              <p>
                If the monthly amount is more than you can manage now, the{" "}
                <Link to="/step-up-sip-calculator" className={calcLinkClass}>
                  Step-Up SIP Calculator
                </Link>{" "}
                shows how a smaller SIP that rises each year can reach the same goal, and the{" "}
                <Link to="/financial-goal-planner" className={calcLinkClass}>
                  Multi-Goal Budget Optimizer
                </Link>{" "}
                splits one monthly budget across several goals.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your goal amount in future money (for example, {fmt0(exampleGoal)} for a home down payment).</li>
                <li>Set your investment duration (number of years you can invest).</li>
                <li>Enter the expected annual rate of return from your investments.</li>
                <li>The calculator will show the monthly SIP amount required and total investment.</li>
                <li>Adjust the inputs to find a comfortable monthly investment amount.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Benefits of Goal-Based SIP Planning">
              <CalcBenefitGrid
                items={[
                  { title: "Goal Clarity", text: "Define specific financial goals and create a disciplined investment plan to achieve them." },
                  { title: "Disciplined Investing", text: "SIPs encourage regular investing and cost averaging, reducing market timing risk." },
                  { title: "Power of Compounding", text: "Starting early and investing regularly allows your money to grow significantly over time." },
                  { title: "Flexible Planning", text: "Adjust your monthly SIP amount, duration, or expected returns to find a plan that fits your budget." },
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
