import PageContainer from "../components/layout/PageContainer";

import useWorkspace from "../hooks/useWorkspace";

import WorkspaceHero from "../components/features/workspace/WorkspaceHero";
import ProgressRoadmap from "../components/features/progress/ProgressRoadmap";
import TodayFocusCard from "../components/features/workspace/TodayFocusCard";
import QuickActionsCard from "../components/features/workspace/QuickActionsCard";
import ActiveGoalsCard from "../components/features/workspace/ActiveGoalsCard";
import ContinueLearningCard from "../components/features/workspace/ContinueLearningCard";

import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function WorkspacePage() {
  const workspace = useWorkspace();

  return (
    <PageContainer className="space-y-8 py-10">

      {/* Hero */}
      <WorkspaceHero workspace={workspace} />

      {/* Journey */}
      <ProgressRoadmap workspace={workspace} />

      {/* Main Grid */}
      <section className="grid gap-6 lg:grid-cols-2">

        <TodayFocusCard workspace={workspace} />

        <QuickActionsCard workspace={workspace} />

        <ActiveGoalsCard workspace={workspace} />

        <ContinueLearningCard workspace={workspace} />

        {/* AI Insights */}

        <Card className="min-h-[280px]">

          <Badge variant="primary">
            Phase 2
          </Badge>

          <h2 className="mt-5 text-2xl font-bold">
            AI Financial Insights
          </h2>

          <p className="mt-3 leading-7 text-slate-500">
            FINAIW AI will analyze your goals, savings habits and financial
            progress to provide personalized recommendations.
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-5">

            <p className="font-semibold text-blue-700">
              🚀 Coming Soon
            </p>

            <p className="mt-2 text-slate-600">
              Personalized financial coaching powered by AI.
            </p>

          </div>

        </Card>

        {/* Achievements */}

        <Card className="min-h-[280px]">

          <Badge variant="primary">
            Phase 2
          </Badge>

          <h2 className="mt-5 text-2xl font-bold">
            Achievements
          </h2>

          <p className="mt-3 leading-7 text-slate-500">
            Unlock badges as you reach financial milestones and complete
            learning paths.
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-5">

            <p className="font-semibold text-emerald-700">
              🏆 Coming Soon
            </p>

            <p className="mt-2 text-slate-600">
              Rewards, XP levels, streaks and milestone tracking.
            </p>

          </div>

        </Card>

      </section>

    </PageContainer>
  );
}