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
            className="border border-[#111814]/15 px-6 py-3 font-semibold text-[#111814] transition hover:bg-[#111814]/5 dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:hover:bg-[#eef1ec]/5"
          >
            Back
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={!isValid}
            className="bg-[#047857] px-6 py-3 font-semibold text-white transition hover:bg-[#065f46] disabled:opacity-40 disabled:cursor-not-allowed"
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