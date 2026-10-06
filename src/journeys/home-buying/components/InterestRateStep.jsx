import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function InterestRateStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const interestRate = answers.interestRate ?? 8.5;

  return (
    <JourneyStepLayout
      title="Expected Interest Rate"
      description="You can adjust this later."
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
  onClick={() => {
    updateAnswer("interestRate", interestRate);
    nextStep();
  }}
            className="bg-[#047857] px-6 py-3 font-semibold text-white transition hover:bg-[#065f46]"
          >
            Continue
          </button>
        </div>
      }
    >
      <NumberField
        label="Interest Rate (%)"
        value={interestRate}
        onChange={(value) =>
          updateAnswer("interestRate", value)
        }
        placeholder="8.5"
        min={1}
        required
      />
    </JourneyStepLayout>
  );
}