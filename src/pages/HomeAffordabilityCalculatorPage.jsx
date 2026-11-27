import { useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { useDefaultableObject, useFieldBounds } from "@/hooks/useDefaultableField";
import { formatCurrency } from "../utils/currency";
import { calculateHomeAffordability } from "../services/calculators/homeAffordability";
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

const FAQ_ITEMS = [
  { q: "What EMI-to-income ratio is considered safe?", a: "Most lenders and financial planners treat 30-40% of monthly income as the safe upper limit for a home loan EMI. Above 40%, less is left over for other goals and emergencies; above 50%, a single income disruption can put the loan at risk." },
  { q: "Why does this ask for my other expenses and existing EMIs?", a: "A property can look affordable purely on income, but if you're already paying off a car loan or have high monthly expenses, the cash actually available for a new EMI is much smaller. Lenders check this too — it's the debt-to-income ratio, not just income, that decides how much you can realistically borrow." },
  { q: "Should I stretch my budget to buy a more expensive home?", a: "Generally no. A home loan is typically the largest, longest debt most people take on — buying at the edge of what you can afford leaves no room for a job change, medical expense, or rate increase (most home loans in India are floating rate) without real financial stress." },
  { q: "How much down payment do I need?", a: "In India, RBI rules cap a home loan at 90% of the property's value for loans up to ₹30 lakh, 80% up to ₹75 lakh and 75% above that, so you need at least 10–25% yourself, plus stamp duty and registration, which lenders don't finance. A bigger down payment means a smaller EMI and less interest over the loan." },
  { q: "Should I include my spouse's income?", a: "If you'll apply jointly and both incomes will go towards the EMI, yes, and include both partners' existing EMIs too. Check that the home is still affordable on one income for a few months, in case either of you takes a career break or loses a job." },
  { q: "What happens if interest rates rise?", a: "On a floating-rate loan, your lender either raises the EMI or extends the tenure. Run this calculator again at a rate one or two percentage points higher: if the cash left over each month turns negative or uncomfortably small, the home is at the edge of your budget." },
];

// Highest loan an EMI can support at a given rate and tenure.
function loanForEmi(emi, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (emi <= 0 || n <= 0) return 0;
  return r === 0 ? emi * n : (emi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

export default function HomeAffordabilityCalculatorPage() {
  const { settings } = useSettings();

  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // ─── State ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useDefaultableObject("homeAffordability", [
    "propertyPrice",
    "downPayment",
    "monthlyIncome",
    "monthlyExpenses",
    "existingEMI",
    "loanTenure",
    "interestRate",
  ]);

  // ─── Update handler ──────────────────────────────────────────────
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const propertyPriceBounds = useFieldBounds("homeAffordability", "propertyPrice");
  const downPaymentBounds = useFieldBounds("homeAffordability", "downPayment", { propertyPrice: inputs.propertyPrice });
  const monthlyIncomeBounds = useFieldBounds("homeAffordability", "monthlyIncome");
  const monthlyExpensesBounds = useFieldBounds("homeAffordability", "monthlyExpenses");
  const existingEMIBounds = useFieldBounds("homeAffordability", "existingEMI");
  const loanTenureBounds = useFieldBounds("homeAffordability", "loanTenure");
  const interestRateBounds = useFieldBounds("homeAffordability", "interestRate");

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => calculateHomeAffordability(inputs), [inputs]);

  const toneByRecommendation = {
    Excellent: "signal",
    Good: "signal",
    Caution: "amber",
    "High Risk": "red",
  };
  const tone = toneByRecommendation[results.recommendation] ?? "amber";

  // The most this income supports, for three shares of income going to all
  // EMIs (existing ones included), with the down payment entered above.
  const priceRows = [30, 35, 40].map((share) => {
    const maxEmi = (inputs.monthlyIncome * share) / 100 - inputs.existingEMI;
    const maxLoan = loanForEmi(maxEmi, inputs.interestRate, inputs.loanTenure);
    return [
      `${share}% of income`,
      maxEmi > 0 ? fmt(Math.round(maxEmi)) : "—",
      maxEmi > 0 ? fmt(Math.round(maxLoan)) : "—",
      maxEmi > 0 ? fmt(Math.round(maxLoan + inputs.downPayment)) : "—",
    ];
  });

  // Stress test: the same loan at a higher rate.
  const stressRows = [0, 1, 2].map((extra) => {
    const rate = inputs.interestRate + extra;
    const stressed = calculateHomeAffordability({ ...inputs, interestRate: rate });
    return [
      extra === 0 ? `${rate}% (as entered)` : `${rate}% (+${extra} point${extra > 1 ? "s" : ""})`,
      fmt(Math.round(stressed.estimatedEMI)),
      `${stressed.debtToIncomeRatio.toFixed(1)}%`,
      fmt(Math.round(stressed.monthlyCashAfterEMI)),
    ];
  });
  return (
    <>
      <Seo
        title="Home Affordability Calculator – Can You Afford It?"
        description="Check whether a home is actually affordable for your income — estimated EMI, EMI-to-income ratio, and debt-to-income ratio, before you commit to a property."
        path="/home-affordability-calculator"
        keywords="home affordability calculator, how much home can I afford, EMI to income ratio, debt to income ratio, home loan eligibility"
        jsonLd={[
          calculatorSchema({
            name: "Home Affordability Calculator",
            description: "Check whether a home is actually affordable for your income — estimated EMI, EMI-to-income ratio, and debt-to-income ratio, before you commit to a property.",
            path: "/home-affordability-calculator",
          }),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
          howToSchema({
            name: "How to Use the Home Affordability Calculator",
            description: "Check whether a home is actually affordable for your income, before you commit to a property.",
            steps: [
              { name: "Enter the property price", text: "Enter the price of the property you're considering in the Property Price field." },
              { name: "Enter your down payment", text: "Enter how much you'll pay upfront in the Down Payment field." },
              { name: "Enter your monthly income", text: "Enter your monthly take-home income in the Monthly Income field." },
              { name: "Enter your other monthly expenses", text: "Enter your regular living expenses in the Other Monthly Expenses field." },
              { name: "Enter any existing EMI", text: "Enter any EMI you're already paying on other loans in the Existing EMI field." },
              { name: "Enter the loan tenure", text: "Enter the loan repayment period in years in the Loan Tenure field." },
              { name: "Enter the interest rate", text: "Enter the expected annual interest rate as a percentage in the Interest Rate field." },
              { name: "View your result instantly", text: "The calculator instantly shows your estimated EMI, affordability status, and EMI-to-income and debt-to-income ratios." },
            ],
          }),
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
                {...propertyPriceBounds}
                format={fmt}
              />
              <CalcField
                label="Down Payment"
                value={inputs.downPayment}
                onChange={(v) => handleChange("downPayment", v)}
                {...downPaymentBounds}
                format={fmt}
              />
              <CalcField
                label="Monthly Income (take-home)"
                value={inputs.monthlyIncome}
                onChange={(v) => handleChange("monthlyIncome", v)}
                {...monthlyIncomeBounds}
                format={fmt}
              />
              <div>
                <CalcField
                  label="Other Monthly Expenses"
                  value={inputs.monthlyExpenses}
                  onChange={(v) => handleChange("monthlyExpenses", v)}
                  {...monthlyExpensesBounds}
                  format={fmt}
                />
                <p className="mt-2 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                  Living expenses only — rent, food, utilities. Don't include an existing EMI here; that's the next field.
                </p>
              </div>
              <CalcField
                label="Existing EMI (other loans)"
                value={inputs.existingEMI}
                onChange={(v) => handleChange("existingEMI", v)}
                {...existingEMIBounds}
                format={fmt}
              />
              <CalcField
                label="Loan Tenure"
                value={inputs.loanTenure}
                onChange={(v) => handleChange("loanTenure", v)}
                {...loanTenureBounds}
                suffix=" yrs"
              />
              <CalcField
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => handleChange("interestRate", v)}
                {...interestRateBounds}
                suffix="%"
                hint="Sample value. Enter your own."
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
                        ? "text-amber-800 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {results.recommendation}
                </p>
                <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                  This EMI would be{" "}
                  <strong className="text-[#111814] dark:text-[#eef1ec]">{results.emiRatio.toFixed(1)}%</strong> of your
                  monthly income
                  {inputs.existingEMI > 0 && (
                    <>
                      , and all your EMIs together{" "}
                      <strong className="text-[#111814] dark:text-[#eef1ec]">{results.debtToIncomeRatio.toFixed(1)}%</strong>
                    </>
                  )}
                  .
                  {results.monthlyCashAfterEMI < 0 && " After your expenses and EMIs, you'd be short of money every month."}
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
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This calculator gives an illustrative estimate only. Actual loan eligibility depends on the lender's own
                income, credit score, and policy checks.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="What Does 'Affordable' Actually Mean Here?">
              <p>
                This calculator checks a property price against your real monthly cash flow — not just whether a bank
                would approve the loan. It estimates the EMI for the property, then measures that EMI against your
                income and existing obligations using two ratios lenders themselves rely on: EMI-to-income and
                debt-to-income.
              </p>
            </CalcSection>

            <CalcSection title="How the rating works">
              <p>
                The rating looks at all your EMIs together, the new one plus any you already pay, as a share of your
                take-home income: <strong className={calcStrongClass}>30% or less is Excellent</strong>, up to 40% is
                Good, up to 50% is Caution, and above 50% is High Risk. If your expenses and EMIs would add up to
                more than your income, the rating is High Risk whatever the ratio, because the plan doesn't work
                month to month.
              </p>
            </CalcSection>

            <CalcSection title="How much house can you afford?">
              <p>
                Working backwards from your income gives the most a lender's ratio would let you borrow. With your
                income, existing EMIs, down payment, rate and tenure as entered above:
              </p>
              <CalcTable
                caption={`At ${inputs.interestRate}% over ${inputs.loanTenure} years, with ${fmt(inputs.downPayment)} down`}
                columns={["All EMIs at", "Room for a new EMI", "Loan it supports", "Highest property price"]}
                rows={priceRows}
              />
              <p>
                Treat the 40% row as a ceiling, not a target. The 30% row leaves room to keep investing, build an
                emergency fund and absorb a rate rise. To see what any loan costs in total interest, use the{" "}
                <Link to="/emi-calculator" className={calcLinkClass}>
                  Loan EMI Calculator
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="Stress test: what if rates rise?">
              <p>
                Most home loans in India, and many elsewhere, have a floating rate, so your EMI can rise over a{" "}
                {inputs.loanTenure}-year loan. Here is the same loan at your rate and one and two percentage points
                higher:
              </p>
              <CalcTable
                caption={`${fmt(results.loanAmount)} loan over ${inputs.loanTenure} years`}
                columns={["Interest rate", "EMI", "All EMIs as % of income", "Cash left each month"]}
                rows={stressRows}
              />
              <p>
                If the bottom row leaves too little each month, choose a cheaper home, a bigger down payment or a
                longer tenure, or plan to prepay early so a rate rise hits a smaller balance.
              </p>
            </CalcSection>

            <CalcSection title="Down payment and loan limits">
              <p>
                Lenders won't finance the whole price. In India, RBI rules cap the loan at{" "}
                <strong className={calcStrongClass}>90% of the property's value for loans up to ₹30 lakh, 80% for loans
                up to ₹75 lakh and 75% above that</strong>, so you need at least 10–25% of the price yourself. Many
                lenders elsewhere ask for 20% too; in the US, putting down less than 20% on a conventional mortgage
                usually means paying for mortgage insurance.
              </p>
              <p>
                A bigger down payment cuts the EMI and the total interest, but don't empty your savings to make it.
                Keep an emergency fund of several months' expenses, including the new EMI, after you've paid it.
                The{" "}
                <Link to="/emergency-fund-calculator" className={calcLinkClass}>
                  Emergency Fund Calculator
                </Link>{" "}
                works out how much.
              </p>
            </CalcSection>

            <CalcSection title="Costs on top of the price">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Stamp duty and registration:</strong> set by each state, often
                  several percent of the price, and paid upfront. Lenders don't include it in the loan.
                </li>
                <li>
                  <strong className={calcStrongClass}>Loan fees:</strong> processing, legal and valuation charges, plus
                  GST on fees.
                </li>
                <li>
                  <strong className={calcStrongClass}>Moving in:</strong> interiors, furniture, appliances, and any
                  maintenance deposit or society charges.
                </li>
                <li>
                  <strong className={calcStrongClass}>Running costs:</strong> monthly maintenance, property tax and home
                  insurance, which renters don't pay.
                </li>
              </ul>
              <p>
                Not sure whether to buy at all? The{" "}
                <Link to="/verdict/rent-vs-buy" className={calcLinkClass}>
                  Rent vs Buy verdict
                </Link>{" "}
                compares the two with your own numbers, and our lesson on{" "}
                <Link to="/learn/home-loan-basics" className={calcLinkClass}>
                  home loan basics
                </Link>{" "}
                covers rates, tenure and prepayment.
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
                  { title: "EMI-to-Income Ratio", text: "The share of your monthly income the new EMI alone would take. On its own it can look fine even when existing loans already take a big share, which is why the rating uses the debt-to-income ratio instead." },
                  { title: "Debt-to-Income Ratio", text: "The share of income going toward ALL debt — the new EMI plus any existing loans. Most lenders and planners treat 30-40% as the comfortable ceiling. Two people with the same income but different existing debt can have very different real affordability, even for the same property." },
                  { title: "Cash Flow After EMI", text: "What's left every month once the EMI, other expenses, and existing debt are paid. This is the number that determines whether you can still save, invest, and handle a surprise expense." },
                  { title: "A Second Opinion Before You Commit", text: "A lender approving your loan confirms you can legally borrow the amount — not that it's a comfortable fit for your actual monthly life. Those are two different questions." },
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
