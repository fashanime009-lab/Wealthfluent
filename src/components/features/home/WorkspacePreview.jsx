import {
  ArrowRight,
  Target,
  TrendingUp,
  Wallet,
  Sparkles,
} from "lucide-react";

import DashboardSection from "../../layout/DashboardSection";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Progress from "../../ui/Progress";

export default function WorkspacePreview() {
  return (
    <DashboardSection
      className="mt-24"
      title="One Workspace. Every Financial Goal."
      subtitle="Your calculators, goals, learning progress and financial journey stay connected in one intelligent workspace."
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">

        {/* LEFT */}

        <Card className="overflow-hidden">

          <div className="flex items-center justify-between">

            <div>

              <Badge variant="primary">
                Workspace Preview
              </Badge>

              <h3 className="mt-5 text-3xl font-black text-slate-900">
                Retirement Planning
              </h3>

            </div>

            <Sparkles
              className="text-blue-600"
              size={28}
            />

          </div>

          <div className="mt-8">

            <Progress
              value={68}
              showLabel
            />

          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            <div>

              <p className="text-sm text-slate-500">
                Current
              </p>

              <h4 className="mt-2 text-2xl font-black text-slate-900">
                ₹8.2L
              </h4>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Target
              </p>

              <h4 className="mt-2 text-2xl font-black text-slate-900">
                ₹30L
              </h4>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Monthly SIP
              </p>

              <h4 className="mt-2 text-2xl font-black text-slate-900">
                ₹12,000
              </h4>

            </div>

          </div>

          <div className="mt-10">

            <Button
              rightIcon={<ArrowRight size={18} />}
            >
              Open Workspace
            </Button>

          </div>

        </Card>

        {/* RIGHT */}

        <div className="space-y-5">

          <Card>

            <div className="flex gap-4">

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">

                <Target
                  className="text-blue-600"
                  size={22}
                />

              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Connected Goals
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Every calculator contributes to your long-term financial plan.
                </p>

              </div>

            </div>

          </Card>

          <Card>

            <div className="flex gap-4">

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50">

                <TrendingUp
                  className="text-emerald-600"
                  size={22}
                />

              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Progress Tracking
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Continue your financial journey instead of starting over.
                </p>

              </div>

            </div>

          </Card>

          <Card>

            <div className="flex gap-4">

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-50">

                <Wallet
                  className="text-violet-600"
                  size={22}
                />

              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Financial Snapshot
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep your most important financial information in one place.
                </p>

              </div>

            </div>

          </Card>

        </div>

      </div>

    </DashboardSection>
  );
}