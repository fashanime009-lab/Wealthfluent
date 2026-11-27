import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import { sipFutureValue } from "@/utils/projections";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { currencies } from "../data/currencies";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How do I choose my annual increase percentage?", a: "Match it to how fast you expect your income to grow. Raising your investment by the same percentage as your pay rises keeps your savings rate steady; raising it by more increases your savings rate over time. If you're unsure, start with about your expected inflation rate and raise it in good years." },
  { q: "What should I include in my retirement investments?", a: "Everything you've set aside for retirement and won't touch before then: SIPs and other mutual fund investments, provident fund and pension contributions (yours and your employer's), PPF, NPS, and shares, bonds or ETFs held for retirement. Leave out your emergency fund and money for nearer goals." },
  { q: "How often should I update my tracker?", a: "At least once a year, ideally at the end of each financial year, and whenever you make a large one-off investment such as investing a bonus. A yearly check is enough to spot a gap early without reacting to every market move." },
  { q: "How do I set my first year's target?", a: "Work out the monthly amount your retirement plan needs, with the Retirement Calculator or the Retirement Corpus Planner, and multiply it by twelve. The tracker then raises each following year's target by your annual increase." },
  { q: "What if I fall behind my target?", a: "Look at the variance, not just the progress percentage. Small gaps can be closed by investing a bonus or raising your monthly amount slightly; a large gap may mean revisiting your plan's assumptions, such as your retirement age or expected spending." },
];

