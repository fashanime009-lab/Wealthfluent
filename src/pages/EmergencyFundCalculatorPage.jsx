import { useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { useDefaultableObject, useFieldBounds } from "@/hooks/useDefaultableField";
import { formatCurrency } from "../utils/currency";
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

// The first two answer the questions people actually search for (Search
// Console, Nov 2026: "how to calculate an emergency fund", "how much do i
// save for emergency fund"). The page and its FAQPage schema both come from
// this one list.
const FAQ_ITEMS = [
  { q: "How do I calculate my emergency fund?", a: "Add up your essential monthly expenses: rent or home-loan EMI, groceries, utilities, insurance premiums, other loan repayments, school fees and transport. Leave out spending you would cut in a crisis. Multiply that total by the number of months you want covered, 3 to 6 for most households and 6 to 9 if your income is irregular. That is your target. Subtract the savings you already have set aside to find your shortfall. The calculator above does exactly this." },
  { q: "How much should I save for an emergency fund?", a: "Enough to cover 3 to 6 months of essential expenses, or 6 to 9 months if you are self-employed, freelance or the only earner. For example, if your essentials cost 40,000 a month, a 6-month fund is 240,000. You don't have to build it at once: aim for one month first, then three, then six, by setting aside a fixed amount every month." },
  { q: "How many months of expenses should I save?", a: "3 months is a common starting point for stable, dual-income households; 6–9 months is safer for freelancers, single-income households, or anyone with variable income." },
  { q: "Where should I keep my emergency fund?", a: "Somewhere you can reach within a day or two without a penalty or market risk: a separate savings account for the first month or two, and a sweep-in fixed deposit or a liquid or overnight mutual fund for the rest. Not in equity, and not in a long fixed deposit with a heavy early-withdrawal penalty." },
  { q: "Should I invest my emergency fund for better returns?", a: "No — the purpose of this money is reliability, not growth. Investing it defeats the point: if a downturn coincides with your emergency (a common pattern, since layoffs often spike during downturns), you'd be forced to sell at a loss." },
  { q: "How long will it take to build my emergency fund?", a: "Divide the shortfall by what you can save each month. The calculator shows this for your numbers. If it's more than two years, start with a one-month target, then three, and add windfalls like bonuses or tax refunds to speed it up." },
];

const MONTHS_ROWS = [
  ["Two stable incomes, no dependants", "3 months"],
  ["One stable salary, or a family to support", "6 months"],
  ["Home loan or other large EMIs", "6 months or more"],
  ["Self-employed, freelance or commission-based", "9–12 months"],
  ["Industry where finding a new job takes long", "9–12 months"],
];

export default function EmergencyFundCalculatorPage() {
  const { settings } = useSettings();

  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // ─── State ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useDefaultableObject("emergencyFund", [
    "monthlyExpenses",
    "recommendedMonths",
    "currentSavings",
    "monthlySaving",
  ]);

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const monthlyExpensesBounds = useFieldBounds("emergencyFund", "monthlyExpenses");
  const recommendedMonthsBounds = useFieldBounds("emergencyFund", "recommendedMonths");
  const currentSavingsBounds = useFieldBounds("emergencyFund", "currentSavings");
  const monthlySavingBounds = useFieldBounds("emergencyFund", "monthlySaving");

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const { monthlyExpenses, recommendedMonths, currentSavings, monthlySaving } = inputs;

    const target = monthlyExpenses * recommendedMonths;
    const shortfall = Math.max(0, target - currentSavings);
    const monthsCovered = currentSavings > 0 && monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
    // Months of saving to close the gap (no interest assumed).
    const monthsToTarget = shortfall > 0 && monthlySaving > 0 ? Math.ceil(shortfall / monthlySaving) : 0;

    return {
      target: Math.round(target),
      shortfall: Math.round(shortfall),
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      monthsToTarget,
      isFullyFunded: currentSavings >= target,
    };
  }, [inputs]);

  const durationText = (months) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return [y && `${y} year${y > 1 ? "s" : ""}`, m && `${m} month${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  };

  // Timeline table: months to reach the target from today's savings, at
  // half, one and two times the monthly saving entered above.
  const timelineRows = [0.5, 1, 2]
    .map((k) => Math.round(inputs.monthlySaving * k))
    .filter((amount) => amount > 0)
    .map((amount) => [
      `${fmt(amount)} a month`,
      results.shortfall > 0 ? durationText(Math.ceil(results.shortfall / amount)) : "Already there",
    ]);
  return (
    <>
      <Seo
        title="Emergency Fund Calculator: How Much to Save"
        description="Calculate how big your emergency fund should be from your monthly expenses, and how long it will take to build it from what you can save each month."
        path="/emergency-fund-calculator"
        keywords="emergency fund calculator, rainy day fund, savings goal, financial security"
        jsonLd={[
        calculatorSchema({
          name: "Emergency Fund Calculator",
          description: "Calculate how big your emergency fund should be from your monthly expenses, and how long it will take to build it from what you can save each month.",
          path: "/emergency-fund-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Emergency Fund Calculator",
          description: "Calculate how much you need in your emergency fund based on your monthly expenses and current savings.",
          steps: [
            { name: "Enter your monthly living expenses", text: "Enter your average monthly living expenses in the Monthly Living Expenses field." },
            { name: "Enter months of expenses to cover", text: "Enter how many months of expenses you'd like to cover in the Months of Expenses to Cover field." },
            { name: "Enter your current savings", text: "Enter how much you've already saved in the Current Savings field." },
            { name: "Enter what you can save each month", text: "Enter how much you can put towards the fund every month in the Amount You Can Save Each Month field." },
            { name: "View your result instantly", text: "The calculator instantly shows your recommended emergency fund, your shortfall and how long it will take to build." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Wealth & Goals"
            title="Emergency Fund Calculator"
            description="Plan your financial safety net. Calculate how much you need to set aside for unexpected expenses, job loss, or emergencies."
          />

          {/* Main Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField
                label="Monthly Living Expenses"
                value={inputs.monthlyExpenses}
                onChange={(v) => handleChange("monthlyExpenses", v)}
                {...monthlyExpensesBounds}
                format={fmt}
              />

              <div>
                <CalcField
                  label="Months of Expenses to Cover"
                  value={inputs.recommendedMonths}
                  onChange={(v) => handleChange("recommendedMonths", v)}
                  {...recommendedMonthsBounds}
                  suffix=" months"
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                  Financial experts recommend 3–6 months of expenses for most people, or up to 12 months for higher-risk situations.
                </p>
              </div>

              <CalcField
                label="Current Savings"
                value={inputs.currentSavings}
                onChange={(v) => handleChange("currentSavings", v)}
                {...currentSavingsBounds}
                format={fmt}
              />

              <div>
                <CalcField
                  label="Amount You Can Save Each Month"
                  value={inputs.monthlySaving}
                  onChange={(v) => handleChange("monthlySaving", v)}
                  {...monthlySavingBounds}
                  format={fmt}
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                  What you can put towards the fund each month, to see how long it will take to build.
                </p>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel
                label="Recommended Emergency Fund"
                value={fmt(results.target)}
                note={`Based on ${inputs.recommendedMonths} months of expenses`}
              />

              {/* Current Status */}
              <div className={`border p-6 dark:bg-[#0e1512] ${results.isFullyFunded ? "border-[#047857]/25 bg-[#047857]/[0.06] dark:border-[#34d399]/20" : "border-amber-500/25 bg-amber-500/[0.06] dark:border-amber-400/20"}`}>
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Current Status</p>
                {results.isFullyFunded ? (
                  <>
                    <p className="mt-1 text-[22px] font-bold text-[#047857] dark:text-[#34d399]">✓ Fully Funded!</p>
                    <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Your savings cover <strong className="text-[#111814] dark:text-[#eef1ec]">{results.monthsCovered} months</strong> of expenses.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-[22px] font-bold text-amber-800 dark:text-amber-400">Need to Save More</p>
                    <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Your savings cover <strong className="text-[#111814] dark:text-[#eef1ec]">{results.monthsCovered} months</strong> of expenses.
                    </p>
                    <p className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Shortfall: <span className="font-mono-tech font-bold tabular-nums text-amber-800 dark:text-amber-400">{fmt(results.shortfall)}</span>
                    </p>
                    <p className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      {results.monthsToTarget > 0
                        ? <>Saving {fmt(inputs.monthlySaving)} a month, you'll reach it in <strong className="text-[#111814] dark:text-[#eef1ec]">{durationText(results.monthsToTarget)}</strong>.</>
                        : "Enter what you can save each month to see how long it will take."}
                    </p>
                  </>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Monthly Expenses" value={fmt(inputs.monthlyExpenses)} />
                <CalcStat label="Months to Cover" value={`${inputs.recommendedMonths} months`} />
                <CalcStat label="Current Savings" value={fmt(inputs.currentSavings)} tone="signal" />
                <CalcStat label="Monthly Saving" value={fmt(inputs.monthlySaving)} />
                <CalcStat label="Time to Target" value={results.isFullyFunded ? "Reached" : results.monthsToTarget > 0 ? durationText(results.monthsToTarget) : "—"} />
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This calculator is for illustrative purposes only. Your actual emergency fund needs may vary based on your personal situation.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="What Is an Emergency Fund?">
              <p>
                An emergency fund is a dedicated savings account designed to cover unexpected expenses — such as medical bills, car repairs, or job loss. Financial experts recommend saving 3 to 6 months' worth of living expenses to protect against life's uncertainties.
              </p>
            </CalcSection>

            <CalcSection title="How many months should you cover?">
              <p>
                Three to six months of essential expenses suits most people, but the right number depends on how
                quickly your income could stop and how long it might take to replace it:
              </p>
              <CalcTable caption="A starting point by situation" columns={["Your situation", "Months to cover"]} rows={MONTHS_ROWS} />
              <p>
                Count only essentials: rent or EMI, groceries, utilities, insurance premiums, minimum loan payments,
                school fees and transport. Good health insurance lets you hold less, because it covers the biggest
                medical bills.
              </p>
            </CalcSection>

            <CalcSection title="How long will it take to build?">
              <p>
                With {fmt(inputs.currentSavings)} already saved towards a {fmt(results.target)} target, here's how long the
                rest takes at different monthly amounts:
              </p>
              {timelineRows.length > 0 ? (
                <CalcTable caption={`Time to close a ${fmt(results.shortfall)} gap`} columns={["Saving", "Time to target"]} rows={timelineRows} />
              ) : (
                <p>Enter a monthly saving above to see the timeline.</p>
              )}
              <p>
                If it's a long way off, build in stages: one month of expenses first, then three, then your full
                target. Automate a transfer on salary day, and send part of every bonus or tax refund to the fund.
                If you have expensive credit card or personal loan debt, build one month first, clear the debt, then
                finish the fund.
              </p>
            </CalcSection>

            <CalcSection title="Where to keep it">
              <p>
                Safe and quick to reach come first; return comes last. A common setup is{" "}
                <strong className={calcStrongClass}>one month in a separate savings account</strong> for instant access and
                the rest in a <strong className={calcStrongClass}>sweep-in fixed deposit or a liquid or overnight fund</strong>.
                Avoid equity, long fixed deposits with heavy penalties and locked-in schemes. Our{" "}
                <Link to="/learn/emergency-funds" className={calcLinkClass}>
                  emergency funds lesson
                </Link>{" "}
                compares the options, including deposit insurance limits and instant-redemption rules.
              </p>
              <p>
                When you use the fund, refill it before you raise other investments. And review the target once a
                year, or whenever your expenses change. To find room in your budget for the monthly saving, see{" "}
                <Link to="/learn/budgeting-basics" className={calcLinkClass}>
                  budgeting basics
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your average monthly living expenses (rent, food, utilities, etc.).</li>
                <li>Select how many months you'd like to cover (usually 3–12).</li>
                <li>Add your current savings and what you can save each month.</li>
                <li>See your target emergency fund, your shortfall and how long it will take to build.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Why an Emergency Fund Matters">
              <CalcBenefitGrid
                items={[
                  { title: "Avoids High-Interest Debt", text: "Without savings set aside, an unexpected expense often gets funded with a credit card or personal loan, turning a one-time cost into an ongoing interest expense." },
                  { title: "Protects Your Investments", text: "A cash buffer means you're never forced to sell mutual funds or stocks at a loss just because a downturn coincided with a job loss or emergency — exactly the scenario a cash buffer prevents." },
                  { title: "Reduces Financial Stress", text: "Knowing a few months of expenses are covered changes how you approach job changes, negotiations, and other decisions — you're choosing from a position of stability, not desperation." },
                  { title: "A Foundation for Everything Else", text: "Most financial planning frameworks put an emergency fund before investing, insurance optimization, or debt payoff — it's the base the rest of a plan is built on." },
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
