import { NumberField } from "@/journeys/shared/ui";
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

  function handleChange(value) {
    updateAnswer("propertyPrice", value);
  }

  return (
    <section className="max-w-2xl">

      <h2 className="text-4xl font-bold tracking-tight">
        What is the purchase price?
      </h2>

      <p className="mt-3 text-[var(--text-secondary)]">
        Enter the property's total purchase price.
      </p>

      <div className="mt-10">

        <NumberField
          label="Property Price"
          value={propertyPrice}
          onChange={handleChange}
          placeholder="5000000"
          required
        />

      </div>

      <button
        type="button"
        onClick={nextStep}
        disabled={!isValid}
        className="
          mt-10
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Continue
      </button>

    </section>
  );
}