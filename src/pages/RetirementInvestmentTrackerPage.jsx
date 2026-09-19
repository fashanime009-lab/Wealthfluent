import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { currencies } from "../data/currencies";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How do I determine my annual increase percentage?", a: "A good starting point is to match the average inflation rate (the average inflation rate in your country) plus your expected income growth. Many investors use 10% as a reasonable target for annual increase in retirement investments." },
  { q: "What should I include in my retirement investments?", a: "Include all investments earmarked for retirement, such as mutual funds (SIPs), retirement accounts, mutual funds, stocks, bonds, ETFs, and other long-term investments, stocks, bonds, and any other long-term savings vehicles." },
  { q: "How often should I update my tracker?", a: "It's recommended to update your tracker at least annually, or whenever you make a significant contribution to your retirement investments. Regular updates help you stay on top of your progress." },
];

export default function RetirementInvestmentTrackerPage() {
  // ─── State ──────────────────────────────────────────────────────
const [annualIncrease, setAnnualIncrease] = useState(10);
const { settings } = useSettings();
// Symbol only, for the column headers; amounts go through the shared formatter.
const currency = (currencies.find((c) => c.code === settings.currency) || currencies[0]).symbol;
  const [rows, setRows] = useState([
    { id: 1, year: new Date().getFullYear(), target: 0, actual: 0 },
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
  const totals = useMemo(() => {
    let totalTarget = 0;
    let totalActual = 0;
    let rowsWithData = 0;

    rows.forEach((row) => {
      totalTarget += row.target || 0;
      totalActual += row.actual || 0;
      if (row.actual > 0 || row.target > 0) rowsWithData++;
    });

    const progress = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

    return {
      totalTarget,
      totalActual,
      rowsWithData,
      progress: Math.min(progress, 100),
      variance: totalActual - totalTarget,
    };
  }, [rows]);

  // ─── Format currency ──────────────────────────────────────────
  // Shared, currency-aware formatter (lakh/crore grouping for INR).
  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="Retirement Investment Tracker – Plan & Track Retirement Savings"
        description="Track your retirement investments year by year. Set annual increase targets and monitor your actual contributions."
        path="/retirement-investment-tracker"
        keywords="retirement tracker, investment tracker, retirement planning, goal tracking"
        jsonLd={[
        calculatorSchema({
          name: "Retirement Investment Tracker",
          description: "Track your retirement investments year by year. Set annual increase targets and monitor your actual contributions.",
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
                <label className="whitespace-nowrap text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
                  Annual increase in investment
                </label>
                <div className="flex max-w-xs flex-1 items-center gap-4">
                  <input
                    type="range"
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
              <p className="mt-2 text-[12.5px] text-[#111814]/45 dark:text-[#eef1ec]/45">
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
                          value={row.actual || ""}
                          onChange={(e) => updateRow(row.id, "actual", e.target.value)}
                          className="ml-auto block w-full max-w-[180px] border border-[#111814]/15 bg-transparent px-3 py-1.5 text-right font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          className={`text-[#111814]/40 transition hover:text-red-500 dark:text-[#eef1ec]/40 ${
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
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total target</p>
                <p className="font-mono-tech mt-1 text-[19px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                  {fmt(totals.totalTarget)}
                </p>
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
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Variance</p>
                <p className={`font-mono-tech mt-1 text-[19px] font-medium tabular-nums ${totals.variance >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                  {totals.variance >= 0 ? "+" : ""}
                  {fmt(totals.variance)}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 space-y-1 border-t border-[#111814]/10 pt-4 text-[12px] leading-5 text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
              <p>
                Please note that these calculators are for illustrations only and do not represent actual returns.
              </p>
              <p>
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
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

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
