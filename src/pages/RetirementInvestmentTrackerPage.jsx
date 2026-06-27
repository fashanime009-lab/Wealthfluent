import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";


export default function RetirementInvestmentTrackerPage() {
  // ─── State ──────────────────────────────────────────────────────
const [annualIncrease, setAnnualIncrease] = useState(10);
const [currency, setCurrency] = useState("$");
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
  const recalculateTargets = () => {
    const increaseFactor = 1 + annualIncrease / 100;
    let newRows = [...rows];
    for (let i = 1; i < newRows.length; i++) {
      const prevTarget = newRows[i - 1].target;
      newRows[i].target = Math.round(prevTarget * increaseFactor);
    }
    setRows(newRows);
  };

  // ─── Handle Annual Increase Change ──────────────────────────────
  const handleAnnualIncreaseChange = (e) => {
    const value = Number(e.target.value) || 0;
    setAnnualIncrease(value);
    // Recalculate targets after a short delay
    setTimeout(recalculateTargets, 100);
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
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ─── Get current year ──────────────────────────────────────────
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Retirement Investment Tracker – Plan & Track Retirement Savings</title>
        <meta
          name="description"
          content="Track your retirement investments year by year. Set annual increase targets and monitor your actual contributions."
        />
        <meta
          name="keywords"
          content="retirement tracker, investment tracker, retirement planning, goal tracking"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Retirement Planning Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Retirement Investment Tracker
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Use this sheet to track investments made for retirement. Set annual increase targets and monitor your progress.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <div className="mb-8">
  <label className="block text-sm font-medium text-slate-600 mb-2">
    Currency
  </label>

  <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
  >
    <option value="$">USD ($)</option>
    <option value="€">EUR (€)</option>
    <option value="£">GBP (£)</option>
    <option value="₹">INR (₹)</option>
    <option value="¥">JPY (¥)</option>
    <option value="A$">AUD (A$)</option>
    <option value="C$">CAD (C$)</option>
  </select>
</div>
            {/* Annual Increase Input */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  Annual increase in investment (%)
                </label>
                <div className="flex items-center gap-4 flex-1 max-w-xs">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={annualIncrease}
                    onChange={handleAnnualIncreaseChange}
                    className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-blue-600 min-w-[50px] text-right">
                    {annualIncrease}%
                  </span>
                </div>
                <button
                  onClick={recalculateTargets}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline"
                >
                  Recalculate Targets
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Enter the total investment made each year for this goal in the cells below.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600 w-[60px]">
                      S.No
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600 w-[120px]">
                      Year
                    </th>
                    <th className="text-right py-3 px-3 text-sm font-semibold text-slate-600">
                      Investment Target ({currency})
                    </th>
                    <th className="text-right py-3 px-3 text-sm font-semibold text-slate-600">
                      Actual ({currency})
                    </th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-slate-600 w-[50px]">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="py-2 px-3 text-sm text-slate-500 text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 text-sm font-medium text-slate-700">
                        {row.year}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={row.target || ""}
                          onChange={(e) => updateRow(row.id, "target", e.target.value)}
                          className="w-full max-w-[180px] ml-auto block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={row.actual || ""}
                          onChange={(e) => updateRow(row.id, "actual", e.target.value)}
                          className="w-full max-w-[180px] ml-auto block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          className={`text-slate-400 hover:text-red-500 transition ${
                            rows.length <= 1 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                          disabled={rows.length <= 1}
                          aria-label="Remove row"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td colSpan="2" className="py-3 px-3 text-sm font-bold text-slate-700">
                      Total
                    </td>
                    <td className="py-3 px-3 text-sm font-bold text-slate-700 text-right">
                      {currency}{formatCurrency(totals.totalTarget)}
                    </td>
                    <td className="py-3 px-3 text-sm font-bold text-slate-700 text-right">
                      {currency}{formatCurrency(totals.totalActual)}
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
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500">Total Target</p>
                <p className="text-xl font-bold text-slate-800">{currency}{formatCurrency(totals.totalTarget)}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500">Total Actual</p>
                <p className="text-xl font-bold text-blue-600">{currency}{formatCurrency(totals.totalActual)}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500">Progress</p>
                <p className="text-xl font-bold text-emerald-600">{totals.progress.toFixed(1)}%</p>
                <div className="mt-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totals.progress}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500">Variance</p>
                <p className={`text-xl font-bold ${totals.variance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {totals.variance >= 0 ? '+' : ''}
{currency}
{formatCurrency(totals.variance)}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
              <p>
                <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
              </p>
              <p>
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Retirement Investment Tracker?</h2>
              <p className="text-slate-500 leading-relaxed">
                A Retirement Investment Tracker helps you monitor your progress toward your retirement goals.
                By setting annual investment targets and tracking your actual contributions, you can ensure
                you're on track to build a sufficient retirement corpus. The annual increase feature helps
                you account for inflation and income growth over time.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Tracker</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Set your desired annual increase in investment (to account for inflation and income growth).</li>
                <li>Enter your investment target for each year (the amount you plan to invest).</li>
                <li>Enter your actual investment amount for each year as you make contributions.</li>
                <li>Add more rows as needed to track investments over multiple years.</li>
                <li>Monitor your progress through the summary cards showing total target, actual, and progress percentage.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Track Retirement Investments?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Goal Clarity</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Tracking your investments year by year gives you a clear picture of whether you're on track to meet your retirement goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Disciplined Saving</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Regular tracking encourages consistent saving and helps you identify gaps early so you can adjust your strategy.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Inflation Adjustment</h3>
                  <p className="text-slate-500 leading-relaxed">
                    The annual increase feature helps you account for inflation, ensuring your investments keep pace with rising costs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Motivation</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Seeing your progress visually can be motivating and encourage you to stay committed to your retirement plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How do I determine my annual increase percentage?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    A good starting point is to match the average inflation rate (the average inflation rate in your country) plus your expected income growth. Many investors use 10% as a reasonable target for annual increase in retirement investments.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What should I include in my retirement investments?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Include all investments earmarked for retirement, such as mutual funds (SIPs), retirement accounts, mutual funds, stocks, bonds, ETFs, and other long-term investments, stocks, bonds, and any other long-term savings vehicles.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How often should I update my tracker?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    It's recommended to update your tracker at least annually, or whenever you make a significant contribution to your retirement investments. Regular updates help you stay on top of your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

       
      </div>
    </>
  );
}