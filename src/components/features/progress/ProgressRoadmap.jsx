import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Progress from "../../ui/Progress";

export default function ProgressRoadmap({ workspace }) {
  const { activeGoal, progress } = workspace;

  const stages = [
    "Budget",
    "Emergency",
    "Debt",
    "Invest",
    "Retirement",
    "Freedom",
  ];

  const stageMap = {
    budget: 0,
    emergency: 1,
    debt: 2,
    invest: 3,
    retirement: 4,
    freedom: 5,
  };

  let currentStage = 0;

  if (activeGoal?.type) {
    currentStage = stageMap[activeGoal.type] ?? 0;
  }

  return (
    <Card className="overflow-hidden">
      <div className="mb-8">
        <Badge variant="primary">
          Your Financial Progress
        </Badge>

        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          Keep Moving Forward
        </h2>

        <p className="mt-2 text-slate-500">
          Every completed milestone moves you closer to long-term financial
          freedom.
        </p>
      </div>

      <div className="mb-8">
        <Progress
          value={progress.percentage}
          showLabel
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

        <div className="flex items-center justify-between">

          {stages.map((stage, index) => {

            const completed = index < currentStage;
            const active = index === currentStage;

            return (
              <div
                key={stage}
                className="flex flex-1 flex-col items-center"
              >

                <div
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    completed
                      ? "border-emerald-500 bg-emerald-500"
                      : active
                      ? "border-blue-600 bg-blue-600 ring-4 ring-blue-100"
                      : "border-slate-300 bg-white"
                  }`}
                />

                <span
                  className={`mt-3 text-xs font-medium ${
                    active
                      ? "text-blue-600"
                      : completed
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {stage}
                </span>

              </div>
            );
          })}

        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Current Stage
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {activeGoal?.title || "Start Your Journey"}
          </h3>

          <p className="mt-2 text-slate-500">
            {activeGoal
              ? "Continue progressing toward your financial goal."
              : "Save your first goal from a calculator to begin your journey."}
          </p>

        </div>

      </div>
    </Card>
  );
}