import {
  ArrowRight,
  Award,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Progress from "../../ui/Progress";

export default function WorkspaceHero({ workspace }) {
  const {
    activeGoal,
    today,
    progress,
    rewards,
  } = workspace;

  return (
    <Card className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 shadow-xl">

      {/* Background */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="relative z-10">

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700">
          <Sparkles size={16} />
          FINAIW Personal Finance Workspace
        </div>

        <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-slate-900">
          BUILD
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            FINANCIAL FREEDOM
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Every smart financial decision you make today moves you closer to long-term wealth.
        </p>

        {activeGoal && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-blue-600">
                Current Goal
              </p>

              <h3 className="mt-2 text-xl text-blue-600 font-bold">
                {activeGoal.title}
              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Monthly SIP
              </p>

              <h3 className="mt-2 text-xl text-blue-600 font-bold">
                ₹{Number(
                  activeGoal.monthlyContribution ?? 0
                ).toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Goal Value
              </p>

              <h3 className="mt-2 text-xl font-bold text-blue-600">
                ₹{Number(
                  activeGoal.target ?? 0
                ).toLocaleString()}
              </h3>

            </div>

          </div>
        )}

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Today's Focus
              </p>

              <h2 className="mt-2 text-2xl text-black font-bold">
                {today?.title}
              </h2>

              <p className="mt-2 text-slate-500">
                {today?.description}
              </p>

            </div>

            <TrendingUp
              size={38}
              className="text-blue-600"
            />

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 text-blue-600 rounded-full bg-slate-100 px-4 py-2">
              <Clock3 size={16} />
              <span>{today?.estimatedTime}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">
              <Award size={16} />
              <span>+{today?.xp} XP</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
              <Target size={16} />
              <span>Wealth Score {rewards.wealthScore}</span>
            </div>

          </div>

        </div>

        <div className="mt-10">

          <div className="mb-3 flex items-center justify-between">

            <h3 className="font-semibold text-slate-900">
              Overall Goal Progress
            </h3>

            <span className="font-bold text-blue-600">
              {progress.percentage}%
            </span>

          </div>

          <Progress
            value={progress.percentage}
          />

          <div className="mt-3 flex justify-between text-sm text-slate-500">

            <span>
              {progress.completed} / {progress.total} Milestones
            </span>

            <span>
              Stage: {progress.stage}
            </span>

          </div>

        </div>

        <div className="mt-10">

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