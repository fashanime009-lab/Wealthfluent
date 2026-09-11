import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function MonthlyExpensesStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const monthlyExpenses = answers.monthlyExpenses ?? "";

  const isValid =
    monthlyExpenses !== "" &&
    Number(monthlyExpenses) >= 0;

  return (
    <JourneyStepLayout
      title="What are your monthly expenses?"
      description="Include rent, food, transport, bills and other regular expenses."
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
        label="Monthly Expenses"
        value={monthlyExpenses}
        onChange={(value) => updateAnswer("monthlyExpenses", value)}
        placeholder="40000"
        required
      />
    </JourneyStepLayout>
  );
}