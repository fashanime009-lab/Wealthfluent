import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const JourneyContext = createContext(null);

export function JourneyProvider({
  journey,
  initialStep = 0,
  children,
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const totalSteps = journey.steps.length;

  function nextStep() {
    setCurrentStep((previous) =>
      Math.min(previous + 1, totalSteps - 1)
    );
  }

  function previousStep() {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );
  }

  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= totalSteps) return;
    setCurrentStep(stepIndex);
  }

  const value = useMemo(
    () => ({
      journey,
      currentStep,
      totalSteps,
      nextStep,
      previousStep,
      goToStep,
    }),
    [journey, currentStep, totalSteps]
  );

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

JourneyProvider.propTypes = {
  journey: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
  }).isRequired,
  initialStep: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export function useJourney() {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error(
      "useJourney must be used inside JourneyProvider."
    );
  }

  return context;
}