import { useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";
import { useSettings } from "../context/SettingsContext";
import { useDefaultableObjectCustom, useFieldBounds } from "@/hooks/useDefaultableField";
import { defaultFor } from "@/data/calculatorDefaults";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What's a good wealth age?", a: "Anything below your real age means your current habits are outpacing what your age alone would predict. There's no universal target — the number is most useful tracked over time against your own past results." },
  { q: "Why did my wealth age go up instead of down?", a: "Usually a savings rate under 20% and/or a negative or low net worth (debt exceeding investments). Increasing monthly savings or paying down high-interest debt are the two most direct levers to bring it back down." },
  { q: "Is this the same as a real financial planning tool?", a: "No — treat it as a quick gut-check, not a substitute for a full financial plan. For actual retirement projections, use the Retirement or FIRE calculators, which model your specific numbers rather than producing a single comparative score." },
];

export default function WealthAgeCalculatorPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // Bounds are per-currency hand-picked values (calculatorFieldBounds.js),
  // same as the DEFAULTS they contain — never FX-converted. A slider range
  // is a property of the currency's own scale, same reasoning as the
  // hand-picked JPY defaults elsewhere.
  const ageBounds = useFieldBounds("wealthAge", "age");
  const monthlyIncomeBounds = useFieldBounds("wealthAge", "monthlyIncome");
  const monthlySavingsBounds = useFieldBounds("wealthAge", "monthlySavings");
  const investmentsBounds = useFieldBounds("wealthAge", "investments");
  const debtBounds = useFieldBounds("wealthAge", "debt");
  const monthlyExpensesBounds = useFieldBounds("wealthAge", "monthlyExpenses");

  const FIELDS = [
    { name: "age", label: "Current Age", ...ageBounds, isAge: true },
    { name: "monthlyIncome", label: "Monthly Income", ...monthlyIncomeBounds },
    { name: "monthlySavings", label: "Monthly Savings", ...monthlySavingsBounds },
    { name: "investments", label: "Investments", ...investmentsBounds },
    { name: "debt", label: "Debt", ...debtBounds },
    { name: "monthlyExpenses", label: "Monthly Expenses", ...monthlyExpensesBounds },
  ];

  // Default starting values are hand-picked per currency (see
  // calculatorDefaults.js), not FX-converted like the slider bounds above —
  // a converted "typical income" reads as unrealistic for a market like
  // Japan, where nominal figures don't scale with the exchange rate.
  const [formData, setFormData] = useDefaultableObjectCustom((curr) => ({
    age: defaultFor("wealthAge", "age", curr),
    monthlyIncome: defaultFor("wealthAge", "monthlyIncome", curr),
    monthlySavings: defaultFor("wealthAge", "monthlySavings", curr),
    investments: defaultFor("wealthAge", "investments", curr),
    debt: defaultFor("wealthAge", "debt", curr),
    monthlyExpenses: defaultFor("wealthAge", "monthlyExpenses", curr),
  }));

  const handleChange = (name, rawValue, fallback) => {
    const value = Number(rawValue);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(value) ? fallback : value,
    }));
  };

  const results = useMemo(() => {
    const savingsRate =
      formData.monthlyIncome > 0
        ? (formData.monthlySavings / formData.monthlyIncome) * 100
        : 0;

    const netWorth = formData.investments - formData.debt;
    const annualIncome = formData.monthlyIncome * 12;
    const annualExpenses = formData.monthlyExpenses * 12;
    // Falls back to annual expenses when there's no income to measure
    // against — a retiree drawing down savings has 0 income but a very
    // real annual spend, and "net worth covers a year of spending" is
    // still a meaningful yardstick in that case.
    const annualBasis = annualIncome > 0 ? annualIncome : annualExpenses;

    let wealthAge = formData.age;

    if (savingsRate >= 40) wealthAge -= 8;
    else if (savingsRate >= 30) wealthAge -= 5;
    else if (savingsRate >= 20) wealthAge -= 2;
    else wealthAge += 3;

    // Net-worth bonus: net worth at least 1x the annual basis above.
    // Guarded against a 0 basis — without it, any non-negative net worth
    // would trivially clear a threshold of 0, which isn't a meaningful
    // "ahead" signal.
    if (annualBasis > 0 && netWorth >= annualBasis) wealthAge -= 5;
    if (netWorth < 0) wealthAge += 5;

    wealthAge = Math.max(1, wealthAge);

    // Wealth score's net-worth term: net worth as a share of the annual
    // basis, capped at +20 so it can't dominate the score on its own. With
    // both income and expenses at 0 there's nothing to measure net worth
    // against, so the term is skipped entirely (not treated as 0 or
    // Infinity) and a short note explains why.
    let incomeRelativeNote = null;
    let netWorthScoreTerm;
    if (annualBasis > 0) {
      netWorthScoreTerm = Math.min(20, (netWorth / annualBasis) * 20);
    } else {
      netWorthScoreTerm = 0;
      incomeRelativeNote = "Enter your monthly income or expenses to include net worth in your wealth score.";
    }

    const wealthScore = Math.max(1, Math.min(100, Math.round(savingsRate + netWorthScoreTerm)));

    let personality;
    if (wealthScore >= 80) personality = "Wealth Accelerator";
    else if (wealthScore >= 60) personality = "Growth Builder";
    else if (wealthScore >= 40) personality = "Smart Saver";
    else personality = "Financial Explorer";

    let status = "Average";
    if (wealthAge < formData.age) status = "Ahead For Your Age";
    if (wealthAge > formData.age) status = "Needs Improvement";

    return { savingsRate, netWorth, wealthAge, wealthScore, personality, status, incomeRelativeNote };
  }, [formData]);

  return (
    <>
      <Seo
        title="Wealth Age Calculator – Compare Your Financial Age to Your Real Age"
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

          {/* Calculator Grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              {FIELDS.map((field) => (
                <CalcField
                  key={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={(v) => handleChange(field.name, v, field.min)}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  suffix={field.isAge ? " yrs" : undefined}
                  format={field.isAge ? undefined : fmt}
                />
              ))}

              {/* Disclaimer */}
              <div className="space-y-1 border-t border-[#111814]/10 pt-6 text-[12px] leading-5 text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
                <p>
                  <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                  This is a motivational comparison tool, not a precise actuarial or
                  financial planning measure.
                </p>
                <p>
                  Your actual financial standing depends on many factors this
                  simplified score doesn't capture.
                </p>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="flex flex-col gap-6">
              {/* Top stat cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#111814]/12 bg-[#ffffff] p-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Financial Age</p>
                  <p className="font-mono-tech mt-1 text-[28px] font-bold tabular-nums text-[#047857] dark:text-[#34d399]">
                    {results.wealthAge}
                  </p>
                </div>
                <div className="border border-[#111814]/12 bg-[#ffffff] p-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Wealth Score</p>
                  <p className="font-mono-tech mt-1 text-[28px] font-bold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {results.wealthScore}
                  </p>
                </div>
                <div className="border border-[#111814]/12 bg-[#ffffff] p-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Savings Rate</p>
                  <p className="font-mono-tech mt-1 text-[28px] font-bold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {Math.round(results.savingsRate)}%
                  </p>
                </div>
                <div className="border border-[#111814]/12 bg-[#ffffff] p-5 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                  <p className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">Net Worth</p>
                  <p className="font-mono-tech mt-1 break-words text-[20px] font-bold tabular-nums text-[#111814] dark:text-[#eef1ec]">
                    {fmt(results.netWorth)}
                  </p>
                </div>
              </div>

              {results.incomeRelativeNote && (
                <p className="text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                  {results.incomeRelativeNote}
                </p>
              )}

              {/* Main insight card */}
              <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] md:p-8">
                <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[160px_1fr]">
                  <div className="flex justify-center">
                    <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full border-[8px] border-[#047857] bg-[#eef1ec] dark:border-[#34d399] dark:bg-[#0e1512]">
                      <div className="text-center">
                        <p className="text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/55">Wealth Score</p>
                        <p className="font-mono-tech mt-1 text-[34px] font-bold tabular-nums text-[#047857] dark:text-[#34d399]">
                          {results.wealthScore}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">
                      Financial Analysis
                    </p>
                    <h2 className="font-display mt-2 text-[24px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[28px]">
                      {results.personality}
                    </h2>
                    <p className="mt-3 text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Your financial behavior suggests that you are currently{" "}
                      <strong className="text-[#111814] dark:text-[#eef1ec]">{results.status}</strong>.
                      Your savings habits, net worth, and investment growth indicate
                      your long-term wealth-building potential.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="border border-[#047857]/25 px-3 py-1.5 font-mono-tech text-[13px] font-semibold tabular-nums text-[#047857] dark:border-[#34d399]/25 dark:text-[#34d399]">
                        Savings Rate: {Math.round(results.savingsRate)}%
                      </span>
                      <span className="border border-[#111814]/15 px-3 py-1.5 font-mono-tech text-[13px] font-semibold tabular-nums text-[#111814]/70 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/70">
                        Net Worth: {formatCurrency(results.netWorth, currency, true)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight cards */}
              <CalcBenefitGrid
                items={[
                  { title: "Wealth Optimization", text: "Increasing your monthly savings rate can significantly reduce your financial age and accelerate your path toward financial freedom." },
                  { title: "Recommendation", text: "Focus on growing investments while reducing high-interest debt to improve your overall wealth score over time." },
                  { title: "Financial Discipline", text: "Consistent investing and controlled spending habits are what currently support your long-term wealth creation journey." },
                  { title: "Future Potential", text: "Your current financial pattern suggests strong future compounding opportunities if maintained consistently." },
                ]}
              />
            </div>
          </div>

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
