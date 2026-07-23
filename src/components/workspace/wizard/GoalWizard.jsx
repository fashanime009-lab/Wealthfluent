import { useState } from "react";

import GoalTypeStep from "./GoalTypeStep";
import GoalDetailsStep from "./GoalDetailsStep";
import GoalReviewStep from "./GoalReviewStep";
import GoalSuccessStep from "./GoalSuccessStep";

export default function GoalWizard({
  onClose,
  onComplete,
  initialGoal = null,
}) {
  const [step, setStep] = useState(1);

 const [goal, setGoal] = useState(
  initialGoal ?? {
    type: "",
    title: "",
    category: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
  }
);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const updateGoal = (updates) =>
    setGoal((prev) => ({
      ...prev,
      ...updates,
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-3xl rounded-3xl bg-[var(--card)] p-8 shadow-2xl">

        {step === 1 && (
          <GoalTypeStep
            goal={goal}
            updateGoal={updateGoal}
            next={next}
            onClose={onClose}
          />
        )}

        {step === 2 && (
          <GoalDetailsStep
            goal={goal}
            updateGoal={updateGoal}
            next={next}
            back={back}
          />
        )}

        {step === 3 && (
          <GoalReviewStep
            goal={goal}
            back={back}
            next={next}
            onComplete={onComplete}
          />
        )}

        {step === 4 && (
          <GoalSuccessStep
            goal={goal}
            onClose={onClose}
          />
        )}

      </div>

    </div>
  );
}