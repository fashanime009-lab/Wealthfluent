import { useJourney } from "@/journeys/shared/context/JourneyContext";
import { calculateHomeAffordability } from "@/services/calculators/homeAffordability";
import { TONE_COLOR } from "@/components/verdict/palette";

export default function AffordabilityAnalysisStep() {
  const { answers, previousStep } = useJourney();

  const result = calculateHomeAffordability(answers);
 if (!answers.propertyPrice || !answers.monthlyIncome) {
  return (
    <section className="mx-auto max-w-3xl border border-[#111814]/12 p-10 text-center dark:border-[#eef1ec]/12">
      <h2 className="font-display text-3xl font-bold text-[var(--text)]">
        Complete the Journey
      </h2>

      <p className="mt-4 text-[var(--text-secondary)]">
        Finish the previous steps to receive your home affordability analysis.
      </p>

      <button
        onClick={previousStep}
        className="mt-8 bg-[#047857] px-6 py-3 font-semibold text-white transition hover:bg-[#065f46]"
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

  // Same two-signal convention as the Verdict system (see palette.js):
  // green means decisive/good, rust covers everything short of that —
  // color only ever encodes confidence, the actual text label ("Caution"
  // vs "High Risk") carries the finer distinction.
  const tone = affordabilityScore >= 80 ? TONE_COLOR.go : TONE_COLOR.caution;

  return (
    <section className="mx-auto max-w-4xl">

      <h1 className="font-display text-4xl font-bold text-[var(--text)]">
        Home Affordability Analysis
      </h1>

      <p className="mt-3 text-[var(--text-secondary)]">
        Based on the information you provided.
      </p>

      <div className="mt-10 border border-[#111814]/12 bg-[var(--card)] p-10 dark:border-[#eef1ec]/12">

  <div className="flex items-center gap-3">

    <div className="tone-bg h-2.5 w-2.5 flex-shrink-0" style={{ "--tone-l": tone.light, "--tone-d": tone.dark }} />

    <span className="tone-text text-[13px] font-semibold" style={{ "--tone-l": tone.light, "--tone-d": tone.dark }}>

      {recommendation} match

    </span>

  </div>

  <h2 className="font-mono-tech mt-6 text-6xl font-bold text-[var(--text)]">

    {affordabilityScore}

    <span className="text-3xl text-[var(--text-secondary)]">
      /100
    </span>

  </h2>

  <h3 className="font-display mt-6 text-3xl font-bold text-[var(--text)]">

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

<div className="mt-8 border border-[#111814]/12 p-8 dark:border-[#eef1ec]/12">

  <h3 className="font-display text-2xl font-bold text-[var(--text)]">

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

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

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

      <div className="mt-10 border border-[#111814]/12 p-6 dark:border-[#eef1ec]/12">

        <h3 className="font-display text-xl font-semibold text-[var(--text)]">
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
          className="border border-[#111814]/15 px-6 py-3 font-semibold text-[#111814] transition hover:bg-[#111814]/5 dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:hover:bg-[#eef1ec]/5"
        >
          Back
        </button>

        <button
          className="bg-[#047857] px-6 py-3 font-semibold text-white transition hover:bg-[#065f46]"
        >
          Complete Analysis
        </button>

      </div>

    </section>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="border border-[#111814]/12 p-6 dark:border-[#eef1ec]/12">
      <p className="text-sm text-[var(--text-secondary)]">
        {title}
      </p>

      <h3 className="font-mono-tech mt-2 text-2xl font-bold text-[var(--text)]">
        {value}
      </h3>
    </div>
  );
}