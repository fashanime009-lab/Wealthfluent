import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  Landmark,
  Trophy,
} from "lucide-react";

import DashboardSection from "../../layout/DashboardSection";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Progress from "../../ui/Progress";

const journey = [
  {
    title: "Budget Basics",
    icon: Wallet,
    progress: 100,
    status: "Completed",
    variant: "success",
  },
  {
    title: "Emergency Fund",
    icon: ShieldCheck,
    progress: 75,
    status: "In Progress",
    variant: "warning",
  },
  {
    title: "Investing",
    icon: TrendingUp,
    progress: 35,
    status: "Next Step",
    variant: "primary",
  },
  {
    title: "Retirement",
    icon: Landmark,
    progress: 10,
    status: "Locked",
    variant: "neutral",
  },
  {
    title: "Financial Freedom",
    icon: Trophy,
    progress: 0,
    status: "Future Goal",
    variant: "purple",
  },
];

export default function JourneySection() {
  return (
    <DashboardSection
      title="Financial Journey"
      subtitle="Every milestone moves you closer to long-term financial independence."
    >
      <div className="grid gap-5 lg:grid-cols-5">
        {journey.map((step) => {
          const Icon = step.icon;

          return (
            <Card
              key={step.title}
              hover
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                  <Icon
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <Badge variant={step.variant}>
                  {step.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {step.progress}% Complete
                </p>
              </div>

              <Progress
                value={step.progress}
                color="blue"
              />
            </Card>
          );
        })}
      </div>
    </DashboardSection>
  );
}