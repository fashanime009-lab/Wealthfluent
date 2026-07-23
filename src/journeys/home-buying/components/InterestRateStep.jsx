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
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
          >
            Back
          </button>

          <button
  type="button"
  onClick={() => {
    updateAnswer("interestRate", interestRate);
    nextStep();
  }}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
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