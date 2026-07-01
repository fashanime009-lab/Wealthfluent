import JourneyLayout from "@/journeys/shared/layouts/JourneyLayout";
import JourneyHeader from "@/journeys/shared/components/JourneyHeader";

import {
  JourneyProvider,
  useJourney,
} from "@/journeys/shared/context/JourneyContext";

import homeBuyingJourney from "../data/homeBuyingJourney";

function JourneyContent() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    journey,
  } = useJourney();

  const step = journey.steps[currentStep];

  return (
    <JourneyLayout>
      <JourneyHeader
        eyebrow="Journey"
        title={journey.title}
        description="The reusable journey engine is now running."
      />

      <section className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-xl font-semibold">
          {step.title}
        </h2>

        <p className="mt-3">
          Step {currentStep + 1} of {totalSteps}
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </JourneyLayout>
  );
}

export default function HomeBuyingJourney() {
  return (
    <JourneyProvider journey={homeBuyingJourney}>
      <JourneyContent />
    </JourneyProvider>
  );
}