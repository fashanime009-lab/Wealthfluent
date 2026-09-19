import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";


export default function GoalPlannerPage() {
  const { settings } = useSettings();

const currency = settings.currency;
  // ─── State for all input fields ──────────────────────────────────

  const [inputs, setInputs] = useState({
    // Expenses
    monthlyExpenses: 25000,
    annualExpenses: 25000,
    // Inflation & Age
    inflationBeforeRetirement: 8,
    currentAge: 35,
    retirementAge: 60,
    lifeExpectancy: 80,
    inflationDuringRetirement: 8,
    // Returns
    postTaxReturnCorpus: 8,
    postTaxReturnEquity: 14,
    postTaxReturnTaxableFixed: 6,
    postTaxReturnTaxFreeFixed: 8,
    // Current Investments
    currentEquityInvestments: 100000,
    currentTaxableFixedIncome: 300000,
    currentTaxFreeFixedIncome: 300000,
    lumpSumBenefitsAtRetirement: 500000,
    // EPF / NPS
    monthlyEPFContribution: 8000,
    annualEPFIncrease: 5,
    epfReturnRate: 8,
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };
  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
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

    // Step 13: Post-tax return (used for current and future investments)
    // Weighted average return based on allocation
    // Assume equity: 50%, taxable fixed: 30%, tax-free fixed: 20%
    const weightedReturn =
      (postTaxReturnEquity * 0.5) +
      (postTaxReturnTaxableFixed * 0.3) +
      (postTaxReturnTaxFreeFixed * 0.2);

    // Future value of current investments
    const fvCurrentEquity =
      currentEquityInvestments * Math.pow(1 + postTaxReturnEquity / 100, yearsToRetirement);
    const fvCurrentTaxableFixed =
      currentTaxableFixedIncome * Math.pow(1 + postTaxReturnTaxableFixed / 100, yearsToRetirement);
    const fvCurrentTaxFreeFixed =
      currentTaxFreeFixedIncome * Math.pow(1 + postTaxReturnTaxFreeFixed / 100, yearsToRetirement);

    const fvCurrentInvestments =
      fvCurrentEquity + fvCurrentTaxableFixed + fvCurrentTaxFreeFixed;

    // Future value of lump sum benefits
    const fvLumpSumBenefits =
      lumpSumBenefitsAtRetirement * Math.pow(1 + weightedReturn / 100, yearsToRetirement);

    // Future value of EPF contributions (growing annuity)
    let fvEPF = 0;
    const monthlyEPFReturn = epfReturnRate / 100 / 12;
    const monthlyEPFIncrease = annualEPFIncrease / 100 / 12;

    if (monthlyEPFReturn > 0 && yearsToRetirement > 0) {
      const totalMonths = yearsToRetirement * 12;
      let currentContribution = monthlyEPFContribution;
      for (let i = 0; i < totalMonths; i++) {
        fvEPF = (fvEPF + currentContribution) * (1 + monthlyEPFReturn);
        currentContribution *= (1 + monthlyEPFIncrease);
      }
    }

    // Total accumulated corpus at retirement
    const totalAccumulated = fvCurrentInvestments + fvLumpSumBenefits + fvEPF;

    // Net corpus to be accumulated (if shortfall)
    const netCorpusToAccumulate = Math.max(0, totalCorpusRequired - totalAccumulated);

    return {
      totalMonthlyExpenses: Math.round(totalMonthlyExpenses),
      yearsToRetirement,
      monthlyExpensesFirstRetirement: Math.round(monthlyExpensesFirstRetirement),
      yearsInRetirement,
      totalCorpusRequired: Math.round(totalCorpusRequired),
      weightedReturn: weightedReturn.toFixed(2),
      fvCurrentInvestments: Math.round(fvCurrentInvestments),
      fvLumpSumBenefits: Math.round(fvLumpSumBenefits),
      fvEPF: Math.round(fvEPF),
      totalAccumulated: Math.round(totalAccumulated),
      netCorpusToAccumulate: Math.round(netCorpusToAccumulate),
    };
  }, [inputs]);

  const fmt = (v) => formatCurrency(v, currency);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      <Seo
        title="Financial Goal Planner – Retirement Planning Tool"
        description="Plan your retirement with our Financial Goal Planner. Calculate required corpus with variable asset allocation and inflation-adjusted expenses."
        path="/goal-planner"
        keywords="goal planner, retirement planning, corpus calculator, financial planning, asset allocation"
        jsonLd={calculatorSchema({
          name: "Financial Goal Planner",
          description: "Plan your retirement with our Financial Goal Planner. Calculate required corpus with variable asset allocation and inflation-adjusted expenses.",
          path: "/goal-planner",
        })}
      />
      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Wealth & Goals"
            title="Financial Goal Planner"
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
                    <CalcField label={`Annual Expenses (${currency})`} value={inputs.annualExpenses} onChange={(v) => handleChange("annualExpenses", v)} min={0} max={6000000} step={1000} format={fmt} />
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
                    <CalcField label={`Retirement Benefits (${currency})`} value={inputs.lumpSumBenefitsAtRetirement} onChange={(v) => handleChange("lumpSumBenefitsAtRetirement", v)} min={0} max={10000000} step={5000} format={fmt} />
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
                  {results.netCorpusToAccumulate === 0 && (
                    <p className="mt-1 text-[13px] text-[#047857] dark:text-[#34d399]">✓ You're on track!</p>
                  )}
                </div>

                {/* Detailed breakdown */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Retirement Summary</h3>
                  <div className="mt-3 divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                    <CalcStat label="Years to Retirement" value={`${results.yearsToRetirement} years`} />
                    <CalcStat label="Years in Retirement" value={`${results.yearsInRetirement} years`} />
                    <CalcStat label="Monthly Expenses in First Year of Retirement" value={fmt(results.monthlyExpensesFirstRetirement)} />
                    <CalcStat label="Weighted Average Return" value={`${results.weightedReturn}%`} />
                  </div>
                </div>

                {/* Accumulated Corpus Breakdown */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Accumulated Corpus at Retirement</h3>
                  <div className="mt-3 divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                    <CalcStat label="Current Investments (FV)" value={fmt(results.fvCurrentInvestments)} tone="signal" />
                    <CalcStat label="Lump Sum Benefits (FV)" value={fmt(results.fvLumpSumBenefits)} />
                    <CalcStat label="Retirement Contributions (FV)" value={fmt(results.fvEPF)} />
                    <CalcStat label="Total Accumulated" value={fmt(results.totalAccumulated)} tone="signal" />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-6 text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <CalcSection title="What Is Financial Goal Planning?">
              <p>
                Financial goal planning helps you determine how much you need to save and invest to achieve
                your life goals — like a comfortable retirement. This calculator factors in your current expenses,
                inflation, expected returns, and existing investments to estimate the corpus required and the
                additional savings needed.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your current monthly and annual expenses.</li>
                <li>Set your retirement age, current age, and life expectancy.</li>
                <li>Provide expected inflation rates and post-tax returns for different asset classes.</li>
                <li>Add your current investments and retirement contributions.</li>
                <li>The calculator will show your required corpus and how much more you need to save.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Key Assumptions">
              <ul className="list-disc space-y-2 pl-5">
                <li>Expenses grow with inflation until retirement.</li>
                <li>During retirement, expenses grow with retirement inflation.</li>
                <li>Asset allocation: 50% equity, 30% taxable fixed, 20% tax-free fixed (adjustable).</li>
                <li>Retirement contributions grow annually at the specified rate.</li>
              </ul>
            </CalcSection>
          </div>
        </div>
      </div>
    </>
  );
}
