import { TrendingUp } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";

export default function PlanningForecastCard({ forecast }) {
  if (!forecast) return null;

  const statusColor = {
    ahead: "text-green-600",
    "on-track": "text-blue-600",
    behind: "text-red-600",
    unknown: "text-gray-500",
  };
  const statusLabel = {
  ahead: "Ahead",
  "on-track": "On Track",
  behind: "Behind",
  unknown: "Unknown",
};

  return (
  <DashboardCard
    title="Forecast"
    subtitle="Projected goal completion"
    icon={<TrendingUp size={20} />}
  >
    <div className="space-y-6">
      <h2
        className={`text-3xl font-bold ${
          statusColor[forecast.status] ?? "text-[var(--text)]"
        }`}
      >
       {statusLabel[forecast.status] ?? "Unknown"}

        
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Current Monthly
          </span>

          <span className="font-semibold text-[var(--text)]">
            {forecast.currentMonthlySavings ?? "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Required Monthly
          </span>

          <span className="font-semibold text-[var(--text)]">
            {forecast.requiredMonthlySavings ?? "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Estimated Finish
          </span>

          <span className="font-semibold text-[var(--text)]">
            {forecast.estimatedCompletionDate
              ? new Date(
                  forecast.estimatedCompletionDate
                ).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>
    </div>
  </DashboardCard>
);
}