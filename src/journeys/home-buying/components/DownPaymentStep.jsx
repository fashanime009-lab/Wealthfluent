import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function DownPaymentStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const downPayment = answers.downPayment ?? "";

  const isValid =
    downPayment !== "" &&
    Number(downPayment) >= 0;

  return (
    <JourneyStepLayout
      title="How much can you pay upfront?"
      description="Enter the amount available for your down payment."
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
        label="Down Payment"
        value={downPayment}
        onChange={(value) => updateAnswer("downPayment", value)}
        placeholder="1000000"
        required
      />
    </JourneyStepLayout>
  );
}