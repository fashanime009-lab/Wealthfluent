import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { calculateHomeAffordability } from "../services/calculators/homeAffordability";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What EMI-to-income ratio is considered safe?", a: "Most lenders and financial planners treat 30-40% of monthly income as the safe upper limit for a home loan EMI. Above 40%, less is left over for other goals and emergencies; above 50%, a single income disruption can put the loan at risk." },
  { q: "Why does this ask for my other expenses and existing EMIs?", a: "A property can look affordable purely on income, but if you're already paying off a car loan or have high monthly expenses, the cash actually available for a new EMI is much smaller. Lenders check this too — it's the debt-to-income ratio, not just income, that decides how much you can realistically borrow." },
  { q: "Should I stretch my budget to buy a more expensive home?", a: "Generally no. A home loan is typically the largest, longest debt most people take on — buying at the edge of what you can afford leaves no room for a job change, medical expense, or rate increase (most home loans in India are floating rate) without real financial stress." },
];

export default function HomeAffordabilityCalculatorPage() {
  const { settings } = useSettings();

  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // ─── State ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useState({
    propertyPrice: 6000000,
    downPayment: 1200000,
    monthlyIncome: 100000,
    monthlyExpenses: 30000,
    existingEMI: 0,
    loanTenure: 20,
    interestRate: 8.5,
  });

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => calculateHomeAffordability(inputs), [inputs]);

  const toneByRecommendation = {
    Excellent: "signal",
    Good: "signal",
    Caution: "amber",
    "High Risk": "red",
  };
  const tone = toneByRecommendation[results.recommendation] ?? "amber";

  return (
    <>
      <Seo
        title="Home Affordability Calculator – FINAIW"
        description="Check whether a home is actually affordable for your income — estimated EMI, EMI-to-income ratio, and debt-to-income ratio, before you commit to a property."
        path="/home-affordability-calculator"
        keywords="home affordability calculator, how much home can I afford, EMI to income ratio, debt to income ratio, home loan eligibility"
        jsonLd={[
          calculatorSchema({
            name: "Home Affordability Calculator",
            description: "Check whether a home is actually affordable for your income — estimated EMI, EMI-to-income ratio, and debt-to-income ratio, before you commit to a property.",
            path: "/home-affordability-calculator",
          }),
          faqSchema([
            {
              question: "What EMI-to-income ratio is considered safe?",
              answer: "Most lenders and financial planners treat 30-40% of monthly income as the safe upper limit for a home loan EMI. Above 40%, less is left over for other goals and emergencies; above 50%, a single income disruption can put the loan at risk.",
            },
            {
              question: "Why does this ask for my other expenses and existing EMIs?",
              answer: "A property can look affordable purely on income, but if you're already paying off a car loan or have high monthly expenses, the cash actually available for a new EMI is much smaller. Lenders check this too — it's the debt-to-income ratio, not just income, that decides how much you can realistically borrow.",
            },
            {
              question: "Should I stretch my budget to buy a more expensive home?",
              answer: "Generally no. A home loan is typically the largest, longest debt most people take on — buying at the edge of what you can afford leaves no room for a job change, medical expense, or rate increase (most home loans in India are floating rate) without real financial stress.",
            },
          ]),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Home Affordability Calculator"
            description="Before you commit to a property, check whether it actually fits your income — not just whether a lender will approve the loan."
          />

          {/* Main Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Inputs */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField
                label="Property Price"
                value={inputs.propertyPrice}
                onChange={(v) => handleChange("propertyPrice", v)}
                min={500000}
                max={30000000}
                step={100000}
                format={fmt}
              />
              <CalcField
                label="Down Payment"
                value={inputs.downPayment}
                onChange={(v) => handleChange("downPayment", v)}
                min={0}
                max={inputs.propertyPrice}
                step={50000}
                format={fmt}
              />
              <CalcField
                label="Monthly Income (take-home)"
                value={inputs.monthlyIncome}
                onChange={(v) => handleChange("monthlyIncome", v)}
                min={10000}
                max={1000000}
                step={1000}
                format={fmt}
              />
              <div>
                <CalcField
                  label="Other Monthly Expenses"
                  value={inputs.monthlyExpenses}
                  onChange={(v) => handleChange("monthlyExpenses", v)}
                  min={0}
                  max={500000}
                  step={1000}
                  format={fmt}
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                  Living expenses only — rent, food, utilities. Don't include an existing EMI here; that's the next field.
                </p>
              </div>
              <CalcField
                label="Existing EMI (other loans)"
                value={inputs.existingEMI}
                onChange={(v) => handleChange("existingEMI", v)}
                min={0}
                max={200000}
                step={500}
                format={fmt}
              />
              <CalcField
                label="Loan Tenure"
                value={inputs.loanTenure}
                onChange={(v) => handleChange("loanTenure", v)}
                min={5}
                max={30}
                step={1}
                suffix=" yrs"
              />
              <CalcField
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => handleChange("interestRate", v)}
                min={6}
                max={15}
                step={0.1}
                suffix="%"
              />
            </div>

            {/* Right Panel – Results */}
            <div className="space-y-6">
              <CalcResultPanel
                label="Estimated Monthly EMI"
                value={fmt(results.estimatedEMI)}
                note={`On a ${fmt(results.loanAmount)} loan over ${inputs.loanTenure} years at ${inputs.interestRate}%`}
              />

              {/* Affordability Status */}
              <div
                className={`border p-6 dark:bg-[#0e1512] ${
                  tone === "signal"
                    ? "border-[#047857]/25 bg-[#047857]/[0.06] dark:border-[#34d399]/20"
                    : tone === "amber"
                      ? "border-amber-500/25 bg-amber-500/[0.06] dark:border-amber-400/20"
                      : "border-red-500/25 bg-red-500/[0.06] dark:border-red-400/20"
                }`}
              >
                <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Affordability</p>
                <p
                  className={`mt-1 text-[22px] font-bold ${
                    tone === "signal"
                      ? "text-[#047857] dark:text-[#34d399]"
                      : tone === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {results.recommendation}
                </p>
                <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                  This EMI would be{" "}
                  <strong className="text-[#111814] dark:text-[#eef1ec]">{results.emiRatio.toFixed(1)}%</strong> of your
                  monthly income.
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Loan Amount" value={fmt(results.loanAmount)} />
                <CalcStat label="Estimated EMI" value={fmt(results.estimatedEMI)} tone="signal" />
                <CalcStat label="EMI-to-Income Ratio" value={`${results.emiRatio.toFixed(1)}%`} />
                <CalcStat label="Debt-to-Income Ratio" value={`${results.debtToIncomeRatio.toFixed(1)}%`} />
                <CalcStat label="Available Cash Flow (before new EMI)" value={fmt(results.availableCashFlow)} />
                <CalcStat label="Cash Flow After New EMI" value={fmt(results.monthlyCashAfterEMI)} />
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This calculator gives an illustrative estimate only. Actual loan eligibility depends on the lender's own
                income, credit score, and policy checks.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="homeaffordability_calc_mid" />

            <CalcSection title="What Does 'Affordable' Actually Mean Here?">
              <p>
                This calculator checks a property price against your real monthly cash flow — not just whether a bank
                would approve the loan. It estimates the EMI for the property, then measures that EMI against your
                income and existing obligations using two ratios lenders themselves rely on: EMI-to-income and
                debt-to-income.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter the property price you're considering, and how much you'll pay as a down payment.</li>
                <li>Enter your monthly take-home income, other living expenses, and any existing EMI.</li>
                <li>Set the loan tenure and the interest rate you expect to be offered.</li>
                <li>Check the affordability status — Excellent, Good, Caution, or High Risk — and the ratios behind it.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Why the Ratios Matter More Than the EMI Alone">
              <CalcBenefitGrid
                items={[
                  { title: "EMI-to-Income Ratio", text: "The share of your monthly income the new EMI alone would take. Most lenders and planners treat 30-40% as the safe ceiling — beyond that, less is left for everything else in your life." },
                  { title: "Debt-to-Income Ratio", text: "The share of income going toward ALL debt — the new EMI plus any existing loans. Two people with the same income but different existing debt can have very different real affordability, even for the same property." },
                  { title: "Cash Flow After EMI", text: "What's left every month once the EMI, other expenses, and existing debt are paid. This is the number that determines whether you can still save, invest, and handle a surprise expense." },
                  { title: "A Second Opinion Before You Commit", text: "A lender approving your loan confirms you can legally borrow the amount — not that it's a comfortable fit for your actual monthly life. Those are two different questions." },
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
