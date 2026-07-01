import {
  ArrowRight,
  Award,
  Clock3,
  Target,
} from "lucide-react";

import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

export default function TodayFocusCard({ workspace }) {
  const { today, activeGoal } = workspace;

  if (!today) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden">

      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-50" />

      <div className="relative">

        <Badge variant="primary">
          Today's Focus
        </Badge>

        <h2 className="mt-5 text-3xl font-bold text-slate-900">
          {today.title}
        </h2>

        <p className="mt-3 text-slate-600 leading-7">
          {today.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">

          <div className="flex items-center gap-2 text-blue-600 rounded-full bg-slate-100 px-4 py-2">

            <Clock3 size={16} />

            <span className="text-sm text-blue-600 font-medium">
              {today.estimatedTime}
            </span>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">

            <Award size={16} />

            <span className="text-sm font-semibold">
              +{today.xp} XP
            </span>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">

            <Target size={16} />

            <span className="text-sm font-semibold">
              +{today.wealthScore} Wealth Score
            </span>

          </div>

        </div>

        {activeGoal && (

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Current Goal
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {activeGoal.title}
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4">

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Monthly SIP
                </p>

                <p className="mt-1 text-lg text-blue-600 font-bold">
                  ₹{Number(
                    activeGoal.monthlyContribution ?? 0
                  ).toLocaleString()}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase  tracking-wide text-slate-500">
                  Duration
                </p>

                <p className="mt-1 text-lg text-blue-600 font-bold">
                  {activeGoal.duration} Years
                </p>

              </div>

            </div>

          </div>

        )}

        <div className="mt-8">

          <Button
            rightIcon={<ArrowRight size={18} />}
          >
            Continue {activeGoal?.title ?? "Journey"}
          </Button>

        </div>

      </div>

    </Card>
  );
}