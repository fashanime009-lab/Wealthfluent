import {
  JourneyStepLayout,
  NumberField,
} from "@/journeys/shared/ui";

import { useJourney } from "@/journeys/shared/context/JourneyContext";

export default function PropertyPriceStep() {
  const {
    answers,
    updateAnswer,
    nextStep,
  } = useJourney();

  const propertyPrice = answers.propertyPrice ?? "";

  const isValid =
    propertyPrice !== "" &&
    Number(propertyPrice) > 0;

  return (
    <JourneyStepLayout
      title="What is the purchase price?"
      description="Enter the property's total purchase price."
      footer={
        <button
          type="button"
          onClick={nextStep}
          disabled={!isValid}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <NumberField
        label="Property Price"
        value={propertyPrice}
        onChange={(value) =>
          updateAnswer("propertyPrice", value)
        }
        placeholder="5000000"
        required
      />
    </JourneyStepLayout>
  );
}