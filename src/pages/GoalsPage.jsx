import { useEffect, useState } from "react";

import GoalCard from "../components/features/goals/GoalCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import {
  getGoals,
  deleteGoal,
  completeGoal,
} from "../services/goalEngine";

export default function GoalsPage() {

  const [goals, setGoals] = useState([]);

  useEffect(() => {

    const loadGoals = () => {
      setGoals(getGoals());
    };

    loadGoals();

    window.addEventListener(
      "finaiw:goals-updated",
      loadGoals
    );

    return () =>
      window.removeEventListener(
        "finaiw:goals-updated",
        loadGoals
      );

  }, []);

  const activeGoals = goals.filter(
    goal => !goal.completed
  );

  const completedGoals = goals.filter(
    goal => goal.completed
  );

  const handleDelete = (goal) => {
    deleteGoal(goal.id);
  };

  const handleComplete = (goal) => {
    completeGoal(goal.id);
  };

  return (

    <div className="mx-auto max-w-7xl space-y-12 p-8">

      <div>

        <h1 className="text-4xl font-bold">
          My Financial Plan
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your financial goals and track your journey.
        </p>

      </div>

      {activeGoals.length === 0 ? (

        <Card className="py-16 text-center">

          <h2 className="text-2xl font-bold">
            No Financial Goals Yet
          </h2>

          <p className="mt-3 text-slate-500">
            Use one of our calculators to create your first financial goal.
          </p>

          <Button className="mt-8">
            Explore Calculators
          </Button>

        </Card>

      ) : (

        <section className="space-y-6">

          <h2 className="text-2xl font-bold">
            Active Goals
          </h2>

          {activeGoals.map(goal => (

            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />

          ))}

        </section>

      )}

      {completedGoals.length > 0 && (

        <section className="space-y-6">

          <h2 className="text-2xl font-bold">
            Completed Goals
          </h2>

          {completedGoals.map(goal => (

            <GoalCard
              key={goal.id}
              goal={goal}
            />

          ))}

        </section>

      )}

    </div>

  );

}