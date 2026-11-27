import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import WealthAgeCalculator from "@/components/calculators/WealthAgeCalculator";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What's a good wealth age?", a: "Anything below your real age means your current habits are outpacing what your age alone would predict. There's no universal target — the number is most useful tracked over time against your own past results." },
  { q: "Why did my wealth age go up instead of down?", a: "Usually a savings rate under 20% and/or a negative or low net worth (debt exceeding investments). Increasing monthly savings or paying down high-interest debt are the two most direct levers to bring it back down." },
  { q: "Is this the same as a real financial planning tool?", a: "No — treat it as a quick gut-check, not a substitute for a full financial plan. For actual retirement projections, use the Retirement or FIRE calculators, which model your specific numbers rather than producing a single comparative score." },
  { q: "How is my savings rate worked out?", a: "Monthly savings divided by monthly income, as a percentage. Count everything you put aside each month, including SIPs, deposits and extra loan prepayments, and use take-home income so the two figures match." },
  { q: "Should I include my home in investments?", a: "The calculator asks for investments and debt, not property. For a stricter check, leave your home out and enter only investments you could draw on. If you include your home loan in debt, include the home's value too, or your net worth will look worse than it is." },
];

const ADJUSTMENT_ROWS = [
  ["Saving 40% or more of income", "8 years younger"],
  ["Saving 30–39%", "5 years younger"],
  ["Saving 20–29%", "2 years younger"],
  ["Saving under 20%", "3 years older"],
  ["Net worth at least one year's income", "A further 5 years younger"],
  ["Net worth below zero", "A further 5 years older"],
];

export default function WealthAgeCalculatorPage() {
  return (
    <>
      <Seo
        title="Wealth Age Calculator: Your Financial Age"
        description="Free Wealth Age Calculator: see how your savings rate and net worth compare to your real age, with a wealth score and personalized insights."
        path="/wealth-age-calculator"
        keywords="wealth age calculator, financial age, net worth calculator, savings rate, wealth score"
        jsonLd={[
        calculatorSchema({
          name: "Wealth Age Calculator",
          description: "Free Wealth Age Calculator: see how your savings rate and net worth compare to your real age, with a wealth score and personalized insights.",
          path: "/wealth-age-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Wealth Age Calculator",
          description: "Compare your financial age to your real age using your income, savings, investments and debt.",
          steps: [
            { name: "Enter your current age", text: "Enter your real age in the Current Age field." },
            { name: "Enter your monthly income", text: "Enter your monthly income in the Monthly Income field." },
            { name: "Enter your monthly savings", text: "Enter how much you save every month in the Monthly Savings field." },
            { name: "Enter your investments", text: "Enter the total value of your investments in the Investments field." },
            { name: "Enter your debt", text: "Enter your total outstanding debt in the Debt field." },
            { name: "Enter your monthly expenses", text: "Enter your monthly expenses in the Monthly Expenses field." },
            { name: "View your result instantly", text: "The calculator instantly shows your financial age, wealth score, savings rate and net worth." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Wealth & Goals"
            title="Wealth Age Calculator"
            description="Discover your financial age, wealth score, and investment personality using your income, savings, debt, and financial habits."
          />

          <div className="mt-10">
            <WealthAgeCalculator />
          </div>

          <p className="mt-8 text-[14px] leading-6 text-[#111814]/70 dark:text-[#eef1ec]/65">
            Not sure what the result means? Take the{" "}
            <Link
              to="/how-am-i-doing-financially-for-my-age"
              className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30"
            >
              5-point financial check for your age
            </Link>
            .
          </p>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="What Is a Wealth Age Calculator?">
              <p>
                A Wealth Age Calculator compares your actual financial age — how
                old your savings rate and net worth suggest you are, financially
                — against your real age. It's a quick, single-number gut check on
                whether your saving habits and current net worth are ahead of,
                on pace with, or behind where your birth-certificate age would
                suggest, based on your income, savings, investments, and debt.
              </p>
              <p>
                It isn't a precise actuarial measure — it's a motivational
                snapshot meant to make savings rate and net worth tangible in a
                way a raw percentage or currency figure often doesn't.
              </p>
            </CalcSection>

            <CalcSection title="How Is Wealth Age Calculated?">
              <p>
                Two factors adjust your real age up or down: your savings rate
                (monthly savings ÷ monthly income) and your net worth (investments
                minus debt). A savings rate of 40%+ subtracts 8 years; 30-39%
                subtracts 5; 20-29% subtracts 2; below 20% adds 3 years. A net
                worth at or above your annual income subtracts a further 5
                years (annual expenses instead, if you haven't entered an
                income), while a negative net worth adds 5 years. The two
                adjustments combine, so someone saving aggressively with a
                strong net worth can show a wealth age well below their real
                age — and the reverse is true for a high real age with a low
                savings rate and negative net worth.
              </p>
            </CalcSection>

            <CalcSection title="Wealth age adjustments at a glance">
              <CalcTable
                caption="How each factor moves your wealth age from your real age"
                columns={["If you're…", "Your wealth age is…"]}
                rows={ADJUSTMENT_ROWS}
              />
              <p>
                Two examples. A 30-year-old saving 25% of their income with a net worth above one year's income
                gets 30 − 2 − 5 = a <strong className={calcStrongClass}>wealth age of 23</strong>. A 30-year-old saving 10%
                with more debt than investments gets 30 + 3 + 5 ={" "}
                <strong className={calcStrongClass}>38</strong>. Same age, fifteen years apart financially.
              </p>
            </CalcSection>

            <CalcSection title="How to lower your wealth age">
              <p>
                Your savings rate is the lever you control month to month, and it moves the result most. Crossing
                20% takes you from three years older to two years younger, a five-year swing.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Automate savings on payday</strong>, so they happen before spending
                  does. Our{" "}
                  <Link to="/learn/budgeting-basics" className={calcLinkClass}>
                    budgeting basics
                  </Link>{" "}
                  lesson covers the 50/30/20 split.
                </li>
                <li>
                  <strong className={calcStrongClass}>Clear expensive debt first.</strong> A credit card or personal loan
                  balance pulls net worth down and can push it below zero; the{" "}
                  <Link to="/verdict/debt-vs-invest" className={calcLinkClass}>
                    Debt vs Invest verdict
                  </Link>{" "}
                  shows whether to prepay or invest.
                </li>
                <li>
                  <strong className={calcStrongClass}>Save each pay rise.</strong> Putting half of every increase into
                  savings raises your rate without cutting today's spending.
                </li>
              </ul>
            </CalcSection>

            <CalcSection title="What wealth age doesn't tell you">
              <p>
                It's a quick score with blunt bands: saving 19% and 20% land five years apart, and it doesn't
                look at your emergency fund, insurance or how your money is invested. Use it as a motivating
                snapshot, then check the details: the{" "}
                <Link to="/networth-calculator" className={calcLinkClass}>
                  Net Worth Calculator
                </Link>{" "}
                gives an itemised net worth, the{" "}
                <Link to="/emergency-fund-calculator" className={calcLinkClass}>
                  Emergency Fund Calculator
                </Link>{" "}
                checks your safety net, and the{" "}
                <Link to="/net-worth-percentile" className={calcLinkClass}>
                  Global Net Worth Percentile Calculator
                </Link>{" "}
                ranks your net worth worldwide.
              </p>
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
