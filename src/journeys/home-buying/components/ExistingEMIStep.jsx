import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function ExistingEMIStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const existingEMI = answers.existingEMI ?? "";

  const isValid =
    existingEMI !== "" &&
    Number(existingEMI) >= 0;

  return (
    <JourneyStepLayout
      title="Do you already pay any monthly EMIs?"
      description="Include car loans, personal loans, education loans and other monthly EMIs."
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
        label="Existing Monthly EMI"
        value={existingEMI}
        onChange={(value) => updateAnswer("existingEMI", value)}
        placeholder="15000"
        required
      />
    </JourneyStepLayout>
  );
}