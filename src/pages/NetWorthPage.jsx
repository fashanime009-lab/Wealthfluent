import PageContainer from "../components/layout/PageContainer";

import useNetWorth from "../hooks/useNetWorth";

import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Progress from "../components/ui/Progress";

export default function NetWorthPage() {
  const {
    netWorth,
    totalAssets,
    totalLiabilities,
    activeGoal,
  } = useNetWorth();

  const progress =
    activeGoal && activeGoal.target > 0
      ? Math.min(
          100,
          Math.round((activeGoal.current / activeGoal.target) * 100)
        )
      : 0;

  return (
    <PageContainer className="space-y-8 py-10">

      {/* Hero */}

      <Card className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 p-10">

        <Badge variant="primary">
          Net Worth Dashboard
        </Badge>

        <h1 className="mt-5 text-5xl font-black text-slate-900">
          Your Net Worth
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Track your financial position by monitoring your assets,
          liabilities and long-term wealth growth.
        </p>

        <div className="mt-10 text-6xl font-black text-blue-600">
          ₹{Number(netWorth).toLocaleString()}
        </div>

      </Card>

      {/* Summary */}

      <section className="grid gap-6 md:grid-cols-3">

        <Card>

          <Badge variant="primary">
            Assets
          </Badge>

          <h2 className="mt-5 text-4xl font-bold text-emerald-600">
            ₹{Number(totalAssets).toLocaleString()}
          </h2>

          <p className="mt-2 text-slate-500">
            Total value of everything you own.
          </p>

        </Card>

        <Card>

          <Badge variant="primary">
            Liabilities
          </Badge>

          <h2 className="mt-5 text-4xl font-bold text-red-500">
            ₹{Number(totalLiabilities).toLocaleString()}
          </h2>

          <p className="mt-2 text-slate-500">
            Loans, debt and other obligations.
          </p>

        </Card>

        <Card>

          <Badge variant="primary">
            Wealth Progress
          </Badge>

          <h2 className="mt-5 text-4xl font-bold text-blue-600">
            {progress}%
          </h2>

          <div className="mt-6">
            <Progress value={progress} showLabel={false} />
          </div>

        </Card>

      </section>

      {/* Active Goal */}

      {activeGoal && (

        <Card>

          <Badge variant="primary">
            Active Financial Goal
          </Badge>

          <h2 className="mt-5 text-3xl font-bold">
            {activeGoal.title}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <p className="text-sm text-slate-500">
                Current Value
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₹{Number(activeGoal.current).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Target Value
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₹{Number(activeGoal.target).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Monthly SIP
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₹{Number(
                  activeGoal.monthlyContribution
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Duration
              </p>

              <p className="mt-2 text-2xl font-bold">
                {activeGoal.duration} Years
              </p>

            </div>

          </div>

        </Card>

      )}

      {/* Coming Soon */}

      <section className="grid gap-6 lg:grid-cols-2">

        <Card>

          <Badge variant="primary">
            Phase 2
          </Badge>

          <h2 className="mt-5 text-2xl font-bold">
            Asset Allocation
          </h2>

          <p className="mt-3 text-slate-500">
            Interactive charts showing how your wealth is distributed across
            investments, cash, gold and property.
          </p>

        </Card>

        <Card>

          <Badge variant="primary">
            Phase 2
          </Badge>

          <h2 className="mt-5 text-2xl font-bold">
            Wealth Timeline
          </h2>

          <p className="mt-3 text-slate-500">
            Visualize how your net worth grows over months and years.
          </p>

        </Card>

      </section>

    </PageContainer>
  );
}