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
        label="Monthly Income"
        value={monthlyIncome}
        onChange={(value) => updateAnswer("monthlyIncome", value)}
        placeholder="100000"
        required
      />
    </JourneyStepLayout>
  );
}