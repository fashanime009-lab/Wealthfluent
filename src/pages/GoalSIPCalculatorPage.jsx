import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What if I can't afford the required monthly SIP?", a: "Extend the duration if your goal allows it, look for a realistic (not overly optimistic) higher return via equity exposure for long horizons, or split the goal into a smaller near-term target and a larger stretch target." },
  { q: "Should I increase my SIP every year?", a: "A step-up SIP — increasing your contribution annually in line with income growth — can meaningfully shorten how long it takes to reach a goal, or let you reach a larger goal with the same starting contribution." },
  { q: "Is the expected return guaranteed?", a: "No — this is a planning estimate, not a promise. Market-linked investments carry real risk, and actual returns will vary year to year even if the long-term average is close to your assumption." },
];

export default function GoalSIPCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [goalAmount, setGoalAmount] = useState(500000);
  const [investmentDuration, setInvestmentDuration] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const { settings } = useSettings();
  const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = investmentDuration * 12;

    let monthlySIP = 0;
    let totalInvestment = 0;

    if (monthlyRate > 0 && months > 0) {
      // Formula: P = FV * r / [((1 + r)^n - 1) * (1 + r)]
      // where P = monthly SIP, FV = goal amount, r = monthly rate, n = number of months
      monthlySIP =
        (goalAmount * monthlyRate) /
        ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
      totalInvestment = monthlySIP * months;
    }

    return {
      monthlySIP: Math.round(monthlySIP * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
    };
  }, [goalAmount, investmentDuration, expectedReturn]);

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fmt = (v) => `${currency}${formatCurrency(v)}`;

  return (
    <>
      <Seo
        title="Goal Investment Calculator – Plan Your Financial Goals"
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
              <CalcField label="Goal Amount" value={goalAmount} onChange={setGoalAmount} min={10000} max={10000000} step={5000} format={fmt} />
              <CalcField label="Investment Duration (In Years)" value={investmentDuration} onChange={setInvestmentDuration} min={1} max={50} suffix=" Years" />
              <CalcField label="Expected Rate of Return (p.a.) %" value={expectedReturn} onChange={setExpectedReturn} min={1} max={30} step={0.5} suffix="%" />
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel label="Monthly SIP Amount" value={fmt(results.monthlySIP)} />

              <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat
                  label="Your Total Investment"
                  value={fmt(results.totalInvestment)}
                  share={(results.totalInvestment / goalAmount) * 100}
                  tone="signal"
                />
                <p className="mt-1 text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">
                  {((results.totalInvestment / goalAmount) * 100).toFixed(1)}% of your goal amount
                </p>
              </div>

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Goal Amount" value={fmt(goalAmount)} />
                <CalcStat label="Investment Duration" value={`${investmentDuration} years`} />
                <CalcStat label="Expected Return" value={`${expectedReturn}% p.a.`} />
                <CalcStat label="Monthly SIP Required" value={fmt(results.monthlySIP)} tone="signal" />
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  window.open("https://www.investopedia.com/investing-4427685", "_blank");
                }}
                className="inline-flex h-12 w-full items-center justify-center bg-[#047857] text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
              >
                Start Your SIP Journey
              </button>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="goalsip_calc_mid" />

            <CalcSection title="What Is a Goal SIP Calculator?">
              <p>
                A Goal SIP Calculator helps you determine the monthly Systematic Investment Plan (SIP)
                amount you need to invest to reach a specific financial goal. By entering your goal amount,
                investment duration, and expected rate of return, the calculator computes the required
                monthly investment to achieve your target.
              </p>
            </CalcSection>

            <CalcSection title="How Is the Required SIP Calculated?">
              <p>
                This calculator works backward from your goal, using the future
                value of a growing SIP formula solved for the monthly contribution:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Monthly SIP = FV × r / [((1 + r)^n − 1) × (1 + r)]
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">FV</strong> is your goal amount,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is the
                monthly expected return (annual rate ÷ 12 ÷ 100), and <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is
                the number of months. Small changes to duration have an outsized
                effect: extending a goal from 10 to 15 years often cuts the required
                monthly SIP by nearly a third, since more months means more
                compounding periods working on your side.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your financial goal amount (e.g., 500,000 for a home down payment).</li>
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

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
