import {
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Progress from "../../ui/Progress";
import Button from "../../ui/Button";

export default function ActiveGoalsCard({ workspace }) {
  const { activeGoal, progress } = workspace;

  if (!activeGoal) {
    return (
      <Card>

        <Badge variant="primary">
          Active Goal
        </Badge>

        <div className="py-12 text-center">

          <Target
            size={52}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-5 text-2xl font-bold">
            No Active Goal
          </h2>

          <p className="mt-3 text-slate-500">
            Save a calculator result to create your first financial goal.
          </p>

        </div>

      </Card>
    );
  }

  return (
    <Card>

      <Badge variant="primary">
        Active Goal
      </Badge>

      <h2 className="mt-5 text-3xl text-black font-bold">
        {activeGoal.title}
      </h2>

      <p className="mt-2 text-slate-500">
        Stay consistent. Small investments today create future wealth.
      </p>

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-2 flex items-center justify-between">

          <span className="font-medium text-slate-600">
            Goal Progress
          </span>

          <span className="font-bold text-blue-600">
            {progress.percentage}%
          </span>

        </div>

        <Progress
          value={progress.percentage}
          showLabel={false}
        />

      </div>

      {/* Current vs Target */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-2xl border border-slate-200 p-5">

          <div className="flex items-center gap-2">

            <Wallet size={18} />

            <span className="text-sm font-medium text-slate-500">
              Current Investment
            </span>

          </div>

          <p className="mt-3 text-2xl text-blue-600 font-bold">
            ₹{Number(activeGoal.current).toLocaleString()}
          </p>

        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <div className="flex items-center gap-2">

            <Target
              size={18}
              className="text-blue-600"
            />

            <span className="text-sm font-medium text-blue-600">
              Goal Value
            </span>

          </div>

          <p className="mt-3 text-2xl font-bold text-blue-700">
            ₹{Number(activeGoal.target).toLocaleString()}
          </p>

        </div>

      </div>

      {/* Goal Details */}

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-xl border border-slate-200 p-4">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Monthly SIP
          </p>

          <p className="mt-2 text-blue-600 text-xl font-bold">
            ₹{Number(
              activeGoal.monthlyContribution
            ).toLocaleString()}
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 p-4">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Expected Return
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-600">
            {activeGoal.expectedReturn}%
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 p-4">

          <div className="flex items-center gap-2">

            <Calendar size={16} />

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Duration
            </span>

          </div>

          <p className="mt-2 text-blue-600 text-xl font-bold">
            {activeGoal.duration} Years
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 p-4">

          <div className="flex items-center gap-2">

            <TrendingUp size={16} />

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Wealth Score
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-blue-600">
            {activeGoal.wealthScore}
          </p>

        </div>

      </div>

      {/* Recommendation */}

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="font-semibold text-blue-700">
          Recommended Next Step
        </h3>

        <p className="mt-3 text-slate-700 leading-7">
          {workspace.recommendation?.description ??
            "Continue investing consistently every month."}
        </p>

      </div>

      <div className="mt-8">

        <Button
          rightIcon={<ArrowRight size={18} />}
        >
          Update Goal
        </Button>

      </div>

    </Card>
  );
}