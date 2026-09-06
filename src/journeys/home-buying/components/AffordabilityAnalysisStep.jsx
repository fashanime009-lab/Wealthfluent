import { useJourney } from "@/journeys/shared/context/JourneyContext";
import { calculateHomeAffordability } from "@/services/calculators/homeAffordability";

export default function AffordabilityAnalysisStep() {
  const { answers, previousStep } = useJourney();

  const result = calculateHomeAffordability(answers);
 if (!answers.propertyPrice || !answers.monthlyIncome) {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 p-10 text-center dark:border-slate-700">
      <h2 className="text-3xl font-bold">
        Complete the Journey
      </h2>

      <p className="mt-4 text-[var(--text-secondary)]">
        Finish the previous steps to receive your home affordability analysis.
      </p>

      <button
        onClick={previousStep}
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
      >
        Go Back
      </button>
    </section>
  );
}

  const {
    loanAmount,
    estimatedEMI,
    availableCashFlow,
    emiRatio,
    affordabilityScore,
    recommendation,
  } = result;

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  const badgeClass =
    affordabilityScore >= 80
      ? "bg-green-100 text-green-700"
      : affordabilityScore >= 60
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <section className="mx-auto max-w-4xl">

      <h1 className="text-4xl font-bold">
        Home Affordability Analysis
      </h1>

      <p className="mt-3 text-[var(--text-secondary)]">
        Based on the information you provided.
      </p>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-[var(--card)] p-10 dark:border-slate-700">

  <div className="flex items-center gap-3">

    <div
      className={`h-4 w-4 rounded-full ${
        affordabilityScore >= 80
          ? "bg-green-500"
          : affordabilityScore >= 60
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
    />

    <span className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)]">

      {recommendation} Match

    </span>

  </div>

  <h2 className="mt-6 text-6xl font-bold">

    {affordabilityScore}

    <span className="text-3xl text-[var(--text-secondary)]">
      /100
    </span>

  </h2>

  <h3 className="mt-6 text-3xl font-bold">

    {recommendation === "Excellent" &&
      "You can comfortably afford this home."}

    {recommendation === "Good" &&
      "This home appears affordable."}

    {recommendation === "Caution" &&
      "Review your finances before proceeding."}

    {recommendation === "High Risk" &&
      "This purchase could put pressure on your finances."}

  </h3>

  <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">

    This assessment is based on your income,
    expenses, existing loan commitments,
    expected interest rate and loan tenure.

  </p>

</div>

<div className="mt-8 rounded-2xl border border-slate-200 p-8 dark:border-slate-700">

  <h3 className="text-2xl font-bold">

    Why this result?

  </h3>

  <div className="mt-6 space-y-4">

    <p>

      ✓ Estimated EMI uses only{" "}

      <strong>{emiRatio.toFixed(1)}%</strong>

      {" "}of your monthly income.

    </p>

    <p>

      ✓ You will have{" "}

      <strong>

        {formatCurrency(result.monthlyCashAfterEMI)}

      </strong>

      {" "}remaining after paying your EMI.

    </p>

    <p>

      ✓ Total debt-to-income ratio is{" "}

      <strong>

        {result.debtToIncomeRatio.toFixed(1)}%

      </strong>

    </p>

  </div>

</div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <MetricCard
          title="You'll Need to Borrow"
          value={formatCurrency(loanAmount)}
        />

        <MetricCard
          title="Estimated Monthly EMI"
          value={formatCurrency(estimatedEMI)}
        />

        <MetricCard
          title="Money Left Each Month"
          value={formatCurrency(availableCashFlow)}
        />

        <MetricCard
          title="EMI as % of Income"
          value={`${emiRatio.toFixed(1)}%`}
        />

      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">

        <h3 className="text-xl font-semibold">
          Recommended Next Steps
        </h3>

        <ul className="mt-5 space-y-3 list-disc pl-5">

          <li>Compare home loan offers.</li>

          <li>Review your monthly budget.</li>

          <li>Increase your down payment if possible.</li>

          <li>Save this analysis.</li>

        </ul>

      </div>

      <div className="mt-10 flex gap-4">

        <button
          onClick={previousStep}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
        >
          Back
        </button>

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Complete Analysis
        </button>

      </div>

    </section>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
      <p className="text-sm text-[var(--text-secondary)]">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        {value}
      </h3>
    </div>
  );
}