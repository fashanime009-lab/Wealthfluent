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

      <h2 className="font-display text-4xl font-bold tracking-tight text-[var(--text)]">
  Review Your Information
</h2>

      <p className="mt-3 text-[var(--text-secondary)]">
        Please confirm everything looks correct before we analyze your affordability.
      </p>

      <div className="mt-10 border border-[#111814]/12 dark:border-[#eef1ec]/12">

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

<div className="mt-10 bg-[#0e1512] p-6">

  <h3 className="font-display text-xl font-semibold text-[#eef1ec]">
    Your Home Buying Snapshot
  </h3>

  <div className="mt-6 flex items-center justify-between">

    <span className="text-[#eef1ec]/70">Available Cash Flow</span>

    <span className="font-mono-tech text-2xl font-bold text-[#34d399]">

      {formatCurrency(availableCashFlow)}

    </span>

  </div>

  <p className="mt-4 text-sm text-[#eef1ec]/55">

    Income − Expenses − Existing EMI

  </p>
<div className="mt-8 space-y-4">

  <SummaryRow
    label="Loan Required"
    value={formatCurrency(loanAmount)}
    onDark
  />

  <SummaryRow
    label="Estimated EMI"
    value={formatCurrency(
      estimatedEMI
    )}
    onDark
  />

  <SummaryRow
    label="EMI / Income"
    value={`${emiRatio.toFixed(1)}%`}
    onDark
  />

</div>
</div>
<div className="mt-8 border border-[#111814]/12 p-6 dark:border-[#eef1ec]/12">

  <h3 className="font-display text-xl font-semibold text-[var(--text)]">

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
          className="border border-[#111814]/15 px-6 py-3 font-semibold text-[#111814] transition hover:bg-[#111814]/5 dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:hover:bg-[#eef1ec]/5"
        >
          Back
        </button>

        <button
  type="button"
  onClick={nextStep}
  className="bg-[#047857] px-6 py-3 font-semibold text-white transition hover:bg-[#065f46]"
>
  Continue to Affordability Analysis
</button>

      </div>

    </section>
  );
}

function SummaryRow({ label, value, onDark = false }) {
  return (
    <div
      className={`flex items-center justify-between border-b px-6 py-5 last:border-none ${
        onDark ? "border-[#eef1ec]/10" : "border-[#111814]/10 dark:border-[#eef1ec]/10"
      }`}
    >
      <span className={`font-medium ${onDark ? "text-[#eef1ec]/70" : "text-[var(--text)]"}`}>
        {label}
      </span>

      <span className={`font-mono-tech font-semibold ${onDark ? "text-[#eef1ec]" : "text-[var(--text)]"}`}>
        {value}
      </span>
    </div>
  );
}