export default function RetirementInvestmentTrackerPage() {
  // ─── State ──────────────────────────────────────────────────────
const [annualIncrease, setAnnualIncrease] = useState(10);
const { settings } = useSettings();
// Symbol only, for the column headers; amounts go through the shared formatter.
const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;
  // The first year's target used to start at 0, so every row added after it
  // was 0 too. Start from a year of this currency's default monthly
  // retirement investment (₹15,000 × 12, $1,000 × 12, ...), editable.
  const [rows, setRows] = useState(() => [
    { id: 1, year: new Date().getFullYear(), target: defaultFor("retirement", "monthly", settings.currency) * 12, actual: 0 },
  ]);

  // ─── Add / Remove Rows ──────────────────────────────────────────
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const newId = lastRow ? lastRow.id + 1 : 1;
    const newYear = lastRow ? lastRow.year + 1 : new Date().getFullYear();
    const increaseFactor = 1 + annualIncrease / 100;
    const newTarget = lastRow ? Math.round(lastRow.target * increaseFactor) : 0;

    setRows([...rows, { id: newId, year: newYear, target: newTarget, actual: 0 }]);
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((row) => row.id !== id));
  };

  // ─── Update Row ──────────────────────────────────────────────────
  const updateRow = (id, field, value) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: Number(value) || 0 } : row
      )
    );
  };

  // ─── Recalculate Targets when Annual Increase changes ──────────
  // Takes the percentage explicitly. It used to read `annualIncrease` from
  // state and get called from a setTimeout right after setAnnualIncrease —
  // but that closure still held the PREVIOUS render's value, so dragging
  // the slider to 20% recalculated every target at the old percentage and
  // the targets were always one step behind what the slider showed. Rows
  // are also copied rather than mutated in place now.
  const recalculateTargets = (increasePct) => {
    const increaseFactor = 1 + increasePct / 100;
    setRows((current) => {
      const next = current.map((row) => ({ ...row }));
      for (let i = 1; i < next.length; i++) {
        next[i].target = Math.round(next[i - 1].target * increaseFactor);
      }
      return next;
    });
  };

  // ─── Handle Annual Increase Change ──────────────────────────────
  const handleAnnualIncreaseChange = (e) => {
    const value = Number(e.target.value) || 0;
    setAnnualIncrease(value);
    recalculateTargets(value);
  };

  // ─── Computed Totals ─────────────────────────────────────────────
  // Progress and variance are measured against the targets for years up to
  // and including this one. They used to include every future year's
  // target too, so anyone planning ahead always looked behind.
  const thisYear = new Date().getFullYear();
  const totals = useMemo(() => {
    let totalTarget = 0;
    let targetToDate = 0;
    let totalActual = 0;

    rows.forEach((row) => {
      totalTarget += row.target || 0;
      if (row.year <= thisYear) targetToDate += row.target || 0;
      totalActual += row.actual || 0;
    });

    const progress = targetToDate > 0 ? (totalActual / targetToDate) * 100 : 0;

    return {
      totalTarget,
      targetToDate,
      totalActual,
      progress: Math.min(progress, 100),
      variance: totalActual - targetToDate,
    };
  }, [rows, thisYear]);

  // ─── Format currency ──────────────────────────────────────────
  // Shared, currency-aware formatter (lakh/crore grouping for INR).
  const fmt = (v) => formatCurrency(v, settings.currency);

  // Step-up comparison: 20 years from the first row's target, invested
  // monthly at this currency's equity assumption.
  const { equityReturn } = assumptionsFor(settings.currency);
  const firstYearTarget = rows[0]?.target || defaultFor("retirement", "monthly", settings.currency) * 12;
  const stepUpRows = [0, 5, 10].map((step) => {
    let invested = 0;
    let corpus = 0;
    let yearly = firstYearTarget;
    for (let y = 0; y < 20; y++) {
      invested += yearly;
      // Monthly compounding throughout, matching sipFutureValue.
      corpus = corpus * Math.pow(1 + equityReturn / 1200, 12) + sipFutureValue(yearly / 12, 1, equityReturn);
      yearly *= 1 + step / 100;
    }
    return [step === 0 ? "No increase" : `${step}% a year`, fmt(Math.round(invested)), fmt(Math.round(corpus))];
  });

  return (
    <>
      <Seo
        title="Retirement Investment Tracker: Year by Year"
        description="Track your retirement investments year by year: set yearly step-up targets, log what you actually invested and see whether you're on track. Free."
        path="/retirement-investment-tracker"
        keywords="retirement tracker, investment tracker, retirement planning, goal tracking"
        jsonLd={[
        calculatorSchema({
          name: "Retirement Investment Tracker",
          description: "Track your retirement investments year by year: set yearly step-up targets, log what you actually invested and see whether you're on track. Free.",
          path: "/retirement-investment-tracker",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Retirement Investment Tracker"
            description="Use this sheet to track investments made for retirement. Set annual increase targets and monitor your progress."
          />

          {/* Main Content */}
          <div className="mt-10 border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] md:p-8">
            {/* Annual Increase Input */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label htmlFor="annual-increase" className="whitespace-nowrap text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
                  Annual increase in investment
                </label>
                <div className="flex max-w-xs flex-1 items-center gap-4">
                  <input
                    id="annual-increase"
                    type="range"
                    aria-valuetext={`${annualIncrease}%`}
                    min="0"
                    max="30"
                    step="1"
                    value={annualIncrease}
                    onChange={handleAnnualIncreaseChange}
                    className="instrument-range flex-1"
                  />
                  <span className="font-mono-tech min-w-[50px] text-right text-[14px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {annualIncrease}%
                  </span>
                </div>
                <button
                  onClick={() => recalculateTargets(annualIncrease)}
                  className="text-[13px] font-semibold text-[#047857] hover:underline dark:text-[#34d399]"
                >
                  Recalculate targets
                </button>
              </div>
              <p className="mt-2 text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                Enter the total investment made each year for this goal in the cells below.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#111814]/12 dark:border-[#eef1ec]/12">
                    <th className="w-[60px] px-3 py-3 text-left text-[13px] font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">
                      S.No
                    </th>
                    <th className="w-[120px] px-3 py-3 text-left text-[13px] font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Year
                    </th>
                    <th className="px-3 py-3 text-right text-[13px] font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Investment target ({currency})
                    </th>
                    <th className="px-3 py-3 text-right text-[13px] font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Actual ({currency})
                    </th>
                    <th className="w-[50px] px-3 py-3 text-center text-[13px] font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b border-[#111814]/10 dark:border-[#eef1ec]/10"
                    >
                      <td className="px-3 py-2 text-center font-mono-tech text-[13.5px] tabular-nums text-[#111814]/65 dark:text-[#eef1ec]/65">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 font-mono-tech text-[13.5px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                        {row.year}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          aria-label={`Target for ${row.year}`}
                          value={row.target || ""}
                          onChange={(e) => updateRow(row.id, "target", e.target.value)}
                          className="ml-auto block w-full max-w-[180px] border border-[#111814]/15 bg-transparent px-3 py-1.5 text-right font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          aria-label={`Actual for ${row.year}`}
                          value={row.actual || ""}
                          onChange={(e) => updateRow(row.id, "actual", e.target.value)}
                          className="ml-auto block w-full max-w-[180px] border border-[#111814]/15 bg-transparent px-3 py-1.5 text-right font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          className={`text-[#111814]/60 transition hover:text-red-500 dark:text-[#eef1ec]/50 ${
                            rows.length <= 1 ? "cursor-not-allowed opacity-30" : ""
                          }`}
                          disabled={rows.length <= 1}
                          aria-label="Remove row"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot>
                  <tr className="border-t border-[#111814]/12 dark:border-[#eef1ec]/12">
                    <td colSpan="2" className="px-3 py-3 text-[13.5px] font-bold text-[#111814] dark:text-[#eef1ec]">
                      Total
                    </td>
                    <td className="px-3 py-3 text-right font-mono-tech text-[13.5px] font-bold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                      {fmt(totals.totalTarget)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono-tech text-[13.5px] font-bold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                      {fmt(totals.totalActual)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Add Row Button */}
            <div className="mt-4">
              <button
                onClick={addRow}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#047857] transition hover:underline dark:text-[#34d399]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add row
              </button>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Target to date (to {thisYear})</p>
                <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                  {fmt(totals.targetToDate)}
                </p>
                <p className="mt-1 text-[12px] text-[#111814]/55 dark:text-[#eef1ec]/50">All rows: {fmt(totals.totalTarget)}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total actual</p>
                <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
                  {fmt(totals.totalActual)}
                </p>
              </div>
              <div>
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Progress</p>
                <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
                  {totals.progress.toFixed(1)}%
                </p>
                <div className="mt-2 h-[3px] w-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
                  <div
                    className="h-full bg-[#047857] transition-all duration-500 dark:bg-[#34d399]"
                    style={{ width: `${totals.progress}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Variance vs target to date</p>
                <p className={`font-mono-tech mt-1 text-[19px] font-medium tabular-nums ${totals.variance >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                  {totals.variance >= 0 ? "+" : ""}
                  {fmt(totals.variance)}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 space-y-1 border-t border-[#111814]/10 pt-4 text-[12px] leading-5 text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
              <p>
                Progress and variance compare what you've invested with your targets for years up to {thisYear}.
                Your entries aren't saved when you leave the page, so note them down or keep a copy.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <CalcSection title="What is a retirement investment tracker?">
              <p>
                A Retirement Investment Tracker helps you monitor your progress toward your retirement goals. By
                setting annual investment targets and tracking your actual contributions, you can ensure you're on
                track to build a sufficient retirement corpus. The annual increase feature helps you account for
                inflation and income growth over time.
              </p>
            </CalcSection>

            <CalcSection title="How to use this tracker">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Set your desired annual increase in investment (to account for inflation and income growth).</li>
                <li>Enter your investment target for each year (the amount you plan to invest).</li>
                <li>Enter your actual investment amount for each year as you make contributions.</li>
                <li>Add more rows as needed to track investments over multiple years.</li>
                <li>Monitor your progress through the summary cards showing total target, actual, and progress percentage.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Setting your first target">
              <p>
                Start from the monthly amount your retirement plan needs. The{" "}
                <Link to="/retirement-calculator" className={calcLinkClass}>
                  Retirement Calculator
                </Link>{" "}
                shows what a monthly amount grows to, and the{" "}
                <Link to="/goal-planner" className={calcLinkClass}>
                  Retirement Corpus Planner
                </Link>{" "}
                works out the monthly SIP needed to close your gap. Multiply that by twelve for the first year's
                target, then set the annual increase to roughly how fast you expect your income to grow.
              </p>
            </CalcSection>

            <CalcSection title="Why the annual increase matters">
              <p>
                Raising your investment a little each year makes a big difference over a career. Starting at{" "}
                {fmt(firstYearTarget)} a year, invested monthly at {equityReturn}% for 20 years:
              </p>
              <CalcTable
                caption={`20 years from a first-year target of ${fmt(firstYearTarget)}`}
                columns={["Yearly increase", "Total invested", "Value after 20 years"]}
                rows={stepUpRows}
              />
              <p>
                The{" "}
                <Link to="/step-up-sip-calculator" className={calcLinkClass}>
                  Step-Up SIP Calculator
                </Link>{" "}
                runs the same comparison for any amount and period.
              </p>
            </CalcSection>

            <CalcSection title="If you fall behind">
              <p>
                Look at the <strong className={calcStrongClass}>variance</strong> as well as the progress percentage: it
                tells you the amount you're short. Small gaps close quickly by investing a bonus or raising your
                monthly SIP a little. If you're behind several years running, revisit the plan itself: a later
                retirement age, lower planned spending or a higher annual increase can each bring it back on track.
                Don't try to catch up by moving into riskier investments than you're comfortable holding.
              </p>
            </CalcSection>

            <CalcSection title="Why track retirement investments?">
              <CalcBenefitGrid
                items={[
                  { title: "Goal clarity", text: "Tracking your investments year by year gives you a clear picture of whether you're on track to meet your retirement goals." },
                  { title: "Disciplined saving", text: "Regular tracking encourages consistent saving and helps you identify gaps early so you can adjust your strategy." },
                  { title: "Inflation adjustment", text: "The annual increase feature helps you account for inflation, ensuring your investments keep pace with rising costs." },
                  { title: "Motivation", text: "Seeing your progress visually can be motivating and encourage you to stay committed to your retirement plan." },
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
