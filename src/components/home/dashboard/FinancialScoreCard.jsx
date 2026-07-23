import { calculateFinancialScore } from "../../../services/financialScore/calculateScore";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { Info } from "lucide-react";
import HoverCard from "../../ui/HoverCard";
import DashboardCard from "./DashboardCard";

export default function FinancialScoreCard() {
  const { workspace } = useWorkspace();
const hasNetWorth = workspace.dashboard.netWorth > 0;

const hasInvestment = workspace.dashboard.monthlyInvestment > 0;

const hasEmergencyFund =
  workspace.dashboard.emergencyFund?.currentAmount > 0;

const hasGoal = workspace.goals.length > 0;
  const score = calculateFinancialScore({
  netWorth: hasNetWorth ? 1 : 0,

  monthlyInvestment: hasInvestment ? 1 : 0,

  emergencyFundMonths: hasEmergencyFund ? 1 : 0,

  debtRatio: 0,

  goalProgress: hasGoal ? 100 : 0,
});

  return (
    <DashboardCard>

      <div className="flex items-center gap-2">

  <h3 className="text-[10px] font-semibold text-slate-500">
    Financial Health
  </h3>

  <HoverCard
  trigger={
    <button className="rounded-full p-1 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:text-slate-700">
      <Info size={13} />
    </button>
  }
  align="right"
  width="17rem"
>
  <h4 className="mb-3 text-sm font-bold text-slate-900">
    Score Breakdown
  </h4>

  <ScoreItem
    label="Net Worth"
    complete={hasNetWorth}
  />

  <ScoreItem
    label="Monthly Investment"
    complete={hasInvestment}
  />

  <ScoreItem
    label="Emergency Fund"
    complete={hasEmergencyFund}
  />

  <ScoreItem
    label="Active Goal"
    complete={hasGoal}
  />

  <div className="mt-4 border-t pt-3 text-xs text-slate-500">
    Improve these items to increase your score.
  </div>
</HoverCard>

</div>

      <div className="mt-5">

  <div
    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${
      score.score >= 80
        ? "bg-emerald-100 text-emerald-700"
        : score.score >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {score.score >= 80
      ? "Excellent"
      : score.score >= 50
      ? "Good"
      : score.score >= 25
      ? "Needs Attention"
      : "Poor"}
  </div>

  <div
    className={`mt-2 text-3xl font-black ${
      score.score >= 80
        ? "text-emerald-600"
        : score.score >= 50
        ? "text-amber-600"
        : "text-red-600"
    }`}
  >
    <div className="flex items-end gap-1">

  <span className="...">
      {score.score}
  </span>

  <span className="mb-1 text-base font-semibold text-slate-400">
      /100
  </span>

</div>

  </div>

</div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
  score.score >= 80
    ? "bg-emerald-500"
    : score.score >= 50
    ? "bg-amber-500"
    : "bg-red-500"
}`}
          style={{
            width: `${score.score}%`,
          }}
        />
      </div>

      <div className="mt-3 text-xs font-semibold text-slate-500">
  {
    [
  hasNetWorth,
  hasInvestment,
  hasEmergencyFund,
  hasGoal,
].filter(Boolean).length
  }
  {" "}of 4 foundations completed
</div>

<div className="mt-2 text-xs text-slate-500">
  {score.description}
</div>


    </DashboardCard>
    
  );
  function ScoreItem({ label, complete }) {
  return (
    <div className="flex items-center justify-between text-xs">

      <span className="text-slate-600">
        {label}
      </span>

      <span
        className={
          complete
            ? "font-bold text-emerald-600"
            : "font-bold text-slate-400"
        }
      >
        {complete ? "✓" : "○"}
      </span>

    </div>
  );
}
}