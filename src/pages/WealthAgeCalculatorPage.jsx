import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import WealthAgeCalculator from "@/components/calculators/WealthAgeCalculator";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What's a good wealth age?", a: "Anything below your real age means your current habits are outpacing what your age alone would predict. There's no universal target — the number is most useful tracked over time against your own past results." },
  { q: "Why did my wealth age go up instead of down?", a: "Usually a savings rate under 20% and/or a negative or low net worth (debt exceeding investments). Increasing monthly savings or paying down high-interest debt are the two most direct levers to bring it back down." },
  { q: "Is this the same as a real financial planning tool?", a: "No — treat it as a quick gut-check, not a substitute for a full financial plan. For actual retirement projections, use the Retirement or FIRE calculators, which model your specific numbers rather than producing a single comparative score." },
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
        faqSchema([
          {
            "question": "What's a good wealth age?",
            "answer": "Anything below your real age means your current habits are outpacing what your age alone would predict. There's no universal target — the number is most useful tracked over time against your own past results."
          },
          {
            "question": "Why did my wealth age go up instead of down?",
            "answer": "Usually a savings rate under 20% and/or a negative or low net worth (debt exceeding investments). Increasing monthly savings or paying down high-interest debt are the two most direct levers to bring it back down."
          },
          {
            "question": "Is this the same as a real financial planning tool?",
            "answer": "No — treat it as a quick gut-check, not a substitute for a full financial plan. For actual retirement projections, use the Retirement or FIRE calculators, which model your specific numbers rather than producing a single comparative score."
          }
        ]),
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
            <AdSlot slotId="wealthage_calc_mid" />

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

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
