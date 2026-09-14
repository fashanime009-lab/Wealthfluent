import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How many months of expenses should I save?", a: "3 months is a common starting point for stable, dual-income households; 6–9 months is safer for freelancers, single-income households, or anyone with variable income." },
  { q: "Where should I keep my emergency fund?", a: "Somewhere accessible within a day or two without penalty or market risk — a high-yield savings account or a liquid mutual fund, not equity and not a long-tenure fixed deposit." },
  { q: "Should I invest my emergency fund for better returns?", a: "No — the purpose of this money is reliability, not growth. Investing it defeats the point: if a downturn coincides with your emergency (a common pattern, since layoffs often spike during downturns), you'd be forced to sell at a loss." },
];

export default function EmergencyFundCalculatorPage() {
  const { settings } = useSettings();

  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // ─── State ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useState({
    monthlyExpenses: 30000,
    recommendedMonths: 6,
    currentSavings: 100000,
    additionalIncome: 0,
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const { monthlyExpenses, recommendedMonths, currentSavings, additionalIncome } = inputs;

    const target = monthlyExpenses * recommendedMonths;
    const netSavings = currentSavings + additionalIncome;
    const shortfall = Math.max(0, target - netSavings);
    const monthsCovered = netSavings > 0 ? netSavings / monthlyExpenses : 0;

    return {
      target: Math.round(target),
      netSavings: Math.round(netSavings),
      shortfall: Math.round(shortfall),
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      isFullyFunded: netSavings >= target,
    };
  }, [inputs]);

  return (
    <>
      <Seo
        title="Emergency Fund Calculator – FINAIW"
        description="Calculate how much you need in your emergency fund based on your monthly expenses and savings. Plan for financial security."
        path="/emergency-fund-calculator"
        keywords="emergency fund calculator, rainy day fund, savings goal, financial security"
        jsonLd={[
        calculatorSchema({
          name: "Emergency Fund Calculator",
          description: "Calculate how much you need in your emergency fund based on your monthly expenses and savings. Plan for financial security.",
          path: "/emergency-fund-calculator",
        }),
        faqSchema([
          {
            "question": "How many months of expenses should I save?",
            "answer": "3 months is a common starting point for stable, dual-income households; 6–9 months is safer for freelancers, single-income households, or anyone with variable income."
          },
          {
            "question": "Where should I keep my emergency fund?",
            "answer": "Somewhere accessible within a day or two without penalty or market risk — a high-yield savings account or a liquid mutual fund, not equity and not a long-tenure fixed deposit."
          },
          {
            "question": "Should I invest my emergency fund for better returns?",
            "answer": "No — the purpose of this money is reliability, not growth. Investing it defeats the point: if a downturn coincides with your emergency (a common pattern, since layoffs often spike during downturns), you'd be forced to sell at a loss."
          }
        ]),
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
                min={1000}
                max={500000}
                step={1000}
                format={fmt}
              />

              <div>
                <CalcField
                  label="Months of Expenses to Cover"
                  value={inputs.recommendedMonths}
                  onChange={(v) => handleChange("recommendedMonths", v)}
                  min={1}
                  max={24}
                  step={1}
                  suffix=" months"
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                  Financial experts recommend 3–6 months of expenses for most people, or up to 12 months for higher-risk situations.
                </p>
              </div>

              <CalcField
                label="Current Savings"
                value={inputs.currentSavings}
                onChange={(v) => handleChange("currentSavings", v)}
                min={0}
                max={5000000}
                step={1000}
                format={fmt}
              />

              <div>
                <CalcField
                  label="Additional Income Source"
                  value={inputs.additionalIncome}
                  onChange={(v) => handleChange("additionalIncome", v)}
                  min={0}
                  max={500000}
                  step={1000}
                  format={fmt}
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                  Optional: Include rental income, freelance earnings, or any additional monthly income.
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
                    <p className="mt-1 text-[22px] font-bold text-amber-600 dark:text-amber-400">Need to Save More</p>
                    <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Your savings cover <strong className="text-[#111814] dark:text-[#eef1ec]">{results.monthsCovered} months</strong> of expenses.
                    </p>
                    <p className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                      Shortfall: <span className="font-mono-tech font-bold tabular-nums text-amber-600 dark:text-amber-400">{fmt(results.shortfall)}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Monthly Expenses" value={fmt(inputs.monthlyExpenses)} />
                <CalcStat label="Months to Cover" value={`${inputs.recommendedMonths} months`} />
                <CalcStat label="Current Savings" value={fmt(inputs.currentSavings)} />
                <CalcStat label="Additional Income" value={fmt(inputs.additionalIncome)} />
                <CalcStat label="Total Available" value={fmt(results.netSavings)} tone="signal" />
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This calculator is for illustrative purposes only. Your actual emergency fund needs may vary based on your personal situation.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="emergencyfund_calc_mid" />

            <CalcSection title="What Is an Emergency Fund?">
              <p>
                An emergency fund is a dedicated savings account designed to cover unexpected expenses — such as medical bills, car repairs, or job loss. Financial experts recommend saving 3 to 6 months' worth of living expenses to protect against life's uncertainties.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your average monthly living expenses (rent, food, utilities, etc.).</li>
                <li>Select how many months you'd like to cover (usually 3–12).</li>
                <li>Add your current savings and any additional income sources.</li>
                <li>See your target emergency fund and whether you're on track.</li>
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

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
