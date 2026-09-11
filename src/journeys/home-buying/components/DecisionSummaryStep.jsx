import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function DecisionSummaryStep() {
  const {
  answers,
  previousStep,
  nextStep,
} = useJourney();
const monthlyIncome = Number(answers.monthlyIncome || 0);
const monthlyExpenses = Number(answers.monthlyExpenses || 0);
const existingEMI = Number(answers.existingEMI || 0);

const availableCashFlow =
  monthlyIncome -
  monthlyExpenses -
  existingEMI;
  const propertyPrice = Number(answers.propertyPrice || 0);

const downPayment = Number(answers.downPayment || 0);

const loanAmount =
  propertyPrice - downPayment;

// Temporary assumptions
const annualInterestRate = 8.5;
const loanTenureYears = 20;

const monthlyInterest =
  annualInterestRate / 12 / 100;

const totalMonths =
  loanTenureYears * 12;

const estimatedEMI =
  loanAmount > 0
    ? (
        (loanAmount *
          monthlyInterest *
          Math.pow(
            1 + monthlyInterest,
            totalMonths
          )) /
        (Math.pow(
          1 + monthlyInterest,
          totalMonths
        ) - 1)
      )
    : 0;

const emiRatio =
  monthlyIncome > 0
    ? (estimatedEMI / monthlyIncome) * 100
    : 0;
  function formatCurrency(value) {
    if (!value) return "—";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  return (
    <section className="max-w-3xl">

      <h2 className="text-4xl font-bold tracking-tight">
  Review Your Information
</h2>

      <p className="mt-3 text-[var(--text-secondary)]">
        Please confirm everything looks correct before we analyze your affordability.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700">

        <SummaryRow
          label="Property Price"
          value={formatCurrency(answers.propertyPrice)}
        />

        <SummaryRow
          label="Down Payment"
          value={formatCurrency(answers.downPayment)}
        />

        <SummaryRow
          label="Monthly Income"
          value={formatCurrency(answers.monthlyIncome)}
        />

        <SummaryRow
          label="Monthly Expenses"
          value={formatCurrency(answers.monthlyExpenses)}
        />

        <SummaryRow
          label="Existing EMI"
          value={formatCurrency(answers.existingEMI)}
        />

      </div>

<div className="mt-10 rounded-2xl bg-blue-50 p-6 dark:bg-slate-800">

  <h3 className="text-xl font-semibold">
    Your Home Buying Snapshot
  </h3>

  <div className="mt-6 flex items-center justify-between">

    <span>Available Cash Flow</span>

    <span className="text-2xl font-bold text-blue-600">

      {formatCurrency(availableCashFlow)}

    </span>

  </div>

  <p className="mt-4 text-sm text-[var(--text-secondary)]">

    Income − Expenses − Existing EMI

  </p>
<div className="mt-8 space-y-4">

  <SummaryRow
    label="Loan Required"
    value={formatCurrency(loanAmount)}
  />

  <SummaryRow
    label="Estimated EMI"
    value={formatCurrency(
      estimatedEMI
    )}
  />

  <SummaryRow
    label="EMI / Income"
    value={`${emiRatio.toFixed(1)}%`}
  />

</div>
</div>
<div className="mt-8 rounded-xl border border-slate-200 p-6 dark:border-slate-700">

  <h3 className="font-semibold text-xl">

    Initial Assessment

  </h3>

  <p className="mt-4 text-lg">

    {emiRatio <= 30
      ? "🟢 Excellent — This home appears comfortably affordable."

      : emiRatio <= 40
      ? "🟡 Good — Affordable, but review your monthly budget."

      : emiRatio <= 50
      ? "🟠 Caution — This loan could stretch your finances."

      : "🔴 High Risk — Consider increasing your down payment or choosing a lower-priced property."}

  </p>

</div>
<div className="mt-10 flex gap-4">

        <button
          type="button"
          onClick={previousStep}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
        >
          Back
        </button>

        <button
  type="button"
  onClick={nextStep}
  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
>
  Continue to Affordability Analysis
</button>

      </div>

    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 last:border-none dark:border-slate-700">
      <span className="font-medium">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}