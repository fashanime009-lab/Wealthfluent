import {
  ArrowRight,
  BookOpen,
  Calculator,
  BarChart3,
  Target,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";

export default function QuickActionsCard({ workspace }) {
  const navigate = useNavigate();

  const { quickActions, activeGoal } = workspace;

  const actionMap = {
    calculator: {
      icon: Calculator,
      path: "/calculators",
      subtitle: "Explore financial tools",
    },
    lesson: {
      icon: BookOpen,
      path: "/workspace",
      subtitle: "Continue learning",
    },
    goal: {
      icon: Target,
      path: "/workspace",
      subtitle: "Review your goal",
    },
    progress: {
      icon: BarChart3,
      path: "/workspace",
      subtitle: "Track your progress",
    },
  };

  const actions = (quickActions || []).map((action) => ({
    ...action,
    ...actionMap[action.id],
  }));

  return (
    <Card>

      <Badge variant="primary">
        Quick Actions
      </Badge>

      <h2 className="mt-5 text-2xl text-black font-bold">
        Continue Your Journey
      </h2>

      <p className="mt-2 text-slate-500">
        Quick shortcuts based on your current financial goal.
      </p>

      <div className="mt-8 space-y-4">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-slate-100 p-3 transition group-hover:bg-blue-100">

                  <Icon size={20} />

                </div>

                <div className="text-left">

                  <p className="font-semibold text-slate-900">
                    {action.label}
                  </p>

                  <p className="text-sm text-slate-500">
                    {action.subtitle}
                  </p>

                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 transition-transform group-hover:translate-x-1"
              />

            </button>

          );

        })}

      </div>

      {activeGoal && (

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Active Goal
          </p>

          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {activeGoal.title}
          </h3>

        </div>

      )}

      <div className="mt-8">

        <Button
          variant="secondary"
          onClick={() => navigate("/calculators")}
        >
          Explore All Calculators
        </Button>

      </div>

    </Card>
  );
}