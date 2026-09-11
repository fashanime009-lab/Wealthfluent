import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function LoanTenureStep() {
  const {
    answers,
    updateAnswer,
    previousStep,
    nextStep,
  } = useJourney();

  const loanTenure = answers.loanTenure ?? 20;

  return (
    <JourneyStepLayout
      title="How many years do you want the loan for?"
      description="Most home loans are between 15 and 30 years."
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
    updateAnswer("loanTenure", loanTenure);
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
        label="Loan Tenure (Years)"
        value={loanTenure}
        onChange={(value) =>
          updateAnswer("loanTenure", value)
        }
        placeholder="20"
        min={1}
        required
      />
    </JourneyStepLayout>
  );
}