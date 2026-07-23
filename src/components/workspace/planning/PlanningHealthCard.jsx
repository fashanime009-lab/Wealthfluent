import { HeartPulse } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";

export default function PlanningHealthCard({
    health,
}) {
  if (!health) return null;

  return (
  <DashboardCard
    title="Goal Health"
    subtitle="Overall health score"
    icon={<HeartPulse size={20} />}
  >
   <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-5xl font-bold text-[var(--text)]">
          {health.grade}
        </h2>

        <p className="mt-2 text-lg text-[var(--text-secondary)]">
          {health.status}
        </p>
      </div>

      <div className="text-right">
        <p className="text-3xl font-bold text-[var(--text)]">
          {health.score}
        </p>

        <p className="text-sm text-[var(--text-secondary)]">
          /100 Score
        </p>
      </div>
    </div>
  </DashboardCard>
);
}