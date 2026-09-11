import { useMemo } from "react";
import { financialJourney } from "../data/financialJourney";

export default function useJourney() {
  const journey = financialJourney;

  const currentStep = useMemo(
    () => journey.find((step) => step.current),
    [journey]
  );

  const nextStep = useMemo(() => {
    if (!currentStep) return null;

    return (
      journey.find((step) => step.order === currentStep.order + 1) || null
    );
  }, [journey, currentStep]);

  const completedSteps = useMemo(
    () => journey.filter((step) => step.progress === 100).length,
    [journey]
  );

  const totalSteps = journey.length;

  const overallProgress = useMemo(() => {
    const total = journey.reduce(
      (sum, step) => sum + step.progress,
      0
    );

    return Math.round(total / totalSteps);
  }, [journey, totalSteps]);

  const totalXP = useMemo(() => {
    return journey
      .filter((step) => step.progress === 100)
      .reduce((sum, step) => sum + step.xp, 0);
  }, [journey]);

  const wealthScore = useMemo(() => {
    return journey
      .filter((step) => step.progress === 100)
      .reduce((sum, step) => sum + step.wealthScore, 0);
  }, [journey]);

  return {
    journey,
    currentStep,
    nextStep,
    completedSteps,
    totalSteps,
    overallProgress,
    totalXP,
    wealthScore,
  };
}