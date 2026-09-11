import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function MonthlyIncomeStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const monthlyIncome = answers.monthlyIncome ?? "";

  const isValid =
    monthlyIncome !== "" &&
    Number(monthlyIncome) > 0;

  return (
    <JourneyStepLayout
      title="What is your monthly income?"
      description="Enter your total monthly income before deductions."
      footer={
        <div className="flex gap-4">
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
            disabled={!isValid}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      }
    >
      <NumberField
        label="Monthly Income"
        value={monthlyIncome}
        onChange={(value) => updateAnswer("monthlyIncome", value)}
        placeholder="100000"
        required
      />
    </JourneyStepLayout>
  );
}